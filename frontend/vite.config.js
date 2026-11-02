import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Django dev server (python manage.py runserver)
const backend = "http://127.0.0.1:8000";

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [".."]
    },
    // In development the React site and Django share one origin through this proxy,
    // so /api and uploaded /media files work without CORS setup.
    // changeOrigin stays false so Django builds media URLs on this same origin.
    proxy: {
      "/api": { target: backend, changeOrigin: false },
      "/media": { target: backend, changeOrigin: false }
    }
  }
});
