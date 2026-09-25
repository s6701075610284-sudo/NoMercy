"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function submitFinance(data: { type: string; amount: number; imageUrl?: string }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  // @ts-ignore
  const userId = session.user.id;

  if (!data.amount || data.amount <= 0) {
    throw new Error("จำนวนเงินต้องมากกว่า 0");
  }

  await prisma.finance.create({
    data: {
      userId,
      type: data.type, // "GREEN" or "RED"
      amount: data.amount,
      imageUrl: data.imageUrl || null,
    }
  });

  revalidatePath("/");
  return { success: true };
}

export async function getFinances() {
  const finances = await prisma.finance.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true, image: true }
      }
    }
  });
  
  return finances;
}

export async function getFinanceStats() {
  const finances = await prisma.finance.findMany({
    where: { status: "APPROVED" }
  });
  
  let totalGreen = 0;
  let totalRed = 0;
  
  finances.forEach(f => {
    if (f.type === "GREEN") totalGreen += f.amount;
    if (f.type === "RED") totalRed += f.amount;
  });

  return { totalGreen, totalRed };
}

export async function approveFinance(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");
  
  // @ts-ignore
  const role = session.user.role;
  if (role !== "Moderator" && role !== "Boss" && role !== "Underboss" && role !== "Treasurer") {
    throw new Error("ไม่มีสิทธิ์อนุมัติยอดเงิน (ต้องเป็น Moderator, Boss, Underboss หรือ Treasurer)");
  }

  await prisma.finance.update({
    where: { id },
    data: { status: "APPROVED" }
  });

  revalidatePath("/");
  return { success: true };
}

export async function rejectFinance(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");
  
  // @ts-ignore
  const role = session.user.role;
  if (role !== "Moderator" && role !== "Boss" && role !== "Underboss" && role !== "Treasurer") {
    throw new Error("ไม่มีสิทธิ์ปฏิเสธยอดเงิน");
  }

  await prisma.finance.update({
    where: { id },
    data: { status: "REJECTED" }
  });

  revalidatePath("/");
  return { success: true };
}
