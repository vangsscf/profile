export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const maxQuestionLength = 1000;
export const maxHistoryMessages = 11;
export const maxReplyLength = 2000;
