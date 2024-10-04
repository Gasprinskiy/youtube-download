<script setup lang="ts">
import { shallowRef } from 'vue';

import {
  NLoadingBarProvider,
  NConfigProvider,
  NNotificationProvider,
  NMessageProvider,
  NGlobalStyle,
  NLayoutHeader,
  NScrollbar,
  NSwitch,
  NIcon,

  darkTheme,
  lightTheme,
} from 'naive-ui';
import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface';
import { MoonOutline, SunnyOutline, LogoYoutube } from '@vicons/ionicons5';

const currentThemeSwitchValue = shallowRef<boolean>(true);
const currentTheme = shallowRef<BuiltInGlobalTheme>(darkTheme);

function onChangeTheme(value: boolean): void {
  currentTheme.value = value ? darkTheme : lightTheme;
}
</script>

<template>
  <NConfigProvider :theme="currentTheme">
    <NLoadingBarProvider>
      <NNotificationProvider>
        <NMessageProvider placement="bottom">
          <div class="app-container">
            <NLayoutHeader class="app-container__header">
              <h1 class="app-container__title">
                Скачать из
                <span>
                  <NIcon
                    :component="LogoYoutube"
                    size="30"
                  />
                  YouTube
                </span>
              </h1>
              <NSwitch
                v-model:value="currentThemeSwitchValue"
                size="large"
                @update-value="onChangeTheme"
              >
                <template #checked-icon>
                  <NIcon :component="MoonOutline" />
                </template>
                <template #unchecked-icon>
                  <NIcon :component="SunnyOutline" />
                </template>
              </NSwitch>
            </NLayoutHeader>
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

    &__header {
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__title {
      padding: 0;
      margin: 0;
      display: flex;
      align-items: center;
      font-weight: 500;
      gap: 8px;
      span {
        display: flex;
        align-items: center;
        gap: 5px;
        font-weight: 600;
      }
    }

    &__inner {
      max-width: 1000px;
      padding: 30px 20px;
      margin: auto;
    }
  }
</style>
