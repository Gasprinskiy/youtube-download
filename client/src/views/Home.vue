<script setup lang="ts">
import type { VNode } from 'vue';
import { h, shallowRef } from 'vue';

import type { NotificationReactive } from 'naive-ui';
import { NButton, NCard, NCollapseTransition, useMessage, useNotification } from 'naive-ui';

import SearchInput from '../components/SearchInput.vue';
import { downloadVideo, getDownloadOptions } from '../api';
import type { AppServiceVideoDownloadOptions, AppServiceVideoInfo } from '../api/types';
import SearchResult from '../components/SearchResult.vue';
import { startDownload } from '../shared/utils/download';
import { useApiRequest } from '../composables/use-api-request.ts';

const abortTitle = 'Прервать';

const notification = useNotification();
const message = useMessage();
const { handleRequest, abortRequest } = useApiRequest();

const data = shallowRef<AppServiceVideoInfo | null>(null);
const currentUrl = shallowRef<string>('');
const chosenOptionID = shallowRef<string>();
const videoUrl = shallowRef<string | null>();
const inProgressNotification = shallowRef<NotificationReactive>();

async function onInputSubmit(url: string): Promise<void> {
  const inProgressMessage = 'Идет поиск видео';

  handleRequest({
    request: (signal?: AbortSignal) => getDownloadOptions(url, signal),

    beforeRequestStart: () => {
      inProgressNotification.value = notification.create({
        title: inProgressMessage,
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
      message.warning(inProgressMessage);
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
  const inProgressMessage = 'Идет подготовка видео';

  handleRequest({
    request: (signal?: AbortSignal) => {
      const params = {
        id: option.id,
        quality: option.quality,
        file_name: fileName,
      };
      return downloadVideo(params, signal);
    },

    beforeRequestStart: () => {
      videoUrl.value = null;
      inProgressNotification.value = notification.create({
        title: inProgressMessage,
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
      const url = startDownload(result, fileName);
      videoUrl.value = url;
      inProgressNotification.value?.destroy();
      message.success('Загрузка видео началась');
    },

    onTryRequestWithLoadingInProgress: () => {
      message.warning(inProgressMessage);
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
</script>

<template>
  <div class="home-view">
    <NCard>
      <SearchInput
        @on-submit="onInputSubmit"
      />
    </NCard>

    <NCollapseTransition :show="!!data">
      <SearchResult
        v-if="data"
        :data="data"
        @on-download-clicked="onDownloadClicked"
      />
    </NCollapseTransition>

    <NCollapseTransition :show="!!videoUrl">
      <NCard>
        <p
          v-if="videoUrl"
          class="home-view__url-hint"
        >
          Если загрузка видео не началась, вы можете получить доступ к видео по
          <a
            :href="videoUrl" target="_blank"
          >
            ссылке
          </a>
        </p>
      </NCard>
    </NCollapseTransition>
  </div>
</template>

<style lang="scss" scoped>
  .home-view {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__url-hint {
      text-align: center;
      font-weight: 400;
      font-size: 15px;
    }
  }
</style>
