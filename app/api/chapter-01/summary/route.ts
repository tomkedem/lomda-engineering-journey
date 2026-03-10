import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as aiCore from '@/lib/ai-core';

/**
 * Chapter 01 Exercise: Monolithic and Tightly Coupled Code.
 * Goal: Identify coupling and decompose it into an engineering contract.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const studentId = body.studentId;
    const lessonId = body.lessonId;

    // 1. Direct call to DB Mocks (Tight coupling to data layer)
    const student = await db.students.findById(studentId);

    // 2. Mock data for logic exercise (Since quiz only has 'create' method)
    const mockGrades = [
      { score: 65, topic: 'Functions' },
      { score: 85, topic: 'Variables' }
    ];

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Business logic mixed within the route (Filtering & Formatting)
    const weakTopics = mockGrades
      .filter((g) => g.score < 70)
      .map((g) => g.topic)
      .join(', ');

    // 3. AI Interaction without a defined output schema (Probabilistic output)
    const aiProvider = aiCore as Record<string, unknown>;
    const prompt = `Summarize lesson ${lessonId} for ${student.id}. Weak topics: ${weakTopics}`;
    
    let aiResponse = "AI Logic Placeholder";
    
    // Dynamic check to avoid 'any' and handle missing exports
    if (typeof aiProvider.generateText === 'function') {
      const generateFn = aiProvider.generateText as (p: string) => Promise<string>;
      aiResponse = await generateFn(prompt);
    }

    // 4. Return response without validation
    return NextResponse.json({ 
      success: true, 
      data: aiResponse,
      balance: student.balance 
    });

  } catch (error) {
    // Logging error to satisfy ESLint unused-vars
    console.error('Chapter 01 Summary Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}