import { Controller, Param, Get, Query } from '@nestjs/common';
import { DowloadsService } from './services/dowload';
import { AppServiceVideoInfo, PrepareVideoParams } from './shared/service/download/types';

@Controller()
export class AppController {
  constructor(private readonly downloadService: DowloadsService) { }

  @Get('/options/:id')
  getDownloadOptions(@Param('id') id: string): Promise<AppServiceVideoInfo> {
    return this.downloadService.getDownloadOptions(id)
  }

  @Get('/download_link')
  prepare(@Query() query: PrepareVideoParams): Promise<string> {
    return this.downloadService.prepareVideo(query)
  }
}
