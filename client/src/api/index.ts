import { getIDFromUrl } from "./utils/url";
import { AppServiceVideoInfo, PrepareVideoParams } from "./types";
import { $api } from "./lib";


export function getDownloadOptions(url: string): Promise<AppServiceVideoInfo> {
  const id = getIDFromUrl(url)
  return $api(`options/${id}`)
}

export function getDownloadLink(params: PrepareVideoParams): Promise<string> {
  return $api('/download_link', { query: { ...params } })
}