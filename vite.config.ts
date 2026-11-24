import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "node:path";

// Sito a più pagine statiche: la pagina vera (index) e due segnaposto legali.
// /admin si aggiunge al passo 3.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        privacy: resolve(__dirname, "privacy.html"),
        cookie: resolve(__dirname, "cookie.html"),
      },
    },
  },
});
