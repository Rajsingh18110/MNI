import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import icons from 'unplugin-icons/vite';
import svgLoader from 'vite-svg-loader';
import path from 'path';
import { lucideIconsPlugin } from '../design-system/src/icons/lucide/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		lucideIconsPlugin(),
		icons({
			compiler: 'vue3',
			autoInstall: true,
		}),
		svgLoader({
			svgoConfig: {
				plugins: [
					{
						name: 'preset-default',
						params: {
							overrides: {
								cleanupIds: false,
								removeViewBox: false,
							},
						},
					},
				],
			},
		}),
	],
	resolve: {
		alias: [
			{
				find: /^@MNI\/design-system$/,
				replacement: path.resolve(__dirname, '../design-system/src/index.ts'),
			},
			{
				find: /^@MNI\/design-system\/(.*)$/,
				replacement: path.resolve(__dirname, '../design-system/src/$1'),
			},
			{
				find: /^@MNI\/chat$/,
				replacement: path.resolve(__dirname, '../chat/src/index.ts'),
			},
			{
				find: /^@MNI\/chat\/(.*)$/,
				replacement: path.resolve(__dirname, '../chat/src/$1'),
			},
			// Editor-UI aliases
			{
				find: /^@\/(.*)$/,
				replacement: path.resolve(__dirname, '../../editor-ui/src/$1'),
			},
			{
				find: /^@MNI\/i18n$/,
				replacement: path.resolve(__dirname, '../i18n/src/index.ts'),
			},
			{
				find: /^@MNI\/i18n\/(.*)$/,
				replacement: path.resolve(__dirname, '../i18n/src/$1'),
			},
			{
				find: /^@MNI\/stores$/,
				replacement: path.resolve(__dirname, '../stores/src/index.ts'),
			},
			{
				find: /^@MNI\/stores\/(.*)$/,
				replacement: path.resolve(__dirname, '../stores/src/$1'),
			},
			{
				find: /^@MNI\/composables$/,
				replacement: path.resolve(__dirname, '../composables/src/index.ts'),
			},
			{
				find: /^@MNI\/composables\/(.*)$/,
				replacement: path.resolve(__dirname, '../composables/src/$1'),
			},
			{
				find: /^@MNI\/utils$/,
				replacement: path.resolve(__dirname, '../../../@MNI/utils/src/index.ts'),
			},
			{
				find: /^@MNI\/utils\/(.*)$/,
				replacement: path.resolve(__dirname, '../../../@MNI/utils/src/$1'),
			},
		],
	},
});
