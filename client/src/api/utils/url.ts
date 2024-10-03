export function getIDFromUrl(url: string): string | undefined {
  const videoRegex = /(?<=v=)[^&]+/gm
  const shortsRegex = /shorts\/([^\/?]+)/
  let match = videoRegex.exec(url)

  if (match) {
    return match[0]
  }

  match = shortsRegex.exec(url)
  return match?.[1]
}