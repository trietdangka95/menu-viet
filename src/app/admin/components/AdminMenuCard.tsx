"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";

interface AdminMenuCardProps {
  item: {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    color: string;
    stats: string;
  };
  index: number;
}

export default function AdminMenuCard({ item, index }: AdminMenuCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={item.href}
        className="group bg-white p-4 sm:p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
      >
        <div
          className={`w-12 h-12 sm:w-16 sm:h-16 ${item.color} text-white rounded-2xl sm:rounded-[1.5rem] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}
        >
          <item.icon size={24} className="sm:hidden" />
          <item.icon size={32} className="hidden sm:block" />
        </div>
        <div className="flex-1 w-full">
          <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-0.5 sm:mb-1">{item.title}</h2>
          <p className="text-gray-400 text-[10px] sm:text-xs font-medium">{item.description}</p>
        </div>
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50">
          <div
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-sm font-black uppercase tracking-tight shadow-sm ${item.color} text-white whitespace-nowrap`}
          >
            {item.stats}
          </div>
          <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all">
            <ChevronRight size={18} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
