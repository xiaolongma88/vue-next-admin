import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus';
import { buildConfig } from './src/utils/build';

import path from 'path';
// 加载引入插件处理方法
import { createVitePlugins } from './build/plugins';

const pathResolve = (dir) => {
	return resolve(__dirname, '.', dir);
};

const alias = {
	'/@': pathResolve('./src/'),
	'@': path.resolve(__dirname, 'src'),
};

const viteConfig = defineConfig((mode) => {
	const env = loadEnv(mode.mode, process.cwd());
	// 是否生产环境
	const isBuild = mode.command === 'build';
	return {
		plugins: [JSON.parse(env.VITE_OPEN_CDN) ? buildConfig.cdn() : null, ...createVitePlugins(env, isBuild)],
		root: process.cwd(),
		resolve: { alias },
		base: mode.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
		optimizeDeps: {
			exclude: ['vue-demi'],
			include: ['@/../lib/vform/designer.umd.js'],
		},
		server: {
			host: '0.0.0.0',
			port: env.VITE_PORT,
			open: JSON.parse(env.VITE_OPEN),
			hmr: true,
			proxy: {
				'/gitee': {
					target: 'https://gitee.com',
					ws: true,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/gitee/, ''),
				},
				//
				[env.VITE_API_URL]: {
					target: env.VITE_API_PROXY,
					changeOrigin: true,
					// 代理websockets
					ws: true,
					// 重写的请求路径
					rewrite: (path) => path.replace(new RegExp(`^${env.VITE_API_URL}`), ''),
				},
			},
		},
		build: {
			outDir: 'dist',
			chunkSizeWarningLimit: 1500,
			commonjsOptions: {
				include: [/node_modules|lib/],
			},
			rollupOptions: {
				output: {
					chunkFileNames: 'assets/js/[name]-[hash].js',
					entryFileNames: 'assets/js/[name]-[hash].js',
					assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
					manualChunks(id) {
						if (id.includes('node_modules')) {
							return id.toString().match(/\/node_modules\/(?!.pnpm)(?<moduleName>[^\/]*)\//).groups.moduleName ?? 'vender';
						}
					},
				},
				...(JSON.parse(env.VITE_OPEN_CDN) ? { external: buildConfig.external } : {}),
			},
		},
		css: {
			preprocessorOptions: {
				css: { charset: false },
				// define global scss variable
				scss: {
					additionalData: `@use '@/styles/global/index.scss' as *;`,
				},
			},
		},
		define: {
			__NEXT_VERSION__: JSON.stringify(process.env.npm_package_version),
			__NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
		},
	};
});

export default viteConfig;
