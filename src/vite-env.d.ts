// src/env.d.ts
/// <reference types="vite/client" />
declare const __IS_ELECTRON__: boolean;
import type {
  MessageApi,
  DialogApi,
  NotificationApi,
  LoadingBarApi
} from 'naive-ui'

declare global {
  interface Window {
    $message: MessageApi
    $dialog: DialogApi
    $notification: NotificationApi
    $loadingBar: LoadingBarApi
    electronAPI: {
      sendLoginSuccess: (loginInfo?: Record<string, any>) => void
      setGlobal: (info?: Record<string, any>) => void
      closeWindow: () => void
      minimizeWindow: () => void
    }
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

