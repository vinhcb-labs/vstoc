VSTOC Static Site

Cách chạy local: mở file VSTOC-site/index.html bằng trình duyệt (file://).
Triển khai production: trỏ web root vào thư mục VSTOC-site/ (giữ nguyên cấu trúc assets/ và pages/).

Cấu trúc thư mục (đã chuẩn hoá đường dẫn):
VSTOC-site/
├── index.html
├── web.config
├── assets/
│   ├── style.css
│   ├── app.js
│   ├── vstoc.ico
│   └── momo-qr.png
└── pages/
    ├── 
home.html    ├── features.html    ├── buy.html    ├── download.html    ├── support.html    ├── contact.html    ├── terms.html    ├── privacy.html

Quảng cáo AdSense:
- Thêm/đổi client script trong <head> của index.html nếu cần
- Sửa data-ad-client và data-ad-slot trong các block quảng cáo (nếu bạn chèn)

Thanh toán:
- Trang BUY dùng VietQR ngân hàng (tạo mã đơn + ghi sẵn nội dung CK).
- Email xác nhận gửi qua EmailJS (cần setup PUBLIC KEY, SERVICE_ID, TEMPLATE_ID).
- Webhook Discord cần thay bằng webhook của bạn để nhận thông báo.

Ghi chú:
- Các trang con ở thư mục pages/ sử dụng CSS: ../assets/style.css
- ĐÃ dùng pages/buy.html cho tab BUY.
- Icon site: assets/vstoc.ico
- Mẫu QR MoMo (tuỳ chọn): assets/momo-qr.png (không bắt buộc, hiện trang BUY dùng VietQR).

VSTOC Static Site

Chạy local: mở VSTOC-site/index.html (file://).
Triển khai: trỏ web root vào thư mục VSTOC-site/.

AdSense:
- Thay client trong <head> của index.html
- Sửa data-ad-client và data-ad-slot trong các block quảng cáo

MoMo (tạm thời, không cần Merchant):
- Đổi ảnh QR: assets/momo-qr.png = QR nhận tiền của bạn (xuất từ app MoMo)
- Người mua quét QR, nhập số tiền theo gói, dán nội dung chứa mã đơn (auto sinh)

Nâng cấp Merchant (sau này):
- Dùng Payment Link / IPN để xác nhận tự động


[2025-09-06] Đã đổi buynow.html -> pages/buy.html; cập nhật routes/tab; sửa logic gửi Discord + Email và fallback mailto.

