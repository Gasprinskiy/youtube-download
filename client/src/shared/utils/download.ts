export function downloadBlob(file: Blob, fileName: string): void {
  const a = document.createElement('a');
  const url = window.URL.createObjectURL(file);
  document.body.appendChild(a);

  a.href = url;
  a.download = fileName;

  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  a.dispatchEvent(clickEvent);

  a.remove();
  window.URL.revokeObjectURL(url);
}
