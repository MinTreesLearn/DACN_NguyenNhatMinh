# Huong dan cai dat tren may moi (Windows)

Tai lieu nay giup ban chay toan bo he thong tren may khac, bao gom:
- Frontend React (port 5173)
- Backend Spring Boot (port 8080)
- PostgreSQL (port 5432)
- Python AI Advisor FastAPI (port 8001)

## 1. Phan mem can cai dat

Cai cac thanh phan sau:
- Git
- Node.js LTS (khuyen nghi 20.x)
- Java JDK 17
- Maven 3.9+
- Docker Desktop (khuyen nghi)
- Python 3.11+

Goi y cai nhanh bang winget (PowerShell chay voi quyen Administrator):

```powershell
winget install --id Git.Git -e
winget install --id OpenJS.NodeJS.LTS -e
winget install --id EclipseAdoptium.Temurin.17.JDK -e
winget install --id Apache.Maven -e
winget install --id Docker.DockerDesktop -e
winget install --id Python.Python.3.11 -e
```

Sau khi cai xong, dong mo lai terminal.

### Lua chon nhanh: cai tu dong 1 lenh

Neu ban muon script tu cai prerequisites:

```powershell
powershell -ExecutionPolicy Bypass -File .\install-prerequisites.ps1 -AcceptPackageAgreements -AcceptSourceAgreements
```

Script se chi cai nhung thanh phan con thieu.

## 2. Clone source code

```powershell
git clone <REPO_URL>
cd Minh
```

Neu da co source code thi bo qua buoc nay.

## 3. Kiem tra may da du dieu kien chua

Chay script kiem tra:

```powershell
powershell -ExecutionPolicy Bypass -File .\check-system-requirements.ps1
```

Neu con thieu cong cu nao, script se hien huong dan cai dat.

## 4. Khoi dong toan bo he thong

Lenh duy nhat:

```powershell
powershell -ExecutionPolicy Bypass -File .\run-system.ps1
```

Script se:
- Khoi dong PostgreSQL bang Docker container `luxury-postgres`
- Neu port 5432 dang duoc dung, tu dong dung PostgreSQL local san co
- Nap schema du lieu mau neu DB rong
- Cai frontend dependencies neu chua co
- Tao va cai python venv cho `ai_advisor_service`
- Mo 3 terminal cho Python AI, backend va frontend

URL sau khi chay:
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- AI Python Service: http://localhost:8001

## 5. Tai khoan mac dinh de test

- Admin:
  - Username: admin
  - Password: admin123
- User:
  - Username: johndoe
  - Password: user123

## 6. Lenh dung he thong

```powershell
powershell -ExecutionPolicy Bypass -File .\stop-system.ps1
```

Neu muon giu DB khi stop:

```powershell
powershell -ExecutionPolicy Bypass -File .\stop-system.ps1 -KeepDatabase
```

## 7. Loi thuong gap

- Docker chua chay:
  - Mo Docker Desktop va doi icon On.
- Maven/Java khong nhan:
  - Mo terminal moi sau khi cai dat.
- Port bi trung:
  - Kiem tra 5173, 8080, 8001, 5432.
- Python package loi:
  - Xoa `ai_advisor_service\.venv`, chay lai `run-system.ps1`.

## 8. Che do khong dung Docker cho DB

Neu khong dung Docker, ban can:
- Cai PostgreSQL local
- Tao DB `luxury_ecommerce`
- Dat tai khoan mat khau trung voi backend config mac dinh:
  - user: `postgres`
  - password: `postgres`
- Hoac sua trong `backend/src/main/resources/application.properties`

Sau do van chay:

```powershell
powershell -ExecutionPolicy Bypass -File .\run-system.ps1
```

Script se tu phat hien port 5432 dang dung va su dung DB local.
