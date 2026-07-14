import { apiFetch } from "./client";
import type { MyCouponsParams, PointResponse, UserCouponDetail, UserCouponItem } from "./types";

export const mypageApi = {
  getPoint: () => apiFetch<PointResponse>("/api/v1/mypage/point"),

  getCoupons: (params: MyCouponsParams = {}) =>
    apiFetch<UserCouponItem[]>("/api/v1/mypage/coupons", { params }),

  getCouponDetail: (userCouponId: number) =>
    apiFetch<UserCouponDetail>(`/api/v1/mypage/coupons/${userCouponId}`),
};
