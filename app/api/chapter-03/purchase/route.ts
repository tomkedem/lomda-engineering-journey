import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    const { studentId, courseId, price } = await request.json();

    // Step 1: Read the current balance from the database
    const student = await db.students.findById(studentId);
    
    if (student.balance < price) {
        return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
    }
    
    // Step 2: Calculate the new balance and update the record
    // Architectural Flaw: Read-Modify-Write creates a race condition for concurrent requests.
    const newBalance = student.balance - price;
    await db.students.updateBalance(studentId, newBalance);
    
    // Step 3: Grant access to the course
    await db.enrollments.create({ studentId, courseId });
    
    return NextResponse.json({ success: true, remainingBalance: newBalance });
}