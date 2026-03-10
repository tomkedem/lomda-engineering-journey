import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { aiAgent } from '@/lib/ai-core';

export async function POST(request: Request) {
    const { courseId, transcriptText } = await request.json();

    // Flaw 1: Long-running synchronous LLM call in a serverless route
    const prompt = `Generate a 5 question multiple-choice quiz based on this text: ${transcriptText}. Return only JSON.`;
    const aiResponse = await aiAgent.generateText(prompt);

    // Flaw 2: Blind trust in AI output structure
    const generatedQuiz = JSON.parse(aiResponse);

    const newQuiz = await db.quiz.create({
        data: { courseId: courseId, title: 'Auto-Generated Quiz', status: 'published' }
    });

    // Flaw 3: Missing database transaction for batch inserts
    for (const question of generatedQuiz.questions) {
        await db.question.create({
            data: {
                quizId: newQuiz.id,
                text: question.text,
                correctAnswer: question.correctAnswer,
                options: question.options
            }
        });
    }

    return NextResponse.json({ success: true, quizId: newQuiz.id });
}