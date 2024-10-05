import { getIDFromUrl } from './utils/url';
import type { AppServiceVideoInfo, PrepareVideoParams } from './types';
import { $api } from './lib';

export function getDownloadOptions(
  url: string,
  signal?: AbortSignal,
): Promise<AppServiceVideoInfo> {
  const id = getIDFromUrl(url);
  return $api(`options/${id}`, { signal });
}

export function downloadVideo(
  params: PrepareVideoParams,
  signal?: AbortSignal,
): Promise<Blob> {
  return $api('/download', {
    query: { ...params },
    signal,
  });
}
