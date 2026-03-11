/**
 * CHAPTER 3: MENTAL DEBUGGING EXERCISE
 * * Instructions:
 * 1. DO NOT RUN THIS CODE YET.
 * 2. Read each scenario and identify the "Gap" where the system state can break.
 * 3. Mark the problematic line with a comment: // BREAKPOINT: [Reason]
 * 4. Suggest an architectural fix for each scenario.
 */

interface Student {
  id: string;
  credits: number;
  isPremium: boolean;
  hasReceivedBonus: boolean;
}

// Mock Database & Services
const db = {
  students: {
    findById: async (id: string): Promise<Student> => ({ 
      id, 
      credits: 100, 
      isPremium: false, 
      hasReceivedBonus: false 
    }),
    update: async (id: string, data: Partial<Student>) => { 
      console.log(`DB: Updated student ${id}`, data); 
    }
  },
  courses: {
    update: async (id: string, data: Record<string, unknown>) => { 
      console.log(`DB: Updated course ${id}`, data); 
    }
  }
};

const stripe = {
  charge: async (amount: number) => { 
    console.log(`Stripe: Charged $${amount}`); 
    return { success: true }; 
  }
};

// Exporting to satisfy 'no-unused-vars' and allow external testing
export const notificationService = {
  cancelCourseReminders: async (courseId: string) => {
    console.log(`Notifications: Cancelled reminders for ${courseId}`);
  }
};

// --- SCENARIO 1: The Partial Charge (Partial Failure) ---
export async function purchasePremium(studentId: string) {
  const chargeResult = await stripe.charge(49);
  
  if (chargeResult.success) {
    // BREAKPOINT: If DB update fails here, user is charged but not upgraded.
    await db.students.update(studentId, { isPremium: true });
    return { status: "success" };
  }
}

// --- SCENARIO 2: The Bonus Race (Race Condition) ---
export async function grantOnboardingBonus(studentId: string) {
  const student = await db.students.findById(studentId);

  if (!student.hasReceivedBonus) {
    const newBalance = student.credits + 100;
    
    // BREAKPOINT: Parallel requests can both pass the IF check before either updates the DB.
    await db.students.update(studentId, { 
      credits: newBalance, 
      hasReceivedBonus: true 
    });
  }
}

// --- SCENARIO 3: The Logic Zombie (Inconsistent State) ---
export async function archiveCourse(courseId: string) {
  console.log(`Archiving course ${courseId}...`);
  
  await db.courses.update(courseId, { 
    status: 'archived', 
    archivedAt: new Date().toISOString() 
  });

  // BREAKPOINT: The course status changed locally, but no message was sent to notificationService.
  return { status: "archived" };
}