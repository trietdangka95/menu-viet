"use client";

import { useCartStore } from "@/store/cartStore";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import LoginView from "@/components/auth/LoginView";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { userRole } = useCartStore();
  const pathname = usePathname();

  // Kiểm tra quyền truy cập
  const hasAdminAccess = userRole === "admin";
  const hasKitchenAccess = userRole === "kitchen" && pathname === "/admin/kitchen";

  const hasAccess = hasAdminAccess || hasKitchenAccess;

  if (!hasAccess) {
    // Nếu đang vào trang kitchen mà chưa đăng nhập, mặc định hiện login cho kitchen
    const initialRole = pathname === "/admin/kitchen" ? "kitchen" : "admin";
    return <LoginView initialRole={initialRole} />;
  }

  return <>{children}</>;
}
