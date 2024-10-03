import { Injectable, OnApplicationShutdown } from "@nestjs/common";

import * as fs from 'node:fs/promises';
import { join } from 'path';

import { PathToRoot } from '../shared/constants'

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  async onApplicationShutdown() {
    const rootPath = join(__dirname, PathToRoot, `/uploads/`)
    const files = await fs.readdir(rootPath);

    for (const file of files) {
      const filePath = join(__dirname, PathToRoot, `/uploads/${file}`)
      await fs.unlink(filePath);
    }
  }
}