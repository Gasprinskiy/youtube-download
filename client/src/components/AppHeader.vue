<script lang="ts" setup>
import type { VNode } from 'vue';
import { computed, h, shallowRef } from 'vue';

import type { SelectOption } from 'naive-ui';
import {
  NLayoutHeader,
  NSwitch,
  NIcon,
  NSelect,

  darkTheme,
  lightTheme,
} from 'naive-ui';
import { MoonOutline, SunnyOutline } from '@vicons/ionicons5';
import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface';

import { DownloadSourceOptions } from '../composables/use-download-source/constants';
import SourceOption from './SourceOption.vue';
import type { DownloadSource } from '../api/types';

const props = defineProps<{
  currentSource: DownloadSource;
}>();

const emit = defineEmits<{
  onChangeTheme: [theme: BuiltInGlobalTheme];
  onChangeSource: [source: DownloadSource];
}>();

const currentThemeSwitchValue = shallowRef<boolean>(true);
const isLightTheme = shallowRef<boolean>(false);

const options = computed<SelectOption[]>(() => DownloadSourceOptions.map(({ label, value }) => ({ label, value })));

function onChangeTheme(value: boolean): void {
  const theme = value ? darkTheme : lightTheme;
  emit('onChangeTheme', theme);

  if (theme.name === 'light') {
    setTimeout(() => {
      isLightTheme.value = true;
    }, 200);
    return;
  }
  isLightTheme.value = false;
}

function renderLabel(option: SelectOption): VNode | undefined {
  const props = DownloadSourceOptions.find(item => item.value === option.value);
  if (!props) {
    return;
  }

  return h(SourceOption, {
    style: 'width: 100%',
    ...props,
  });
}
</script>

<template>
  <NLayoutHeader
    class="app-header"
    :class="{ outlined: isLightTheme }"
  >
    <div class="app-header__title">
      <div class="app-header__label">
        Скачать из
      </div>
      <NSelect
        class="app-header__select"
        :options
        :default-value="props.currentSource"
        :render-label="renderLabel"
        @update-value="emit('onChangeSource', $event)"
      />
    </div>

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
</template>

<style lang="scss" scoped>
  .app-header {
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &.outlined {
      outline: 1px solid rgb(239, 239, 245);
    }

    &__title {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 40%;
    }

    &__select {
      width: 35%;
    }

    &__label {
      font-size: 18px;
      line-height: 20px;
      padding-bottom: 1px;
      font-weight: 500;
    }
  }
</style>
