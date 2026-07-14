import { apiFetch, toNumber } from "./client";
import type {
  FeedResponse,
  SaleProductDetail,
  SaleStoreMarker,
  SaleStoreMarkersParams,
  SalesFeedParams,
  SubscribeResponse,
} from "./types";

function normalizeStoreMarker(marker: SaleStoreMarker): SaleStoreMarker {
  return { ...marker, longitude: toNumber(marker.longitude), latitude: toNumber(marker.latitude) };
}

export const salesApi = {
  getFeed: (params: SalesFeedParams = {}) =>
    apiFetch<FeedResponse>("/api/v1/sales/feed", { params, auth: false }),

  getStoreMarkers: (params: SaleStoreMarkersParams = {}) =>
    apiFetch<SaleStoreMarker[]>("/api/v1/sales/stores/markers", { params, auth: false }).then(
      (list) => list.map(normalizeStoreMarker)
    ),

  subscribeStore: (saleStoreId: number) =>
    apiFetch<SubscribeResponse>(`/api/v1/sales/stores/${saleStoreId}/subscribe`, {
      method: "POST",
    }),

  unsubscribeStore: (saleStoreId: number) =>
    apiFetch<void>(`/api/v1/sales/stores/${saleStoreId}/subscribe`, { method: "DELETE" }),

  getProductDetail: (saleProductId: number) =>
    apiFetch<SaleProductDetail>(`/api/v1/sales/products/${saleProductId}`, { auth: false }),
};
