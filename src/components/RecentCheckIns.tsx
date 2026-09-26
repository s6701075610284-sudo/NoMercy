"use client";

import { useEffect, useState } from "react";
import { getRecentCheckIns, getAbsentMembers } from "@/app/actions/checkin";
import { Image as ImageIcon, UserX } from "lucide-react";

export function RecentCheckIns() {
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [absent, setAbsent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [checkinData, absentData] = await Promise.all([
        getRecentCheckIns(5, true),
        getAbsentMembers()
      ]);
      setCheckIns(checkinData);
      setAbsent(absentData);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-brand-400">กำลังโหลด...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-brand-400 border-b border-brand-800 text-sm">
            <th className="pb-3 font-medium w-1/2">สมาชิก</th>
            <th className="pb-3 font-medium">ยศ</th>
            <th className="pb-3 font-medium">เวลาเช็คชื่อ</th>
            <th className="pb-3 font-medium text-right">หลักฐาน</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {checkIns.map((ci) => (
            <tr key={ci.id} className="border-b border-brand-800/50 hover:bg-brand-800/20 transition-colors">
              <td className="py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-700 overflow-hidden">
                  <img src={ci.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${ci.user.name}`} alt="avatar" />
                </div>
                <div>
                  <p className="font-semibold text-brand-100">{ci.user.name}</p>
                  <p className="text-xs text-brand-400">{ci.user.steamId || "ไม่ได้เชื่อมต่อ Steam"}</p>
                </div>
              </td>
              <td className="py-4">
                <span className={`px-2 py-1 rounded text-xs font-medium border ${
                  ci.user.role === 'Boss' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                  ci.user.role === 'Underboss' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                  'bg-brand-800 text-brand-200 border-brand-600'
                }`}>
                  {ci.user.role}
                </span>
              </td>
              <td className="py-4 text-brand-300">
                {new Date(ci.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
              </td>
              <td className="py-4 text-right">
                <a href={ci.imageUrl} target="_blank" rel="noreferrer" className="text-brand-300 hover:text-white inline-block">
                  <ImageIcon className="w-4 h-4" />
                </a>
              </td>
            </tr>
          ))}
          {checkIns.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-brand-400">ยังไม่มีการเช็คชื่อวันนี้</td>
            </tr>
          )}
        </tbody>
      </table>

      {absent.length > 0 && (
        <div className="mt-8">
          <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
            <UserX className="w-4 h-4" /> ยังไม่มาเช็คชื่อ ({absent.length} คน)
          </h4>
          <div className="flex flex-wrap gap-2">
            {absent.map(user => (
              <div key={user.id} className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
                <div className="w-4 h-4 rounded-full overflow-hidden bg-brand-800">
                  <img src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" />
                </div>
                {user.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
