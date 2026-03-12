import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const apiPrefix = env.VITE_API_PREFIX || "/api";
	const apiBaseUrl = env.VITE_API_BASE_URL || "http://localhost:8000";

	let proxyTarget = "http://localhost:8000";
	try {
		proxyTarget = new URL(apiBaseUrl).origin;
	} catch {
		proxyTarget = "http://localhost:8000";
	}

	return {
		plugins: [react(), tailwindcss()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		server: {
			open: "/login",
			proxy: {
				[apiPrefix]: {
					target: proxyTarget,
					changeOrigin: true,
				},
			},
		},
	};
});
