import { DownloadSource } from '../../api/types';
import type { DownloadSourceOption } from './types';

export const DownloadSourceOptions: DownloadSourceOption[] = [
  {
    label: DownloadSource[DownloadSource.YouTube],
    value: DownloadSource.YouTube,
  },
  {
    label: DownloadSource[DownloadSource.Instagram],
    value: DownloadSource.Instagram,
  },
] as const;
