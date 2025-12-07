import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
	plugins: [react()],
	server: {
		host: '0.0.0.0', // Membolehkan akses dari IP lain di jaringan
		port: 5173,
		proxy: {
			'/api': {
				target: 'http://localhost:5000',
				changeOrigin: true
			}
		}
	},
	preview: {
		host: '0.0.0.0', // Untuk production preview
		port: 5173
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
});
