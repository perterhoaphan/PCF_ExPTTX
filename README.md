# PptxGenerator — PCF Control for Power Apps

> **Xuất file PowerPoint (.pptx) động từ Power Apps** bằng cách fill dữ liệu vào template có sẵn thông qua một nút bấm tùy chỉnh.

---

## 📋 Tính năng

- ✅ Xuất file `.pptx` từ template có sẵn (nhúng sẵn trong bundle)
- ✅ 5 slide title dynamic — bind trực tiếp từ Power Apps properties
- ✅ Nút bấm tùy chỉnh: label và màu sắc cấu hình được từ Power Apps
- ✅ Auto-detect màu chữ (trắng/đen) dựa theo độ sáng màu nền
- ✅ Không cần external service — hoạt động hoàn toàn client-side

---

## 🛠 Yêu cầu hệ thống

| Công cụ | Phiên bản tối thiểu | Ghi chú |
|---|---|---|
| [Node.js](https://nodejs.org/) | v18+ | Kiểm tra: `node --version` |
| [.NET SDK](https://dotnet.microsoft.com/download) | v8+ | Kiểm tra: `dotnet --version` |
| Power Platform CLI (`pac`) | v2.8+ | Cài qua dotnet tool |
| Power Apps environment | — | Cần quyền System Customizer trở lên |

---

## 🚀 Cài đặt & Chạy local

### Bước 1 — Clone repo

```bash
git clone <your-repo-url>
cd pcfpptx
```

### Bước 2 — Cài Power Platform CLI (nếu chưa có)

```powershell
dotnet tool install --global Microsoft.PowerApps.CLI.Tool
```

> ⚠️ Sau khi cài xong, **mở lại terminal** để PATH được cập nhật.

### Bước 3 — Cài dependencies

Nếu clone dự án có sẵn `package.json`, bạn chỉ cần chạy:

```bash
npm install
```

Hoặc nếu bạn muốn cài đặt các thư viện tạo slide & zip thủ công từ đầu:

```bash
# Cài đặt thư viện tạo slide & fill template
npm install pptxgenjs docxtemplater pizzip

# Cài đặt types cho pizzip (phục vụ TypeScript)
npm install --save-dev @types/pizzip
```

### Bước 4 — (Tuỳ chọn) Tạo lại template PPTX

Nếu bạn muốn thay đổi template demo mặc định:

```bash
# Tạo template PPTX mới từ script
node scripts/create-template.js

# Encode template thành base64 và nhúng vào TypeScript
node scripts/encode-template.js
```

> 💡 **Dùng template của bạn:** Thay file `PptxGenerator/template.pptx` bằng file của bạn (phải chứa các placeholder `{slide1_title}` ... `{slide5_title}`), sau đó chạy `node scripts/encode-template.js`.

### Bước 5 — Build

```bash
npm run build
```

### Bước 6 — Chạy local test harness

```bash
npm start
```

Trình duyệt tự mở tại `http://localhost:8181`. Nhập giá trị vào các property bên phải, bấm nút để test xuất file.

---

## 📦 Deploy lên Power Apps

### Bước 1 — Đăng nhập vào môi trường

```powershell
pac auth create --environment <environment-id>
# Hoặc dùng URL trực tiếp:
pac auth create --url https://YOUR-ORG.crm.dynamics.com
```

> Tìm Environment ID tại: `https://make.powerapps.com` → chọn môi trường → URL sẽ hiển thị ID.

### Bước 2 — Push control lên môi trường

```powershell
pac pcf push --publisher-prefix <your-prefix>
```

> Thay `<your-prefix>` bằng publisher prefix của bạn (ví dụ: `hoa`, `contoso`...).

Lệnh này sẽ tự động **build** lại và **import solution** lên Dataverse.

---

## 🎯 Sử dụng trong Power Apps Studio

1. Mở app trong **Edit mode**
2. Menu **Insert** → **Get more components** → tab **Code**
3. Chọn **PptxGenerator** → **Import**
4. Kéo thả control vào màn hình
5. Cấu hình properties trong panel bên phải:

| Property | Kiểu | Mô tả | Ví dụ |
|---|---|---|---|
| `Slide 1 - Title` | Text (bound) | Tiêu đề slide 1 | `TextInput1.Text` |
| `Slide 2 - Title` | Text (bound) | Tiêu đề slide 2 | `"Kết quả Q3"` |
| `Slide 3 - Title` | Text (bound) | Tiêu đề slide 3 | `varTitle3` |
| `Slide 4 - Title` | Text (bound) | Tiêu đề slide 4 | `Label1.Text` |
| `Slide 5 - Title` | Text (bound) | Tiêu đề slide 5 | `"Cảm ơn!"` |
| `Button Label` | Text (input) | Tên hiển thị trên nút | `"📄 Xuất Báo Cáo"` |
| `Button Color` | Text (input) | Màu nền nút (hex) | `"#1E3A5F"` |

---

## 🗂 Cấu trúc dự án

```
pcfpptx/
├── PptxGenerator/
│   ├── ControlManifest.Input.xml   # Khai báo properties của control
│   ├── index.ts                    # Logic chính của PCF control
│   ├── template.pptx               # File template PPTX (nguồn gốc)
│   ├── template.ts                 # Template đã encode base64 (auto-generated)
│   └── generated/                  # ManifestTypes auto-generated bởi pcf-scripts
├── scripts/
│   ├── create-template.js          # Script tạo template PPTX demo
│   └── encode-template.js          # Script encode .pptx → .ts (base64)
├── webpack.config.js               # Override webpack cho pcf-scripts
├── pcfconfig.json                  # Cấu hình PCF project
├── pcfpptx.pcfproj                 # MSBuild project file
├── tsconfig.json
└── package.json
```

---

## 🔧 Tùy chỉnh template PPTX của bạn

Để dùng template PPTX riêng thay cho template demo:

1. Mở file PPTX của bạn bằng **PowerPoint**
2. Chèn text `{slide1_title}`, `{slide2_title}`, ..., `{slide5_title}` vào đúng vị trí tiêu đề của từng slide
3. Lưu file, đặt vào `PptxGenerator/template.pptx` (ghi đè)
4. Chạy:
   ```bash
   node scripts/encode-template.js
   ```
5. Build và deploy lại:
   ```bash
   pac pcf push --publisher-prefix <your-prefix>
   ```

> ⚠️ **Lưu ý quan trọng:** Khi soạn placeholder trong PowerPoint, gõ toàn bộ `{slide1_title}` trong **một lần** (không copy-paste từng ký tự riêng lẻ) để tránh bị PowerPoint tách thành nhiều XML run khác nhau làm docxtemplater không nhận ra.

---

## 📚 Thư viện sử dụng

| Package | Mục đích |
|---|---|
| [`pptxgenjs`](https://gitbrent.github.io/PptxGenJS/) | Tạo template PPTX demo (chỉ dùng trong scripts/) |
| [`docxtemplater`](https://docxtemplater.com/) | Fill dữ liệu vào template PPTX tại runtime |
| [`pizzip`](https://github.com/open-xml-templating/pizzip) | Đọc/ghi file PPTX dạng ZIP trong browser |

---

## 🐛 Troubleshooting

### Control không hiển thị trong danh sách Code components
→ Chạy lại `pac pcf push` và **hard refresh** browser (`Ctrl + Shift + R`) trong Power Apps Studio.

### Title vẫn hiện `undefined`
→ Đảm bảo placeholder trong file `.pptx` viết đúng: `{slide1_title}` (không có khoảng trắng thừa).

### Lỗi `pac` not recognized
→ Cài lại PAC CLI: `dotnet tool install --global Microsoft.PowerApps.CLI.Tool` và mở terminal mới.

### Build lỗi `node:fs` / `node:https`
→ Đảm bảo file `webpack.config.js` tồn tại ở root và `pcfAllowCustomWebpack` được bật trong `node_modules/pcf-scripts/featureflags.json`.

---

## 📄 License

MIT



Cách đổi tempalte pttx

Bước 1: Gán placeholder vào file PowerPoint của bạn
Mở file slide PowerPoint của bạn.
Tại những vị trí bạn muốn dữ liệu từ Power Apps điền vào, hãy viết placeholder tương ứng:
Slide 1 gõ: {slide1_title}

Slide 2 gõ: {slide2_title}

Slide 3 gõ: {slide3_title}

Slide 4 gõ: {slide4_title}

Slide 5 gõ: {slide5_title}

Lưu ý quan trọng: Khi gõ placeholder (ví dụ {slide1_title}), bạn nên gõ liền mạch từ đầu đến cuối, tránh copy-paste chắp vá hoặc gõ ngắt quãng, vì PowerPoint có thể tự động tách chữ thành các đoạn XML con làm thư viện không nhận diện được.

Bước 2: Thay thế file template

Copy file PowerPoint mới đó của bạn và dán đè vào thư mục dự án theo đúng đường dẫn: 👉 PptxGenerator/template.pptx

Bước 3: Chạy lệnh encode và update lên Power Apps
Mở Terminal tại thư mục dự án và chạy lần lượt các lệnh sau:

bash
# 1. Chuyển file PPTX mới thành mã code Base64
node scripts/encode-template.js
# 2. Build & Deploy trực tiếp lên Power Apps
pac pcf push --publisher-prefix hoa
Sau khi chạy xong, bạn chỉ cần F5/Refresh lại Power Apps Studio là template mới đã được cập nhật thành công!