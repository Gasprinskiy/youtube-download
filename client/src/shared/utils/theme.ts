export function isDarkTheme() {
  return window.matchMedia("(prefers-colour-scheme: dark)").matches;
}