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
  const callerRole = session.user.role;

  if (callerRole !== "Moderator" && callerRole !== "Boss" && callerRole !== "Underboss") {
    throw new Error("Permission Denied: Only Moderator, Boss, or Underboss can manage roles.");
  }

  const targetUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!targetUser) throw new Error("User not found");

  if (targetUser.role === "Moderator" && callerRole !== "Moderator") {
    throw new Error("Permission Denied: Cannot change a Moderator's role.");
  }

  if (newRole === "Moderator" && callerRole !== "Moderator") {
    throw new Error("Permission Denied: Only a Moderator can assign the Moderator role.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });

  revalidatePath("/");
}

