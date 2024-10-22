import { getIDFromUrl } from './utils/url';
import type { AppServiceVideoInfo, DownloadSource, PrepareVideoParams } from './types';
import { $api } from './lib';

export function getDownloadOptions(
  url: string,
  source?: DownloadSource,
  signal?: AbortSignal,
): Promise<AppServiceVideoInfo> {
  const id = getIDFromUrl(url);
  return $api('options', {
    query: {
      id,
      source,
    },
    signal,
  });
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
