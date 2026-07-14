import { apiFetch } from "./client";
import type { QrVerifyRequest, QrVerifyResponse } from "./types";

export const rewardsApi = {
  verifyQr: (data: QrVerifyRequest) =>
    apiFetch<QrVerifyResponse>("/api/v1/rewards/verify", { method: "POST", body: data }),
};
