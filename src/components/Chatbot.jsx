import { useEffect, useRef, useState } from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { generateGeminiResponse } from "../lib/gemini";
import { getUserDataSummary } from "../lib/userData";

function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[85%] sm:max-w-[70%] items-start gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center ${isUser ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"}`}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>
        <div className={`rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm border ${isUser ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-800 border-slate-200"}`}>
          {content}
        </div>
      </div>
    </div>
  );
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your money copilot powered by Gemini AI. Ask me about your transactions, budgets, or goals and I'll provide personalized insights based on your data.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const viewportRef = useRef(null);

  useEffect(() => {
    if (!viewportRef.current) return;
    viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
  }, [messages]);

  const onSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    // Add user message
    const userMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      // Get user's financial data
      const userData = getUserDataSummary();

      // Generate response using Gemini API
      const reply = await generateGeminiResponse(trimmed, userData);

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">AI Financial Advisor</h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">Ask questions about your money — get summaries and actionable suggestions powered by Gemini AI.</p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col h-[calc(100vh-12rem)] sm:h-[70vh] max-h-[800px] min-h-[500px]">
        <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 border-b border-slate-200 flex items-center gap-2">
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-slate-800">Money Copilot</span>
          <span className="ml-auto text-xs text-slate-500">Gemini AI</span>
        </div>

        <div ref={viewportRef} className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4 bg-slate-50">
          {messages.map((m, idx) => (
            <MessageBubble key={idx} role={m.role} content={m.content} />
          ))}
          {sending && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
              Thinking...
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder="Ask about budgets, goals, or your overview..."
              className="flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-32"
            />
            <button
              onClick={onSend}
              disabled={sending || input.trim().length === 0}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-2.5 sm:px-3 rounded-lg bg-indigo-600 text-white text-xs sm:text-sm shadow hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          <div className="mt-2 text-[10px] sm:text-[11px] text-slate-500">
            Press Enter to send • Shift+Enter for newline
          </div>
        </div>
      </section>
    </main>
  );
}
