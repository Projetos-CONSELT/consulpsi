/* Assinatura Digital Conselt - Empresa Junior de Consultoria em Engenharia Elétrica */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import compression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  const devPreviewCompatibility = isDev
    ? {
        name: "lovable-preview-compat",
        transformIndexHtml(html: string) {
          return html
            .replace(/frame-ancestors 'self';\s*/i, "")
            .replace(/<meta\s+http-equiv="X-Frame-Options"[^>]*>\s*/i, "");
        },
      }
    : null;

  return {
    build: {
      sourcemap: mode === "development",
      cssCodeSplit: true,
      target: "es2020",
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: !isDev,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            "vendor-query": ["@tanstack/react-query"],
            "vendor-motion": ["framer-motion"],
            "vendor-lucide": ["lucide-react"],
          },
        },
      },
    },
    server: {
      host: "0.0.0.0",
      port: 8080,
      strictPort: true,
      hmr: {
        overlay: false,
      },
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
        ...(isDev
          ? {}
          : {
              "X-Frame-Options": "SAMEORIGIN",
              "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
            }),
      },
    },
    plugins: [
      react(),
      isDev && componentTagger(),
      devPreviewCompatibility,
      !isDev && compression({
        algorithm: 'brotli',
        ext: '.br',
      }),
      !isDev && compression({
        algorithm: 'gzip',
        ext: '.gz',
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
  };
});
