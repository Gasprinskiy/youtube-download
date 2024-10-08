<script lang="ts" setup>
import { computed } from 'vue';

import { NIcon } from 'naive-ui';
import { LogoYoutube } from '@vicons/ionicons5';

import type { AppServiceVideoDownloadOptions } from '../api/types';

const props = defineProps<AppServiceVideoDownloadOptions>();

const title = computed<string>(() => `${props.quality}p/${props.fps}FPS[${props.extension}]`);
const formattedSize = computed<string>(() => {
  const size = Math.floor(props.size / 1_000_000);
  return `~ ${size} МБ`;
});
</script>

<template>
  <div class="download-option">
    <div class="download-option__title">
      <NIcon
        :component="LogoYoutube"
        size="20"
      />
      <span>{{ title }}</span>
    </div>
    <div class="download-option__size">
      {{ formattedSize }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .download-option {
    display: flex;
    justify-content: space-between;

    &__title,
    &__size {
      font-weight: 300;
      font-size: 15px;
      line-height: 20px;
    }

    &__title {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
</style>
