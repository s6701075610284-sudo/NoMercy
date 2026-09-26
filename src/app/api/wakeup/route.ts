import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // ทำการ query เบาๆ เพื่อปลุกฐานข้อมูล (Neon DB) ไม่ให้หลับ
    await prisma.user.findFirst();
    return NextResponse.json({ status: 'Awake', time: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ status: 'Error', error: String(error) }, { status: 500 });
  }
}
