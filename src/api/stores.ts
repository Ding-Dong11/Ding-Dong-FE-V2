import { apiFetch, toNumber } from "./client";
import type { MarkerItem, StoreDetail, StoreMarkersParams, StoreSearchItem } from "./types";

function normalizeMarkerItem(item: MarkerItem): MarkerItem {
  return { ...item, longitude: toNumber(item.longitude), latitude: toNumber(item.latitude) };
}

export const storesApi = {
  getMarkers: (params: StoreMarkersParams) =>
    apiFetch<MarkerItem[]>("/api/v1/stores/markers", { params, auth: false }).then((list) =>
      list.map(normalizeMarkerItem)
    ),

  getDetail: (storeId: number) =>
    // 로그인 상태면 쿠키의 access_token이 실려 cooldown_days_left가 사용자별로 채워진다.
    // 비로그인 상태여도 인증 없이 200이 오는 공개 엔드포인트라 auth 헤더는 optional로만 붙인다.
    apiFetch<StoreDetail>(`/api/v1/stores/${storeId}`).then((detail) => ({
      ...detail,
      longitude: toNumber(detail.longitude),
      latitude: toNumber(detail.latitude),
    })),

  search: (q: string, limit?: number) =>
    apiFetch<StoreSearchItem[]>("/api/v1/stores/search", {
      params: { q, limit },
      auth: false,
    }).then((list) =>
      list.map((item) => ({
        ...item,
        longitude: toNumber(item.longitude),
        latitude: toNumber(item.latitude),
      }))
    ),
};
