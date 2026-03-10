import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    // Extract video progress from the client payload
    const { studentId, videoId, currentTime } = await request.json();

    // Directly update the database with the current timestamp
    // Architectural Flaw: This creates a synchronous write for every heartbeat, risking database overload.
    await db.progress.upsert({
        where: { studentId_videoId: { studentId, videoId } },
        update: { lastWatchedAt: currentTime },
        create: { studentId, videoId, lastWatchedAt: currentTime }
    });

    return NextResponse.json({ success: true });
}