"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDashboardStats() {
  const totalMembers = await prisma.user.count();
  
  const [finances, expenses, inventoryItems] = await Promise.all([
    prisma.finance.findMany({ where: { status: "APPROVED" } }),
    prisma.expense.findMany(),
    prisma.inventoryItem.findMany()
  ]);

  const inventoryCount = inventoryItems.reduce((acc, item) => acc + item.quantity, 0);

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
  // Calculate check-ins for today (resets at noon BKK time)
  const bkkTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
  bkkTime.setHours(12, 0, 0, 0); // Noon today
  
  // If it's currently before noon, we use yesterday's noon as the start
  if (new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok", hour12: false }).split(', ')[1] < "12:00:00") {
    bkkTime.setDate(bkkTime.getDate() - 1);
  }
  
  // Adjust back to UTC for Prisma query
  const utcStart = new Date(bkkTime.getTime() - (7 * 60 * 60 * 1000));
  
  const recentCheckIns = await prisma.checkIn.count({
    where: {
      createdAt: {
        gte: utcStart
      }
    }
  });

  return {
    totalMembers,
    totalGreen,
    totalRed,
    recentCheckIns,
    inventoryCount
  };
}
