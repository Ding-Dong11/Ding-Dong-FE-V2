import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import ChatbotFab from "../components/ChatbotFab";
import { recommendationsApi } from "../api";
import type { RecommendationItem } from "../api";

// geolocation 권한이 없거나 실패하면 기본 지도 중심(거창)으로 폴백
const FALLBACK_CENTER = { lat: 35.6866, lng: 127.9095 };

function StoreThumb() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="h-[74px] w-[74px] shrink-0 rounded-xl"
      aria-hidden="true"
    >
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
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [stores, setStores] = useState<RecommendationItem[]>([]);
  const copy = (text: string) => navigator.clipboard?.writeText(text);

  useEffect(() => {
    const fetchWith = (lat: number, lon: number) => {
      recommendationsApi
        .get({ lat, lon })
        .then((res) => {
          setDate(res.date);
          setStores(res.items);
        })
        .catch(() => {});
    };

    if (!navigator.geolocation) {
      fetchWith(FALLBACK_CENTER.lat, FALLBACK_CENTER.lng);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWith(pos.coords.latitude, pos.coords.longitude),
      () => fetchWith(FALLBACK_CENTER.lat, FALLBACK_CENTER.lng)
    );
  }, []);

  const title = date
    ? `${Number(date.slice(5, 7))}월 ${Number(date.slice(8, 10))}일 추천상점`
    : "오늘의 추천상점";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 flex-1">
        <div className="h-full overflow-y-auto pb-6">
          <h1 className="py-6 text-center text-xl font-extrabold">{title}</h1>
          <div className="flex flex-col gap-4 px-5">
            {stores.length === 0 && (
              <p className="mt-10 text-center text-lg text-sub">
                추천할 상점이 없습니다
              </p>
            )}
            {stores.map((s) => (
              <button
                key={s.store_id}
                type="button"
                onClick={() =>
                  navigate("/map", { state: { openStoreId: s.store_id } })
                }
                className="flex items-center gap-4 rounded-2xl bg-field p-4 text-left"
              >
                <StoreThumb />
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-extrabold">
                    {s.store_name}
                    {s.branch_name ? ` ${s.branch_name}` : ""}
                  </p>
                  <p className="flex items-center gap-1.5 truncate text-[15px]">
                    {s.road_address}
                    {s.road_address && (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 shrink-0 stroke-sub"
                        fill="none"
                        strokeWidth="1.8"
                        onClick={(e) => {
                          e.stopPropagation();
                          copy(s.road_address ?? "");
                        }}
                      >
                        <rect x="8" y="8" width="12" height="12" rx="2" />
                        <path
                          d="M16 4H6a2 2 0 0 0-2 2v10"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </p>
                  <p className="truncate text-[15px] text-sub">
                    {s.jibun_address}
                  </p>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 shrink-0 stroke-sub"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="m9 5 7 7-7 7" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>
        <ChatbotFab className="absolute bottom-5 right-5 z-20" />
      </div>
      <BottomNav />
    </div>
  );
}
