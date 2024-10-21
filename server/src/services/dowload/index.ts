import { Injectable } from '@nestjs/common';

import { join } from 'path';
import * as fs from 'node:fs/promises'

import { getFirefoxProfilePath } from 'src/shared/utils/borwser-profile';

import { PathToRoot } from '../shared/constants'
import { FileLifeTime } from '../../shared/service/download/constants';
import { youtubeDl } from '../../shared/youtube-dl';
import { DownloadableFormatsIdMap } from '../../shared/youtube-dl/constants';
import {
  AppServiceVideoDownloadOptions,
  AppServiceVideoInfo,
  DownloadSource,
  GetDownloadOptionsParams,
  PrepareVideoParams
} from '../../shared/service/download/types';
import axios from 'axios';
import { getHostName } from 'src/shared/utils/env';


@Injectable()
export class DownloadsService {

  async getDownloadOptions(params: GetDownloadOptionsParams): Promise<AppServiceVideoInfo> {
    const { id, source } = params
    const url = this.getUrl(params)
    const info = await this.getVideoFormats(url)

    const formats = info.formats as Array<any>

    const preview_url = this.getPreviewUrl(params)

    const handlers: { [key in DownloadSource]: () => Promise<AppServiceVideoInfo> } = {
      [DownloadSource.YouTube]: async () => {
        const filteredDownloadOption = formats.filter(item => {
          const isSatisfyingQuality = item.height > 360
          const isMp4 = item.ext === 'mp4'
          const isDownloadable = DownloadableFormatsIdMap[item.format_id]

          return isSatisfyingQuality && isMp4 && isDownloadable
        })

        return {
          name: info.title,
          preview_url,
          download_options: filteredDownloadOption.map<AppServiceVideoDownloadOptions>(item => ({
            id: `${id}-${item.format_id}`,
            quality: item.height,
            extension: item.video_ext,
            size: item.filesize,
            fps: item.fps
          }))
        }
      },

      [DownloadSource.Instagram]: async () => {
        const filteredDownloadOption = []
        const filtered = formats.filter(item => {
          const isSatisfyingQuality = item.width > 540
          const isMp4 = item.ext === 'mp4'

          return isSatisfyingQuality && isMp4
        })

        for (const element of filtered) {
          const has = filteredDownloadOption.findIndex(item => item.width === element.width)
          if (has >= 0) {
            continue
          }

          filteredDownloadOption.push(element)
        }

        const previewResponse = await axios.get(preview_url, { responseType: 'arraybuffer' })

        const { device_fingerprint } = params
        const fileName = `${id}-${device_fingerprint}.jpeg`
        const filePath = join(__dirname, PathToRoot, `/uploads/${fileName}`)
        await fs.writeFile(filePath, previewResponse.data)

        queueMicrotask(() => this.setFileToRemove(filePath, 60000))

        return {
          name: info.title,
          preview_url: `${getHostName()}/${fileName}`,
          download_options: filteredDownloadOption.map<AppServiceVideoDownloadOptions>(item => ({
            id: `${id}-${item.format_id}`,
            quality: item.width,
            extension: item.video_ext,
            size: item.filesize,
            fps: item.fps
          }))
        }
      }
    }

    return handlers[source]()
  }

  async prepareVideo(params: PrepareVideoParams): Promise<Buffer> {
    const { id, quality, source } = params

    const url = this.getUrl({
      id,
      source
    })
    const rootPath = this.getFileRootPath(params)

    const execQueryHandlers: { [key in DownloadSource]: () => string[] } = {
      [DownloadSource.YouTube]: () => {
        return [
          '--cookies-from-browser',
          `firefox:${getFirefoxProfilePath()}`,
          url,
          '-f',
          `bestvideo[height=${quality}][vcodec^=avc]+bestaudio[ext=mp4]/best[height=${quality}][vcodec^=avc]`,
          '-S', 'vcodec:avc',
          '--merge-output-format', 'mp4',
          '--recode-video', 'mp4',
          '-o', rootPath
        ]
      },

      [DownloadSource.Instagram]: () => {
        return [
          '--cookies-from-browser',
          `firefox:${getFirefoxProfilePath()}`,
          url,
          '-f',
          `bestvideo[width=${quality}]+bestaudio/best`,
          '--merge-output-format', 'mp4',
          '-o', rootPath
        ]
      }
    }

    const execQuery = execQueryHandlers[source]()

    await youtubeDl.execPromise(execQuery)

    queueMicrotask(() => this.setFileToRemove(rootPath))

    return fs.readFile(rootPath)
  }

  private getFileRootPath(params: PrepareVideoParams): string {
    const { id, file_name, device_fingerprint } = params

    const fileName = `${file_name}[${device_fingerprint}_${id}].mp4`
    return join(__dirname, PathToRoot, `/uploads/${fileName}`)
  }

  private async getVideoFormats(url: string): Promise<any> {
    const listFormats = await youtubeDl.execPromise([
      '--cookies-from-browser',
      `firefox:${getFirefoxProfilePath()}`,
      url,
      '--list-formats',
      '--dump-json'
    ]);

    const jsonRegexp = /{[\w\W]+?}$/gim
    const jsonMatch = jsonRegexp.exec(listFormats)
    if (!jsonMatch) {
      throw Error('No json data')
    }

    try {
      const data = JSON.parse(jsonMatch[0])
      return data
    }
    catch (e) {
      const data = JSON.parse('[' + listFormats.replace(/\n/g, ',').slice(0, -1) + ']')
      return data
    }
  }

  private getUrl(params: Omit<GetDownloadOptionsParams, 'device_fingerprint'>): string {
    const { id, source } = params

    switch (source) {
      case DownloadSource.YouTube:
        return `https://www.youtube.com/watch?v=${id}`

      case DownloadSource.Instagram:
        return `https://www.instagram.com/reel/${id}/`
    }
  }

  private getPreviewUrl(params: GetDownloadOptionsParams): string {
    const { id, source } = params

    switch (source) {
      case DownloadSource.YouTube:
        return `http://i3.ytimg.com/vi/${id}/hqdefault.jpg`

      case DownloadSource.Instagram:
        return `https://instagram.com/p/${id}/media?size=l`
    }
  }

  private setFileToRemove(file_path: string, lifeTime?: number): void {
    setTimeout(async () => {
      await fs.unlink(file_path)
    }, lifeTime || FileLifeTime)
  }
}
