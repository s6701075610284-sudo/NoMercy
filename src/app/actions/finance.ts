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

export async function getMemberContributions() {
  const approvedFinances = await prisma.finance.findMany({
    where: { status: "APPROVED" },
    include: {
      user: {
        select: { id: true, name: true, image: true, role: true }
      }
    }
  });

  const memberMap = new Map<string, any>();

  for (const f of approvedFinances) {
    if (!memberMap.has(f.user.id)) {
      memberMap.set(f.user.id, {
        id: f.user.id,
        name: f.user.name,
        image: f.user.image,
        role: f.user.role,
        totalGreen: 0,
        totalRed: 0,
      });
    }

    const member = memberMap.get(f.user.id);
    if (f.type === "GREEN") {
      member.totalGreen += f.amount;
    } else if (f.type === "RED") {
      member.totalRed += f.amount;
    }
  }

  // Convert map to array and sort by total amount
  return Array.from(memberMap.values()).sort((a, b) => (b.totalGreen + b.totalRed) - (a.totalGreen + a.totalRed));
}

export async function getFinanceStats() {
  const [finances, expenses] = await Promise.all([
    prisma.finance.findMany({ where: { status: "APPROVED" } }),
    prisma.expense.findMany()
  ]);
  
  let totalGreen = 0;
  let totalRed = 0;
  
  finances.forEach(f => {
    if (f.type === "GREEN") totalGreen += f.amount;
    if (f.type === "RED") totalRed += f.amount;
  });

  expenses.forEach(e => {
    if (e.type === "GREEN") totalGreen -= e.amount;
    if (e.type === "RED") totalRed -= e.amount;
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

export async function addExpense(data: { type: string; amount: number; description: string }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");
  
  // @ts-ignore
  const role = session.user.role;
  if (role !== "Moderator" && role !== "Boss" && role !== "Underboss" && role !== "Treasurer") {
    throw new Error("ไม่มีสิทธิ์บันทึกรายจ่าย");
  }

  if (!data.amount || data.amount <= 0 || !data.description) {
    throw new Error("ข้อมูลไม่ครบถ้วน");
  }

  // @ts-ignore
  const userId = session.user.id;

  await prisma.expense.create({
    data: {
      userId,
      type: data.type,
      amount: data.amount,
      description: data.description
    }
  });

  revalidatePath("/");
  return { success: true };
}

export async function getExpenses() {
  const expenses = await prisma.expense.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true, image: true }
      }
    }
  });
  
  return expenses;
}

export async function cancelExpense(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");
  
  // @ts-ignore
  const role = session.user.role;
  if (role !== "Moderator" && role !== "Boss" && role !== "Underboss" && role !== "Treasurer") {
    throw new Error("ไม่มีสิทธิ์ยกเลิกรายจ่าย");
  }

  await prisma.expense.delete({
    where: { id }
  });

  revalidatePath("/");
  return { success: true };
}
