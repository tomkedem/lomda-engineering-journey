/**
 * CHAPTER 3: MENTAL DEBUGGING EXERCISE
 * * Instructions:
 * 1. DO NOT RUN THIS CODE YET.
 * 2. Read each scenario and identify the "Gap" where the system state can break.
 * 3. Mark the problematic line with a comment: // BREAKPOINT: [Reason]
 * 4. Suggest an architectural fix for each scenario.
 */

// Mock Database & Services
const db = {
  students: {
    findById: async (id: string) => ({ id, credits: 100, isPremium: false, hasReceivedBonus: false }),
    update: async (id: string, data: any) => { console.log(`DB: Updated student ${id}`, data); }
  },
  courses: {
    update: async (id: string, data: any) => { console.log(`DB: Updated course ${id}`, data); }
  }
};

const stripe = {
  charge: async (amount: number) => { 
    console.log(`Stripe: Charged $${amount}`); 
    return { success: true }; 
  }
};

const notificationService = {
  cancelCourseReminders: async (courseId: string) => {
    console.log(`Notifications: Cancelled reminders for ${courseId}`);
  }
};

// --- SCENARIO 1: The Partial Charge (Partial Failure) ---
async function purchasePremium(studentId: string) {
  // Step 1: External Charge
  const chargeResult = await stripe.charge(49);
  
  if (chargeResult.success) {
    // Step 2: Internal DB Update
    // WHAT IF: The database is down right here?
    await db.students.update(studentId, { isPremium: true });
    return { status: "success" };
  }
}

// --- SCENARIO 2: The Bonus Race (Race Condition) ---
async function grantOnboardingBonus(studentId: string) {
  const student = await db.students.findById(studentId);

  // Agent logic: Check then update
  if (!student.hasReceivedBonus) {
    const newBalance = student.credits + 100;
    
    // WHAT IF: Another request executes this exact line simultaneously?
    await db.students.update(studentId, { 
      credits: newBalance, 
      hasReceivedBonus: true 
    });
  }
}

// --- SCENARIO 3: The Logic Zombie (Inconsistent State) ---
async function archiveCourse(courseId: string) {
  console.log(`Archiving course ${courseId}...`);
  
  // Agent logic: Focus only on the 'Course' entity
  await db.courses.update(courseId, { 
    status: 'archived', 
    archivedAt: new Date().toISOString() 
  });

  // WHAT IF: The notification service is still sending "Pending Task" reminders for this course?
  return { status: "archived" };
}

/**
 * ARCHITECTURAL CHALLENGE:
 * How would you refactor 'archiveCourse' to ensure the Notification Service 
 * is always synced, even if the process fails mid-way?
 */