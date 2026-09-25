"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function issueFine(data: { userId: string; amount: number; reason: string }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  // @ts-ignore
  const issuerId = session.user.id;
  // @ts-ignore
  const issuerRole = session.user.role;

  if (issuerRole !== "Boss" && issuerRole !== "Underboss") {
    throw new Error("ไม่มีสิทธิ์ออกใบสั่งค่าปรับ (ต้องเป็นระดับ Boss หรือ Underboss เท่านั้น)");
  }

  if (!data.amount || data.amount <= 0) {
    throw new Error("จำนวนเงินต้องมากกว่า 0");
  }

  if (!data.userId || !data.reason) {
    throw new Error("ข้อมูลไม่ครบถ้วน");
  }

  await prisma.fine.create({
    data: {
      userId: data.userId,
      issuedBy: issuerId,
      amount: data.amount,
      reason: data.reason,
    }
  });

  revalidatePath("/");
  return { success: true };
}

export async function payFine(fineId: string, imageUrl: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  // @ts-ignore
  const currentUserId = session.user.id;

  const fine = await prisma.fine.findUnique({ where: { id: fineId } });
  if (!fine) throw new Error("ไม่พบข้อมูลค่าปรับ");
  
  if (fine.userId !== currentUserId) {
    throw new Error("ไม่ใช่ค่าปรับของคุณ");
  }

  await prisma.fine.update({
    where: { id: fineId },
    data: {
      status: "PAID",
      imageUrl,
    }
  });

  revalidatePath("/");
  return { success: true };
}

export async function getFines() {
  const fines = await prisma.fine.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true, image: true, role: true }
      },
      issuer: {
        select: { name: true, role: true }
      }
    }
  });
  
  return fines;
}
