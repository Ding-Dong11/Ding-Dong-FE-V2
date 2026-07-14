import { apiFetch } from "./client";
import type {
  EmailCodeRequest,
  EmailVerifyRequest,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  WithdrawRequest,
} from "./types";

export const authApi = {
  requestEmailCode: (data: EmailCodeRequest) =>
    apiFetch<void>("/api/v1/auth/email/code", { method: "POST", body: data, auth: false }),

  verifyEmailCode: (data: EmailVerifyRequest) =>
    apiFetch<void>("/api/v1/auth/email/verify", { method: "POST", body: data, auth: false }),

  signup: (data: SignupRequest) =>
    apiFetch<SignupResponse>("/api/v1/auth/signup", { method: "POST", body: data, auth: false }),

  login: (data: LoginRequest) =>
    apiFetch<LoginResponse>("/api/v1/auth/login", { method: "POST", body: data, auth: false }),

  /** refresh_token 쿠키(httponly)는 브라우저가 자동 전송하므로 body 불필요 */
  refresh: () => apiFetch<void>("/api/v1/auth/refresh", { method: "POST", auth: false }),

  logout: () => apiFetch<void>("/api/v1/auth/logout", { method: "POST" }),

  withdraw: (data: WithdrawRequest) =>
    apiFetch<void>("/api/v1/auth/withdraw", { method: "POST", body: data }),
};
