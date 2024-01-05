// Vue插件
import vue from '@vitejs/plugin-vue';
/**
 * * 自动引入依赖API
 */
import AutoImport from 'unplugin-auto-import/vite';
/**
 * * 引入支持jsx
 */
import vueJsx from '@vitejs/plugin-vue-jsx';
/**
 * * 扩展setup插件，支持在script标签中使用name属性
 * * usage: <script setup name="MyComp"></script>
 */
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
/**
 * * rollup打包分析插件
 */
import { visualizer } from 'rollup-plugin-visualizer';
/**
 * * 静态资源压缩
 */
import viteCompression from 'vite-plugin-compression';
/**
 * * 替换内容插件
 */
import replace from '@rollup/plugin-replace';
/**
 * * 自动Element-Plus导入模块
 */
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
/**
 * * 导入svg插件
 */
import path from 'path';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
/**
 * * 处理Vxe表格
 */
import { createStyleImportPlugin, VxeTableResolve } from 'vite-plugin-style-import';

/**
 * 创建插件配置信息
 *
 * @param {Object} viteEnv vite的环境参数配置
 * @param {Boolean} isBuild 是否为编译状态
 * @returns { Array } 插件配置信息
 */
export function createVitePlugins(viteEnv, isBuild) {
	const plugins = [
		vue(),
		vueJsx(),
		vueSetupExtend(),
		AutoImport({
			dts: false,
			imports: ['vue', 'vue-router'],
		}),
		// Components({
		//   resolvers: [ElementPlusResolver()],
		// }),
		replace({
			preventAssignment: true,
			include: ['@/../lib/vform/designer.umd.js'],
			values: {
				'eval(': '[eval][0](',
			},
		}),
		// svg
		createSvgIconsPlugin({
			// 指定需要缓存的图标文件夹(路径为存放所有svg图标的文件夹不单个svg图标)
			iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
			// 指定symbolId格式
			symbolId: 'icon-[dir]-[name]',
		}),
		// vxe-table按需导入
		createStyleImportPlugin({
			resolves: [VxeTableResolve()],
		}),
	];
	// 生产环境
	if (isBuild) {
		plugins.push(
			visualizer({
				open: false,
				gzipSize: true,
				brotliSize: true,
			})
		);
		plugins.push(
			viteCompression({
				verbose: true,
				disable: false, // 不禁用压缩
				deleteOriginFile: false, // 压缩后是否删除原文件
				threshold: 10240, // 压缩前最小文件大小
				algorithm: 'gzip', // 压缩算法
				ext: '.gz', // 文件类型
			})
		);
	}
	return plugins;
}
