"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

function checkManagerRole(role: string) {
  if (role !== "Moderator" && role !== "Boss" && role !== "Underboss" && role !== "Treasurer") {
    throw new Error("ไม่มีสิทธิ์จัดการคลังของ (ต้องเป็นระดับบริหาร)");
  }
}

export async function getInventory() {
  const items = await prisma.inventoryItem.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return items;
}

export async function addInventoryItem(data: { name: string; quantity: number; imageUrl?: string }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");
  
  // @ts-ignore
  checkManagerRole(session.user.role);

  if (!data.name || data.quantity < 0) {
    throw new Error("ข้อมูลไม่ครบถ้วน");
  }

  await prisma.inventoryItem.create({
    data: {
      name: data.name,
      quantity: data.quantity,
      imageUrl: data.imageUrl || null,
      updatedBy: session.user.name || "Manager",
    }
  });

  revalidatePath("/");
  return { success: true };
}

export async function updateInventoryItemQuantity(id: string, delta: number) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");
  
  // @ts-ignore
  checkManagerRole(session.user.role);

  const item = await prisma.inventoryItem.findUnique({ where: { id } });
  if (!item) throw new Error("ไม่พบไอเทม");

  const newQuantity = item.quantity + delta;
  if (newQuantity < 0) throw new Error("จำนวนไอเทมติดลบไม่ได้");

  await prisma.inventoryItem.update({
    where: { id },
    data: { 
      quantity: newQuantity,
      updatedBy: session.user.name || "Manager"
    }
  });

  revalidatePath("/");
  return { success: true };
}

export async function deleteInventoryItem(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");
  
  // @ts-ignore
  checkManagerRole(session.user.role);

  await prisma.inventoryItem.delete({
    where: { id }
  });

  revalidatePath("/");
  return { success: true };
}
