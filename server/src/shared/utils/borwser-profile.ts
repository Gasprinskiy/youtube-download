import { join } from "path";

export function getFirefoxProfilePath(): string {
  return join(__dirname, '..', 'firefox-profile')
}