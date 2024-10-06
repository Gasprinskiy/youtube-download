export function startDownload(file: Blob, fileName: string): string {
  const a = document.createElement('a');
  document.body.appendChild(a);

  const url = window.URL.createObjectURL(file);

  a.href = url;
  a.download = fileName;
  a.click();

  a.remove();

  return url;
}
