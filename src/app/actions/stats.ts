"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDashboardStats() {
  const totalMembers = await prisma.user.count();
  
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
  // Calculate check-ins in the last 24 hours
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const recentCheckIns = await prisma.checkIn.count({
    where: {
      createdAt: {
        gte: yesterday
      }
    }
  });

  return {
    totalMembers,
    totalGreen,
    totalRed,
    recentCheckIns
  };
}
