"use client";

import { useState } from 'react';
import { signIn, signOut, useSession } from "next-auth/react";
import { Crown, PieChart, Users, MapPin, Vault, Settings, Camera, Bell, ArrowUp, Banknote, Coins, Crosshair, Image as ImageIcon, Info, X } from 'lucide-react';
import { MembersContent } from '@/components/MembersContent';
import { FinanceContent } from '@/components/FinanceContent';
import { RecentCheckIns } from '@/components/RecentCheckIns';
import { CheckInModal } from '@/components/CheckInModal';
import { CheckInContent } from '@/components/CheckInContent';
import { DashboardStats } from '@/components/DashboardStats';
import { FinesContent } from '@/components/FinesContent';
import { ExpensesContent } from '@/components/ExpensesContent';
import { InventoryContent } from '@/components/InventoryContent';
import { QuickFinanceForm } from '@/components/QuickFinanceForm';
import { AlertTriangle, Receipt, Box } from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

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
          <div className="w-24 h-24 mx-auto mb-6">
            <img src="/LOGO_NO_MERCY.png" alt="No Mercy Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
          </div>
          <h1 className="text-3xl font-black tracking-widest text-white uppercase mb-2">
            NO<span className="text-brand-300">MERCY</span>
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
            <img src="/LOGO_NO_MERCY.png" alt="Logo" className="w-10 h-10 object-contain mr-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            <div>
              <h1 className="text-xl font-black tracking-widest text-brand-50 uppercase">
                NO<span className="text-brand-300">MERCY</span>
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-8 px-4 space-y-2">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-brand-800/50 text-brand-100 border border-brand-600/50' : 'text-brand-400 hover:text-brand-100 hover:bg-brand-800/30'}`}>
              <PieChart className="w-5 h-5 mr-3" />
              <span className="font-medium">ภาพรวม (Dashboard)</span>
            </button>
            <button onClick={() => setActiveTab('members')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'members' ? 'bg-brand-800/50 text-brand-100 border border-brand-600/50' : 'text-brand-400 hover:text-brand-100 hover:bg-brand-800/30'}`}>
              <Users className="w-5 h-5 mr-3" />
              <span className="font-medium">จัดการสมาชิก</span>
            </button>
            <button onClick={() => setActiveTab('checkin')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'checkin' ? 'bg-brand-800/50 text-brand-100 border border-brand-600/50' : 'text-brand-400 hover:text-brand-100 hover:bg-brand-800/30'}`}>
              <MapPin className="w-5 h-5 mr-3" />
              <span className="font-medium">เช็คชื่อ (Check-in)</span>
            </button>
            <button onClick={() => setActiveTab('stash')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'stash' ? 'bg-brand-800/50 text-brand-100 border border-brand-600/50' : 'text-brand-400 hover:text-brand-100 hover:bg-brand-800/30'}`}>
              <Vault className="w-5 h-5 mr-3" />
              <span className="font-medium">คลัง & ส่งยอด</span>
            </button>
            <button onClick={() => setActiveTab('fines')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'fines' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'text-brand-400 hover:text-red-400 hover:bg-brand-800/30'}`}>
              <AlertTriangle className="w-5 h-5 mr-3" />
              <span className="font-medium">ระบบค่าปรับ</span>
            </button>
            <button onClick={() => setActiveTab('expenses')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'expenses' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' : 'text-brand-400 hover:text-orange-400 hover:bg-brand-800/30'}`}>
              <Receipt className="w-5 h-5 mr-3" />
              <span className="font-medium">รายจ่าย</span>
            </button>
            <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'inventory' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'text-brand-400 hover:text-blue-400 hover:bg-brand-800/30'}`}>
              <Box className="w-5 h-5 mr-3" />
              <span className="font-medium">รายการของแก๊ง</span>
            </button>
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
            <p className="text-sm text-brand-400 flex items-center gap-1">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              อัปเดตข้อมูลล่าสุดแบบ Real-time
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCheckinModalOpen(true)}
              className="btn-primary px-6 py-2.5 rounded-full font-semibold flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              เช็คชื่อเข้าเมือง
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        {activeTab === 'dashboard' && (
          <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
            
            {/* Stats Row */}
            <DashboardStats />

            {/* Main Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Check-ins */}
              <div className="lg:col-span-2 glass-card rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">เช็คชื่อล่าสุด</h3>
                  <button onClick={() => setActiveTab('checkin')} className="text-sm text-brand-300 hover:text-white transition-colors">ดูทั้งหมด</button>
                </div>
                <RecentCheckIns />
              </div>

              {/* Finance / Quota Submit */}
              <div className="glass-card rounded-2xl p-6 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-6">ส่งยอด</h3>
                <QuickFinanceForm />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <MembersContent currentUserRole={(session?.user as any)?.role || "Member"} />
        )}

        {activeTab === 'checkin' && (
          <CheckInContent />
        )}

        {activeTab === 'stash' && (
          <FinanceContent />
        )}

        {activeTab === 'fines' && (
          <FinesContent />
        )}

        {activeTab === 'expenses' && (
          <ExpensesContent />
        )}

        {activeTab === 'inventory' && (
          <InventoryContent />
        )}
      </main>

      {/* Check-in Modal Overlay */}
      {isCheckinModalOpen && (
        <CheckInModal onClose={() => setIsCheckinModalOpen(false)} />
      )}

    </div>
  );
}
