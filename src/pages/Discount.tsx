import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import BreadImage from "../components/BreadImage";
import ChatbotFab from "../components/ChatbotFab";
import { salesApi } from "../api";
import type { SaleProductCard } from "../api";

function DiscountSkeletonCard() {
  return (
    <div>
      <div className="aspect-square animate-pulse rounded-2xl bg-neutral-100" />
      <div className="mt-2.5 h-3.5 w-2/3 animate-pulse rounded bg-neutral-100" />
      <div className="mt-2 h-[22px] w-4/5 animate-pulse rounded bg-neutral-100" />
      <div className="mt-2 h-7 w-1/2 animate-pulse rounded bg-neutral-100" />
    </div>
  );
}

export default function Discount() {
  const navigate = useNavigate();
  const [items, setItems] = useState<SaleProductCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    salesApi
      .getFeed({ sort: "deadline" })
      .then((res) => setItems(res.items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 flex-1">
        <div className="h-full overflow-y-auto pb-6">
          <h1 className="py-6 text-center text-xl font-extrabold">
            할인상품
          </h1>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 px-5">
            {loading ? (
              Array.from({ length: 6 }, (_, i) => <DiscountSkeletonCard key={i} />)
            ) : items.length === 0 ? (
              <p className="col-span-2 mt-10 text-center text-lg text-sub">
                할인 중인 상품이 없습니다
              </p>
            ) : (
              items.map((item) => {
              const soldOut = item.effective_status !== "ON_SALE";
              return (
                <button
                  key={item.sale_product_id}
                  type="button"
                  disabled={soldOut}
                  onClick={() =>
                    navigate("/map", {
                      state: { openStoreId: item.sale_store_id },
                    })
                  }
                  className="text-left"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl">
                    <BreadImage className="h-full w-full" dim={soldOut} />
                    {soldOut ? (
                      <span className="absolute inset-0 flex items-center justify-center text-lg font-medium text-white">
                        {item.effective_status === "SOLD_OUT" ? "품절" : "마감"}
                      </span>
                    ) : (
                      <span className="absolute left-3 top-3 rounded-full bg-black/45 px-3 py-1 text-sm text-white">
                        {item.stock_quantity}개 남음
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-2.5 text-sm ${
                      soldOut ? "text-neutral-300" : "text-sub"
                    }`}
                  >
                    {item.store_name}
                  </p>
                  <p
                    className={`text-lg font-medium ${
                      soldOut ? "text-neutral-300" : ""
                    }`}
                  >
                    {item.name}
                  </p>
                  <p className="text-2xl font-extrabold">
                    <span className={soldOut ? "text-red-200" : "text-danger"}>
                      {Math.round(item.discount_rate)}%
                    </span>{" "}
                    <span className={soldOut ? "text-neutral-300" : ""}>
                      {item.sale_price.toLocaleString()}
                    </span>
                  </p>
                </button>
              );
              })
            )}
          </div>
        </div>
        <ChatbotFab className="absolute right-4 top-4 z-20" />
      </div>
      <BottomNav />
    </div>
  );
}
