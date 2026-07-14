import { useState } from "react";
import PageHeader from "../components/PageHeader";

type Message = { role: "user" | "bot"; text: string };

const INITIAL: Message[] = [];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState("");

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      {
        role: "bot",
        text:
          "대전에 있는 쌀국수집으로는 쌀쌀국수(관저동), 쌀국수맛집(도마동), 가장싼집(둔산동), 얄라리얄라국수(내동)등이 있습니다.\n오늘은 한번 얄라리얄라국수 내동점에 들려보는 건 어떨까요?"
      }
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="AI챗봇" />
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-6">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[78%] whitespace-pre-line rounded-2xl px-4 py-3 text-base leading-7 ${
              m.role === "user" ? "self-end bg-field" : "self-start bg-[#F8CE7C]"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="px-5 pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="flex h-14 items-center rounded-full bg-field px-5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="무엇을 도와드릴까요?"
            className="flex-1 bg-transparent text-base outline-none placeholder:text-sub"
          />
          <button type="button" aria-label="전송" onClick={send}>
            <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-sub" fill="none" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M4 5.5 20 12 4 18.5 6.5 12Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
