import { apiFetch } from "./client";
import type { CouponDetail, CouponItem, CouponPurchaseResponse } from "./types";

export const couponsApi = {
  getList: () => apiFetch<CouponItem[]>("/api/v1/coupons", { auth: false }),

  getDetail: (couponId: number) =>
    apiFetch<CouponDetail>(`/api/v1/coupons/${couponId}`, { auth: false }),

  purchase: (couponId: number) =>
    apiFetch<CouponPurchaseResponse>(`/api/v1/coupons/${couponId}/purchase`, { method: "POST" }),
};
