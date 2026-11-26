import { handleCareerChat } from "../../career-chat-server";

export function POST(request: Request) {
  return handleCareerChat(request, process.env.OPENROUTER_API_KEY);
}
