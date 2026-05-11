TECHNICAL SPECIFICATIONS (Tài liệu kỹ thuật)
1.1. Architecture Stack

Frontend: Next.js 14+ (App Router)  + tanstack. Tối ưu hóa cho Mobile Browser.

Backend: Node.js + Express.js.

Database: MongoDB (ưu tiên vì tính linh hoạt cho Menu món ăn) hoặc PostgreSQL.

Realtime: Socket.io (Đảm bảo độ trễ thấp nhất giữa Khách và Bếp).

Storage: AWS S3 hoặc Cloudinary để lưu trữ hình ảnh món ăn đã qua xử lý.

1.2. Database Schema (Rút gọn)

JavaScript
// Cửa hàng
Store {
  _id: ObjectId,
  name: String,
  logo: String,
  config: { themeColor: String, currency: "VND" }
}

// Bàn
Table {
  _id: ObjectId,
  storeId: Ref(Store),
  tableNumber: Number,
  qrSlug: String // Unique ID dùng để generate mã QR
}

// Món ăn
Product {
  _id: ObjectId,
  storeId: Ref(Store),
  name: String,
  price: Number,
  image: String,
  isAvailable: Boolean
}

// Đơn hàng
Order {
  _id: ObjectId,
  tableId: Ref(Table),
  items: [{ productId: Ref(Product), quantity: Number, note: String }],
  status: ["pending", "cooking", "completed"],
  totalPrice: Number,
  createdAt: Timestamp
}
1.3. Luồng xử lý Realtime (Socket.io)

Khách: Nhấn "Gửi Order" -> Gọi API lưu đơn vào DB -> Phát sự kiện socket.emit('new_order', data).

Server: Nhận sự kiện -> Xác định storeId -> Phát lại sự kiện io.to(storeId).emit('display_order', data).

Bếp: Lắng nghe sự kiện -> Cập nhật danh sách đơn hàng trên màn hình -> Phát âm thanh thông báo.