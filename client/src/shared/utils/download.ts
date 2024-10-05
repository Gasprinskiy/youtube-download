import { getApiUrl } from './env';

export function startDownload(file: Blob, fileName: string): void {
  const a = document.createElement('a');
  document.body.appendChild(a);

  const url = window.URL.createObjectURL(file);

  a.href = url;
  a.download = fileName;
  a.click();

  window.URL.revokeObjectURL(url);
  a.remove();
}

export function getVideoUrl(fileName: string): string {
  const apiUrl = getApiUrl();
  return `${apiUrl}/${fileName}`;
}
