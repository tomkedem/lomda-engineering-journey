// Mock AI core to simulate probabilistic model responses
export const aiAgent = {
    generateText: async (_prompt: string) => {
        return JSON.stringify({
            questions: [
                { text: "Sample AI Question?", correctAnswer: 1, options: ["A", "B", "C", "D"] }
            ]
        });
    }
};