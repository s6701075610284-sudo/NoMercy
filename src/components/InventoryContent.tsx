"use client";

import { useEffect, useState } from "react";
import { getInventory, addInventoryItem, updateInventoryItemQuantity, deleteInventoryItem, setInventoryItemQuantity } from "@/app/actions/inventory";
import { useSession } from "next-auth/react";
import { Package, PlusCircle, MinusCircle, Trash2, Image as ImageIcon, Box } from "lucide-react";

export function InventoryContent() {
  const { data: session } = useSession();
  const currentUser = session?.user as any;
  const isManager = currentUser?.role === "Moderator" || currentUser?.role === "Boss" || currentUser?.role === "Underboss" || currentUser?.role === "Treasurer";

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [holderName, setHolderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inline Edit State
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingQuantity, setEditingQuantity] = useState("");

  const fetchData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const data = await getInventory();
    setItems(data);
    if (showLoading) setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quantity || isNaN(Number(quantity))) {
      alert("กรุณากรอกชื่อและจำนวนให้ถูกต้อง");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addInventoryItem({ name, quantity: Number(quantity), imageUrl, holderName });
      setName("");
      setQuantity("");
      setImageUrl("");
      setHolderName("");
      fetchData(false);
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateQuantity = async (id: string, delta: number) => {
    try {
      await updateInventoryItemQuantity(id, delta);
      fetchData(false);
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาด");
    }
  };

  const handleSetQuantity = async (id: string) => {
    if (editingQuantity === "") {
      setEditingItemId(null);
      return;
    }
    const num = Number(editingQuantity);
    if (isNaN(num) || num < 0) {
      alert("กรุณาระบุจำนวนที่ถูกต้อง");
      setEditingItemId(null);
      return;
    }
    try {
      await setInventoryItemQuantity(id, num);
      fetchData(false);
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาด");
    }
    setEditingItemId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบไอเทมนี้ออกจากคลังถาวรใช่หรือไม่?")) return;
    try {
      await deleteInventoryItem(id);
      fetchData(false);
    } catch (err: any) {
      alert(err.message || "เกิดข้อผิดพลาด");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-brand-400">กำลังโหลดคลังไอเทม...</div>;
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <Box className="w-6 h-6 text-brand-400" /> คลังของแก๊ง (Inventory)
        </h2>
        <p className="text-sm text-brand-400">รายการอาวุธ ไอเทม และของใช้ส่วนรวมของแก๊ง</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Item Form */}
        {isManager && (
          <div className="glass-card rounded-2xl p-6 lg:col-span-1 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-brand-300" />
              <h3 className="text-lg font-bold text-white">เพิ่มของเข้าคลัง</h3>
            </div>
            
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-brand-300 mb-2">ชื่อไอเทม</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-brand-900/50 border border-brand-700/50 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-brand-400" 
                  placeholder="เช่น ปืนสั้น, เกราะหนัก, แบนเดจ" 
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-brand-300 mb-2">จำนวน</label>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-brand-900/50 border border-brand-700/50 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-brand-400" 
                  placeholder="0" 
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-300 mb-2">URL รูปภาพไอเทม (ถ้ามี)</label>
                <input 
                  type="url" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-brand-900/50 border border-brand-700/50 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-brand-400" 
                  placeholder="https://..." 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-300 mb-2">ผู้ครอบครอง / สถานที่เก็บ</label>
                <input 
                  type="text" 
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full bg-brand-900/50 border border-brand-700/50 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-brand-400" 
                  placeholder="เช่น คลังส่วนกลาง, พี่บอส, นาย A" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl font-bold mt-2 bg-brand-600 hover:bg-brand-500 text-white transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "กำลังเพิ่ม..." : "เพิ่มไอเทมใหม่"}
              </button>
            </form>
          </div>
        )}

        {/* Inventory List */}
        <div className={`glass-card rounded-2xl p-6 flex flex-col h-full max-h-[700px] ${isManager ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Box className="w-5 h-5 text-brand-300" /> ของทั้งหมดในคลัง ({items.length} รายการ)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="bg-brand-900/40 border border-brand-800 rounded-xl p-4 flex flex-col justify-between hover:bg-brand-800/30 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-brand-950/50 border border-brand-800 flex items-center justify-center overflow-hidden shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <Package className="w-8 h-8 text-brand-700" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{item.name}</h4>
                    {item.holderName && (
                      <p className="text-xs font-medium text-yellow-400 mb-1 bg-yellow-400/10 inline-block px-2 py-0.5 rounded border border-yellow-400/20 mt-1">
                        อยู่กับ: {item.holderName}
                      </p>
                    )}
                    <p className="text-[11px] text-brand-500 mt-1">อัปเดตโดย: {item.updatedBy}</p>
                    <p className="text-[10px] text-brand-600">{new Date(item.updatedAt).toLocaleString('th-TH')}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-brand-950/50 rounded-lg p-2 border border-brand-800/50">
                  <span className="text-xs font-medium text-brand-400 pl-2">จำนวนคงเหลือ</span>
                  <div className="flex items-center gap-3">
                    {isManager && (
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="p-1 hover:bg-brand-700 rounded-md text-red-400 hover:text-red-300 transition-colors disabled:opacity-30"
                        disabled={item.quantity <= 0}
                      >
                        <MinusCircle className="w-5 h-5" />
                      </button>
                    )}
                    {editingItemId === item.id ? (
                      <input 
                        type="number"
                        value={editingQuantity}
                        onChange={(e) => setEditingQuantity(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSetQuantity(item.id);
                          if (e.key === 'Escape') setEditingItemId(null);
                        }}
                        onBlur={() => handleSetQuantity(item.id)}
                        autoFocus
                        className="w-16 bg-brand-900 border border-brand-700 rounded p-1 text-center font-mono font-bold text-lg text-white focus:outline-none focus:border-brand-400"
                        min="0"
                      />
                    ) : (
                      <span 
                        className={`font-mono font-bold text-xl text-white min-w-[3ch] text-center ${isManager ? 'cursor-pointer hover:text-brand-300' : ''}`}
                        onClick={() => {
                          if (isManager) {
                            setEditingItemId(item.id);
                            setEditingQuantity(item.quantity.toString());
                          }
                        }}
                        title={isManager ? "คลิกเพื่อพิมพ์ตัวเลข" : ""}
                      >
                        {item.quantity.toLocaleString()}
                      </span>
                    )}
                    {isManager && (
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="p-1 hover:bg-brand-700 rounded-md text-green-400 hover:text-green-300 transition-colors"
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                
                {isManager && (
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="mt-3 text-xs text-brand-600 hover:text-red-400 self-end transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> ลบไอเทม
                  </button>
                )}
              </div>
            ))}
            
            {items.length === 0 && (
              <div className="col-span-full text-center py-10 text-brand-500">
                ยังไม่มีของในคลังแก๊ง
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
