import { Controller, Get, Query, Res, Req } from '@nestjs/common';

import { Response } from 'express';

import { DownloadsService } from './services/dowload';
import { AppServiceVideoInfo, DownloadSource, GetDownloadOptionsParams, PrepareVideoParams } from './shared/service/download/types';
import { Fingerprint, IFingerprint } from 'nestjs-fingerprint';

@Controller()
export class AppController {

  constructor(private readonly downloadService: DownloadsService) { }

  @Get('/options')
  getDownloadOptions(
    @Query() query: GetDownloadOptionsParams,
    @Fingerprint() fp: IFingerprint,
  ): Promise<AppServiceVideoInfo> {
    const { id } = query
    return this.downloadService.getDownloadOptions({
      id,
      source: +query.source,
      device_fingerprint: fp.id
    })
  }

  @Get('/download')
  async prepare(
    @Query() query: Omit<PrepareVideoParams, 'device_fingerprint'>,
    @Res() res: Response,
    @Fingerprint() fp: IFingerprint
  ): Promise<void> {
    const params: PrepareVideoParams = {
      ...query,
      source: +query.source,
      device_fingerprint: fp.id
    }
    const buffer = await this.downloadService.prepareVideo(params)

    res.contentType('mp4')
    res.send(buffer)
  }

  private parseSource(source?: DownloadSource): number | undefined {
    return source ? +source : undefined
  }
}
