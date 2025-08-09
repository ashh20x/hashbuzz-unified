import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    define: {
        global: "globalThis", // 👈 fixes "global is not defined"
    },
    publicDir: "public",
    server: {
        // open the browser at project root
        open: true,
        port: 3000, // 👈 set default port to 3000
    },
    resolve: {
        alias: {
            "@": "/src",
            buffer: "buffer",
        },
    },
    optimizeDeps: {
        include: ["buffer"],
    },

    // esbuild configuration removed; Vite handles JSX automatically with the React plugin.
    // https://vitejs.dev/config/
    // Use project root index.html and serve static assets from public/
    root: process.cwd(),
});
