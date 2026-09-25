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

  // Check time constraint: Only allowed between 21:20 and 23:00 (BKK Time)
  const bkkTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
  const hour = bkkTime.getHours();
  const minute = bkkTime.getMinutes();
  const timeInMinutes = hour * 60 + minute;
  const startMinutes = 21 * 60 + 20; // 21:20 = 1280
  const endMinutes = 23 * 60;        // 23:00 = 1380

  if (timeInMinutes < startMinutes || timeInMinutes > endMinutes) {
    throw new Error("แก๊งเปิดรับเช็คชื่อเฉพาะช่วงเวลา 21:20 ถึง 23:00 เท่านั้นครับ!");
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

export async function getRecentCheckIns(limit = 10) {
  const checkIns = await prisma.checkIn.findMany({
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
