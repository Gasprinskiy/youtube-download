import { Injectable } from '@nestjs/common';

import { join } from 'path';
import * as fs from 'node:fs/promises'

import { PathToRoot } from '../shared/constants'

import { FileLifeTime } from '../../shared/service/download/constants';
import { youtubeDl } from '../../shared/youtube-dl';
import { DownloadableFormatsIdMap } from '../../shared/youtube-dl/constants';
import { AppServiceVideoDownloadOptions, AppServiceVideoInfo, PrepareVideoParams } from '../../shared/service/download/types';

@Injectable()
export class DowloadsService {
  async getDownloadOptions(id: string): Promise<AppServiceVideoInfo> {
    const url = this.getUrl(id)
    const info = await this.getVideoFormats(url)

    const formats = info.formats as Array<any>

    const filteredDownloadOption = formats.filter(item => {
      const isSatisfyingQuality = item.height > 360
      const isMp4 = item.ext === 'mp4'
      const isDownloadable = DownloadableFormatsIdMap[item.format_id]

      return isSatisfyingQuality && isMp4 && isDownloadable
    })

    return {
      name: info.title,
      preview_url: this.getPreviewUrl(id),
      download_options: filteredDownloadOption.map<AppServiceVideoDownloadOptions>(item => ({
        id: `${id}-${item.format_id}`,
        quality: item.height,
        extension: item.video_ext,
        size: item.filesize,
        fps: item.fps
      }))
    }
  }

  async prepareVideo(params: PrepareVideoParams): Promise<string> {
    const { id, quality, file_name } = params

    const url = this.getUrl(id)
    const unicID = Date.now().toString(16)
    const fileName = `${file_name}[${unicID}_${id}].mp4`
    const rootPath = join(__dirname, PathToRoot, `/uploads/${fileName}`)

    await youtubeDl.execPromise([
      url,
      '-f',
      `bestvideo[height=${quality}][vcodec^=avc]+bestaudio[ext=mp4]/best[height=${quality}][vcodec^=avc]`,
      '-S', 'vcodec:avc',
      '--merge-output-format', 'mp4',
      '--recode-video', 'mp4',
      '-o', rootPath,
    ])

    queueMicrotask(() => this.setFileToRemove(rootPath))

    return fileName
  }

  private async getVideoFormats(url: string): Promise<any> {
    const listFormats = await youtubeDl.execPromise([url, '--list-formats', '--dump-json']);

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

  private getUrl(id: string): string {
    return `https://www.youtube.com/watch?v=${id}`
  }

  private getPreviewUrl(id: string): string {
    return `http://i3.ytimg.com/vi/${id}/hqdefault.jpg`
  }

  private setFileToRemove(file_path: string): void {
    setTimeout(async () => {
      await fs.unlink(file_path)
    }, FileLifeTime)
  }
}
