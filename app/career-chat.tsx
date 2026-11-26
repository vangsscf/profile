"use client";

import { useEffect, useRef, useState } from "react";
import { maxHistoryMessages, maxQuestionLength, type ChatMessage } from "./chat-limits";

const suggestions = [
  "How did you scale BitcoinToYou’s exchange?",
  "What did you build at Alias Tecnologia?",
  "What’s your experience with TypeScript?",
];

function renderReply(content: string) {
  return content.split(/(?<![\\*])\*\*([^*\s](?:[^*\r\n]*[^*\s])?)\*\*(?!\*)/u).map((part, index) => (
    index % 2 === 0 ? part : <strong key={index}>{part}</strong>
  ));
}

export default function CareerChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const requestInProgress = useRef(false);

  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [messages, pending, error]);

  async function sendQuestion(question: string) {
    const content = question.trim();
    if (!content || requestInProgress.current) return;

    const next: ChatMessage[] = [...messages, { role: "user", content }];
    requestInProgress.current = true;
    setMessages(next);
    setDraft("");
    setError("");
    setPending(true);
    input.current?.focus();

    try {
      const response = await fetch("/api/career-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-maxHistoryMessages) }),
      });
      const data: { reply?: unknown; error?: unknown } | null = await response.json().catch(() => null);
      if (!response.ok || typeof data?.reply !== "string") {
        const message = typeof data?.error === "string" && data.error;
        throw new Error(message || "Chat couldn’t connect. Try sending your question again.");
      }
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (failure) {
      setMessages(messages);
      setDraft(content);
      setError(failure instanceof Error ? failure.message : "Chat couldn’t connect. Try sending your question again.");
    } finally {
      requestInProgress.current = false;
      setPending(false);
    }
  }

  function clearChat() {
    setMessages([]);
    setDraft("");
    setError("");
    input.current?.focus();
  }

  return (
    <section className="shell section career-chat" id="career-chat" aria-labelledby="career-chat-title">
      <div>
        <p className="eyebrow">Digital twin</p>
        <h2 id="career-chat-title">Ask about my career.</h2>
        <p className="section-description">Chat with an AI version of me about my work, technical experience, and the projects I’ve built.</p>
      </div>
      <div className="chat-panel">
        <div className="chat-header">
          <div className="monogram" aria-hidden="true">VC<span>.</span></div>
          <div className="chat-identity"><strong>Vagner’s career twin</strong><span>AI career assistant</span></div>
          <button type="button" className="chat-clear" onClick={clearChat} disabled={pending || (!messages.length && !error)}>Clear chat</button>
        </div>
        <div className="chat-log" ref={log} role="log" aria-label="Chat history" tabIndex={0}>
          <div className="chat-message chat-assistant"><p>Hi! Ask me about my career. Here are a few places to start.</p></div>
          {!messages.length && !pending && (
            <div className="chat-suggestions">
              {suggestions.map((question) => (
                <button key={question} type="button" className="chat-suggestion" onClick={() => sendQuestion(question)}>{question}</button>
              ))}
            </div>
          )}
          {messages.map(({ role, content }, index) => (
            <div key={index} className={`chat-message chat-${role}`}>
              <span className="sr-only">{role === "user" ? "You" : "Career twin"}</span>
              <p>{role === "assistant" ? renderReply(content) : content}</p>
            </div>
          ))}
        </div>
        {pending && <p className="chat-feedback" role="status">Preparing a reply…</p>}
        {error && <p className="chat-feedback chat-error" role="alert">{error}</p>}
        <form className="chat-form" onSubmit={(event) => { event.preventDefault(); sendQuestion(draft); }}>
          <label className="sr-only" htmlFor="career-question">Your career question</label>
          <input id="career-question" ref={input} value={draft} onChange={(event) => setDraft(event.target.value)}
            maxLength={maxQuestionLength} readOnly={pending} placeholder="Ask a career question…" autoComplete="off" />
          <button className="button button-primary" type="submit" disabled={pending || !draft.trim()}>Send</button>
        </form>
      </div>
    </section>
  );
}
