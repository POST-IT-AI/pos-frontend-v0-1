export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
  AUTH_SERVICE_URL:
    (import.meta.env.VITE_AUTH_SERVICE_URL as string) ||
    "http://localhost:30002",
  USER_SERVICE_URL:
    (import.meta.env.VITE_USER_SERVICE_URL as string) ||
    "http://localhost:30001",
  APP_NAME: (import.meta.env.VITE_APP_NAME as string) || "POS System",
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;
