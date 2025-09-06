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
