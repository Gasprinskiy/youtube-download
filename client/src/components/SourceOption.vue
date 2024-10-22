<script setup lang="ts">
import { computed, type Component } from 'vue';

import { NIcon } from 'naive-ui';
import { LogoYoutube, LogoInstagram } from '@vicons/ionicons5';

import { DownloadSource } from '../api/types';
import OptionTemplate from './template/OptionTemplate.vue';
import type { DownloadSourceOption } from '../composables/use-download-source/types';

const props = defineProps<DownloadSourceOption>();

const iconComponent = computed<Component>(() => {
  switch (props.value) {
    case DownloadSource.YouTube:
      return LogoYoutube;

    case DownloadSource.Instagram:
      return LogoInstagram;

    default:
      return LogoYoutube;
  }
});
</script>

<template>
  <OptionTemplate class="download-option">
    <template #title>
      <NIcon
        :component="iconComponent"
        size="20"
      />
      <span>{{ props.label }}</span>
    </template>
  </OptionTemplate>
</template>
