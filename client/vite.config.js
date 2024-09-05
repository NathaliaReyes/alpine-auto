import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: 'esnext',
      sourcemap: false,
      minify: false,
    },
    server: {
      host: true,
      port: 5174,
      proxy:{
        '/graphql': {
          target: 'ttps://alpineautosales.netlify.app',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
});