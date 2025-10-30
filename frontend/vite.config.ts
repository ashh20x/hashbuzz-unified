import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Determine which env file to use based on mode
  let envFile = '.env';
  if (mode === 'development') {
    envFile = '.env.dev';
  } else if (mode === 'remotedev') {
    envFile = '.env.remotedev';
  } else if (mode === 'localdev') {
    envFile = '.env';
  } else if (mode === 'production') {
    envFile = '.env.production';
  } else {
    envFile = '.env';
  }

  console.warn(`🚀 Running in ${mode} mode, using ${envFile}`);

  return {
    plugins: [react(), svgr()],
    define: {
      global: 'globalThis', // 👈 fixes "global is not defined"
    },
    publicDir: 'public',
    build: {
      outDir: 'build',
      emptyOutDir: true,
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      // ✅ Use esbuild instead of terser
      minify: 'esbuild',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            vendor: ['react', 'react-dom'],
            utils: ['lodash', 'axios'],
            ui: ['@mui/material', '@mui/icons-material'],
          },
        },
        maxParallelFileOps: 2,
      },
    },
    server: {
      open: true,
      port: 3000,
    },
    resolve: {
      alias: {
        '@': '/src',
        buffer: 'buffer',
      },
    },
    optimizeDeps: {
      include: ['buffer'],
    },
    root: process.cwd(),
  };
});
