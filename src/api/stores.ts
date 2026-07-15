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
    apiFetch<StoreDetail>(`/api/v1/stores/${storeId}`, { auth: false }).then((detail) => ({
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
