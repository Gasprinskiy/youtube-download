<script setup lang="ts">
import {
  NLoadingBarProvider,
  NConfigProvider,
  NNotificationProvider,
  NMessageProvider,
  NGlobalStyle,
  NScrollbar,
} from 'naive-ui';

import AppHeader from '../components/AppHeader.vue';
import { useAppTheme } from '../composables/use-app-theme';
import { useDownloadSource } from '../composables/use-download-source';

const { currentTheme, setCurrentTheme } = useAppTheme();
const { currentSource, setCurrentSource } = useDownloadSource();
</script>

<template>
  <NConfigProvider :theme="currentTheme">
    <NLoadingBarProvider>
      <NNotificationProvider placement="top-left">
        <NMessageProvider placement="bottom">
          <div class="app-container">
            <AppHeader
              :key="currentSource"
              :current-source="currentSource"
              @on-change-theme="setCurrentTheme"
              @on-change-source="setCurrentSource"
            />

            <div class="app-container__inner">
              <NScrollbar>
                <slot />
              </NScrollbar>
            </div>
          </div>

          <NGlobalStyle />
        </NMessageProvider>
      </NNotificationProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>

<style lang="scss" scoped>
  .app-container {
    width: 100%;

    &__inner {
      max-width: 1000px;
      padding: 30px 20px;
      margin: auto;
    }
  }

  @media (max-width: 400px) {
    .app-container {

      &__title {
        font-size: 20px;
      }

    }
  }
</style>
