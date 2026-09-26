"use client";

import { useState } from "react";
import { submitFinance } from "@/app/actions/finance";
import { Image as ImageIcon } from "lucide-react";

export function QuickFinanceForm() {
  const [type, setType] = useState("GREEN");
  const [amount, setAmount] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      alert("ส่งยอดสำเร็จ! กรุณารอผู้นำแก๊งอนุมัติยอด");
      // Optional: Refresh page or stats to reflect pending status
      window.location.reload(); 
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาดในการส่งยอด");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4 flex-1" onSubmit={handleSubmit}>
      <div>
        <label className="block text-xs font-medium text-brand-300 mb-1">ประเภทเงิน</label>
        <div className="grid grid-cols-2 gap-2">
          <label className="cursor-pointer">
            <input 
              type="radio" 
              name="quickMoneyType" 
              className="peer sr-only" 
              checked={type === "GREEN"}
              onChange={() => setType("GREEN")}
            />
            <div className="text-center py-2 rounded-lg border border-brand-600 bg-brand-800/50 peer-checked:border-green-500 peer-checked:text-green-400 text-brand-400 text-sm transition-all">
              เงินเขียว
            </div>
          </label>
          <label className="cursor-pointer">
            <input 
              type="radio" 
              name="quickMoneyType" 
              className="peer sr-only" 
              checked={type === "RED"}
              onChange={() => setType("RED")}
            />
            <div className="text-center py-2 rounded-lg border border-brand-600 bg-brand-800/50 peer-checked:border-red-500 peer-checked:text-red-400 text-brand-400 text-sm transition-all">
              เงินแดง
            </div>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-brand-300 mb-1">จำนวนเงิน</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400">$</span>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-brand-900/50 border border-brand-700 rounded-lg py-2.5 pl-8 pr-4 text-white focus:outline-none focus:border-brand-300 transition-colors" 
            placeholder="0" 
            required
            min="1"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-xs font-medium text-brand-300 mb-1">ลิงก์สลิป/รูปหลักฐาน (ถ้ามี)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400">
            <ImageIcon className="w-4 h-4" />
          </span>
          <input 
            type="url" 
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full bg-brand-900/50 border border-brand-700 rounded-lg py-2.5 pl-9 pr-4 text-white focus:outline-none focus:border-brand-300 transition-colors text-sm" 
            placeholder="https://..." 
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full btn-primary py-3 rounded-xl font-bold mt-4 shadow-lg shadow-brand-200/10 disabled:opacity-50"
      >
        {isSubmitting ? "กำลังส่ง..." : "ส่งยอด"}
      </button>
    </form>
  );
}
