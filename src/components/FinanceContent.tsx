"use client";

import { useEffect, useState } from "react";
import { submitFinance, getFinances, getFinanceStats } from "@/app/actions/finance";
import { Banknote, Coins, Image as ImageIcon, ArrowUpRight, Clock, PlusCircle } from "lucide-react";

export function FinanceContent() {
  const [finances, setFinances] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalGreen: 0, totalRed: 0 });
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [type, setType] = useState("GREEN");
  const [amount, setAmount] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [financeData, statsData] = await Promise.all([
      getFinances(),
      getFinanceStats()
    ]);
    setFinances(financeData);
    setStats(statsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) {
      alert("กรุณากรอกจำนวนเงินให้ถูกต้อง");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await submitFinance({ type, amount: Number(amount), imageUrl });
      setAmount("");
      setImageUrl("");
      alert("ส่งยอดสำเร็จ!");
      fetchData(); // Reload data
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาดในการส่งยอด");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-brand-400">กำลังโหลดข้อมูลคลัง...</div>;
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-wide">คลัง & ส่งยอด</h2>
        <p className="text-sm text-brand-400">บันทึกรายรับและเป้าหมายเงินกองกลางของแก๊ง</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GREEN STASH */}
        <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Banknote className="w-32 h-32 text-green-500" />
          </div>
          <p className="text-brand-300 font-medium mb-2 relative z-10">ยอดเงินเขียวรวมในคลัง</p>
          <h3 className="text-5xl font-bold text-white relative z-10">${stats.totalGreen.toLocaleString()}</h3>
          <div className="mt-4 flex items-center text-sm text-green-400 font-medium relative z-10">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            อัปเดตล่าสุดเมื่อสักครู่
          </div>
        </div>

        {/* RED STASH */}
        <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Coins className="w-32 h-32 text-red-500" />
          </div>
          <p className="text-brand-300 font-medium mb-2 relative z-10">ยอดเงินแดงรวมในคลัง</p>
          <h3 className="text-5xl font-bold text-white relative z-10">${stats.totalRed.toLocaleString()}</h3>
          <div className="mt-4 flex items-center text-sm text-brand-400 relative z-10">
            เป้าหมายฟอกเงิน: <span className="text-brand-100 ml-2">$1,000,000</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-brand-900 rounded-full h-2 mt-3 overflow-hidden relative z-10">
            <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min((stats.totalRed / 1000000) * 100, 100)}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Form */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-1 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <PlusCircle className="w-5 h-5 text-brand-300" />
            <h3 className="text-lg font-bold text-white">บันทึกส่งยอด</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-brand-300 mb-2">ประเภทเงิน</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer">
                  <input type="radio" name="moneyType" className="peer sr-only" checked={type === "GREEN"} onChange={() => setType("GREEN")} />
                  <div className="text-center py-3 rounded-xl border-2 border-brand-700/50 bg-brand-900/50 peer-checked:border-green-500 peer-checked:text-green-400 peer-checked:bg-green-500/10 text-brand-400 text-sm font-medium transition-all">
                    เงินเขียว
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="moneyType" className="peer sr-only" checked={type === "RED"} onChange={() => setType("RED")} />
                  <div className="text-center py-3 rounded-xl border-2 border-brand-700/50 bg-brand-900/50 peer-checked:border-red-500 peer-checked:text-red-400 peer-checked:bg-red-500/10 text-brand-400 text-sm font-medium transition-all">
                    เงินแดง
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-300 mb-2">จำนวนเงิน</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400 font-bold">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-brand-900/50 border-2 border-brand-700/50 rounded-xl py-3 pl-8 pr-4 text-white font-medium focus:outline-none focus:border-brand-400 transition-colors" 
                  placeholder="0" 
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-brand-300 mb-2">ลิงก์รูปหลักฐาน (Discord URL / Imgur)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400">
                  <ImageIcon className="w-4 h-4" />
                </span>
                <input 
                  type="url" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-brand-900/50 border-2 border-brand-700/50 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-brand-400 transition-colors" 
                  placeholder="https://..." 
                />
              </div>
              <p className="text-[10px] text-brand-500 mt-2">*วิธีที่ง่ายที่สุด: ส่งรูปใน Discord แล้วก็อปลิงก์รูปมาวาง</p>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl font-bold mt-2 shadow-lg transition-all ${
                type === "GREEN" 
                  ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-green-500/20" 
                  : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-red-500/20"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-0.5"}`}
            >
              {isSubmitting ? "กำลังส่ง..." : "ส่งยอดเข้าคลัง"}
            </button>
          </form>
        </div>

        {/* History Log */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2 flex flex-col h-full max-h-[600px]">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-brand-300" />
            <h3 className="text-lg font-bold text-white">ประวัติการส่งยอด</h3>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {finances.map((finance) => (
              <div key={finance.id} className="bg-brand-900/30 border border-brand-800 rounded-xl p-4 flex items-center justify-between hover:bg-brand-800/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                    finance.type === "GREEN" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                  }`}>
                    {finance.type === "GREEN" ? <Banknote className="w-6 h-6" /> : <Coins className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">${finance.amount.toLocaleString()}</p>
                    <p className="text-xs text-brand-400 flex items-center gap-1">
                      โดย <span className="text-brand-200 font-medium">{finance.user.name}</span> • 
                      {new Date(finance.createdAt).toLocaleString('th-TH')}
                    </p>
                  </div>
                </div>
                
                {finance.imageUrl && (
                  <a href={finance.imageUrl} target="_blank" rel="noreferrer" className="text-brand-400 hover:text-white p-2 bg-brand-800/50 rounded-lg transition-colors" title="ดูหลักฐาน">
                    <ImageIcon className="w-5 h-5" />
                  </a>
                )}
              </div>
            ))}
            
            {finances.length === 0 && (
              <div className="text-center py-10 text-brand-500">
                ยังไม่มีประวัติการส่งยอด
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
