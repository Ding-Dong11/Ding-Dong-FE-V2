import { useNavigate } from "react-router-dom";
import Mascot from "./Mascot";

export default function ChatbotFab({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      aria-label="AI 챗봇 열기"
      onClick={() => navigate("/chatbot")}
      className={`relative h-14 w-14 overflow-hidden rounded-full bg-primary shadow-fab ${className}`}
    >
      <span className="absolute right-2 top-1.5 text-xs font-extrabold text-white">?!</span>
      <Mascot pose="peek" className="absolute -bottom-1 left-0 w-12" />
    </button>
  );
}
