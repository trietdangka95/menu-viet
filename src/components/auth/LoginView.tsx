"use client";

import { useState } from "react";
import { useCartStore, UserRole } from "@/store/cartStore";
import { Lock, ChevronLeft, LogIn, UserCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginView({ initialRole = "staff" }: { initialRole?: UserRole }) {
  const { login, staffLogin, kitchenLogin, staffPassword, kitchenPassword, adminPassword } = useCartStore();
  const [role, setRole] = useState<UserRole>(initialRole);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let success = false;
    if (role === "admin") {
      success = login(password);
    } else if (role === "staff") {
      success = staffLogin(password);
    } else if (role === "kitchen") {
      success = kitchenLogin(password);
    }

    if (success) {
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "kitchen") {
        router.push("/admin/kitchen");
      } else {
        router.push("/");
      }
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const getRoleTheme = () => {
    switch (role) {
      case "admin": return { color: "bg-purple-600", text: "Quản trị viên", icon: ShieldCheck, accent: "text-purple-600", hint: adminPassword };
      case "kitchen": return { color: "bg-orange-500", text: "Bộ phận Bếp", icon: LogIn, accent: "text-orange-500", hint: kitchenPassword };
      default: return { color: "bg-blue-600", text: "Nhân viên phục vụ", icon: UserCheck, accent: "text-blue-600", hint: staffPassword };
    }
  };

  const theme = getRoleTheme();

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-orange-100/50 overflow-hidden border border-gray-100">
          {/* Header Area */}
          <div className={`p-8 transition-colors duration-500 flex flex-col items-center justify-center text-white relative ${theme.color}`}>
            <Link
              href="/"
              className="absolute top-6 left-6 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </Link>

            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-4 backdrop-blur-md">
              <theme.icon size={40} />
            </div>

            <h1 className="text-2xl font-black tracking-tight">{theme.text}</h1>
            <p className="opacity-80 text-sm font-medium mt-1">Hệ thống Menu Việt</p>
          </div>

          <div className="p-8">
            {/* Role Selector */}
            <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-8 gap-1">
              <button
                onClick={() => setRole("staff")}
                className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${role === "staff" ? "bg-white shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                Phục vụ
              </button>
              <button
                onClick={() => setRole("kitchen")}
                className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${role === "kitchen" ? "bg-white shadow-sm text-orange-500" : "text-gray-400 hover:text-gray-600"}`}
              >
                Bếp
              </button>
              <button
                onClick={() => setRole("admin")}
                className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${role === "admin" ? "bg-white shadow-sm text-purple-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                Quản trị
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4 mb-2 block text-center">
                  Mật khẩu truy cập {theme.text}
                </label>
                <input
                  autoFocus
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all text-center text-xl font-bold tracking-widest ${error ? "border-red-500 animate-shake" : `border-gray-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5`}`}
                />
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-[10px] font-black text-center mt-3 uppercase tracking-wider"
                    >
                      Mật khẩu không chính xác!
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl text-white ${theme.color} hover:brightness-110`}
              >
                <LogIn size={20} strokeWidth={3} />
                ĐĂNG NHẬP
              </button>

              <div className="text-center pt-2">
                <p className="text-[10px] text-gray-300 font-bold tracking-widest uppercase">
                  Hint: {theme.hint}
                </p>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
