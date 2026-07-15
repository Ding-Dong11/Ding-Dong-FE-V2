import { apiFetch } from "./client";
import type { CouponDetail, CouponItem, CouponListParams, CouponPurchaseResponse } from "./types";

export const couponsApi = {
  getList: (params: CouponListParams = {}) =>
    apiFetch<CouponItem[]>("/api/v1/coupons", { auth: false, params }),

  getDetail: (couponId: number) =>
    apiFetch<CouponDetail>(`/api/v1/coupons/${couponId}`, { auth: false }),

  purchase: (couponId: number) =>
    apiFetch<CouponPurchaseResponse>(`/api/v1/coupons/${couponId}/purchase`, { method: "POST" }),
};
