// Mock database client to prevent compiler errors during code review

type MockData = Record<string, unknown>;

export const db = {
    progress: {
        upsert: async (_data: MockData) => ({ success: true }),
        update: async (_data: MockData) => ({ success: true })
    },
    students: {
        findById: async (id: string) => ({ id, balance: 100 }),
        updateBalance: async (_id: string, _newBalance: number) => ({ success: true })
    },
    enrollments: {
        create: async (_data: MockData) => ({ success: true })
    },
    quiz: {
        create: async (data: MockData) => ({ id: 'quiz_123', ...data })
    },
    question: {
        create: async (data: MockData) => ({ id: 'question_456', ...data })
    }
};