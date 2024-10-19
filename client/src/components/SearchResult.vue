<script setup lang="ts">
import type { VNode } from 'vue';
import { computed, h, shallowRef } from 'vue';

import type { SelectOption } from 'naive-ui';
import {
  NCard,
  NImage,
  NInput,
  NSelect,
  NButton,
  NIcon,
} from 'naive-ui';
import { DownloadOutline } from '@vicons/ionicons5';

import DownloadOption from '../components/DownloadOption.vue';
import type { AppServiceVideoInfo, AppServiceVideoDownloadOptions } from '../api/types';

const props = defineProps<{
  data: AppServiceVideoInfo;
}>();

const emit = defineEmits<{
  onDownloadClicked: [option: {
    fileName: string;
    option: AppServiceVideoDownloadOptions;
  }];
}>();

const fileName = shallowRef<string>(props.data.name);
const chosenOptionID = shallowRef<string>(props.data.download_options[0].id);

const downloadOptions = computed<SelectOption[]>(() => props.data.download_options.map(option => ({
  label: option.quality.toString(),
  value: option.id,
})));

function renderLabel(option: SelectOption): VNode | undefined {
  const componentProps = props.data.download_options.find(item => item.id === option.value);
  if (!componentProps) {
    return;
  }

  return h(DownloadOption, {
    style: 'width: 100%',
    ...componentProps,
  });
}

function onDownloadClicked(): void {
  const chosenOption = props.data.download_options.find(option => option.id === chosenOptionID.value);
  if (!chosenOption) {
    return;
  }

  emit('onDownloadClicked', {
    fileName: fileName.value,
    option: chosenOption,
  });
}
</script>

<template>
  <div class="search-result">
    <NCard class="search-result__card">
      <template #cover>
        <div class="search-result__card_cover">
          <NImage
            class="search-result__card_image"
            :src="data?.preview_url"
            object-fit="contain"
            style="max-width: 100%;"
            lazy
          />
          <div class="search-result__card_data">
            <NInput
              v-model:value="fileName"
              placeholder="Введите название"
              size="large"
            />
            <div class="search-result__card_download-options">
              <NSelect
                v-model:value="chosenOptionID"
                :options="downloadOptions"
                :render-label="renderLabel"
                :default-value="data?.download_options[0].id"
              />
              <NButton
                type="primary"
                @click="onDownloadClicked"
              >
                <NIcon
                  :component="DownloadOutline"
                  size="20"
                />
              </NButton>
            </div>
          </div>
        </div>
      </template>
    </NCard>
  </div>
</template>

<style lang="scss" scoped>
  .search-result {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &__card {
      width: 100%;
      &_cover {
        width: 100%;
        display: flex;
      }

      &_image {
        width: 50%;
        min-width: 480px;
        height: 360px;
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

  @media (max-width: 850px) {
    .search-result {
      &__card {
        &_cover {
          flex-direction: column;
        }

        &_image {
          width: 100%;
          min-width: 250px;
          height: 250px;
        }

        &_data {
          width: unset;
        }
      }
    }
  }
</style>
