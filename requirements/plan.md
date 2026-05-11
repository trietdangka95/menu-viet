
IMPLEMENTATION PLAN (Kế hoạch 14 ngày)
Giai đoạn 1: Core & Realtime (Ngày 1 - Ngày 7)

Ngày 1-2: Khởi tạo project (Next.js + Giao diện UI/UX  Mock API)


Ngày 2. Thiết kế Database và kết nối. Làm tính năng Auth cho Admin (Chủ quán).

Ngày 3: Xây dựng API quản lý Menu (CRUD món ăn) và API quản lý Bàn (Tạo QR slug).

Ngày 4: Thiết lập Socket.io Server. Xây dựng logic "Room" theo storeId để tránh đơn hàng quán này nhảy sang quán khác.

Ngày 5-6: Làm giao diện Bếp (Kitchen) nhận đơn. Hiển thị thẻ đơn hàng dạng List, có nút "Hoàn tất".

Giai đoạn 2: Guest UI & Optimization (Ngày 7 - Ngày 14)

Ngày 8-9: Làm giao diện Khách (Guest). Tập trung vào Mobile UX: Chọn món mượt, giỏ hàng nổi, hiệu ứng thêm món (giống Duolingo).

Ngày 10: Xây dựng module tự động generate mã QR cho từng bàn dựa trên slug. Cho phép Admin tải file ảnh QR. 

Ngày 11-12: Tối ưu hóa:

Sử dụng thư viện sharp ở Backend để tự động nén ảnh món ăn khi chủ quán upload.

Xử lý logic khi mất mạng/reconnect socket.

Ngày 13-14: Testing toàn bộ luồng. Deploy lên môi trường Staging (Vercel/AWS) và fix bug.