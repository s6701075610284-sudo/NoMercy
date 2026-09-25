"use client";

import { useEffect, useState } from "react";
import { addExpense, getExpenses, cancelExpense } from "@/app/actions/finance";
import { useSession } from "next-auth/react";
import { Banknote, Coins, Receipt, ArrowDownCircle, Clock, Trash2 } from "lucide-react";

export function ExpensesContent() {
  const { data: session } = useSession();
  const currentUser = session?.user as any;
  const isManager = currentUser?.role === "Moderator" || currentUser?.role === "Boss" || currentUser?.role === "Underboss" || currentUser?.role === "Treasurer";

  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [type, setType] = useState("GREEN");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const data = await getExpenses();
    setExpenses(data);
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
    if (!description.trim()) {
      alert("กรุณากรอกรายละเอียดรายจ่าย");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addExpense({ type, amount: Number(amount), description });
      setAmount("");
      setDescription("");
      alert("บันทึกรายจ่ายสำเร็จ!");
      fetchData();
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาดในการบันทึกรายจ่าย");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelExpense = async (id: string) => {
    if (!confirm("คุณต้องการยกเลิกบันทึกรายจ่ายนี้ใช่หรือไม่? (ยอดเงินจะถูกคืนกลับเข้าคลัง)")) return;
    try {
      await cancelExpense(id);
      fetchData();
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาดในการยกเลิกรายจ่าย");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-brand-400">กำลังโหลดข้อมูลรายจ่าย...</div>;
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-wide">จัดการรายจ่าย (Expenses)</h2>
        <p className="text-sm text-brand-400">บันทึกประวัติการใช้จ่ายเงินกองกลางของแก๊ง</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Form - Only Managers can see */}
        {isManager && (
          <div className="glass-card rounded-2xl p-6 lg:col-span-1 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <Receipt className="w-5 h-5 text-brand-300" />
              <h3 className="text-lg font-bold text-white">บันทึกรายจ่าย</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-brand-300 mb-2">หักจากกระเป๋าไหน</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="cursor-pointer">
                    <input type="radio" name="expenseType" className="peer sr-only" checked={type === "GREEN"} onChange={() => setType("GREEN")} />
                    <div className="text-center py-3 rounded-xl border-2 border-brand-700/50 bg-brand-900/50 peer-checked:border-green-500 peer-checked:text-green-400 peer-checked:bg-green-500/10 text-brand-400 text-sm font-medium transition-all">
                      คลังเขียว
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="expenseType" className="peer sr-only" checked={type === "RED"} onChange={() => setType("RED")} />
                    <div className="text-center py-3 rounded-xl border-2 border-brand-700/50 bg-brand-900/50 peer-checked:border-red-500 peer-checked:text-red-400 peer-checked:bg-red-500/10 text-brand-400 text-sm font-medium transition-all">
                      คลังแดง
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-300 mb-2">จำนวนเงินที่จ่ายออก ($)</label>
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
                <label className="block text-xs font-medium text-brand-300 mb-2">รายละเอียด (ค่าอะไร / ซื้ออะไร)</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-brand-900/50 border-2 border-brand-700/50 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-brand-400 transition-colors" 
                  placeholder="เช่น ซื้อปืนให้แก๊ง, จ่ายค่าบ้าน..." 
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-xl font-bold mt-2 shadow-lg transition-all ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-0.5"
                } bg-gradient-to-r from-red-600 to-red-800 text-white shadow-red-900/50`}
              >
                {isSubmitting ? "กำลังบันทึก..." : "หักเงินออกจากคลัง"}
              </button>
            </form>
          </div>
        )}

        {/* Expenses Log */}
        <div className={`glass-card rounded-2xl p-6 flex flex-col h-full max-h-[700px] ${isManager ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-brand-300" />
            <h3 className="text-lg font-bold text-white">ประวัติรายจ่ายทั้งหมด</h3>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {expenses.map((expense) => (
              <div key={expense.id} className="bg-brand-900/30 border border-brand-800 rounded-xl p-4 flex items-center justify-between hover:bg-brand-800/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                    expense.type === "GREEN" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                  }`}>
                    <ArrowDownCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-red-400 text-lg">-${expense.amount.toLocaleString()}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-brand-800 text-brand-300">
                        {expense.type === "GREEN" ? "คลังเขียว" : "คลังแดง"}
                      </span>
                    </div>
                    <p className="text-sm text-brand-100 font-medium my-0.5">{expense.description}</p>
                    <p className="text-[11px] text-brand-500 flex items-center gap-1">
                      เบิกโดย {expense.user.name} • {new Date(expense.createdAt).toLocaleString('th-TH')}
                    </p>
                  </div>
                </div>
                
                {isManager && (
                  <button 
                    onClick={() => handleCancelExpense(expense.id)}
                    className="p-2 bg-red-900/50 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors border border-red-800/50"
                    title="ยกเลิกรายจ่ายนี้"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            
            {expenses.length === 0 && (
              <div className="text-center py-10 text-brand-500">
                ยังไม่มีประวัติรายจ่าย
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
