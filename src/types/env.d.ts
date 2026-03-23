/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_WEB_URL: string;
  readonly VITE_STORAGE_URL: string;
  readonly VITE_TELEGRAM_BOT_NAME: string;
  readonly VITE_TELEGRAM_BOT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
