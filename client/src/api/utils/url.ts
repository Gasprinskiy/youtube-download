export function getIDFromUrl(url: string): string | undefined {
  const regexArray = [/(?<=v=)[^&]+/g, /shorts\/([^/?]+)/, /reel\/([^/?]+)/];

  let match: RegExpExecArray | null = null;

  for (const element of regexArray) {
    if (match) {
      break;
    }
    match = element.exec(url);
  }

  return match?.[0].replace('reel/', '');
}
