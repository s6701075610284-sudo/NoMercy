"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function submitCheckIn(imageUrl: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  // @ts-ignore
  const userId = session.user.id;

  if (!imageUrl) {
    throw new Error("กรุณาใส่ลิงก์รูปภาพหลักฐาน");
  }

  // Check time constraint: Only allowed 21:20-21:40 and 23:00-23:20 (BKK Time)
  const bkkTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
  const hour = bkkTime.getHours();
  const minute = bkkTime.getMinutes();
  const timeInMinutes = hour * 60 + minute;
  
  const isPeriod1 = timeInMinutes >= (21 * 60 + 20) && timeInMinutes <= (21 * 60 + 40);
  const isPeriod2 = timeInMinutes >= (23 * 60) && timeInMinutes <= (23 * 60 + 20);

  if (!isPeriod1 && !isPeriod2) {
    throw new Error("แก๊งเปิดรับเช็คชื่อเฉพาะ 21:20-21:40 และ 23:00-23:20 เท่านั้นครับ!");
  }

  await prisma.checkIn.create({
    data: {
      userId,
      imageUrl,
    }
  });

  revalidatePath("/");
  return { success: true };
}

export async function getRecentCheckIns(limit = 10, todayOnly = false) {
  let whereClause = {};
  
  if (todayOnly) {
    // Reset check-ins every day at 12:00 PM (Noon) BKK time
    const bkkTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
    bkkTime.setHours(12, 0, 0, 0); // Noon today
    
    // If it's before noon, we consider "today" as starting from yesterday noon
    if (new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok", hour12: false }).split(', ')[1] < "12:00:00") {
      bkkTime.setDate(bkkTime.getDate() - 1);
    }
    
    // Adjust back to UTC for Prisma query (subtract 7 hours)
    const utcStart = new Date(bkkTime.getTime() - (7 * 60 * 60 * 1000));
    whereClause = { createdAt: { gte: utcStart } };
  }

  const checkIns = await prisma.checkIn.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: { name: true, image: true, role: true, steamId: true }
      }
    }
  });
  
  return checkIns;
}

export async function getAbsentMembers() {
  // Reset absentees every day at 12:00 PM (Noon) BKK time
  const bkkTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
  bkkTime.setHours(12, 0, 0, 0); // Noon today
  
  // If it's currently before noon, we use yesterday's noon as the start
  if (new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok", hour12: false }).split(', ')[1] < "12:00:00") {
    bkkTime.setDate(bkkTime.getDate() - 1);
  }
  
  // Adjust back to UTC for Prisma query
  const utcStart = new Date(bkkTime.getTime() - (7 * 60 * 60 * 1000));
  
  // Find all users
  const allUsers = await prisma.user.findMany({
    select: { id: true, name: true, image: true, role: true, steamId: true }
  });

  // Find all checkins since noon today
  const recentCheckIns = await prisma.checkIn.findMany({
    where: { createdAt: { gte: utcStart } },
    select: { userId: true }
  });

  const checkedInUserIds = new Set(recentCheckIns.map(c => c.userId));
  
  // Filter out users who checked in
  const absentUsers = allUsers.filter(u => !checkedInUserIds.has(u.id));
  
  return absentUsers;
}
