import assets from "./assets.js";
import { handleCareerChat } from "../app/career-chat-server.js";

type WorkerEnv = {
  OPENROUTER_API_KEY?: string;
};

export default {
  fetch(request: Request, env: WorkerEnv): Response | Promise<Response> {
    const { method } = request;
    const { pathname } = new URL(request.url);

    if (pathname === "/api/career-chat" || pathname === "/api/career-chat/") {
      if (method === "POST") return handleCareerChat(request, env.OPENROUTER_API_KEY);
      return new Response(null, { status: 405, headers: { Allow: "POST" } });
    }

    if (method !== "GET" && method !== "HEAD") {
      return new Response(null, { status: 405, headers: { Allow: "GET, HEAD" } });
    }

    const asset = assets[pathname];
    const { type, body } = asset ?? assets["/404.html"];
    const bytes = method === "HEAD" ? null : Uint8Array.from(atob(body), (character) => character.charCodeAt(0));
    return new Response(bytes, {
      status: asset && pathname !== "/404.html" ? 200 : 404,
      headers: { "Content-Type": type },
    });
  },
};
