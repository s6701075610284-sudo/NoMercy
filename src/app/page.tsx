"use client";

import { useState } from 'react';
import { signIn, signOut, useSession } from "next-auth/react";
import { 
  Crown, PieChart, Users, MapPin, Vault, Handshake, 
  Settings, Camera, Bell, ArrowUp, Banknote, Coins, 
  Crosshair, Image as ImageIcon, Info, X 
} from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-brand-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-200"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-brand-900 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-400/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="glass-card p-10 rounded-3xl max-w-md w-full mx-4 text-center z-10 animate-fade-in relative border border-brand-700/50">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-300 to-white flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(193,199,202,0.2)]">
            <Crown className="text-brand-900 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-wider text-white uppercase mb-2">
            GANG<span className="text-brand-300">HUB</span>
          </h1>
          <p className="text-brand-400 mb-8 text-sm">เข้าสู่ระบบเพื่อจัดการข้อมูลแก๊งของคุณ</p>
          
          <button 
            onClick={() => signIn('discord')}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_20px_rgba(88,101,242,0.4)] hover:-translate-y-1"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 127.14 96.36">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14h0c2.64-27.38-4.51-51.11-19.32-72.15ZM42.63,65.34c-5.36,0-9.82-5-9.82-11.12s4.35-11.12,9.82-11.12,9.88,5,9.82,11.12S48.1,65.34,42.63,65.34Zm41.83,0c-5.36,0-9.82-5-9.82-11.12s4.35-11.12,9.82-11.12,9.88,5,9.82,11.12S89.92,65.34,84.46,65.34Z"/>
            </svg>
            เข้าสู่ระบบด้วย Discord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen antialiased bg-brand-900 text-brand-100">
      
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-brand-800 flex-col justify-between hidden md:flex z-10">
        <div>
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-brand-800/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-200 to-white flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(193,199,202,0.3)]">
              <Crown className="text-brand-900 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-brand-50 uppercase">
                GANG<span className="text-brand-300">HUB</span>
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-8 px-4 space-y-2">
            <a href="#" className="flex items-center px-4 py-3 bg-brand-800/50 text-brand-100 rounded-xl border border-brand-600/50 transition-colors">
              <PieChart className="w-5 h-5 mr-3" />
              <span className="font-medium">ภาพรวม (Dashboard)</span>
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-brand-400 hover:text-brand-100 hover:bg-brand-800/30 rounded-xl transition-all">
              <Users className="w-5 h-5 mr-3" />
              <span className="font-medium">จัดการสมาชิก</span>
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-brand-400 hover:text-brand-100 hover:bg-brand-800/30 rounded-xl transition-all">
              <MapPin className="w-5 h-5 mr-3" />
              <span className="font-medium">เช็คชื่อ (Check-in)</span>
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-brand-400 hover:text-brand-100 hover:bg-brand-800/30 rounded-xl transition-all">
              <Vault className="w-5 h-5 mr-3" />
              <span className="font-medium">คลัง & ส่งยอด</span>
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-brand-400 hover:text-brand-100 hover:bg-brand-800/30 rounded-xl transition-all">
              <Handshake className="w-5 h-5 mr-3" />
              <span className="font-medium">การทูต</span>
            </a>
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-brand-800/50">
          <div className="flex items-center p-3 rounded-xl hover:bg-brand-800/30 cursor-pointer transition-colors" onClick={() => signOut()}>
            <div className="w-10 h-10 rounded-full bg-brand-700 flex items-center justify-center overflow-hidden border border-brand-500">
              <img src={session.user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="User avatar" className="w-full h-full object-cover" />
            </div>
            <div className="ml-3 overflow-hidden text-left flex-1">
              <p className="text-sm font-semibold text-white truncate">{session.user?.name}</p>
              <p className="text-xs text-brand-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></span> 
                {/* @ts-ignore */}
                {session.user?.role || "Member"}
              </p>
            </div>
            <Settings className="w-4 h-4 text-brand-400 shrink-0 hover:text-white" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-20 glass-panel border-b border-brand-800/50 flex items-center justify-between px-8 sticky top-0 z-20">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">ภาพรวมแก๊ง</h2>
            <p className="text-sm text-brand-400">อัปเดตข้อมูลล่าสุด: วันนี้ 09:30 น.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCheckinModalOpen(true)}
              className="btn-primary px-6 py-2.5 rounded-full font-semibold flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              เช็คชื่อเข้าเมือง
            </button>
            <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center cursor-pointer relative">
              <Bell className="w-5 h-5 text-brand-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl animate-fade-in opacity-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-brand-400 text-sm font-medium mb-1">สมาชิกในเมืองตอนนี้</p>
                  <h3 className="text-3xl font-bold text-white">24 <span className="text-lg text-brand-400 font-normal">/ 50</span></h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center border border-green-500/20">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-green-400">
                <ArrowUp className="w-3 h-3 mr-1" />
                <span>+5 จากชั่วโมงที่แล้ว</span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl animate-fade-in opacity-0 delay-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-brand-400 text-sm font-medium mb-1">เงินกองกลาง (เขียว)</p>
                  <h3 className="text-3xl font-bold text-brand-100">$2.4M</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center border border-green-500/20">
                  <Banknote className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-brand-400">
                <span className="text-brand-200 font-medium mr-1">ล่าสุด:</span> +$50,000 (John)
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl animate-fade-in opacity-0 delay-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-brand-400 text-sm font-medium mb-1">เงินกองกลาง (แดง)</p>
                  <h3 className="text-3xl font-bold text-brand-100">$850K</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
                  <Coins className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-brand-400">
                <span className="text-brand-200 font-medium mr-1">เป้าหมาย:</span> $1M ภายในสัปดาห์นี้
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl animate-fade-in opacity-0 delay-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-brand-400 text-sm font-medium mb-1">อาวุธคงคลัง</p>
                  <h3 className="text-3xl font-bold text-brand-100">142 <span className="text-sm font-normal">ชิ้น</span></h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-brand-500/20 text-brand-200 flex items-center justify-center border border-brand-500/30">
                  <Crosshair className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-brand-400">
                สถานะ: <span className="text-green-400 ml-1">เพียงพอ</span>
              </div>
            </div>
          </div>

          {/* Main Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent Check-ins */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">เช็คชื่อล่าสุด</h3>
                <button className="text-sm text-brand-300 hover:text-white transition-colors">ดูทั้งหมด</button>
              </div>
              
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
                    <tr className="border-b border-brand-800/50 hover:bg-brand-800/20 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-700 overflow-hidden">
                          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jack" alt="avatar" />
                        </div>
                        <div>
                          <p className="font-semibold text-brand-100">Jack Sniper</p>
                          <p className="text-xs text-brand-400">STEAM_0:1:12345</p>
                        </div>
                      </td>
                      <td className="py-4"><span className="px-2 py-1 rounded bg-brand-800 text-brand-200 text-xs font-medium border border-brand-600">Member</span></td>
                      <td className="py-4 text-brand-300">10 นาทีที่แล้ว</td>
                      <td className="py-4 text-right">
                        <button className="text-brand-300 hover:text-white"><ImageIcon className="w-4 h-4 ml-auto" /></button>
                      </td>
                    </tr>
                    <tr className="border-b border-brand-800/50 hover:bg-brand-800/20 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-700 overflow-hidden">
                          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mia" alt="avatar" />
                        </div>
                        <div>
                          <p className="font-semibold text-brand-100">Mia Driver</p>
                          <p className="text-xs text-brand-400">STEAM_0:1:99887</p>
                        </div>
                      </td>
                      <td className="py-4"><span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs font-medium border border-yellow-500/20">Underboss</span></td>
                      <td className="py-4 text-brand-300">45 นาทีที่แล้ว</td>
                      <td className="py-4 text-right">
                        <button className="text-brand-300 hover:text-white"><ImageIcon className="w-4 h-4 ml-auto" /></button>
                      </td>
                    </tr>
                    <tr className="hover:bg-brand-800/20 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-700 overflow-hidden">
                          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rook" alt="avatar" />
                        </div>
                        <div>
                          <p className="font-semibold text-brand-100">Tom Rookie</p>
                          <p className="text-xs text-brand-400">STEAM_0:1:55667</p>
                        </div>
                      </td>
                      <td className="py-4"><span className="px-2 py-1 rounded bg-brand-800 text-brand-400 text-xs font-medium border border-brand-700">Rookie</span></td>
                      <td className="py-4 text-brand-300">1 ชม. ที่แล้ว</td>
                      <td className="py-4 text-right">
                        <button className="text-brand-300 hover:text-white"><ImageIcon className="w-4 h-4 ml-auto" /></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Finance / Quota Submit */}
            <div className="glass-card rounded-2xl p-6 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-6">ส่งยอด / ภาษี</h3>
              
              <form className="space-y-4 flex-1">
                <div>
                  <label className="block text-xs font-medium text-brand-300 mb-1">ประเภทเงิน</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="cursor-pointer">
                      <input type="radio" name="moneyType" className="peer sr-only" defaultChecked />
                      <div className="text-center py-2 rounded-lg border border-brand-600 bg-brand-800/50 peer-checked:border-green-500 peer-checked:text-green-400 text-brand-400 text-sm transition-all">
                        เงินเขียว
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" name="moneyType" className="peer sr-only" />
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
                    <input type="number" className="w-full bg-brand-900/50 border border-brand-700 rounded-lg py-2.5 pl-8 pr-4 text-white focus:outline-none focus:border-brand-300 transition-colors" placeholder="0" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-brand-300 mb-1">สลิป/หลักฐาน (ถ้ายัดตู้)</label>
                  <div className="border-2 border-dashed border-brand-700 rounded-lg p-4 text-center cursor-pointer hover:border-brand-500 hover:bg-brand-800/30 transition-all flex flex-col items-center">
                    <ImageIcon className="w-6 h-6 text-brand-400 mb-2" />
                    <p className="text-xs text-brand-300">คลิกเพื่ออัปโหลดรูปภาพ</p>
                  </div>
                </div>

                <button type="button" className="w-full btn-primary py-3 rounded-xl font-bold mt-4 shadow-lg shadow-brand-200/10">
                  ส่งยอด
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Check-in Modal Overlay */}
      {isCheckinModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center opacity-100 transition-opacity">
          <div className="glass-card w-full max-w-md rounded-2xl p-6 m-4 relative border-brand-200/30 animate-fade-in">
            <button 
              onClick={() => setIsCheckinModalOpen(false)} 
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
              <div className="border-2 border-dashed border-brand-500/50 bg-brand-900/50 rounded-xl p-8 text-center cursor-pointer hover:border-brand-300 transition-all group flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-brand-800 group-hover:bg-brand-700 flex items-center justify-center mx-auto mb-3 transition-colors">
                  <ImageIcon className="w-6 h-6 text-brand-300" />
                </div>
                <p className="text-brand-200 font-medium text-sm">คลิกเพื่อเลือกไฟล์รูปภาพ</p>
                <p className="text-brand-500 text-xs mt-1">รองรับ JPG, PNG (สูงสุด 5MB)</p>
              </div>

              <div className="bg-brand-800/50 border border-brand-700/50 rounded-lg p-3 flex items-start gap-3">
                <Info className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <p className="text-xs text-brand-300 leading-relaxed">
                  ระบบจะบันทึกเวลา <span className="text-brand-100 font-medium">09:30 น.</span> อัตโนมัติ<br/>
                  โปรดตรวจสอบให้แน่ใจว่ารูปภาพเห็นตัวละครชัดเจน
                </p>
              </div>

              <button 
                onClick={() => setIsCheckinModalOpen(false)}
                className="w-full btn-primary py-3.5 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(193,199,202,0.15)]"
              >
                ยืนยันการเช็คชื่อ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
