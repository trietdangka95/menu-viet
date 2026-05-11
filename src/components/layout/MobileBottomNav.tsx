import Link from "next/link";
import { Menu, Store, User, ShoppingCart } from "lucide-react";

export default function MobileBottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-6 py-3 flex justify-between items-center pb-safe">
      <Link href="#" className="flex flex-col items-center text-primary">
        <Menu className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium uppercase">Menu</span>
      </Link>
      <Link href="#" className="flex flex-col items-center text-gray-400 hover:text-primary transition-colors">
        <Store className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium uppercase">Cửa Hàng</span>
      </Link>
      <Link href="#" className="flex flex-col items-center text-gray-400 hover:text-primary transition-colors">
        <User className="w-6 h-6 mb-1" />
        <span className="text-[10px] font-medium uppercase">Tài Khoản</span>
      </Link>
      <Link href="#" className="flex flex-col items-center text-gray-400 hover:text-primary transition-colors relative">
        <div className="relative">
          <ShoppingCart className="w-6 h-6 mb-1" />
          <span className="absolute -top-1 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">1</span>
        </div>
        <span className="text-[10px] font-medium uppercase">Giỏ Hàng</span>
      </Link>
    </div>
  );
}
