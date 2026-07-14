import { useState } from "react";
import Barcode from "../components/Barcode";
import BreadImage from "../components/BreadImage";
import ChatbotFab from "../components/ChatbotFab";
import PageHeader from "../components/PageHeader";
import { PRODUCT } from "../data/store";

const COUPONS = ["2029137485", "2029137486", "2029137487", "2029137488", "2029137489"];

export default function CouponUse() {
  const [index, setIndex] = useState(1);
  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(COUPONS.length - 1, i + 1));

  return (
    <div className="relative flex flex-1 flex-col">
      <PageHeader title="쿠폰 사용" />
      <div className="px-5 pt-2">
        <label className="flex h-[52px] items-center gap-2.5 rounded-full border border-neutral-200 px-5 py-3.5">
          <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-ink" fill="none" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.8-3.8" />
          </svg>
          <input placeholder="검색어를 입력해주세요" className="w-full bg-transparent text-base outline-none placeholder:text-sub" />
        </label>
      </div>
      <div className="relative mt-6 flex items-center justify-center px-3">
        <div className="absolute left-0 top-10 h-[70%] w-4 rounded-r-2xl bg-neutral-200" />
        <div className="absolute right-0 top-10 h-[70%] w-4 rounded-l-2xl bg-neutral-200" />
        <div className="w-[86%] rounded-3xl bg-white p-6 shadow-[0_6px_24px_rgba(0,0,0,0.1)]">
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
            위 교환권은 2027년 7월 11일까지 ‘{PRODUCT.store}' 에서만 사용할 수 있습니다.
          </p>
          <div className="mt-5 flex justify-center">
            <Barcode value={COUPONS[index]} />
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" aria-label="이전 쿠폰" onClick={prev}>
          <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-neutral-300" fill="none" strokeWidth="2.4" strokeLinecap="round">
            <path d="m14.5 5-7 7 7 7" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          {COUPONS.map((c, i) => (
            <span
              key={c}
              className={`h-2.5 rounded-full transition-all ${i === index ? "w-7 bg-primary" : "w-2.5 bg-neutral-300"}`}
            />
          ))}
        </div>
        <button type="button" aria-label="다음 쿠폰" onClick={next}>
          <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-neutral-300" fill="none" strokeWidth="2.4" strokeLinecap="round">
            <path d="m9 5 7 7-7 7" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <ChatbotFab className="absolute bottom-8 right-5" />
    </div>
  );
}
