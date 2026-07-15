import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [react()],
    server: {
      // 백엔드가 프론트와 다른 오리진(cloudflare 터널)이라 그대로 두면
      // 로그인 시 내려주는 access_token 쿠키를 프론트 JS가 절대 읽을 수 없다.
      // dev 서버가 같은 오리진에서 중계하도록 프록시해서 쿠키가 localhost에 저장되게 한다.
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
        "/health": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
      },
    },
  };
});