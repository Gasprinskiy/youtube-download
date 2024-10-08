import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";

import * as fs from 'node:fs/promises';
import { join } from 'path';

import { PathToRoot } from '../shared/constants'

async function cleanUploads() {
  const rootPath = join(__dirname, PathToRoot, `/uploads/`)
  const files = await fs.readdir(rootPath);

  for (const file of files) {
    const filePath = join(__dirname, PathToRoot, `/uploads/${file}`)
    await fs.unlink(filePath);
  }
}

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  async onApplicationShutdown() {
    await cleanUploads()
  }
}

@Injectable()
export class WarmupService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    await cleanUploads()
  }
}