export interface AppServiceVideoDownloadOptions {
  id: string
  quality: number
  extension: string
  size: number
  fps: number
}

export interface AppServiceVideoInfo {
  name: string
  preview_url: string
  download_options: AppServiceVideoDownloadOptions[]
}

export interface PrepareVideoParams {
  id: string
  quality: string
  file_name: string
  device_fingerprint: string
}

export interface ParsedFormats {
  format_code: string
  extension: string
  resolution: string
  height: number
  codec: string | null
  size: string | null
}

export type ParsedFormatsOmitSize = Omit<ParsedFormats, 'size'>