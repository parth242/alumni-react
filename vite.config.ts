/* import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		minify: false,
	},
	plugins: [react(), tsconfigPaths()],
});
 */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { createHtmlPlugin } from "vite-plugin-html";
// import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";
// import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// Load environment variables based on the mode (development or production)
	const env = loadEnv(mode, process.cwd());

	return {
		build: {
			target: "es2020",
			minify: true,
			rollupOptions: {
				onwarn(warning, warn) {
					// Suppress "Module level directives cause errors when bundled" warnings
					if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
						return;
					}
					warn(warning);
				},
			},
			sourcemap: false, // Disable source maps in production
		},
		optimizeDeps: {
			esbuildOptions: {
				target: "es2020",
			},
		},
		plugins: [
			react(),
			tsconfigPaths(),
			createHtmlPlugin({
				inject: {
					data: {
						VITE_BASE_URL: env.VITE_BASE_URL,
					},
				},
			}),
			/* viteCompression({
				algorithm: "gzip", // Use 'brotliCompress' for Brotli, or include both if needed
				ext: ".gz", // Set the file extension for gzip
				deleteOriginFile: false, // Keep the original files (optional)
			}),
			viteCompression({
				algorithm: "brotliCompress",
				ext: ".br",
				deleteOriginFile: false,
			}), */
			// basicSsl(),
		],
		server: {
			host: true,
		},
		resolve: {
			alias: {
				"@images": path.resolve(
					__dirname,
					"src/assets/game-plinko/img",
				),
				"@sounds": path.resolve(
					__dirname,
					"src/assets/game-plinko/sounds",
				),
			},
		},
	};
});
