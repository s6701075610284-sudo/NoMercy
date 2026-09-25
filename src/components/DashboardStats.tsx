"use client";

import { useEffect, useState } from "react";
import { Users, Banknote, Coins, ArrowUp, Crosshair } from "lucide-react";
import { getDashboardStats } from "@/app/actions/stats";

export function DashboardStats() {
  const [stats, setStats] = useState({ totalMembers: 0, totalGreen: 0, totalRed: 0, recentCheckIns: 0, inventoryCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getDashboardStats();
      setStats(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="animate-pulse flex gap-6 h-32 w-full">กำลังโหลดสถิติ...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="glass-card p-6 rounded-2xl animate-fade-in opacity-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-brand-400 text-sm font-medium mb-1">สมาชิกทั้งหมดในระบบ</p>
            <h3 className="text-3xl font-bold text-white">{stats.totalMembers} <span className="text-lg text-brand-400 font-normal">คน</span></h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center border border-green-500/20">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-green-400">
          <ArrowUp className="w-3 h-3 mr-1" />
          <span>เช็คชื่อ 24 ชม. ที่ผ่านมา: {stats.recentCheckIns} คน</span>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl animate-fade-in opacity-100 delay-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-brand-400 text-sm font-medium mb-1">เงินกองกลาง (เขียว)</p>
            <h3 className="text-3xl font-bold text-brand-100">${stats.totalGreen.toLocaleString()}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center border border-green-500/20">
            <Banknote className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-brand-400">
          <span className="text-brand-200 font-medium mr-1">อัปเดตแบบเรียลไทม์</span>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl animate-fade-in opacity-100 delay-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-brand-400 text-sm font-medium mb-1">เงินกองกลาง (แดง)</p>
            <h3 className="text-3xl font-bold text-brand-100">${stats.totalRed.toLocaleString()}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
            <Coins className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-brand-400">
          <span className="text-brand-200 font-medium mr-1">เป้าหมาย:</span> $1M ภายในสัปดาห์นี้
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl animate-fade-in opacity-100 delay-300">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-brand-400 text-sm font-medium mb-1">ของแก๊งคงคลัง</p>
            <h3 className="text-3xl font-bold text-brand-100">{stats.inventoryCount || 0} <span className="text-sm font-normal">ชิ้น</span></h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Crosshair className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-brand-400">
          สถานะ: <span className="text-blue-400 ml-1 font-medium">พร้อมใช้งาน</span>
        </div>
      </div>
    </div>
  );
}
