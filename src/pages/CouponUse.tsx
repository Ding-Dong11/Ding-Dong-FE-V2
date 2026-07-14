import { useRef, useState } from "react";
import Barcode from "../components/Barcode";
import BreadImage from "../components/BreadImage";
import ChatbotFab from "../components/ChatbotFab";
import PageHeader from "../components/PageHeader";
import { PRODUCT } from "../data/store";

const COUPONS = [
  "2029137485",
  "2029137486",
  "2029137487",
  "2029137488",
  "2029137489",
];

export default function CouponUse() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scrollToIndex = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i] as HTMLElement | undefined;
    if (!card) return;
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2,
      behavior: "smooth",
    });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let min = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const d = Math.abs(el.offsetLeft + el.clientWidth / 2 - center);
      if (d < min) {
        min = d;
        nearest = i;
      }
    });
    setIndex(nearest);
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <PageHeader title="쿠폰 사용" />
      <div className="min-h-0 flex-1 overflow-y-auto pb-6">
        <div className="px-5 pt-2">
          <label className="flex h-[52px] items-center gap-2.5 rounded-full border border-neutral-200 px-5">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 stroke-ink"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.8-3.8" />
            </svg>
            <input
              placeholder="검색어를 입력해주세요"
              className="w-full bg-transparent text-base outline-none placeholder:text-sub"
            />
          </label>
        </div>
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[9%]"
        >
          {COUPONS.map((code) => (
            <div
              key={code}
              className="w-full shrink-0 snap-center rounded-3xl bg-white p-6 shadow-[0_6px_24px_rgba(0,0,0,0.1)]"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <BreadImage className="aspect-square w-full" />
                <span className="absolute left-4 top-4 rounded-lg bg-black/50 px-3 py-1.5 text-sm text-white">
                  2027년 7월 11일까지
                </span>
              </div>
              <p className="mt-4 text-sm text-sub">{PRODUCT.store}</p>
              <p className="text-xl font-medium">{PRODUCT.name} 교환권</p>
              <p className="text-2xl font-extrabold">{PRODUCT.price} P</p>
              <p className="mt-2 text-[15px] leading-6 text-sub">
                위 교환권은 2027년 7월 11일까지 ‘{PRODUCT.store}' 에서만 사용할
                수 있습니다.
              </p>
              <div className="mt-5 flex justify-center">
                <Barcode value={code} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="이전 쿠폰"
            onClick={() => scrollToIndex(Math.max(0, index - 1))}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 stroke-neutral-300"
              fill="none"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="m14.5 5-7 7 7 7" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            {COUPONS.map((c, i) => (
              <span
                key={c}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-7 bg-primary" : "w-2.5 bg-neutral-300"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="다음 쿠폰"
            onClick={() =>
              scrollToIndex(Math.min(COUPONS.length - 1, index + 1))
            }
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 stroke-neutral-300"
              fill="none"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="m9 5 7 7-7 7" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <ChatbotFab className="absolute bottom-6 right-5 z-20" />
    </div>
  );
}
