"use client";

import Link from "next/link";
import { ChevronLeft, LayoutGrid, List as ListIcon, Plus } from "lucide-react";

interface MenuHeaderProps {
  itemCount: number;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  onAddNew: () => void;
}

export default function MenuHeader({
  itemCount,
  viewMode,
  setViewMode,
  onAddNew,
}: MenuHeaderProps) {
  return (
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
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Quản lý Thực đơn</h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              {itemCount} món ăn
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-orange-500"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-orange-500"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <ListIcon size={20} />
            </button>
          </div>

          <button
            onClick={onAddNew}
            className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black shadow-xl shadow-gray-200 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>Thêm món</span>
          </button>
        </div>
      </div>
    </header>
  );
}
