export function isProd() {
  return process.env.npm_lifecycle_event === 'start:prod'
}

export function getCorsOrigin() {
  return isProd() ? process.env.PROD_ORIGIN : process.env.DEV_ORIGIN
}

export function getHostName() {
  return isProd() ? process.env.HOST_NAME : 'http://localhost:3000'
}