import BottomNav from "../components/BottomNav";
import ChatbotFab from "../components/ChatbotFab";
import { RECOMMEND_STORES } from "../data/store";

function StoreThumb() {
  return (
    <svg viewBox="0 0 80 80" className="h-[74px] w-[74px] shrink-0 rounded-xl" aria-hidden="true">
      <rect width="80" height="80" fill="#7C5A3A" />
      <rect x="6" y="8" width="30" height="26" rx="3" fill="#EED9B8" />
      <rect x="42" y="8" width="32" height="26" rx="3" fill="#E4C695" />
      <rect x="6" y="42" width="68" height="30" rx="4" fill="#B98A55" />
      <circle cx="20" cy="56" r="7" fill="#F0B466" />
      <circle cx="40" cy="58" r="7" fill="#EBAA55" />
      <circle cx="60" cy="56" r="7" fill="#F2BC72" />
    </svg>
  );
}

export default function Recommend() {
  const copy = (text: string) => navigator.clipboard?.writeText(text);
  return (
    <div className="flex flex-1 flex-col">
      <div className="relative flex-1 overflow-y-auto pb-6">
        <h1 className="py-6 text-center text-xl font-extrabold">7월 11일 추천상점</h1>
        <div className="flex flex-col gap-4 px-5">
          {RECOMMEND_STORES.map((s, i) => (
            <button key={i} type="button" className="flex items-center gap-4 rounded-2xl bg-field p-4 text-left">
              <StoreThumb />
              <div className="min-w-0 flex-1">
                <p className="text-lg font-extrabold">{s.name}</p>
                <p className="flex items-center gap-1.5 truncate text-[15px]">
                  {s.road}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 stroke-sub"
                    fill="none"
                    strokeWidth="1.8"
                    onClick={(e) => {
                      e.stopPropagation();
                      copy(s.road);
                    }}
                  >
                    <rect x="8" y="8" width="12" height="12" rx="2" />
                    <path d="M16 4H6a2 2 0 0 0-2 2v10" strokeLinecap="round" />
                  </svg>
                </p>
                <p className="truncate text-[15px] text-sub">{s.lot}</p>
              </div>
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 stroke-sub" fill="none" strokeWidth="2" strokeLinecap="round">
                <path d="m9 5 7 7-7 7" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
        <ChatbotFab className="fixed bottom-28 right-5 z-20" />
      </div>
      <BottomNav />
    </div>
  );
}
