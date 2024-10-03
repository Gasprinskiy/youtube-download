import { Controller, Param, Get, Query } from '@nestjs/common';
import { DowloadsService } from './services/dowload';
import { AppServiceVideoInfo, PrepareVideoParams } from './shared/service/download/types';

@Controller()
export class AppController {
  constructor(private readonly downloadService: DowloadsService) { }

  @Get('/options/:id')
  async getDownloadOptions(@Param('id') id: string): Promise<AppServiceVideoInfo> {
    const shit = await this.downloadService.getDownloadOptions(id)
    console.log('shit: ', shit);
    return shit

  }

  @Get('/download_link')
  async prepare(@Query() query: PrepareVideoParams): Promise<string> {
    console.log('query: ', query);

    return this.downloadService.prepareVideo(query)
  }
}
