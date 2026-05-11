import { NextResponse } from "next/server";

export async function GET() {
  const categories = [
    { id: "1", name: "Trà sữa", slug: "tra-sua" },
    { id: "2", name: "Trà nguyên chất", slug: "tra-nguyen-chat" },
    { id: "3", name: "Trà trái cây", slug: "tra-trai-cay" },
    { id: "4", name: "Đá xay", slug: "da-xay" },
    { id: "5", name: "Okinawa", slug: "okinawa" },
    { id: "6", name: "Topping", slug: "topping" },
  ];

  return NextResponse.json(categories);
}
