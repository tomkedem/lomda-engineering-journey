// Agent-centric design: Aesthetic but structurally risky (Scattered logic)
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Agent Flaw: Implicit assumption that 'email' and 'age' always exist
  // Agent Flaw: Generic validation rules not tied to system-wide constraints
  if (data.email.includes('@') && data.age > 18) {
    return NextResponse.json({ 
      valid: true,
      message: "Data looks good!" // Agent style: Friendly but non-standard response
    });
  }

  // Happy Path Trap: What if 'data' is null? The app will crash before reaching here.
  return NextResponse.json({ error: "Invalid data" }, { status: 400 });
}