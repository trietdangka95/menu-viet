"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MenuItem } from "@/store/cartStore";
import { X, Upload, Save } from "lucide-react";
import { useCreateProduct, useUpdateProduct, useCategories } from "@/hooks/useProducts";

interface MenuItemFormProps {
  item?: MenuItem;
  onClose: () => void;
}

export default function MenuItemForm({ item, onClose }: MenuItemFormProps) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const { data: categoriesData = [] } = useCategories();
  const categories = categoriesData.map(c => c.name);

  const [formData, setFormData] = useState({
    name: item?.name || "",
    price: item?.price || 0,
    category: item?.category || (categories[0] || ""),
    image: item?.image || "",
    description: item?.description || "",
    bannerUrl: item?.bannerUrl || "",
    promoTitle: item?.promoTitle || "",
    promoDescription: item?.promoDescription || "",
    discountPercent: item?.discountPercent || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find categoryId
    const selectedCategory = categoriesData.find(c => c.name === formData.category);
    const payload = {
      ...formData,
      categoryId: selectedCategory?.id || 1, // Fallback
    };

    if (item) {
      updateProduct.mutate({ id: item.id, data: payload }, {
        onSuccess: () => onClose(),
      });
    } else {
      createProduct.mutate(payload, {
        onSuccess: () => onClose(),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 cursor-pointer"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">
              {item ? "Sửa món ăn" : "Thêm món mới"}
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Thông tin chi tiết món ăn</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto hide-scrollbar">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Thông tin cơ bản</h3>
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Tên món ăn
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all font-bold text-gray-700"
                placeholder="VD: Phở Bò Tái Lăn"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                  Giá gốc (VNĐ)
                </label>
                <input
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all font-bold text-gray-700"
                  placeholder="VD: 65000"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                  Danh mục
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all font-bold text-gray-700 bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                URL Hình ảnh món
              </label>
              <input
                required
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all font-medium text-gray-600"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Mô tả ngắn
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all h-24 resize-none font-medium text-gray-600"
                placeholder="Nhập mô tả món ăn..."
              />
            </div>
          </div>

          {/* Promotion & Banner Info */}
          <div className="space-y-4 pt-4 border-t border-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Khuyến mãi & Banner</h3>
              </div>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg uppercase">Tùy chọn</span>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Phần trăm giảm giá (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-red-500 outline-none transition-all font-bold text-red-600"
                placeholder="VD: 20 (giảm 20%)"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Banner URL (Dành cho Slide quảng cáo)
              </label>
              <input
                type="text"
                value={formData.bannerUrl}
                onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-red-500 outline-none transition-all font-medium text-gray-600"
                placeholder="https://... (Hình khổ ngang 16:9)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                  Tiêu đề Banner
                </label>
                <input
                  type="text"
                  value={formData.promoTitle}
                  onChange={(e) => setFormData({ ...formData, promoTitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-red-500 outline-none transition-all font-bold text-gray-700"
                  placeholder="VD: Giảm giá 20%"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                  Mô tả Banner
                </label>
                <input
                  type="text"
                  value={formData.promoDescription}
                  onChange={(e) => setFormData({ ...formData, promoDescription: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-red-500 outline-none transition-all font-medium text-gray-600"
                  placeholder="VD: Thứ 2 & Thứ 3"
                />
              </div>
            </div>
            <p className="text-[10px] text-gray-400 italic font-medium px-2">
              * Banner chỉ hiển thị ngoài trang chủ nếu điền đủ cả 4 thông tin trên.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createProduct.isPending || updateProduct.isPending}
              className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {createProduct.isPending || updateProduct.isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={20} />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
