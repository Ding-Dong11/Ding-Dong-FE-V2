import { useEffect, useRef, useState } from "react";
import Barcode from "../components/Barcode";
import BreadImage from "../components/BreadImage";
import ChatbotFab from "../components/ChatbotFab";
import PageHeader from "../components/PageHeader";
import { mypageApi } from "../api";
import type { UserCouponDetail, UserCouponItem } from "../api";

function formatDate(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일까지`;
}

export default function CouponUse() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [coupons, setCoupons] = useState<UserCouponItem[]>([]);
  const [details, setDetails] = useState<Record<number, UserCouponDetail>>({});

  useEffect(() => {
    mypageApi
      .getCoupons({ status: "UNUSED" })
      .then(setCoupons)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const current = coupons[index];
    if (!current || details[current.user_coupon_id]) return;
    mypageApi
      .getCouponDetail(current.user_coupon_id)
      .then((detail) =>
        setDetails((prev) => ({ ...prev, [current.user_coupon_id]: detail }))
      )
      .catch(() => {});
  }, [coupons, index, details]);

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
      <div className="relative min-h-0 flex-1">
      <div className="h-full overflow-y-auto pb-6">
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
        {coupons.length === 0 ? (
          <p className="mt-16 text-center text-lg text-sub">
            사용 가능한 쿠폰이 없습니다
          </p>
        ) : (
          <>
            <div
              ref={trackRef}
              onScroll={onScroll}
              className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[9%]"
            >
              {coupons.map((coupon) => {
                const detail = details[coupon.user_coupon_id];
                return (
                  <div
                    key={coupon.user_coupon_id}
                    className="w-full shrink-0 snap-center rounded-3xl bg-white p-6 shadow-[0_6px_24px_rgba(0,0,0,0.1)]"
                  >
                    <div className="relative overflow-hidden rounded-2xl">
                      {coupon.image_url ? (
                        <img
                          src={coupon.image_url}
                          alt=""
                          className="aspect-square w-full object-cover"
                        />
                      ) : (
                        <BreadImage className="aspect-square w-full" />
                      )}
                      {coupon.valid_until && (
                        <span className="absolute left-4 top-4 rounded-lg bg-black/50 px-3 py-1.5 text-sm text-white">
                          {formatDate(coupon.valid_until)}
                        </span>
                      )}
                    </div>
                    <p className="mt-4 text-xl font-medium">{coupon.name}</p>
                    {detail?.description && (
                      <p className="mt-2 text-[15px] leading-6 text-sub">
                        {detail.description}
                      </p>
                    )}
                    <div className="mt-5 flex justify-center">
                      {detail ? (
                        <Barcode value={detail.barcode} />
                      ) : (
                        <p className="text-sm text-sub">바코드 불러오는 중...</p>
                      )}
                    </div>
                  </div>
                );
              })}
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
                {coupons.map((c, i) => (
                  <span
                    key={c.user_coupon_id}
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
                  scrollToIndex(Math.min(coupons.length - 1, index + 1))
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
          </>
        )}
      </div>
      <ChatbotFab className="absolute right-4 top-4 z-20" />
      </div>
    </div>
  );
}
