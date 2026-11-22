import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Website tĩnh: dữ liệu sản phẩm đọc từ CSV lúc build, chatbot là Botpress (không cần backend).
// Dev: http://localhost:5173  ·  Bản build: `npm run build` -> dist/, xem thử: `npm run preview` (cổng 8000)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  // allowedHosts: cho phép truy cập qua Cloudflare Quick Tunnel (public.ps1)
  preview: { port: 8000, strictPort: true, allowedHosts: [".trycloudflare.com"] },
});
