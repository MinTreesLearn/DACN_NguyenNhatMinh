from __future__ import annotations

from dataclasses import dataclass
from typing import List, Optional
from fastapi import FastAPI
from pydantic import BaseModel, Field
import re
import unicodedata

try:
    from sentence_transformers import SentenceTransformer
except Exception:  # pragma: no cover
    SentenceTransformer = None


class UserContext(BaseModel):
    id: Optional[int] = None
    username: Optional[str] = None
    gender: Optional[str] = None
    style: Optional[str] = None
    favorite_color: Optional[str] = Field(default=None, alias="favorite_color")


class ProductItem(BaseModel):
    id: int
    name: str = ""
    description: str = ""
    category: str = ""
    color: str = ""
    brand: str = ""
    material: str = ""
    is_premium: bool = False
    stock_quantity: int = 0
    price: float = 0.0


class HistoryItem(BaseModel):
    prompt: str = ""
    response: str = ""


class AdvisorRequest(BaseModel):
    prompt: str
    user: Optional[UserContext] = None
    products: List[ProductItem] = Field(default_factory=list)
    history: List[HistoryItem] = Field(default_factory=list)


class AdvisorResponse(BaseModel):
    response: str
    recommended_product_ids: List[int]
    confidence: float
    framework: str


@dataclass
class ScoredProduct:
    product_id: int
    score: float


class SalesSemanticAdvisor:
    def __init__(self) -> None:
        self.embedder = None
        if SentenceTransformer is not None:
            try:
                self.embedder = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
            except Exception:
                self.embedder = None

    def advise(self, req: AdvisorRequest) -> AdvisorResponse:
        prompt = self._normalize(req.prompt)
        history_text = " ".join(self._normalize(h.prompt + " " + h.response) for h in req.history[-5:])
        full_context = (prompt + " " + history_text).strip()

        budget = self._extract_budget(full_context)
        intent = self._detect_intent(full_context)

        scored = self._rank_products(full_context, req.products, req.user, budget, intent)
        top_ids = [item.product_id for item in scored[:6]]

        response = self._build_sales_response(req, intent, budget, len(top_ids))
        confidence = min(0.98, 0.5 + (0.07 * min(len(top_ids), 6)))

        return AdvisorResponse(
            response=response,
            recommended_product_ids=top_ids,
            confidence=round(confidence, 2),
            framework="SPIN+FAB contextual semantic ranking",
        )

    def _normalize(self, text: str) -> str:
        if not text:
            return ""
        text = unicodedata.normalize("NFD", text)
        text = "".join(ch for ch in text if not unicodedata.combining(ch))
        return text.replace("đ", "d").replace("Đ", "D").lower()

    def _extract_budget(self, text: str) -> Optional[float]:
        match = re.search(r"(\d+[\d\.,]*)\s*(trieu|tr|m|k|nghin|ngan|\$|usd)?", text)
        if not match:
            return None
        raw = match.group(1).replace(",", "").replace(".", "")
        if not raw.isdigit():
            return None
        amount = float(raw)
        unit = match.group(2)
        if unit in {"trieu", "tr", "m"}:
            amount *= 1_000_000
        elif unit in {"k", "nghin", "ngan"}:
            amount *= 1_000
        return amount

    def _detect_intent(self, context: str) -> str:
        if self._contains_any(context, ["party", "di tiec", "formal", "sang trong", "luxury"]):
            return "party"
        if self._contains_any(context, ["work", "cong so", "van phong", "school", "di hoc"]):
            return "work"
        if self._contains_any(context, ["summer", "mua he", "nong"]):
            return "summer"
        if self._contains_any(context, ["casual", "di choi", "hang out", "dao pho"]):
            return "casual"
        return "general"

    def _rank_products(
        self,
        context: str,
        products: List[ProductItem],
        user: Optional[UserContext],
        budget: Optional[float],
        intent: str,
    ) -> List[ScoredProduct]:
        if not products:
            return []

        semantic_scores = {}
        if self.embedder is not None:
            try:
                corpus = [self._product_text(p) for p in products]
                embeddings = self.embedder.encode([context] + corpus, normalize_embeddings=True)
                query_vec = embeddings[0]
                for i, p in enumerate(products, start=1):
                    sim = float((query_vec * embeddings[i]).sum())
                    semantic_scores[p.id] = max(0.0, sim)
            except Exception:
                semantic_scores = {}

        scored: List[ScoredProduct] = []
        tokens = [t for t in context.split() if len(t) >= 4]

        for p in products:
            score = 0.0
            text = self._normalize(self._product_text(p))

            for token in tokens:
                if token in text:
                    score += 1.2

            if intent == "party":
                score += 3.0 if p.is_premium else 0.5
            elif intent == "work":
                score += 2.5 if self._contains_any(text, ["shirt", "blazer", "briefcase", "formal"]) else 0.4
            elif intent == "summer":
                score += 2.5 if self._contains_any(text, ["light", "cotton", "silk", "summer"]) else 0.4
            elif intent == "casual":
                score += 2.0 if self._contains_any(text, ["casual", "wallet", "tie", "accessories"]) else 0.4

            if user and user.style and user.style.strip():
                if self._normalize(user.style) in text:
                    score += 2.5

            if user and user.favorite_color and user.favorite_color.strip():
                if self._normalize(user.favorite_color) in text:
                    score += 1.8

            if budget is not None:
                score += 3.0 if p.price <= budget else -2.0

            score += semantic_scores.get(p.id, 0.0) * 4.0
            if p.stock_quantity <= 0:
                score -= 3.0

            scored.append(ScoredProduct(product_id=p.id, score=score))

        scored.sort(key=lambda x: x.score, reverse=True)
        return [s for s in scored if s.score > 0]

    def _build_sales_response(
        self,
        req: AdvisorRequest,
        intent: str,
        budget: Optional[float],
        rec_count: int,
    ) -> str:
        user_style = req.user.style if req.user and req.user.style else "chua ro"

        intent_line = {
            "party": "Ban dang huong toi nhu cau du tiec va can diem nhan cao cap.",
            "work": "Ban dang can outfit lich su, chuyen nghiep cho hoc tap/cong viec.",
            "summer": "Ban dang uu tien su thoang mat va de chiu trong thoi tiet nong.",
            "casual": "Ban dang tim phoi do casual de dung hang ngay.",
            "general": "Ban dang can tu van tong quan theo ngu canh hien tai.",
        }[intent]

        budget_line = (
            f"Ngan sach tam tinh cua ban la {int(budget):,} VND.".replace(",", ".") if budget else
            "Ban chua noi ro ngan sach, minh uu tien phuong an de chot don de nhat."
        )

        return (
            "[SPIN] "
            + intent_line
            + " "
            + budget_line
            + " "
            + f"[FAB] Minh da loc {rec_count} san pham sat voi phong cach '{user_style}', "
            + "uu tien item de phoi, tao gia tri su dung va tang kha nang chot don. "
            + "Neu ban cho minh them thong tin ve mau sac va dip su dung cu the, minh se toi uu bo goi y ngay."
        )

    def _product_text(self, p: ProductItem) -> str:
        return " ".join(
            [
                p.name or "",
                p.description or "",
                p.category or "",
                p.color or "",
                p.brand or "",
                p.material or "",
            ]
        )

    def _contains_any(self, text: str, keywords: List[str]) -> bool:
        return any(k in text for k in keywords)


app = FastAPI(title="Luxury Semantic Sales Advisor", version="1.0.0")
advisor = SalesSemanticAdvisor()


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "semantic_model": bool(advisor.embedder)}


@app.post("/advise", response_model=AdvisorResponse)
def advise(req: AdvisorRequest) -> AdvisorResponse:
    return advisor.advise(req)
