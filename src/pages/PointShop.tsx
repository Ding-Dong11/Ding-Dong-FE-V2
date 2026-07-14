import { useState } from "react";
import BottomNav from "../components/BottomNav";
import BreadImage from "../components/BreadImage";
import ChatbotFab from "../components/ChatbotFab";
import { POINT_ITEMS, PRODUCT } from "../data/store";

function SearchBar() {
  return (
    <label className="mx-5 flex h-[52px] items-center gap-2.5 rounded-full border border-neutral-200 px-5">
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
  );
}

function ExchangeModal({
  onClose,
  onExchange,
}: {
  onClose: () => void;
  onExchange: () => void;
}) {
  const [done, setDone] = useState(false);
  return (
    <div
      className="absolute inset-0 z-30 flex flex-col justify-center bg-black/20 px-5"
      onClick={onClose}
    >
      <div
        className="pop-in rounded-3xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
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
          위 교환권은 2027년 7월 11일까지 ‘{PRODUCT.store}' 에서만 사용할 수
          있습니다.
        </p>
        <button
          type="button"
          disabled={done}
          onClick={() => {
            setDone(true);
            onExchange();
          }}
          className={`mt-5 h-14 w-full rounded-2xl text-lg font-semibold ${
            done ? "bg-field text-neutral-300" : "bg-primary text-white"
          }`}
        >
          {done ? "교환 완료" : "교환하기"}
        </button>
      </div>
    </div>
  );
}

export default function PointShop() {
  const [items, setItems] = useState(POINT_ITEMS);
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 flex-1">
        <div className="h-full overflow-y-auto pb-6">
          <h1 className="py-6 text-center text-xl font-extrabold">
            포인트 사용
          </h1>
          <SearchBar />
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 px-5">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={item.exchanged}
                onClick={() => setOpenId(item.id)}
                className="text-left"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <BreadImage className="h-full w-full" dim={item.exchanged} />
                  {item.exchanged && (
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-medium text-white">
                      교환 완료
                    </span>
                  )}
                </div>
                <p
                  className={`mt-2.5 text-sm ${
                    item.exchanged ? "text-neutral-300" : "text-sub"
                  }`}
                >
                  {PRODUCT.store}
                </p>
                <p
                  className={`text-lg font-medium ${
                    item.exchanged ? "text-neutral-300" : ""
                  }`}
                >
                  {PRODUCT.name}
                </p>
                <p
                  className={`text-2xl font-extrabold ${
                    item.exchanged ? "text-neutral-300" : ""
                  }`}
                >
                  {PRODUCT.price} P
                </p>
              </button>
            ))}
          </div>
        </div>
        <ChatbotFab className="absolute bottom-5 right-5 z-20" />
      </div>
      {openId !== null && (
        <ExchangeModal
          onClose={() => setOpenId(null)}
          onExchange={() =>
            setItems((prev) =>
              prev.map((it) =>
                it.id === openId ? { ...it, exchanged: true } : it
              )
            )
          }
        />
      )}
      <BottomNav />
    </div>
  );
}
