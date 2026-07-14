import { useState } from "react";
import BottomNav from "../components/BottomNav";
import BreadImage from "../components/BreadImage";
import ChatbotFab from "../components/ChatbotFab";
import Mascot from "../components/Mascot";
import { PRODUCT, STORE } from "../data/store";

type PinKind = "normal" | "cooldown" | "sanctioned";

type Pin = {
  id: number;
  label: string;
  x: number;
  y: number;
  kind: PinKind;
};

const PINS: Pin[] = [
  { id: 1, label: "맛있나?근\n데맛이있는\n빵집", x: 63, y: 22, kind: "normal" },
  { id: 2, label: "맛있는 빵집", x: 20, y: 33, kind: "normal" },
  { id: 3, label: "맛있는 빵집", x: 84, y: 34, kind: "cooldown" },
  { id: 4, label: "맛있는 빵집", x: 39, y: 39, kind: "normal" },
  { id: 5, label: "맛있는 빵이\n였던집", x: 70, y: 57, kind: "normal" },
  { id: 6, label: "맛있는 빵집", x: 10, y: 65, kind: "normal" },
  { id: 7, label: "맛있는 빵집", x: 12, y: 74, kind: "sanctioned" },
  { id: 8, label: "맛있는 빵집", x: 26, y: 73, kind: "normal" }
];

function PinMarker({ pin, onSelect }: { pin: Pin; onSelect: (p: Pin) => void }) {
  const color = pin.kind === "sanctioned" ? "#9AA0A8" : "#F2A93B";
  return (
    <button
      type="button"
      onClick={() => onSelect(pin)}
      className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
      style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
    >
      <svg viewBox="0 0 32 40" className="h-10 w-8 drop-shadow">
        <path d="M16 2a13 13 0 0 1 13 13c0 9-13 23-13 23S3 24 3 15A13 13 0 0 1 16 2Z" fill={color} />
        <circle cx="16" cy="15" r="5" fill="#fff" />
      </svg>
      <span className="mt-0.5 whitespace-pre-line text-center text-xs font-medium text-neutral-700 [text-shadow:0_0_4px_#fff,0_0_4px_#fff]">
        {pin.label}
      </span>
    </button>
  );
}

function MapCanvas({ children, dimmed = false }: { children: React.ReactNode; dimmed?: boolean }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${dimmed ? "grayscale" : ""}`}>
      <div className="absolute inset-0 bg-[#EDF1EA]" />
      <div className="absolute -left-10 top-[10%] h-10 w-[130%] rotate-[14deg] rounded-full bg-[#F2B95F]" />
      <div className="absolute -right-24 top-[38%] h-9 w-[120%] rotate-[52deg] rounded-full bg-[#F2B95F]" />
      <div className="absolute -left-6 bottom-[16%] h-6 w-[120%] -rotate-3 bg-[#F6E9A8]" />
      <div className="absolute left-[44%] -top-6 h-[70%] w-2.5 rotate-[18deg] bg-white/90" />
      <div className="absolute left-[8%] top-[46%] h-2.5 w-[60%] rotate-6 bg-white/90" />
      <div className="absolute right-[6%] top-[30%] h-[46%] w-2.5 -rotate-12 bg-white/90" />
      {children}
    </div>
  );
}

function StoreSheet({ pin, onClose }: { pin: Pin; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col">
      <button type="button" aria-label="닫기" onClick={onClose} className="flex-1 bg-black/20" />
      <div className="relative bg-white pb-28">
        <div className="zigzag absolute -top-[17px] left-0 w-full" />
        <div className="max-h-[52dvh] overflow-y-auto px-6 pt-8">
          {pin.kind === "sanctioned" && (
            <div className="mb-6">
              <p className="mb-4 text-center text-lg font-bold text-danger">
                ‘{STORE.name}’은 행정처분 이력이 있는 매장입니다.
              </p>
              <div className="rounded-2xl bg-field px-5 py-5 text-[15px] font-semibold leading-7">
                <p>처분 사유: 식품위생법 제OO조 위반</p>
                <p>처분 내용: 영업정지 OO일</p>
                <p>처분 기간: 2026년 O월 O일 ~ 2026년 O월 O일</p>
              </div>
            </div>
          )}
          <span
            className={`inline-block rounded-full px-3.5 py-1.5 text-sm font-semibold ${
              pin.kind === "cooldown" ? "bg-[#E9EBEE] text-sub" : "bg-primary text-white"
            }`}
          >
            {pin.kind === "cooldown" ? "7일 뒤 포인트 지급" : "포인트 지급"}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold">{STORE.name}</h2>
          <p className="mt-1 text-base">{STORE.road}</p>
          <p className="text-base text-sub">{STORE.lot}</p>
          <div className="mt-5 rounded-2xl bg-field p-5">
            <p className="mb-4 font-semibold text-sub">할인중인 상품</p>
            {pin.kind === "cooldown" ? (
              <div className="flex h-72 items-center justify-center">
                <p className="text-lg text-neutral-400">할인 중인 상품이 없습니다</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                    <BreadImage className="h-full w-full" />
                    <div className="absolute bottom-2.5 left-3 text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
                      <p className="text-sm font-medium">{PRODUCT.name}</p>
                      <p className="text-lg font-bold">
                        <span className="text-[#FF6B6B]">{PRODUCT.discount}%</span> {PRODUCT.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function VisitModal({ onClose }: { onClose: () => void }) {
  const pieces = [
    { l: "12%", t: "18%", r: "-30deg" },
    { l: "30%", t: "10%", r: "20deg" },
    { l: "66%", t: "12%", r: "-15deg" },
    { l: "84%", t: "20%", r: "35deg" },
    { l: "8%", t: "48%", r: "60deg" },
    { l: "90%", t: "50%", r: "-50deg" },
    { l: "20%", t: "72%", r: "15deg" },
    { l: "78%", t: "70%", r: "-20deg" }
  ];
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center px-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/10" />
      <div className="pop-in relative flex h-[440px] w-full flex-col items-center overflow-hidden rounded-3xl bg-white pt-24 shadow-xl">
        {pieces.map((p, i) => (
          <span
            key={i}
            className="confetti absolute h-2 w-5 rounded-sm bg-[#F6C86B]"
            style={{ left: p.l, top: p.t, transform: `rotate(${p.r})`, animationDelay: `${i * 0.15}s` }}
          />
        ))}
        <p className="text-sub">2026.07.11</p>
        <p className="mt-2 text-lg">
          <span className="font-bold text-primary">{STORE.name}</span> 방문 인증 완료!
        </p>
        <p className="mt-2 text-3xl font-extrabold">2000포인트 적립</p>
        <Mascot pose="peek" className="absolute -bottom-2 w-56" />
      </div>
    </div>
  );
}

export default function MapPage() {
  const [selected, setSelected] = useState<Pin | null>(null);
  const [clustered, setClustered] = useState(false);
  const [visited, setVisited] = useState(false);

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="relative flex-1">
        <MapCanvas dimmed={!!selected}>
          {clustered ? (
            <>
              {[
                { n: 12, x: 26, y: 30, s: 200 },
                { n: 4, x: 82, y: 26, s: 150 },
                { n: 2, x: 20, y: 66, s: 160 }
              ].map((c) => (
                <button
                  key={c.n}
                  type="button"
                  onClick={() => setClustered(false)}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#F3D9A0]/60 text-2xl font-semibold text-primaryDeep"
                  style={{ left: `${c.x}%`, top: `${c.y}%`, width: c.s, height: c.s }}
                >
                  {c.n}
                </button>
              ))}
            </>
          ) : (
            PINS.map((p) => <PinMarker key={p.id} pin={p} onSelect={setSelected} />)
          )}
          <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
            <span className="pulse-ring absolute inset-0 rounded-full bg-primary/40" />
            <span className="relative block h-6 w-6 rounded-full border-4 border-[#F6DFAF] bg-primary" />
          </div>
        </MapCanvas>

        <div className="absolute left-0 right-0 top-4 z-10 flex items-center gap-3 px-4">
          <label className="flex h-[52px] flex-1 items-center gap-2.5 rounded-full bg-white px-5 py-3.5 shadow-fab">
            <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-ink" fill="none" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.8-3.8" />
            </svg>
            <input placeholder="검색어를 입력해주세요" className="w-full bg-transparent text-base outline-none placeholder:text-sub" />
          </label>
          <ChatbotFab className="shrink-0" />
        </div>

        <button
          type="button"
          aria-label="현재 위치"
          onClick={() => setClustered((c) => !c)}
          className="absolute bottom-24 right-5 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-fab"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-ink" fill="none" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="1.6" fill="#1F2024" stroke="none" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => setVisited(true)}
          className="absolute bottom-4 left-4 right-4 z-10 h-14 rounded-2xl bg-primary text-lg font-semibold text-white shadow-fab"
        >
          방문 확인
        </button>

        {selected && <StoreSheet pin={selected} onClose={() => setSelected(null)} />}
        {visited && <VisitModal onClose={() => setVisited(false)} />}
      </div>
      <BottomNav />
    </div>
  );
}
