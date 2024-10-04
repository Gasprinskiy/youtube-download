<script setup lang="ts">
import { computed, shallowRef } from 'vue';

import { NInput, NButton, NIcon, useMessage } from 'naive-ui';
import { SearchOutline } from '@vicons/ionicons5';
import { useVuelidate } from '@vuelidate/core';
import { required, url } from '@vuelidate/validators';
import type { FormValidationStatus } from 'naive-ui/es/form/src/interface';

const emit = defineEmits<{
  onSubmit: [url: string];
}>();

const message = useMessage();

const searchUrl = shallowRef<string>('');
const hasError = shallowRef<boolean>(false);

const inputErrStatus = computed<FormValidationStatus>(() => hasError.value ? 'error' : 'success');

const validateRules = {
  searchUrl: { required, url },
};

const $v = useVuelidate(validateRules, { searchUrl });

function onSubmit(): void {
  $v.value.$validate();

  hasError.value = $v.value.$dirty && $v.value.$invalid;

  if (hasError.value) {
    message.error('Не верный url видео');
    return;
  }

  emit('onSubmit', searchUrl.value);
}
</script>

<template>
  <div class="search-input">
    <NInput
      v-model:value="searchUrl"
      type="text"
      placeholder="Введите url видео"
      :status="inputErrStatus"
    />
    <NButton
      type="primary"
      @click="onSubmit"
    >
      <NIcon
        size="20"
        :component="SearchOutline"
      />
    </NButton>
  </div>
</template>

<style scoped lang="scss">
  .search-input {
    display: flex;
    gap: 8px;
  }
</style>
