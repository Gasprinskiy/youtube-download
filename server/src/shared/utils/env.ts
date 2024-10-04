export function isProd() {
  return process.env.npm_lifecycle_event === 'start:prod'
}

export function getCorsOrigin() {
  return isProd() ? process.env.PROD_ORIGIN : process.env.DEV_ORIGIN
}