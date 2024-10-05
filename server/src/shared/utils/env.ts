export function isProd() {
  return process.env.npm_lifecycle_event === 'start:prod'
}

export function getCorsOrigin() {
  return isProd() ? 'http://localhost' : 'http://localhost:3030'
}