<script setup lang="ts">
import type { VNode } from 'vue';
import { computed, h, shallowRef } from 'vue';

import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

import type { FormValidationStatus } from 'naive-ui/es/form/src/interface';
import type { SelectOption } from 'naive-ui';
import {
  NCard,
  NImage,
  NInput,
  NSelect,
  NButton,
  NIcon,
  useMessage,
} from 'naive-ui';
import { DownloadOutline } from '@vicons/ionicons5';

import DownloadOption from '../components/DownloadOption.vue';
import type { AppServiceVideoInfo, AppServiceVideoDownloadOptions, DownloadSource } from '../api/types';

const props = defineProps<{
  data: AppServiceVideoInfo;
  source: DownloadSource;
}>();

const emit = defineEmits<{
  onDownloadClicked: [option: {
    fileName: string;
    option: AppServiceVideoDownloadOptions;
  }];
}>();

const message = useMessage();

const fileName = shallowRef<string>(props.data.name);
const fileNameNonFilled = shallowRef<boolean>(false);
const chosenOptionID = shallowRef<string>(props.data.download_options[0].id);

const downloadOptions = computed<SelectOption[]>(() => props.data.download_options.map(option => ({
  label: option.quality.toString(),
  value: option.id,
})));
const inputErrStatus = computed<FormValidationStatus>(() => fileNameNonFilled.value ? 'error' : 'success');

const validateRules = {
  fileName: { required },
};

const $v = useVuelidate(validateRules, { fileName });

function renderLabel(option: SelectOption): VNode | undefined {
  const componentProps = props.data.download_options.find(item => item.id === option.value);
  if (!componentProps) {
    return;
  }

  return h(DownloadOption, {
    style: 'width: 100%',
    ...componentProps,
    source: props.source,
  });
}

function onDownloadClicked(): void {
  $v.value.$validate();

  fileNameNonFilled.value = $v.value.$dirty && $v.value.$invalid;
  if (fileNameNonFilled.value) {
    message.error('Не введено название видео');
    return;
  }

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
  <form
    class="search-result"
    @submit.prevent.stop="onDownloadClicked"
  >
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
              :status="inputErrStatus"
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
                attr-type="submit"
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
  </form>
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
