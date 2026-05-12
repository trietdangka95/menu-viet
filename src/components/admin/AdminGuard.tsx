"use client";

import { useCartStore } from "@/store/cartStore";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import LoginView from "@/components/auth/LoginView";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useCartStore();

  if (!isAdmin) {
    return <LoginView initialRole="admin" />;
  }

  return <>{children}</>;
}
