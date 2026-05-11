"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
      
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
      {/* Header Top */}
      <header className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            H
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-800">HOMI MEDIA</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <span className="text-sm font-medium text-gray-600 cursor-pointer hover:text-primary transition-colors flex items-center gap-1">
            📍 TÌM CỬA HÀNG
          </span>
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
            👤
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center relative cursor-pointer hover:bg-gray-200 transition-colors">
            🛒
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">1</span>
          </div>
          <button className="bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md shadow-orange-200 hover:bg-orange-600 transition-colors flex items-center gap-2">
            📞 0123 456 789
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        <DesktopSidebar />
        
        <div className="flex-1">
          {/* Hero Banner */}
          <div className="bg-white rounded-3xl overflow-hidden mb-8 relative border border-gray-100 shadow-sm flex flex-col md:flex-row items-center p-8 md:p-12">
            <div className="flex-1 z-10 mb-8 md:mb-0">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                Món mới ra mắt<br />
                <span className="text-primary">Yakult Đào Đá Xay</span>
              </h2>
              <p className="text-gray-500 mt-4 max-w-md">
                Là sự kết hợp giữa Yakult thanh nhẹ và đào ngọt tự nhiên. Mang đến cảm giác mát lạnh, tươi mới mỗi ngày.
              </p>
              <button className="mt-8 bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-transform hover:-translate-y-0.5 active:translate-y-0">
                Đặt món
              </button>
            </div>
            
            <div className="flex-1 relative flex justify-center">
              {/* Background Circle */}
              <div className="absolute w-64 h-64 md:w-80 md:h-80 bg-primary/10 rounded-full inset-auto m-auto -z-10"></div>
              <div className="absolute w-48 h-48 md:w-64 md:h-64 bg-primary rounded-full inset-auto m-auto -z-10 shadow-xl shadow-orange-200"></div>
              
              {/* Product Image Placeholder */}
              <div className="relative w-48 h-64 md:w-64 md:h-80 z-10 transform hover:scale-105 transition-transform duration-500">
                <Image src="https://placehold.co/400x600/transparent/fff?text=Tra+Sua" alt="Hero Product" fill className="object-contain drop-shadow-2xl" />
              </div>
            </div>
          </div>

          {/* Product Categories */}
          {categories.map((category) => {
            const catProducts = products.filter(p => p.categoryId === category.id);
            if (catProducts.length === 0) return null;
            
            return (
              <div key={category.id} className="mb-8" id={category.slug}>
                <h3 className="text-xl font-bold mb-4 text-gray-900 border-b border-gray-100 pb-2">{category.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {catProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
