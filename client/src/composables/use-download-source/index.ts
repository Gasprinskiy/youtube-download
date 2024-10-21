import { shallowRef } from 'vue';

import { DownloadSource } from '../../api/types';

const currentSource = shallowRef<DownloadSource>(DownloadSource.YouTube);

export function useDownloadSource() {
  function setCurrentSource(source: DownloadSource) {
    if (currentSource.value === source) {
      return;
    }

    currentSource.value = source;
  }

  return {
    currentSource,
    setCurrentSource,
  };
}
