"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface CategoryManagerProps {
  categories: string[];
  onAddCategory: (name: string) => void;
  onRemoveCategory: (name: string) => void;
}

export default function CategoryManager({
  categories,
  onAddCategory,
  onRemoveCategory,
}: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName("");
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
        <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider">
          Quản lý Danh mục
        </h2>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((cat) => (
          <div
            key={cat}
            className="group flex items-center gap-2 bg-gray-50 border border-gray-100 pl-4 pr-2 py-2 rounded-xl hover:bg-white hover:shadow-md transition-all"
          >
            <span className="text-sm font-bold text-gray-700">{cat}</span>
            <button
              onClick={() => onRemoveCategory(cat)}
              className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          placeholder="Nhập tên danh mục mới..."
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="flex-1 px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 outline-none transition-all font-medium text-gray-700"
        />
        <button
          type="submit"
          className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all active:scale-95"
        >
          Thêm nhanh
        </button>
      </form>
    </div>
  );
}
