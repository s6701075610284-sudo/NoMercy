"use client";

import { useEffect, useState } from "react";
import { getFines, issueFine, payFine, cancelFine } from "@/app/actions/fines";
import { getMembers } from "@/app/actions/members";
import { AlertTriangle, PlusCircle, CheckCircle, Clock, Image as ImageIcon, Search } from "lucide-react";
import { useSession } from "next-auth/react";

export function FinesContent() {
  const { data: session } = useSession();
  const currentUser = session?.user as any;
  const isBossOrUnderboss = currentUser?.role === "Boss" || currentUser?.role === "Underboss";
  const currentUserId = currentUser?.id;

  const [fines, setFines] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Issue Form State
  const [selectedUserId, setSelectedUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isIssuing, setIsIssuing] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);

  // Pay Modal State
  const [payFineId, setPayFineId] = useState<string | null>(null);
  const [payImageUrl, setPayImageUrl] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [finesData, membersData] = await Promise.all([
      getFines(),
      getMembers()
    ]);
    setFines(finesData);
    setMembers(membersData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !amount || !reason) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    
    setIsIssuing(true);
    try {
      await issueFine({ userId: selectedUserId, amount: Number(amount), reason });
      setAmount("");
      setReason("");
      setSelectedUserId("");
      setShowIssueForm(false);
      alert("ออกใบสั่งสำเร็จ!");
      fetchData();
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsIssuing(false);
    }
  };

  const handlePay = async () => {
    if (!payFineId || !payImageUrl) {
      alert("กรุณาใส่ลิงก์รูปหลักฐาน");
      return;
    }
    
    setIsPaying(true);
    try {
      await payFine(payFineId, payImageUrl);
      setPayFineId(null);
      setPayImageUrl("");
      alert("ส่งหลักฐานชำระค่าปรับสำเร็จ!");
      fetchData();
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsPaying(false);
    }
  };

  const handleCancelFine = async (fineId: string) => {
    if (!confirm("คุณต้องการยกเลิกใบสั่งนี้ใช่หรือไม่?")) return;
    try {
      await cancelFine(fineId);
      alert("ยกเลิกใบสั่งสำเร็จ");
      fetchData();
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาด");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-brand-400">กำลังโหลดระบบค่าปรับ...</div>;
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full animate-fade-in relative">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <AlertTriangle className="text-yellow-500 w-6 h-6" /> ระบบค่าปรับ (Fines)
          </h2>
          <p className="text-sm text-brand-400 mt-1">บันทึกบทลงโทษและการชดใช้ค่าปรับของสมาชิก</p>
        </div>
        {isBossOrUnderboss && (
          <button 
            onClick={() => setShowIssueForm(!showIssueForm)}
            className="flex items-center gap-2 bg-brand-800 hover:bg-brand-700 text-brand-100 px-4 py-2 rounded-xl border border-brand-600 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            {showIssueForm ? "ปิดฟอร์ม" : "ออกใบสั่งใหม่"}
          </button>
        )}
      </div>

      {showIssueForm && isBossOrUnderboss && (
        <div className="glass-card p-6 rounded-2xl mb-8 border border-yellow-500/30 bg-gradient-to-br from-brand-900/90 to-brand-800/90 shadow-[0_0_20px_rgba(234,179,8,0.05)] animate-fade-in">
          <h3 className="text-lg font-bold text-white mb-4">ออกใบสั่งค่าปรับ</h3>
          <form onSubmit={handleIssue} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-brand-300 mb-2">เลือกสมาชิก</label>
              <select 
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-yellow-500"
                required
              >
                <option value="">-- เลือกสมาชิก --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-300 mb-2">จำนวนเงินค่าปรับ ($)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-yellow-500"
                placeholder="50000"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-brand-300 mb-2">เหตุผลที่โดนปรับ</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-brand-900 border border-brand-700 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-yellow-500"
                  placeholder="เช่น ขาดประชุมแก๊ง, ยิงพวกเดียวกัน"
                  required
                />
                <button 
                  type="submit"
                  disabled={isIssuing}
                  className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2.5 px-6 rounded-xl transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {isIssuing ? "กำลังออกใบสั่ง..." : "ยืนยัน"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* UNPAID FINES */}
        <div className="glass-card p-6 rounded-2xl flex flex-col h-full max-h-[700px]">
          <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" /> ค้างชำระ ({fines.filter(f => f.status === "UNPAID").length})
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {fines.filter(f => f.status === "UNPAID").map(fine => (
              <div key={fine.id} className="bg-brand-900/50 border-l-4 border-l-red-500 border border-brand-800 rounded-r-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <img src={fine.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fine.user.name}`} className="w-10 h-10 rounded-full border border-brand-700" alt="" />
                    <div>
                      <p className="font-bold text-white text-base">{fine.user.name}</p>
                      <p className="text-xs text-brand-400">สั่งโดย: {fine.issuer.name}</p>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-red-400">${fine.amount.toLocaleString()}</h4>
                </div>
                <div className="bg-brand-950/50 rounded-lg p-3 text-sm text-brand-300 mt-2 mb-3">
                  <span className="text-brand-500 mr-2">ข้อหา:</span>{fine.reason}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-brand-500">{new Date(fine.createdAt).toLocaleString('th-TH')}</span>
                  
                  <div className="flex gap-2">
                    {isBossOrUnderboss && (
                      <button 
                        onClick={() => handleCancelFine(fine.id)}
                        className="bg-red-900/50 hover:bg-red-800 text-red-200 px-3 py-1.5 rounded-lg transition-colors border border-red-800/50"
                      >
                        ยกเลิก
                      </button>
                    )}
                    {currentUserId === fine.userId && (
                      <button 
                        onClick={() => setPayFineId(fine.id)}
                        className="bg-brand-700 hover:bg-brand-600 text-white px-4 py-1.5 rounded-lg transition-colors"
                      >
                        แจ้งชำระเงิน
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {fines.filter(f => f.status === "UNPAID").length === 0 && (
              <div className="text-center py-10 text-brand-500 text-sm">ไม่มีใบสั่งค้างชำระ ทุกคนทำตัวดีมาก!</div>
            )}
          </div>
        </div>

        {/* PAID FINES */}
        <div className="glass-card p-6 rounded-2xl flex flex-col h-full max-h-[700px]">
          <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> จ่ายแล้ว ({fines.filter(f => f.status === "PAID").length})
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {fines.filter(f => f.status === "PAID").map(fine => (
              <div key={fine.id} className="bg-brand-900/30 border border-brand-800 rounded-xl p-4 opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <img src={fine.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fine.user.name}`} className="w-8 h-8 rounded-full opacity-80" alt="" />
                    <div>
                      <p className="font-bold text-brand-200 text-sm">{fine.user.name}</p>
                      <p className="text-[10px] text-brand-500">จ่ายเมื่อ {new Date(fine.updatedAt).toLocaleString('th-TH')}</p>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-green-500/80">${fine.amount.toLocaleString()}</h4>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-brand-400 truncate max-w-[200px]">{fine.reason}</p>
                  {fine.imageUrl && (
                    <a href={fine.imageUrl} target="_blank" rel="noreferrer" className="text-brand-300 hover:text-white flex items-center gap-1 text-xs bg-brand-800/50 px-2 py-1 rounded">
                      <ImageIcon className="w-3 h-3" /> หลักฐาน
                    </a>
                  )}
                </div>
              </div>
            ))}
            {fines.filter(f => f.status === "PAID").length === 0 && (
              <div className="text-center py-10 text-brand-500 text-sm">ยังไม่มีประวัติการจ่ายค่าปรับ</div>
            )}
          </div>
        </div>
      </div>

      {/* Pay Modal */}
      {payFineId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center opacity-100">
          <div className="glass-card w-full max-w-sm rounded-2xl p-6 m-4 animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-2">ส่งหลักฐานชำระเงิน</h3>
            <p className="text-brand-400 text-sm mb-6">วางลิงก์รูปสลิปจากเกมของคุณเพื่อปิดใบสั่ง</p>
            
            <div className="space-y-4">
              <input 
                type="url" 
                value={payImageUrl}
                onChange={(e) => setPayImageUrl(e.target.value)}
                className="w-full bg-brand-900 border border-brand-700 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-brand-400"
                placeholder="https://imgur.com/..."
              />
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setPayFineId(null)}
                  className="flex-1 py-2.5 rounded-xl text-brand-300 hover:bg-brand-800/50 transition-colors font-medium"
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={handlePay}
                  disabled={isPaying}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-colors disabled:opacity-50"
                >
                  {isPaying ? "รอสักครู่..." : "ยืนยันชำระ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
