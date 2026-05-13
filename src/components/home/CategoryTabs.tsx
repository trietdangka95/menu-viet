"use client";

interface CategoryTabsProps {
  categories: string[];
  activeTab: string;
  onTabChange: (categoryName: string) => void;
}

export default function CategoryTabs({
  categories,
  activeTab,
  onTabChange,
}: CategoryTabsProps) {
  return (
    <div className="sticky top-38 z-30 bg-gray-50/80 backdrop-blur-md -mx-4 px-4 overflow-x-auto no-scrollbar">
      <div className="flex gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onTabChange(cat)}
            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all shadow-sm cursor-pointer ${
              activeTab === cat
                ? "bg-primary text-white shadow-orange-200 scale-105"
                : "bg-white text-gray-500 hover:bg-orange-50 hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
