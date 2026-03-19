# 📊 Hướng Dẫn Xem Sơ Đồ PlantUML

## Tổng Quan

Các file tài liệu thiết kế hệ thống sử dụng **PlantUML** để vẽ sơ đồ. Có nhiều cách để xem và render các sơ đồ này.

---

## 🎯 Phương Pháp 1: VS Code + PlantUML Extension (Khuyên Dùng)

### Bước 1: Cài Đặt Extension
1. Mở VS Code
2. Vào Extensions (Ctrl+Shift+X)
3. Tìm và cài đặt:
   - **PlantUML** by jebbs
   - **Markdown Preview Enhanced** (optional, nhưng tốt hơn)

### Bước 2: Cài Đặt Graphviz (Bắt Buộc)
PlantUML cần Graphviz để render diagrams.

#### Windows:
```powershell
# Dùng Chocolatey
choco install graphviz

# Hoặc download từ: https://graphviz.org/download/
# Sau khi cài, thêm vào PATH: C:\Program Files\Graphviz\bin
```

#### macOS:
```bash
brew install graphviz
```

#### Linux:
```bash
sudo apt-get install graphviz
```

### Bước 3: Xem Diagram
1. Mở file `.md` trong VS Code
2. **Cách 1**: Nhấn `Alt + D` để preview PlantUML diagram
3. **Cách 2**: Right-click trong PlantUML code block → "Preview Current Diagram"
4. **Cách 3**: Mở Markdown Preview (Ctrl+Shift+V)

### Settings (Optional)
Thêm vào VS Code settings.json:
```json
{
  "plantuml.render": "Local",
  "plantuml.server": "https://www.plantuml.com/plantuml",
  "plantuml.exportFormat": "png",
  "plantuml.exportOutDir": "./diagrams"
}
```

---

## 🌐 Phương Pháp 2: Online PlantUML Editor

### Cách 1: PlantText (Đơn Giản Nhất)
1. Truy cập: https://www.planttext.com/
2. Copy code từ `@startuml` đến `@enduml`
3. Paste vào editor
4. Diagram tự động render
5. Export PNG/SVG nếu cần

### Cách 2: PlantUML Online Server
1. Truy cập: http://www.plantuml.com/plantuml/uml/
2. Paste PlantUML code
3. Click "Submit"
4. Xem và download diagram

### Cách 3: Kroki (Hỗ Trợ Nhiều Format)
- URL: https://kroki.io/
- Hỗ trợ PlantUML + nhiều diagram types khác

---

## 🖼 Phương Pháp 3: Export Sang Hình Ảnh

### Dùng VS Code PlantUML Extension
1. Mở file `.md`
2. Đặt cursor trong PlantUML code block
3. Press `Ctrl+Shift+P`
4. Chọn: "PlantUML: Export Current Diagram"
5. Chọn format: PNG, SVG, PDF, etc.
6. File sẽ được lưu vào thư mục `./diagrams/`

### Dùng Command Line (Advanced)
```bash
# Cài PlantUML CLI
npm install -g node-plantuml

# Export tất cả diagrams
puml generate *.md -o ./diagrams/
```

---

## 🎨 Phương Pháp 4: Import Vào Draw.io

### Bước 1: Export SVG
- Dùng VS Code hoặc online tool export sang SVG

### Bước 2: Import vào Draw.io
1. Mở https://app.diagrams.net/
2. File → Import from → Device
3. Chọn file SVG
4. Edit và customize thêm nếu cần

### Hoặc: Dùng PlantUML Plugin trong Draw.io
1. Extras → Plugins → Add
2. Paste URL: https://raw.githubusercontent.com/jgraph/drawio/dev/src/main/webapp/plugins/plantuml.js
3. Apply
4. Arrange → Insert → Advanced → PlantUML
5. Paste code và OK

---

## 📖 Phương Pháp 5: GitHub/GitLab (Auto Render)

### GitHub
GitHub **không tự động render** PlantUML trong markdown. Cần:

#### Option 1: Dùng GitHub Action
Tạo `.github/workflows/plantuml.yml`:
```yaml
name: Generate PlantUML Diagrams
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Generate diagrams
      uses: cloudbees/plantuml-github-action@master
      with:
        args: '**/*.puml'
    - name: Commit diagrams
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add diagrams/
        git commit -m "Update diagrams" || echo "No changes"
        git push
```

#### Option 2: Dùng PlantUML Proxy
Thay thế PlantUML code blocks bằng:
```markdown
![Use Case Diagram](http://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/your-repo/main/use-case-diagram.puml)
```

### GitLab
GitLab **tự động render** PlantUML! Chỉ cần push và xem.

---

## 🔧 Troubleshooting

### Lỗi: "Cannot find Graphviz"
**Giải pháp:**
1. Cài Graphviz (xem Phương Pháp 1)
2. Thêm Graphviz vào PATH
3. Restart VS Code

### Lỗi: "Syntax Error"
**Kiểm tra:**
- Có `@startuml` và `@enduml` không?
- Dấu ngoặc, quotes có đóng đúng không?
- Ký tự đặc biệt (/, <, >) có được escape không?

### Diagram Không Hiển Thị trong Markdown Preview
**Giải pháp:**
- Dùng "Markdown Preview Enhanced" extension thay vì built-in preview
- Hoặc dùng PlantUML preview riêng (Alt+D)

### PlantUML Server Timeout
**Giải pháp:**
- Chuyển sang Local rendering:
  ```json
  "plantuml.render": "Local"
  ```
- Hoặc dùng server khác:
  ```json
  "plantuml.server": "https://kroki.io"
  ```

---

## 📝 Quick Commands (VS Code)

| Command | Shortcut | Description |
|---------|----------|-------------|
| Preview Diagram | `Alt + D` | Preview PlantUML diagram |
| Export Current | `Ctrl+Shift+P` → Export | Export to PNG/SVG/PDF |
| Export All | Command Palette → "Export Workspace" | Export all diagrams |
| Markdown Preview | `Ctrl+Shift+V` | Preview markdown with diagrams |

---

## 🎯 Danh Sách Các File Có Diagram

| File | Số Diagrams | Loại |
|------|-------------|------|
| [use-case-diagram.md](use-case-diagram.md) | 1 | Use Case |
| [class-diagram.md](class-diagram.md) | 1 | Class |
| [sequence-diagram.md](sequence-diagram.md) | 6 | Sequence |
| [activity-diagram.md](activity-diagram.md) | 7 | Activity |
| [component-deployment-diagram.md](component-deployment-diagram.md) | 3 | Component + Deployment |

**Tổng: 18 diagrams**

---

## 💡 Tips

### 1. Tạo Diagram Riêng
Nếu muốn edit dễ hơn, tạo file `.puml` riêng:
```
diagrams/
  ├── use-case.puml
  ├── class.puml
  └── sequence.puml
```

Trong markdown, reference:
```markdown
![Use Case](diagrams/use-case.png)
```

### 2. Theme & Styling
Thêm vào đầu PlantUML code:
```plantuml
@startuml
!theme cerulean
' hoặc: !theme bluegray, amiga, etc.

skinparam backgroundColor #FEFEFE
skinparam handwritten true
' ... diagram code
@enduml
```

### 3. Export High Quality
```json
"plantuml.exportFormat": "svg",
"plantuml.exportSubFolder": false,
"plantuml.exportConcurrency": 4
```

---

## 📚 Tài Liệu Tham Khảo

- **PlantUML Official**: https://plantuml.com/
- **PlantUML Guide**: https://plantuml.com/guide
- **VS Code Extension**: https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml
- **Graphviz**: https://graphviz.org/
- **Kroki**: https://kroki.io/

---

## ✅ Checklist

- [ ] Cài VS Code PlantUML extension
- [ ] Cài Graphviz
- [ ] Test render một diagram
- [ ] Export diagrams sang PNG/SVG
- [ ] Commit diagrams vào repo

---

**🎉 Chúc bạn xem diagram thành công!**

**[🏠 Quay về README](README.md)**
