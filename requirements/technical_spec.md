# TECHNICAL SPECIFICATIONS (Tài liệu kỹ thuật)

## 1. Architecture Stack

*   **Frontend**: Next.js 14+ (App Router) + Tailwind CSS + TanStack Query. Tối ưu hóa đặc biệt cho Mobile Browser (UI/UX Mobile-first, bottom navigation, mượt mà như native app).
*   **Backend**: Node.js + Express.js.
*   **Database**: MongoDB (Ưu tiên vì tính linh hoạt cao cho schema Menu món ăn có thể thay đổi linh hoạt).
*   **Realtime**: Socket.io (Đảm bảo độ trễ thấp nhất giữa Khách order và Bếp nhận đơn).
*   **Storage**: AWS S3 hoặc Cloudinary để lưu trữ và phân phối hình ảnh món ăn đã qua xử lý.

## 2. Database Schema (MongoDB)

### 2.1. Cửa hàng (Store)
```javascript
{
  _id: ObjectId,
  name: String,
  logo: String,
  config: { 
    themeColor: String, // Ví dụ: "#F97316" (Orange)
    currency: String,   // Mặc định: "VND"
  },
  createdAt: Timestamp
}
```

### 2.2. Bàn (Table)
```javascript
{
  _id: ObjectId,
  storeId: ObjectId, // Ref(Store)
  tableNumber: Number,
  qrSlug: String,    // Unique ID dùng để generate mã QR (ví dụ: storeA-table1)
  isActive: Boolean
}
```

### 2.3. Danh mục & Món ăn (Category & Product)
```javascript
// Category
{
  _id: ObjectId,
  storeId: ObjectId, // Ref(Store)
  name: String,      // Trà sữa, Trà trái cây, v.v.
  sortOrder: Number
}

// Product
{
  _id: ObjectId,
  storeId: ObjectId,  // Ref(Store)
  categoryId: ObjectId, // Ref(Category)
  name: String,
  description: String,
  price: Number,
  image: String,      // URL từ Cloudinary/S3
  isAvailable: Boolean,
  sortOrder: Number
}
```

### 2.4. Đơn hàng (Order)
```javascript
{
  _id: ObjectId,
  storeId: ObjectId, // Ref(Store)
  tableId: ObjectId, // Ref(Table)
  items: [
    { 
      productId: ObjectId, // Ref(Product)
      quantity: Number, 
      note: String 
    }
  ],
  status: {
    type: String,
    enum: ["pending", "cooking", "completed", "cancelled"],
    default: "pending"
  },
  totalPrice: Number,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 3. Luồng xử lý Realtime (Socket.io)

1.  **Khách hàng (Client)**: 
    *   Người dùng quét QR code tại bàn, mở Web App.
    *   Thêm món vào giỏ và nhấn "Gửi Order".
    *   Frontend gọi REST API `POST /api/orders` để lưu đơn hàng vào Database.
    *   Sau khi API trả về thành công, Frontend phát sự kiện socket: `socket.emit('new_order', orderData)`.
2.  **Server (Backend)**: 
    *   Server nhận sự kiện `new_order`.
    *   Dựa vào `storeId` trong `orderData`, Server phát lại sự kiện đến một "Room" cụ thể của quán đó: `io.to(storeId).emit('display_order', orderData)`.
3.  **Bếp / Thu ngân (Kitchen/Admin)**: 
    *   Giao diện Bếp luôn kết nối socket và `join(storeId)`.
    *   Lắng nghe sự kiện `display_order`.
    *   Cập nhật danh sách đơn hàng real-time trên màn hình (thêm thẻ đơn hàng mới).
    *   Phát âm thanh thông báo "Ting ting" để nhân viên biết có đơn mới.
    *   Khi bếp làm xong, nhấn "Hoàn tất", gọi API cập nhật status order và emit sự kiện báo cho khách hàng (nếu cần).

## 4. Giao diện (UI/UX)
*   **Màu sắc chủ đạo**: Orange (Cam) & White (Trắng) dựa trên thiết kế mẫu.
*   **Layout Mobile**: Bottom Navigation Bar (Menu, Cửa hàng, Tài khoản, Giỏ hàng), Hero Banner ở trên cùng, Danh sách món ăn phân chia theo danh mục có hiệu ứng scroll-spy.
*   **Layout Desktop**: Left Sidebar chứa danh mục, Main Content hiển thị banner và grid món ăn.
*   **Component cốt lõi**:
    *   Product Card: Hiển thị hình ảnh, tên, mô tả ngắn, giá và nút '+' nổi bật.
    *   Cart floating button (Mobile) để dễ dàng theo dõi số lượng và tổng tiền.
    *   Category Tabs để filter món ăn nhanh chóng.
