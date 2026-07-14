import { apiFetch, toNumber } from "./client";
import type { RecommendationResponse, RecommendationsParams } from "./types";

export const recommendationsApi = {
  get: (params: RecommendationsParams) =>
    apiFetch<RecommendationResponse>("/api/v1/recommendations", { params }).then((res) => ({
      ...res,
      items: res.items.map((item) => ({
        ...item,
        longitude: toNumber(item.longitude),
        latitude: toNumber(item.latitude),
      })),
    })),
};
