// 공통 fetch 래퍼.
// - access_token은 로그인 시 non-httponly 쿠키로 내려오므로 직접 읽어 Authorization 헤더로 붙인다.
// - refresh_token은 httponly라 JS로 읽을 수 없고, /api/v1/auth 경로 요청 시 브라우저가 자동 전송한다.
// - 인증 필요 요청이 401을 받으면 /auth/refresh로 한 번 갱신을 시도한 뒤 원요청을 재시도한다.
//
// 백엔드(cloudflare 터널)는 프론트와 다른 오리진이라, 그쪽으로 직접 요청하면 로그인 시
// 내려주는 access_token 쿠키가 그 도메인에 저장되어 프론트 JS(document.cookie)가 절대 읽을 수 없다.
// 그래서 항상 현재 페이지와 같은 오리진으로 요청하고, dev 서버 프록시(vite.config.ts)가
// 실제 백엔드로 중계하게 한다. 배포 환경에서도 `/api`, `/health`를 백엔드로 리버스 프록시하는
// 설정이 반드시 있어야 이 인증 방식이 동작한다.
const BASE_URL = window.location.origin;

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/**
 * 서버가 위경도 등 숫자 필드를 문자열로 내려주는 경우가 있어(api.yaml 스펙과 실제 응답 불일치)
 * 응답을 쓰기 전에 명시적으로 숫자로 변환한다. 이미 숫자면 그대로 반환.
 */
export function toNumber(value: number | string): number {
  return typeof value === "string" ? Number(value) : value;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getAccessToken(): string | null {
  return getCookie("access_token");
}

/** refresh_token까지 만료되어 재로그인이 필요할 때 호출된다. App 레벨에서 등록해 /login으로 이동시킨다. */
type AuthFailureHandler = () => void;
let authFailureHandler: AuthFailureHandler | null = null;

export function setAuthFailureHandler(handler: AuthFailureHandler | null): void {
  authFailureHandler = handler;
}

// 동시에 여러 요청이 401을 받아도 refresh는 한 번만 수행되도록 진행 중인 시도를 공유한다.
let refreshPromise: Promise<boolean> | null = null;

function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(new URL("/api/v1/auth/refresh", BASE_URL), {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

type QueryParams = Record<string, string | number | boolean | undefined | null>;

function buildUrl(path: string, params?: QueryParams): string {
  const url = new URL(path, BASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

function authHeaders(auth: boolean): Record<string, string> {
  if (!auth) return {};
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  params?: QueryParams;
  /** 인증이 필요 없는 요청이면 false로 지정 (Authorization 헤더 생략, 401 재시도 대상에서도 제외) */
  auth?: boolean;
  signal?: AbortSignal;
};

async function parseErrorBody(res: Response): Promise<Partial<{ code: string; message: string }> | undefined> {
  const isJson = res.headers.get("content-type")?.includes("application/json") ?? false;
  if (!isJson) return undefined;
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

async function performRequest<T>(path: string, options: RequestOptions, isRetry: boolean): Promise<T> {
  const { method = "GET", body, params, auth = true, signal } = options;

  const res = await fetch(buildUrl(path, params), {
    method,
    credentials: "include",
    signal,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...authHeaders(auth),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth) {
    if (!isRetry) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return performRequest<T>(path, options, true);
      }
    }
    authFailureHandler?.();
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const isJson = res.headers.get("content-type")?.includes("application/json") ?? false;
  const data = isJson ? await res.json() : undefined;

  if (!res.ok) {
    const error = data as Partial<{ code: string; message: string }> | undefined;
    throw new ApiError(
      res.status,
      error?.code ?? "UNKNOWN_ERROR",
      error?.message ?? "요청을 처리하는 중 오류가 발생했습니다."
    );
  }

  return data as T;
}

export function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return performRequest<T>(path, options, false);
}

/**
 * SSE(text/event-stream) 응답을 파싱하며 매 청크마다 onMessage를 호출한다.
 * EventSource는 POST/커스텀 헤더를 지원하지 않아 fetch + ReadableStream으로 직접 구현.
 */
export async function apiStream<T>(
  path: string,
  body: unknown,
  onMessage: (chunk: T) => void,
  signal?: AbortSignal,
  isRetry = false
): Promise<void> {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    credentials: "include",
    signal,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(true),
    },
    body: JSON.stringify(body),
  });

  if (res.status === 401) {
    if (!isRetry) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return apiStream<T>(path, body, onMessage, signal, true);
      }
    }
    authFailureHandler?.();
  }

  if (!res.ok || !res.body) {
    const error = await parseErrorBody(res);
    throw new ApiError(res.status, error?.code ?? "STREAM_ERROR", error?.message ?? "스트림 연결에 실패했습니다.");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const event of events) {
      const line = event.split("\n").find((l) => l.startsWith("data:"));
      if (!line) continue;
      const payload = line.slice(line.indexOf(":") + 1).trim();
      if (!payload) continue;
      onMessage(JSON.parse(payload) as T);
    }
  }
}
