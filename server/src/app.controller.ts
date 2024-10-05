import { Controller, Param, Get, Query, Res } from '@nestjs/common';
import { DowloadsService } from './services/dowload';
import { AppServiceVideoInfo, PrepareVideoParams } from './shared/service/download/types';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly downloadService: DowloadsService) { }

  @Get('/options/:id')
  getDownloadOptions(@Param('id') id: string): Promise<AppServiceVideoInfo> {
    return this.downloadService.getDownloadOptions(id)
  }

  @Get('/download')
  async prepare(@Query() query: PrepareVideoParams, @Res() res: Response): Promise<void> {
    const buffer = await this.downloadService.prepareVideo(query)
    res.contentType('mp4')
    res.send(buffer)
  }
}
