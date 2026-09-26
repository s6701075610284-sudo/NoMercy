import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // Security check: Only allow requests with the correct CRON_SECRET
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

  if (!DISCORD_BOT_TOKEN) {
    return NextResponse.json({ error: 'Missing DISCORD_BOT_TOKEN environment variable' }, { status: 500 });
  }

  try {
    // 1. Get all Discord Account IDs for all users in the system
    const accounts = await prisma.account.findMany({
      where: { provider: 'discord' },
      select: { providerAccountId: true, user: { select: { name: true } } }
    });

    const messagesSent = [];
    const errors = [];

    // Determine which period we are reminding for based on current UTC time
    // BKK is UTC+7
    const now = new Date();
    const utcHour = now.getUTCHours();
    
    let timeLabel = "21:20 - 21:40 น.";
    if (utcHour === 15 || utcHour === 16) { // Around 23:00 BKK
      timeLabel = "23:00 - 23:20 น.";
    }

    const messageContent = `🚨 **แจ้งเตือนจากแก๊ง!** 🚨\n\nเตรียมตัวให้พร้อม! อีก 5 นาทีระบบจะเปิดให้เช็คชื่อรอบ **${timeLabel}** แล้วครับ\n\nอย่าลืมเข้าเว็บไปกดเช็คชื่อเพื่อรักษายอดนะครับ 👊\n🔗 https://[เว็บของคุณ]`;

    // 2. Loop through and send a DM to each user
    for (const acc of accounts) {
      const discordUserId = acc.providerAccountId;
      
      try {
        // Step A: Create a DM channel with the user
        const dmChannelRes = await fetch('https://discord.com/api/v10/users/@me/channels', {
          method: 'POST',
          headers: {
            'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ recipient_id: discordUserId })
        });

        if (!dmChannelRes.ok) {
          throw new Error(`Failed to create DM channel: ${await dmChannelRes.text()}`);
        }

        const dmChannel = await dmChannelRes.json();

        // Step B: Send the message to the created DM channel
        const sendRes = await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: messageContent })
        });

        if (!sendRes.ok) {
          throw new Error(`Failed to send message: ${await sendRes.text()}`);
        }

        messagesSent.push(acc.user.name);
      } catch (err: any) {
        errors.push({ user: acc.user.name, error: err.message });
      }
      
      // Delay slightly to avoid Discord rate limits (50 requests per second is Discord's global limit, but safe is safe)
      await new Promise(res => setTimeout(res, 200));
    }

    return NextResponse.json({
      success: true,
      message: `Sent reminders to ${messagesSent.length} users.`,
      sentTo: messagesSent,
      errors: errors
    });

  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
