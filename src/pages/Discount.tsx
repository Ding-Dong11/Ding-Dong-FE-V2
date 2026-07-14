import BottomNav from "../components/BottomNav";
import BreadImage from "../components/BreadImage";
import ChatbotFab from "../components/ChatbotFab";
import { DISCOUNT_ITEMS, PRODUCT } from "../data/store";

export default function Discount() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="relative flex-1 overflow-y-auto pb-6">
        <h1 className="py-6 text-center text-xl font-extrabold">7월 11일 할인상품</h1>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 px-5">
          {DISCOUNT_ITEMS.map((item) => (
            <div key={item.id}>
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <BreadImage className="h-full w-full" dim={item.soldOut} />
                {item.soldOut ? (
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-medium text-white">
                    품절
                  </span>
                ) : (
                  <span className="absolute left-3 top-3 rounded-full bg-black/45 px-3 py-1 text-sm text-white">
                    {item.stock}개 남음
                  </span>
                )}
              </div>
              <p className={`mt-2.5 text-sm ${item.soldOut ? "text-neutral-300" : "text-sub"}`}>{PRODUCT.store}</p>
              <p className={`text-lg font-medium ${item.soldOut ? "text-neutral-300" : ""}`}>{PRODUCT.name}</p>
              <p className="text-2xl font-extrabold">
                <span className={item.soldOut ? "text-red-200" : "text-danger"}>{PRODUCT.discount}%</span>{" "}
                <span className={item.soldOut ? "text-neutral-300" : ""}>{PRODUCT.price}</span>
              </p>
            </div>
          ))}
        </div>
        <ChatbotFab className="fixed bottom-28 right-5 z-20" />
      </div>
      <BottomNav />
    </div>
  );
}
