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
        className="group bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all flex items-center gap-6"
      >
        <div
          className={`w-16 h-16 ${item.color} text-white rounded-[1.5rem] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}
        >
          <item.icon size={32} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-black text-gray-900 mb-1">{item.title}</h2>
          <p className="text-gray-400 text-xs font-medium">{item.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div
            className={`px-4 py-2 rounded-2xl text-sm font-black uppercase tracking-tight shadow-sm ${item.color} text-white whitespace-nowrap`}
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
