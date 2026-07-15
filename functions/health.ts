interface Env {
  BACKEND_ORIGIN?: string;
}

const FALLBACK_BACKEND_ORIGIN = "https://qty-spice-organisations-engines.trycloudflare.com";

export async function onRequest(context: { request: Request; env: Env }) {
  const backendOrigin = context.env.BACKEND_ORIGIN ?? FALLBACK_BACKEND_ORIGIN;
  const url = new URL(context.request.url);
  const target = new URL(url.pathname + url.search, backendOrigin);
  return fetch(new Request(target, context.request));
}
