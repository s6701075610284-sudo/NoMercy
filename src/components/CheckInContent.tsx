"use client";

import { useEffect, useState } from "react";
import { getRecentCheckIns } from "@/app/actions/checkin";
import { MapPin, Image as ImageIcon, Calendar } from "lucide-react";

export function CheckInContent() {
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Get more check-ins for the full page
      const data = await getRecentCheckIns(50);
      setCheckIns(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-brand-400">กำลังโหลดประวัติการเช็คชื่อ...</div>;
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">ประวัติการเช็คชื่อทั้งหมด</h2>
          <p className="text-sm text-brand-400">ประวัติการเข้าเมืองของสมาชิกแก๊ง</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-brand-800/50">
            <tr className="text-brand-300 text-sm">
              <th className="py-4 px-6 font-medium">สมาชิก</th>
              <th className="py-4 px-6 font-medium">ยศ</th>
              <th className="py-4 px-6 font-medium">เวลาเช็คชื่อ</th>
              <th className="py-4 px-6 font-medium text-right">หลักฐาน</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-brand-800/50">
            {checkIns.map((ci) => (
              <tr key={ci.id} className="hover:bg-brand-800/20 transition-colors">
                <td className="py-4 px-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-700 overflow-hidden border border-brand-600">
                    <img src={ci.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${ci.user.name}`} alt="avatar" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-50 text-base">{ci.user.name}</p>
                    <p className="text-xs text-brand-400">{ci.user.steamId || "ไม่ได้เชื่อมต่อ Steam"}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    ci.user.role === 'Boss' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                    ci.user.role === 'Underboss' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                    'bg-brand-500/10 text-brand-300 border-brand-500/30'
                  }`}>
                    {ci.user.role}
                  </span>
                </td>
                <td className="py-4 px-6 text-brand-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-500" />
                  {new Date(ci.createdAt).toLocaleString('th-TH')}
                </td>
                <td className="py-4 px-6 text-right">
                  <a href={ci.imageUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-800/50 hover:bg-brand-700 text-brand-200 rounded-lg transition-colors border border-brand-600">
                    <ImageIcon className="w-4 h-4" /> ดูรูป
                  </a>
                </td>
              </tr>
            ))}
            
            {checkIns.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-brand-400">ยังไม่มีประวัติการเช็คชื่อ</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
