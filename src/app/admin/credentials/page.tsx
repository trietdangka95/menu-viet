"use client";

import { useCartStore } from "@/store/cartStore";
import { ChevronLeft, Lock, ShieldCheck, UserCircle, Key, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CredentialsPage() {
  const { staffPassword, kitchenPassword, adminPassword, updatePasswords } = useCartStore();
  const [passwords, setPasswords] = useState({
    staff: staffPassword,
    kitchen: kitchenPassword,
    admin: adminPassword
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Giả lập delay
    setTimeout(() => {
      updatePasswords(passwords);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full transition-all border border-gray-100"
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Cài đặt Mật khẩu</h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Quản lý quyền truy cập hệ thống</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-6">
          {/* Admin Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Quản trị viên (Admin)</h2>
                <p className="text-xs text-gray-400 font-medium">Quyền cao nhất, quản lý mọi cài đặt</p>
              </div>
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="text"
                value={passwords.admin}
                onChange={(e) => setPasswords({...passwords, admin: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-gray-900 outline-none transition-all font-mono"
                placeholder="Nhập mật khẩu mới..."
              />
            </div>
          </motion.div>

          {/* Staff Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-100/30 border border-blue-50"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <UserCircle size={24} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Nhân viên (Staff)</h2>
                <p className="text-xs text-gray-400 font-medium">Quyền xác nhận đơn và phục vụ bàn</p>
              </div>
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="text"
                value={passwords.staff}
                onChange={(e) => setPasswords({...passwords, staff: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-500 outline-none transition-all font-mono"
                placeholder="Nhập mật khẩu mới..."
              />
            </div>
          </motion.div>

          {/* Kitchen Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-orange-100/30 border border-orange-50"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                <Key size={24} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Nhà bếp (Kitchen)</h2>
                <p className="text-xs text-gray-400 font-medium">Quyền xem đơn và cập nhật trạng thái nấu</p>
              </div>
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="text"
                value={passwords.kitchen}
                onChange={(e) => setPasswords({...passwords, kitchen: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 outline-none transition-all font-mono"
                placeholder="Nhập mật khẩu mới..."
              />
            </div>
          </motion.div>

          {/* Action Button */}
          <div className="pt-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full py-5 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-3 ${
                showSuccess 
                ? "bg-green-500 text-white" 
                : "bg-gray-900 text-white hover:bg-black shadow-2xl shadow-gray-200"
              }`}
            >
              {isSaving ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : showSuccess ? (
                <>
                  <Check size={24} />
                  <span>Đã cập nhật mật khẩu!</span>
                </>
              ) : (
                <span>Lưu tất cả thay đổi</span>
              )}
            </button>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3"
          >
            <Check className="text-green-400" />
            <span className="font-bold">Hệ thống đã cập nhật thông tin đăng nhập mới!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
