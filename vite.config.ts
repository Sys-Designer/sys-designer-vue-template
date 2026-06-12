import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { wrapperEnv } from './build/utils';
import { createProxy } from './build/proxy';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';
import { viteMockServe } from 'vite-plugin-mock';

const pathResolve = (dir: string) => resolve(__dirname, dir)

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDev = command === 'serve';
  const viteEnv = wrapperEnv(env);
  const {
    VITE_PUBLIC_PATH,
    VITE_PORT,
    VITE_PROXY,
  } = viteEnv;

  return {
    base: VITE_PUBLIC_PATH,
    plugins: [
      vue(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          // 自动导入 naive 函数API，无需手动 import
          { 'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar', 'useModal'] }
        ],
        dts: 'src/types/auto-imports.d.ts',
        eslintrc: { enabled: true }
      }),
      Components({
        resolvers: [NaiveUiResolver()], // 自动识别 <n-xxx> 组件并按需引入+加载样式
        dts: 'src/types/components.d.ts'
      }),
      createHtmlPlugin({ inject: { data: { title: env.VITE_APP_TITLE } } }),
      viteMockServe({ mockPath: 'mock', localEnabled: isDev, prodEnabled: false, watchFiles: true })
    ],
    resolve: {
      alias: {
        '@': pathResolve('src'),
        '@common': pathResolve('common'),
      }
    },
    css: {
      preprocessorOptions: {
        scss: { additionalData: `@use "@/assets/styles/vars.scss";` }
      }
    },
    server: {
      host: true,
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY),
      strictPort: false,
    },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router'],
            naive: ['naive-ui'],
            vendor: ['pinia', 'axios', 'dayjs', 'lodash']
          },
          entryFileNames: 'js/[name]-[hash].js',
          chunkFileNames: 'js/[name]-[hash].js',
          assetFileNames: (info) => {
            const ext = info.name.split('.').pop()
            if (/css/.test(ext)) return 'css/[name]-[hash].css'
            if (/png|jpe?g|svg|gif/.test(ext)) return 'img/[name]-[hash].[ext]'
            return 'assets/[name]-[hash].[ext]'
          }
        }
      },
      minify: 'terser',
      terserOptions: { compress: { drop_console: !isDev } }
    }
  }
})