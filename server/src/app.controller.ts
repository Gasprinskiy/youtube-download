import { Controller, Param, Get, Query, Res, Req } from '@nestjs/common';

import { Response, Request } from 'express';

import { DownloadsService } from './services/dowload';
import { AppServiceVideoInfo, PrepareVideoParams } from './shared/service/download/types';
import { Fingerprint, IFingerprint } from 'nestjs-fingerprint';

@Controller()
export class AppController {

  constructor(private readonly downloadService: DownloadsService) { }

  @Get('/options/:id')
  getDownloadOptions(@Param('id') id: string): Promise<AppServiceVideoInfo> {
    return this.downloadService.getDownloadOptions(id)
  }

  @Get('/download')
  async prepare(
    @Query() query: Omit<PrepareVideoParams, 'device_fingerprint'>,
    @Res() res: Response,
    @Fingerprint() fp: IFingerprint
  ): Promise<void> {
    const params: PrepareVideoParams = {
      ...query,
      device_fingerprint: fp.id
    }
    const buffer = await this.downloadService.prepareVideo(params)
    console.log('buffer: ', buffer);

    res.contentType('mp4')
    res.send(buffer)
  }
}
