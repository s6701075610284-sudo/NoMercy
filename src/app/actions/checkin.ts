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
