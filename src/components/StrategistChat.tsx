"use client";

import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";

type SessionSummary = {
  id: string;
  title: string;
  tags: string;
  updatedAt: string;
  lastMessage: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Welcome to your strategy session. We can begin by defining the sonic direction for your next release or focus on visual branding assets. How would you like to proceed?",
};

export function StrategistChat({
  initialSessions,
  userLabel,
  isGuest,
}: {
  initialSessions: SessionSummary[];
  userLabel: string;
  isGuest?: boolean;
}) {
  const [sessions, setSessions] = useState(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  async function refreshSessions() {
    const res = await fetch("/api/chat");
    if (res.ok) {
      const data = await res.json();
      setSessions(data.sessions);
    }
  }

  async function selectSession(id: string) {
    setError(null);
    const res = await fetch(`/api/chat/${id}`);
    if (!res.ok) return;
    const data = await res.json();
    setActiveSessionId(id);
    setMessages(
      data.session.messages.length
        ? data.session.messages.map((m: { id: string; role: string; content: string }) => ({
            id: m.id,
            role: m.role,
            content: m.content,
          }))
        : [WELCOME]
    );
  }

  function startNewSession() {
    setActiveSessionId(null);
    setMessages([WELCOME]);
    setError(null);
  }

  async function deleteSession(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    await fetch(`/api/chat/${id}`, { method: "DELETE" });
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) startNewSession();
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;

    const userMessage: Message = { id: `local-${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: activeSessionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "The AI Strategist could not be reached.");
        setSending(false);
        return;
      }
      setActiveSessionId(data.sessionId);
      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: "assistant", content: data.reply },
      ]);
      await refreshSessions();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <SiteHeader user={{ email: userLabel, displayName: null, isGuest }} />
      <main className="flex-1 flex flex-col md:flex-row h-full relative mirror-bg overflow-hidden">
        <aside className="hidden lg:flex flex-col w-80 border-r border-outline-variant bg-surface-container-lowest/60 backdrop-blur-md h-full z-10 p-6 overflow-y-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/50" />
              <h2 className="font-label-sm text-label-sm text-primary uppercase tracking-widest text-center">
                Saved Strategies
              </h2>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/50" />
            </div>
            <button
              onClick={startNewSession}
              className="w-full mb-6 py-3 px-4 border border-primary/30 rounded text-primary font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary/10 transition-all duration-300 press-scale"
            >
              + New Session
            </button>
            <div className="flex flex-col gap-6">
              {sessions.length === 0 && (
                <p className="font-body-md text-sm text-on-surface-variant italic">
                  No saved strategies yet. Start a conversation below.
                </p>
              )}
              {sessions.map((s) => (
                <div key={s.id} className="relative group cursor-pointer" onClick={() => selectSession(s.id)}>
                  <div className="absolute inset-0 border border-primary/20 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div
                    className={`border-b pb-4 transition-colors ${
                      activeSessionId === s.id
                        ? "border-primary/50"
                        : "border-outline-variant/50 group-hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-headline-md text-body-lg text-on-surface group-hover:text-primary transition-colors">
                        {s.title}
                      </span>
                      <button
                        onClick={(e) => deleteSession(s.id, e)}
                        className="material-symbols-outlined text-on-surface-variant text-sm hover:text-error transition-colors"
                        aria-label="Delete session"
                      >
                        close
                      </button>
                    </div>
                    <p className="font-body-md text-sm text-on-surface-variant line-clamp-2 italic">
                      {s.lastMessage || "No messages yet."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
        <section className="flex-1 flex flex-col h-full relative z-10 p-4 md:p-12 overflow-hidden">
          <div className="flex-1 flex flex-col arched-mirror violet-filigree bg-surface-container-lowest/80 backdrop-blur-sm overflow-hidden relative shadow-2xl">
            <div className="pt-10 pb-6 px-8 flex flex-col items-center justify-center border-b border-outline-variant/30 bg-gradient-to-b from-surface-container-low/90 to-transparent relative z-20">
              <div className="w-8 h-px bg-primary/50 mb-4" />
              <h1 className="font-headline-lg text-headline-lg text-primary mb-2 tracking-widest uppercase text-center">
                AI Strategist
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-lg italic">
                Collaborate with the AI to develop your career roadmap and release strategy.
              </p>
              <div className="w-8 h-px bg-primary/50 mt-4" />
            </div>
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-10 scroll-smooth relative z-10"
            >
              {messages.map((m) =>
                m.role === "assistant" ? (
                  <div key={m.id} className="flex items-start gap-4 max-w-3xl animate-fade-up">
                    <div className="w-12 h-12 rounded-full border border-secondary/50 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(90,64,93,0.5)] bg-surface-container">
                      <span
                        className="material-symbols-outlined text-secondary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        auto_awesome
                      </span>
                    </div>
                    <div className="frosted-amethyst rounded-2xl rounded-tl-none p-6 text-on-surface relative whitespace-pre-wrap">
                      <p className="font-body-md text-body-md leading-relaxed text-on-surface">{m.content}</p>
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="flex items-end justify-end gap-4 max-w-3xl self-end animate-fade-up">
                    <div className="polished-black rounded-2xl rounded-tr-none p-6 text-on-surface relative border border-primary/20 whitespace-pre-wrap">
                      <p className="font-body-md text-body-md leading-relaxed text-primary-fixed-dim">{m.content}</p>
                    </div>
                  </div>
                )
              )}
              {sending && (
                <div className="flex items-start gap-4 max-w-3xl">
                  <div className="w-12 h-12 rounded-full border border-secondary/50 flex items-center justify-center flex-shrink-0 bg-surface-container">
                    <span
                      className="material-symbols-outlined text-secondary animate-pulse"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      auto_awesome
                    </span>
                  </div>
                  <div className="frosted-amethyst rounded-2xl rounded-tl-none p-6 text-on-surface-variant italic">
                    The AI Strategist is thinking…
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 md:p-8 pb-8 bg-gradient-to-t from-surface-container-lowest to-transparent relative z-20">
              {error && <p className="text-error text-sm text-center mb-3">{error}</p>}
              <div className="max-w-4xl mx-auto relative group">
                <div className="relative flex items-end gap-4 polished-black p-2 pl-6 focus-within:border-primary/50 transition-colors shadow-2xl input-glow">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="flex-1 bg-transparent border-none text-primary-fixed-dim font-body-md focus:ring-0 resize-none py-4 placeholder:text-outline-variant max-h-32 overflow-y-auto italic transition-[height] duration-150 ease-out"
                    placeholder="Message the AI Strategist…"
                    rows={1}
                  />
                  <div className="flex items-center gap-2 pb-2 pr-2">
                    <button
                      onClick={sendMessage}
                      disabled={sending || !input.trim()}
                      className="relative overflow-hidden group/btn px-6 py-3 border border-primary/30 bg-transparent hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 press-scale"
                    >
                      <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase relative z-10">
                        Submit
                      </span>
                      <span
                        className="material-symbols-outlined text-primary text-sm relative z-10"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        send
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
