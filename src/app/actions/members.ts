"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getMembers() {
  const session = await getServerSession(authOptions);
  if (!session) return [];

  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' }
  });
  
  return users;
}

export async function updateMemberRole(userId: string, newRole: string) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Allow only Boss or Underboss to change roles
  // @ts-ignore
  if (session.user.role !== "Boss" && session.user.role !== "Underboss") {
    throw new Error("Permission Denied: Only Boss or Underboss can manage roles.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });

  revalidatePath("/");
}

