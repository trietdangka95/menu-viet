import { NextResponse } from "next/server";

export async function GET() {
  const products = [
    {
      id: "1",
      categoryId: "1", // Trà sữa
      name: "Trà Sữa Sương Sáo",
      description: "Trà sữa Oolong đậm đà được dùng kèm với trân châu dai dai, Pudding trứng béo...",
      price: 50000,
      originalPrice: null,
      image: "https://placehold.co/100x100/fdfbf7/ff7b00?text=Tra+Sua",
      isNew: true,
      isHot: false,
    },
    {
      id: "2",
      categoryId: "1",
      name: "Trà Sữa Xoài",
      description: "Trà sữa Oolong đậm đà được dùng kèm với trân châu dai dai, Pudding trứng béo...",
      price: 30000,
      originalPrice: 50000,
      image: "https://placehold.co/100x100/fdfbf7/ff7b00?text=Tra+Xoai",
      isNew: false,
      isHot: true,
    },
    {
      id: "3",
      categoryId: "1",
      name: "Trà Sữa Oolong",
      description: "Trà sữa Oolong đậm đà được dùng kèm với trân châu dai dai, Pudding trứng béo...",
      price: 50000,
      originalPrice: null,
      image: "https://placehold.co/100x100/fdfbf7/ff7b00?text=Oolong",
      isNew: false,
      isHot: false,
    },
    {
      id: "4",
      categoryId: "1",
      name: "Trà Sữa Trân Châu Đen",
      description: "Là sự kết hợp truyền thống giữa trân châu đen dai cùng vị trà sữa trà đen. Thức...",
      price: 30000,
      originalPrice: null,
      image: "https://placehold.co/100x100/fdfbf7/ff7b00?text=Tran+Chau",
      isNew: false,
      isHot: false,
    },
    {
      id: "5",
      categoryId: "2", // Trà nguyên chất
      name: "Trà Bí Đao",
      description: "Trà sữa Oolong đậm đà được dùng kèm với trân châu dai dai, Pudding trứng béo...",
      price: 40000,
      originalPrice: null,
      image: "https://placehold.co/100x100/fdfbf7/ff7b00?text=Bi+Dao",
      isNew: false,
      isHot: true,
    },
    {
      id: "6",
      categoryId: "2",
      name: "Trà Oolong",
      description: "Trà sữa Oolong đậm đà được dùng kèm với trân châu dai dai, Pudding trứng béo...",
      price: 40000,
      originalPrice: null,
      image: "https://placehold.co/100x100/fdfbf7/ff7b00?text=Oolong",
      isNew: false,
      isHot: true,
    }
  ];

  return NextResponse.json(products);
}
