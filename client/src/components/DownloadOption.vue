<script lang="ts" setup>
import type { Component } from 'vue';
import { computed } from 'vue';

import { NIcon } from 'naive-ui';
import { LogoYoutube, LogoInstagram } from '@vicons/ionicons5';

import { type AppServiceVideoDownloadOptions, DownloadSource } from '../api/types';
import OptionTemplate from './template/OptionTemplate.vue';

const props = defineProps<
AppServiceVideoDownloadOptions & { source?: DownloadSource }
>();

const iconComponent = computed<Component>(() => {
  switch (props.source) {
    case DownloadSource.YouTube:
      return LogoYoutube;

    case DownloadSource.Instagram:
      return LogoInstagram;

    default:
      return LogoYoutube;
  }
});
const title = computed<string>(() => {
  if (!props.fps) {
    return `${props.quality}p [${props.extension}]`;
  }
  return `${props.quality}p/${props.fps}FPS[${props.extension}]`;
});
const formattedSize = computed<string | undefined>(() => {
  if (!props.size) {
    return;
  }

  const size = Math.floor(props.size / 1_000_000);
  return `~ ${size} МБ`;
});
</script>

<template>
  <OptionTemplate class="download-option">
    <template #title>
      <NIcon
        :component="iconComponent"
        size="20"
      />
      <span>{{ title }}</span>
    </template>
    <template #subcontent>
      <div v-if="formattedSize" class="download-option__size">
        {{ formattedSize }}
      </div>
    </template>
  </OptionTemplate>
</template>

<style lang="scss" scoped>
  @media (max-width: 370px) {
    .download-option {
      &__size {
        display: none;
      }
    }
  }
</style>
