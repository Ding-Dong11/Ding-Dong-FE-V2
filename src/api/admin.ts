import { apiFetch } from "./client";
import type { QrIssueRequest, QrIssueResponse } from "./types";

export const adminApi = {
  issueStoreQr: (storeId: number, data: QrIssueRequest) =>
    apiFetch<QrIssueResponse>(`/api/v1/admin/stores/${storeId}/qr`, {
      method: "POST",
      body: data,
      auth: false,
    }),

  getStoreQr: (storeId: number) =>
    apiFetch<QrIssueResponse>(`/api/v1/admin/stores/${storeId}/qr`, { auth: false }),
};
