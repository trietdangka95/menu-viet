import Image from "next/image";
import { Plus } from "lucide-react";

type Product = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  image: string;
  isNew: boolean;
  isHot: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex gap-4 w-full relative overflow-hidden group">
      {/* Badge Mới/Hot */}
      {product.isNew && (
        <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm z-10">MỚI</span>
      )}
      {product.isHot && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm z-10">HOT</span>
      )}

      {/* Image */}
      <div className="w-20 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center relative">
        <Image src={product.image} alt={product.name} width={80} height={80} className="object-cover group-hover:scale-110 transition-transform duration-300" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between py-0.5">
        <div>
          <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{product.name}</h4>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-snug">{product.description}</p>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary text-sm">{product.price.toLocaleString("vi-VN")} ₫</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through hidden sm:inline-block">
                {product.originalPrice.toLocaleString("vi-VN")} ₫
              </span>
            )}
          </div>
          
          <button className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center hover:bg-orange-600 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
