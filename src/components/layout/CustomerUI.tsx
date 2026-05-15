"use client";

import { usePathname } from "next/navigation";
import CartDrawer from "@/components/CartDrawer";
import OrdersDrawer from "@/components/OrdersDrawer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function CustomerUI() {
  const pathname = usePathname();

  // Không hiển thị UI của khách nếu đang ở trang Admin hoặc Super Admin
  const isPlatformAdmin = pathname?.startsWith("/superadmin") || pathname?.startsWith("/super-login");
  const isStoreAdmin = pathname?.startsWith("/admin");
  const isAuth = pathname?.startsWith("/auth");

  if (isPlatformAdmin || isStoreAdmin || isAuth) {
    return null;
  }

  return (
    <>
      <CartDrawer />
      <OrdersDrawer />
      <MobileBottomNav />
    </>
  );
}
