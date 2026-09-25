"use client";

import { useState } from "react";
import { submitCheckIn } from "@/app/actions/checkin";
import { X, MapPin, Image as ImageIcon, Info } from "lucide-react";

export function CheckInModal({ onClose }: { onClose: () => void }) {
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!imageUrl) {
      alert("กรุณาใส่ลิงก์รูปภาพก่อนกดยืนยัน");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await submitCheckIn(imageUrl);
      alert("เช็คชื่อสำเร็จแล้ว!");
      onClose();
      window.location.reload(); // Quick refresh to show new check-in
    } catch (e: any) {
      alert(e.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center opacity-100 transition-opacity">
      <div className="glass-card w-full max-w-md rounded-2xl p-6 m-4 relative border-brand-200/30 animate-fade-in">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-brand-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-200/10 text-brand-200 flex items-center justify-center mx-auto mb-4 border border-brand-200/30 shadow-[0_0_20px_rgba(193,199,202,0.2)]">
            <MapPin className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white">เช็คชื่อเข้าเมือง</h3>
          <p className="text-brand-400 text-sm mt-1">อัปโหลดภาพสกรีนช็อตในเกมของคุณเพื่อยืนยัน</p>
        </div>

        <div className="space-y-5">
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
            <p className="text-[10px] text-brand-500 mt-2">*วิธีที่ง่ายที่สุด: ส่งรูปในแชท Discord แล้วก็อปลิงก์รูปมาวาง</p>
          </div>

          <div className="bg-brand-800/50 border border-brand-700/50 rounded-lg p-3 flex items-start gap-3">
            <Info className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
            <p className="text-xs text-brand-300 leading-relaxed">
              <strong className="text-yellow-400">เช็คชื่อได้เฉพาะเวลา 21:20 - 23:00 น. เท่านั้น!</strong><br/>
              ระบบจะบันทึกเวลาปัจจุบันอัตโนมัติ (อิงตามเวลาไทย)<br/>
              โปรดตรวจสอบให้แน่ใจว่ารูปภาพเห็นตัวละครชัดเจน
            </p>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full btn-primary py-3.5 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(193,199,202,0.15)] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการเช็คชื่อ"}
          </button>
        </div>
      </div>
    </div>
  );
}
