import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import BreadImage from "../components/BreadImage";
import ChatbotFab from "../components/ChatbotFab";
import { ApiError, couponsApi } from "../api";
import type { CouponItem } from "../api";

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

function CouponThumb({ imageUrl, dim }: { imageUrl?: string | null; dim?: boolean }) {
  return imageUrl ? (
    <img src={imageUrl} alt="" className={`h-full w-full object-cover ${dim ? "brightness-50" : ""}`} />
  ) : (
    <BreadImage className="h-full w-full" dim={dim} />
  );
}

function ExchangeModal({
  coupon,
  onClose,
  onExchanged,
}: {
  coupon: CouponItem;
  onClose: () => void;
  onExchanged: () => void;
}) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const exchange = async () => {
    if (loading || done) return;
    setError("");
    setLoading(true);
    try {
      await couponsApi.purchase(coupon.coupon_id);
      setDone(true);
      onExchanged();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "교환에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

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
          <CouponThumb imageUrl={coupon.image_url} />
        </div>
        <p className="mt-4 text-xl font-medium">{coupon.name}</p>
        <p className="text-2xl font-extrabold">{coupon.point_price} P</p>
        {coupon.description && (
          <p className="mt-2 text-[15px] leading-6 text-sub">{coupon.description}</p>
        )}
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        <button
          type="button"
          disabled={done || loading}
          onClick={exchange}
          className={`mt-5 h-14 w-full rounded-2xl text-lg font-semibold ${
            done ? "bg-field text-neutral-300" : "bg-primary text-white"
          }`}
        >
          {done ? "교환 완료" : loading ? "교환 중..." : "교환하기"}
        </button>
      </div>
    </div>
  );
}

export default function PointShop() {
  const [items, setItems] = useState<CouponItem[]>([]);
  const [exchangedIds, setExchangedIds] = useState<number[]>([]);
  const [openCoupon, setOpenCoupon] = useState<CouponItem | null>(null);

  useEffect(() => {
    couponsApi
      .getList()
      .then(setItems)
      .catch(() => {});
  }, []);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 flex-1">
        <div className="h-full overflow-y-auto pb-6">
          <h1 className="py-6 text-center text-xl font-extrabold">
            포인트 사용
          </h1>
          <SearchBar />
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 px-5">
            {items.map((item) => {
              const exchanged = exchangedIds.includes(item.coupon_id);
              return (
                <button
                  key={item.coupon_id}
                  type="button"
                  disabled={exchanged}
                  onClick={() => setOpenCoupon(item)}
                  className="text-left"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl">
                    <CouponThumb imageUrl={item.image_url} dim={exchanged} />
                    {exchanged && (
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-medium text-white">
                        교환 완료
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-2.5 text-lg font-medium ${
                      exchanged ? "text-neutral-300" : ""
                    }`}
                  >
                    {item.name}
                  </p>
                  <p
                    className={`text-2xl font-extrabold ${
                      exchanged ? "text-neutral-300" : ""
                    }`}
                  >
                    {item.point_price} P
                  </p>
                </button>
              );
            })}
          </div>
        </div>
        <ChatbotFab className="absolute right-4 top-4 z-20" />
      </div>
      {openCoupon && (
        <ExchangeModal
          coupon={openCoupon}
          onClose={() => setOpenCoupon(null)}
          onExchanged={() =>
            setExchangedIds((prev) => [...prev, openCoupon.coupon_id])
          }
        />
      )}
      <BottomNav />
    </div>
  );
}
