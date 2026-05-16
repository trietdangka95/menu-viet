"use client";

import { motion } from "framer-motion";
import { 
  Store, 
  TrendingUp, 
  Activity, 
  PlusCircle,
  ShieldCheck,
  Package
} from "lucide-react";
import Link from "next/link";

export default function SuperAdminDashboard() {
  const stats = [
    { label: "Total Stores", value: "12", icon: Store, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Stores", value: "10", icon: Activity, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Products", value: "450", icon: Package, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Revenue", value: "1.2B đ", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Platform Overview</h1>
        <p className="text-gray-500 font-medium italic">Monitoring your SaaS restaurant network</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center gap-4"
          >
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900 leading-none">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2 px-4">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">Recent Activity</h2>
            <Link href="/superadmin/stores" className="text-xs font-bold text-blue-600 hover:underline">View All Stores</Link>
          </div>
          
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 divide-y divide-gray-50 overflow-hidden">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                    <Store size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900">Quán Ăn Việt #{item}</h3>
                    <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">quan-an-{item}.orderpro.id.vn</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black rounded-full uppercase">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="space-y-6">
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest px-4">Quick Actions</h2>
          
          <Link 
            href="/superadmin/stores?new=true"
            className="group block bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-200 text-white hover:bg-blue-700 transition-all active:scale-95"
          >
            <PlusCircle size={40} className="mb-4 opacity-80 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-black mb-1">Create Store</h3>
            <p className="text-blue-100 text-sm font-medium">Add a new restaurant to the platform</p>
          </Link>

          <div className="bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl shadow-gray-300 text-white">
            <ShieldCheck size={40} className="mb-4 text-blue-400" />
            <h3 className="text-2xl font-black mb-1">Security Audit</h3>
            <p className="text-gray-400 text-sm font-medium">Monitor system logs and user access patterns</p>
          </div>
        </div>
      </div>
    </div>
  );
}
