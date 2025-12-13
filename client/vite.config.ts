import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: { // for the FE dev server
    host: '127.0.0.1', // To allow the website to be accessed by http://127.0.0.1:5173/ on Windows; Linux is less picky
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 5173, // Otherwise, it'll run on 4173 by standard, which my Spotify App does not include in its list of callback paths (it only includes port 5173)
  }
});
