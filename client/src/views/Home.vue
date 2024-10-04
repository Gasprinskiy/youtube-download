<script setup lang="ts">
import { computed, shallowRef } from 'vue';

import { NCard, NCollapseTransition, useLoadingBar, useNotification } from 'naive-ui';

import SearchInput from '../components/SearchInput.vue';
import { getDownloadOptions } from '../api';
import type { AppServiceVideoInfo } from '../api/types';
import SearchResult from '../components/SearchResult.vue';

const notification = useNotification();
const loading = useLoadingBar();

const data = shallowRef<AppServiceVideoInfo | null>(null);
const fileName = shallowRef<string>('');
const currentUrl = shallowRef<string>('');
const chosenOptionID = shallowRef<string | undefined>();

const showData = computed<boolean>(() => data.value !== null);

async function onInputSubmit(url: string): Promise<void> {
  data.value = null;
  currentUrl.value = url;

  loading.start();

  try {
    const options = await getDownloadOptions(url);

    data.value = options;
    fileName.value = options.name;
    chosenOptionID.value = options.download_options[0].id;

    loading.finish();
  } catch (e) {
    notification.error({
      title: 'Внутренняя ошибка сервера, попробуйте позже',
      duration: 3000,
    });
    console.error(e);
    loading.error();
  }
}
</script>

<template>
  <div class="home-view">
    <NCard>
      <SearchInput
        @on-submit="onInputSubmit"
      />
    </NCard>
    <NCollapseTransition :show="showData">
      <SearchResult
        v-if="data"
        :data="data"
      />
    </NCollapseTransition>
  </div>
</template>

<style lang="scss" scoped>
  .home-view {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__result {
      width: 100%;
      &_cover {
        width: 100%;
        display: flex;
      }

      &_image {
        width: 50%;
        min-width: 480px;
      }

      &_data {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 10px;
        gap: 15px;
      }

      &_download-options {
        display: flex;
        gap: 8px;
      }
    }
  }
</style>
