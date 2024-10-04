export function isProd(): boolean {
  return import.meta.env.PROD;
}

export function getApiUrl(): string {
  return isProd() ? import.meta.env.VITE_PROD_API_URL : import.meta.env.VITE_DEV_API_URL;
}
