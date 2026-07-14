import { useEffect, useRef, useState } from "react";
import PageHeader from "../components/PageHeader";
import { chatApi } from "../api";

type Message = { role: "user" | "bot"; text: string };

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const streamRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const controller = new AbortController();
    streamRef.current = controller;

    const restoreHistory = () => {
      chatApi
        .getHistory()
        .then((res) =>
          setMessages(
            res.messages.map((m) => ({
              role: m.role === "assistant" ? "bot" : "user",
              text: m.content,
            }))
          )
        )
        .catch(() => {});
    };

    const initWithLocation = (lat: number, lon: number) => {
      setMessages([{ role: "bot", text: "" }]);
      chatApi
        .init(
          { lat, lon },
          (chunk) => {
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = {
                role: "bot",
                text: next[next.length - 1].text + chunk.text,
              };
              return next;
            });
          },
          controller.signal
        )
        .catch(restoreHistory);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => initWithLocation(pos.coords.latitude, pos.coords.longitude),
        restoreHistory
      );
    } else {
      restoreHistory();
    }

    return () => controller.abort();
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }, { role: "bot", text: "" }]);
    setSending(true);

    const controller = new AbortController();
    streamRef.current = controller;

    try {
      await chatApi.sendMessage(
        { content: text },
        (chunk) => {
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
              role: "bot",
              text: next[next.length - 1].text + chunk.text,
            };
            return next;
          });
        },
        controller.signal
      );
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "bot", text: "답변을 불러오지 못했어요." };
        return next;
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader title="AI챗봇" />
      <div ref={listRef} className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-6">
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
            className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-sub"
          />
          <button type="button" aria-label="전송" onClick={send} disabled={sending}>
            <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-sub" fill="none" strokeWidth="1.8" strokeLinejoin="round">
              <path d="M4 5.5 20 12 4 18.5 6.5 12Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
