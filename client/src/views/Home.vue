<script setup lang="ts">
import type { VNode } from 'vue';
import { h, shallowRef } from 'vue';

import type { NotificationReactive } from 'naive-ui';
import { NButton, NCard, NCollapseTransition, useMessage, useNotification } from 'naive-ui';

import SearchInput from '../components/SearchInput.vue';
import { downloadVideo, getDownloadOptions } from '../api';
import { DownloadSource, type AppServiceVideoDownloadOptions, type AppServiceVideoInfo, type PrepareVideoParams } from '../api/types';
import SearchResult from '../components/SearchResult.vue';
import { downloadBlob } from '../shared/utils/download';
import { useApiRequest } from '../composables/use-api-request.ts';
import { useDownloadSource } from '../composables/use-download-source/index.ts';

const abortTitle = 'Прервать';

const notification = useNotification();
const message = useMessage();
const { handleRequest, abortRequest } = useApiRequest();
const { currentSource, setCurrentSource } = useDownloadSource();

const data = shallowRef<AppServiceVideoInfo | null>(null);
const currentUrl = shallowRef<string>('');
const inProgressMessage = shallowRef<string>('');
const chosenOptionID = shallowRef<string>();
const inProgressNotification = shallowRef<NotificationReactive>();

async function onInputSubmit(url: string): Promise<void> {
  handleRequest({
    request: (signal?: AbortSignal) => getDownloadOptions(
      url,
      currentSource.value,
      signal,
    ),

    beforeRequestStart: () => {
      inProgressMessage.value = 'Идет поиск видео';

      inProgressNotification.value = notification.create({
        title: inProgressMessage.value,
        action: () => renderNotificationActionButton(
          abortTitle,
          () => {
            inProgressNotification.value?.destroy();
            abortRequest();
          },
        ),
      });
      data.value = null;
      currentUrl.value = url;
    },

    afterRequestFinished: (result: AppServiceVideoInfo) => {
      data.value = result;
      chosenOptionID.value = result.download_options[0].id;
      inProgressNotification.value?.destroy();
    },

    onTryRequestWithLoadingInProgress: () => {
      message.warning(inProgressMessage.value);
    },

    onRequestError: () => {
      inProgressNotification.value?.destroy();
    },
  });
}

async function onDownloadClicked(result: {
  fileName: string;
  option: AppServiceVideoDownloadOptions;
}): Promise<void> {
  const { fileName, option } = result;
  const inProgressDescription = 'Время подготовки зависит от размера видео';

  handleRequest({
    request: (signal?: AbortSignal) => {
      const isYoutube = currentSource.value === DownloadSource.YouTube;
      const id = isYoutube ? option.id : option.id.split('-')[0];

      const params: PrepareVideoParams = {
        id,
        quality: option.quality,
        file_name: fileName,
        source: currentSource.value,
      };
      return downloadVideo(params, signal);
    },

    beforeRequestStart: () => {
      inProgressMessage.value = 'Идет подготовка видео';

      inProgressNotification.value = notification.create({
        title: inProgressMessage.value,
        description: inProgressDescription,
        action: () => renderNotificationActionButton(
          abortTitle,
          () => {
            inProgressNotification.value?.destroy();
            abortRequest();
          },
        ),
      });
    },

    afterRequestFinished: (result: Blob) => {
      downloadBlob(result, `${fileName}.${option.extension}`);
      inProgressNotification.value?.destroy();
      message.success('Загрузка видео началась');
    },

    onTryRequestWithLoadingInProgress: () => {
      message.warning(inProgressMessage.value);
    },

    onRequestError: () => {
      inProgressNotification.value?.destroy();
    },
  });
}

function renderNotificationActionButton(
  title: string,
  onClick: () => void,
): VNode {
  return h(NButton, {
    text: true,
    type: 'primary',
    onClick,
  }, {
    default: () => title,
  });
};

function changeSourceOnInput(value: string): void {
  const sourceStringList: string[] = [
    DownloadSource[DownloadSource.YouTube].toLowerCase(),
    DownloadSource[DownloadSource.Instagram].toLowerCase(),
  ];

  switch (true) {
    case value.includes(sourceStringList[0]):
      setCurrentSource(DownloadSource.YouTube);
      break;

    case value.includes(sourceStringList[1]):
      setCurrentSource(DownloadSource.Instagram);
      break;
  }
}
</script>

<template>
  <div class="home-view">
    <NCard class="home-view__search-input">
      <SearchInput
        @on-submit="onInputSubmit"
        @on-input="changeSourceOnInput"
      />
    </NCard>

    <NCollapseTransition :show="!!data">
      <SearchResult
        v-if="data"
        :data="data"
        :source="currentSource"
        @on-download-clicked="onDownloadClicked"
      />
    </NCollapseTransition>
  </div>
</template>

<style lang="scss">
  .home-view {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__search-input  {
      .n-card__content {
        padding: 10px;
      }
    }

    .n-card > .n-card__content:first-child, .n-card > .n-card__footer:first-child {
      padding-top: 10px;
    }
  }
</style>
