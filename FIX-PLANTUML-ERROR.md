# 🔧 Fix PlantUML Error - Hướng Dẫn Chi Tiết

## ❌ Lỗi Gặp Phải
```
Error: plantuml.jar file not found: ""
Please download plantuml.jar from https://plantuml.com/download
```

## ✅ Giải Pháp

---

## 🌐 CÁCH 1: Dùng Online Server (KHUYÊN DÙNG) ⭐

### Ưu điểm
- ✅ Không cần cài đặt gì thêm
- ✅ Không cần Java
- ✅ Setup trong 30 giây
- ✅ Luôn dùng PlantUML version mới nhất

### Các bước thực hiện

#### Bước 1: Mở VS Code Settings
```
Ctrl + Shift + P → Gõ: "Preferences: Open User Settings (JSON)"
```

#### Bước 2: Thêm vào settings.json
Thêm dòng này vào file `settings.json`:
```json
{
  "markdown-preview-enhanced.plantumlServer": "https://kroki.io/plantuml/svg/"
}
```

**Hoặc dùng PlantUML server chính thức:**
```json
{
  "markdown-preview-enhanced.plantumlServer": "https://www.plantuml.com/plantuml"
}
```

#### Bước 3: Reload VS Code
```
Ctrl + Shift + P → Gõ: "Developer: Reload Window"
```

#### Bước 4: Test
1. Mở file `.md` có PlantUML diagram
2. Right-click → "Markdown Preview Enhanced"
3. Diagram hiển thị thành công! 🎉

### 📝 Full Settings Example
```json
{
  // PlantUML Settings
  "markdown-preview-enhanced.plantumlServer": "https://kroki.io/plantuml/svg/",
  
  // Optional: Other useful settings
  "markdown-preview-enhanced.breakOnSingleNewLine": false,
  "markdown-preview-enhanced.enableScriptExecution": true,
  "markdown-preview-enhanced.scrollSync": true
}
```

---

## 💾 CÁCH 2: Download plantuml.jar (Offline)

### Ưu điểm
- ✅ Làm việc offline
- ✅ Không phụ thuộc internet
- ✅ Nhanh hơn (không cần gọi API)

### Nhược điểm
- ❌ Cần cài Java
- ❌ Cần download thủ công

### Các bước thực hiện

#### Bước 1: Cài Java (Nếu chưa có)
```powershell
# Check Java
java -version

# Nếu chưa có, cài Java
# Download từ: https://www.oracle.com/java/technologies/downloads/
# Hoặc dùng Chocolatey:
choco install openjdk
```

#### Bước 2: Download plantuml.jar
**Option A: Download trực tiếp**
- Link: https://github.com/plantuml/plantuml/releases/latest
- Download file: `plantuml-1.2024.x.jar` (version mới nhất)

**Option B: Dùng PowerShell**
```powershell
# Tạo thư mục
New-Item -ItemType Directory -Path "C:\Tools\plantuml" -Force

# Download plantuml.jar
$url = "https://github.com/plantuml/plantuml/releases/download/v1.2024.3/plantuml-1.2024.3.jar"
$output = "C:\Tools\plantuml\plantuml.jar"
Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "Downloaded plantuml.jar to: $output" -ForegroundColor Green
```

#### Bước 3: Config VS Code
Mở Settings (JSON) và thêm:
```json
{
  "markdown-preview-enhanced.plantumlJarPath": "C:\\Tools\\plantuml\\plantuml.jar"
}
```

⚠️ **Lưu ý**: Dùng double backslash `\\` hoặc forward slash `/`

#### Bước 4: Reload và Test
1. Reload VS Code: `Ctrl+Shift+P` → "Reload Window"
2. Mở markdown file có diagram
3. Test xem diagram hiển thị

---

## 🎯 CÁCH 3: Dùng PlantUML Extension (Alternative)

Nếu muốn dùng extension PlantUML thuần thay vì Markdown Preview Enhanced:

### Bước 1: Cài Extension
```
Extensions → Search: "PlantUML" by jebbs → Install
```

### Bước 2: Cài Graphviz
```powershell
choco install graphviz
```

### Bước 3: Config (Optional)
```json
{
  "plantuml.render": "PlantUMLServer",
  "plantuml.server": "https://www.plantuml.com/plantuml"
}
```

### Bước 4: Xem Diagram
- Open `.md` file
- Place cursor in PlantUML block
- Press `Alt + D` để preview

---

## 🔍 Troubleshooting

### Lỗi: "Cannot connect to server"
**Nguyên nhân**: Mạng của bạn block PlantUML server

**Giải pháp**:
1. Thử server khác:
   ```json
   "markdown-preview-enhanced.plantumlServer": "https://kroki.io/plantuml/svg/"
   ```
2. Hoặc dùng offline mode (Cách 2)

### Lỗi: "Java not found"
**Nguyên nhân**: Chưa cài Java hoặc Java không trong PATH

**Giải pháp**:
```powershell
# Check Java
java -version

# Nếu chưa có, cài:
choco install openjdk
```

### Diagram vẫn không hiển thị
**Checklist**:
- [ ] Đã reload VS Code? (`Ctrl+Shift+P` → Reload Window)
- [ ] Settings.json có lỗi syntax không? (Check màu đỏ)
- [ ] PlantUML code có `@startuml` và `@enduml`?
- [ ] Extension Markdown Preview Enhanced đã cài?

---

## 📖 Các Online Servers Khả Dụng

| Server | URL | Đặc điểm |
|--------|-----|----------|
| **Kroki** (Khuyên dùng) | https://kroki.io/plantuml/svg/ | Nhanh, ổn định |
| PlantUML Official | https://www.plantuml.com/plantuml | Server chính thức |
| PlantText | https://www.planttext.com | Có web editor |

---

## ⚡ Quick Fix Script

Copy và chạy trong PowerShell:

```powershell
# Auto-config PlantUML Server
$settingsPath = "$env:APPDATA\Code\User\settings.json"

if (Test-Path $settingsPath) {
    $settings = Get-Content $settingsPath -Raw | ConvertFrom-Json
    
    # Add PlantUML server setting
    $settings | Add-Member -NotePropertyName "markdown-preview-enhanced.plantumlServer" `
        -NotePropertyValue "https://kroki.io/plantuml/svg/" -Force
    
    # Save
    $settings | ConvertTo-Json -Depth 10 | Set-Content $settingsPath
    
    Write-Host "✅ Config thành công!" -ForegroundColor Green
    Write-Host "📝 Reload VS Code để apply: Ctrl+Shift+P → Reload Window" -ForegroundColor Yellow
} else {
    Write-Host "❌ Không tìm thấy settings.json" -ForegroundColor Red
}
```

---

## ✅ Test Diagram

Sau khi config xong, test bằng code này:

```plantuml
@startuml
Alice -> Bob: Hello
Bob -> Alice: Hi!
@enduml
```

1. Tạo file `test.md`
2. Paste code trên
3. Right-click → "Markdown Preview Enhanced"
4. Nếu thấy diagram → **Thành công!** 🎉

---

## 📚 Tài Liệu Liên Quan

- [HOW-TO-VIEW-DIAGRAMS.md](HOW-TO-VIEW-DIAGRAMS.md) - Hướng dẫn chi tiết xem diagram
- [PlantUML Documentation](https://plantuml.com/)
- [Kroki Documentation](https://kroki.io/)
- [Markdown Preview Enhanced](https://shd101wyy.github.io/markdown-preview-enhanced/)

---

## 💡 Khuyến Nghị

**Cho người mới bắt đầu:** Dùng **Cách 1** (Online Server)
- Đơn giản nhất
- Không cần setup phức tạp
- Chỉ cần thêm 1 dòng config

**Cho dự án production:** Dùng **Cách 2** (Local jar)
- Không phụ thuộc mạng
- Nhanh hơn
- Private/Secure

---

**🎯 Mục tiêu: Làm cho diagram hiển thị trong 1 phút!**

[🏠 Quay về README](README.md)
