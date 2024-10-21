import { Controller, Param, Get, Query, Res, Req } from '@nestjs/common';

import { Response, Request } from 'express';

import { DownloadsService } from './services/dowload';
import { AppServiceVideoInfo, GetDownloadOptionsParams, PrepareVideoParams } from './shared/service/download/types';
import { Fingerprint, IFingerprint } from 'nestjs-fingerprint';

@Controller()
export class AppController {

  constructor(private readonly downloadService: DownloadsService) { }

  @Get('/options')
  getDownloadOptions(@Query() query: GetDownloadOptionsParams): Promise<AppServiceVideoInfo> {
    const { id, source } = query
    return this.downloadService.getDownloadOptions({
      id,
      source: source ? +source : undefined
    })
  }

  @Get('/download')
  async prepare(
    @Query() query: Omit<PrepareVideoParams, 'device_fingerprint'>,
    @Res() res: Response,
    @Fingerprint() fp: IFingerprint
  ): Promise<void> {
    const { source } = query
    const params: PrepareVideoParams = {
      ...query,
      source: source ? +source : undefined,
      device_fingerprint: fp.id
    }
    const buffer = await this.downloadService.prepareVideo(params)

    res.contentType('mp4')
    res.send(buffer)
  }
}
