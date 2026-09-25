"use client";

import { useEffect, useState } from "react";
import { getMembers, updateMemberRole, promoteToBoss } from "@/app/actions/members";
import { User } from "@prisma/client";
import { Shield, ShieldAlert, Crown, User as UserIcon } from "lucide-react";

export function MembersContent({ currentUserRole }: { currentUserRole: string }) {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    setLoading(true);
    const data = await getMembers();
    setMembers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (currentUserRole !== "Boss" && currentUserRole !== "Underboss") {
      alert("คุณไม่มีสิทธิ์ในการเปลี่ยนยศสมาชิก!");
      return;
    }
    
    try {
      await updateMemberRole(userId, newRole);
      // Optimistic update
      setMembers(members.map(m => m.id === userId ? { ...m, role: newRole } : m));
    } catch (e: any) {
      alert(e.message || "เกิดข้อผิดพลาด");
    }
  };

  const handleSelfPromote = async () => {
    const res = await promoteToBoss();
    if (res.success) {
      alert("ยินดีด้วย! คุณได้รับการแต่งตั้งเป็น Boss แล้ว (รีเฟรชหน้าเว็บเพื่อดูผล)");
      window.location.reload();
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-brand-400">กำลังโหลดข้อมูลสมาชิก...</div>;
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">จัดการสมาชิก</h2>
          <p className="text-sm text-brand-400">รายชื่อสมาชิกทั้งหมดภายในแก๊ง</p>
        </div>
        
        {currentUserRole !== "Boss" && (
          <button 
            onClick={handleSelfPromote}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg text-white font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-yellow-500/20"
          >
            ตั้งตัวเองเป็น Boss (โหมดทดสอบ)
          </button>
        )}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-brand-800/50">
            <tr className="text-brand-300 text-sm">
              <th className="py-4 px-6 font-medium">สมาชิก</th>
              <th className="py-4 px-6 font-medium">สตรีมไอดี / อีเมล</th>
              <th className="py-4 px-6 font-medium">ยศปัจจุบัน</th>
              <th className="py-4 px-6 font-medium text-right">จัดการยศ</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-brand-800/50">
            {members.map(member => (
              <tr key={member.id} className="hover:bg-brand-800/20 transition-colors">
                <td className="py-4 px-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-700 overflow-hidden border border-brand-600">
                    <img src={member.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt="avatar" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-50 text-base">{member.name}</p>
                  </div>
                </td>
                <td className="py-4 px-6 text-brand-400">
                  {member.email || "ไม่มีข้อมูล"}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    member.role === 'Boss' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                    member.role === 'Underboss' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                    member.role === 'Rookie' ? 'bg-gray-500/10 text-gray-400 border-gray-500/30' :
                    'bg-brand-500/10 text-brand-300 border-brand-500/30'
                  }`}>
                    {member.role === 'Boss' && <Crown className="w-3 h-3 inline mr-1 -mt-0.5" />}
                    {member.role === 'Underboss' && <ShieldAlert className="w-3 h-3 inline mr-1 -mt-0.5" />}
                    {member.role === 'Member' && <Shield className="w-3 h-3 inline mr-1 -mt-0.5" />}
                    {member.role === 'Rookie' && <UserIcon className="w-3 h-3 inline mr-1 -mt-0.5" />}
                    {member.role}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  {(currentUserRole === "Boss" || currentUserRole === "Underboss") ? (
                    <select 
                      className="bg-brand-900 border border-brand-700 text-brand-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brand-400 cursor-pointer"
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      disabled={member.role === "Boss" && currentUserRole !== "Boss"} // Underboss can't change Boss
                    >
                      <option value="Boss">Boss</option>
                      <option value="Underboss">Underboss</option>
                      <option value="Member">Member</option>
                      <option value="Rookie">Rookie</option>
                    </select>
                  ) : (
                    <span className="text-brand-500 text-xs">ไม่มีสิทธิ์</span>
                  )}
                </td>
              </tr>
            ))}
            
            {members.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-brand-400">ยังไม่มีสมาชิกในระบบ</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
