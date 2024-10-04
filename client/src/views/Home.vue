<script setup lang="ts">
import { 
  NCard, 
  NCollapseTransition, 
  useLoadingBar, 

  useNotification,
} from 'naive-ui';

import SearchInput from '../components/SearchInput.vue'
// import DownloadOption from '../components/DownloadOption.vue'

import {  getDownloadOptions } from '../api';
import { computed, shallowRef } from 'vue';
import { AppServiceVideoInfo } from '../api/types';
import SearchResult from '../components/SearchResult.vue';

const notification = useNotification()
const loading = useLoadingBar()

const data = shallowRef<AppServiceVideoInfo | null>(null)
const fileName = shallowRef<string>('')
const currentUrl = shallowRef<string>('')
const chosenOptionID = shallowRef<string | undefined>()

const showData = computed<boolean>(() => data.value !== null)
// const downloadOptions = computed<SelectOption[]>(() => {
//   return data.value ? mapDownloadOptions(data.value.download_options) : []
// })

async function onInputSubmit(url: string) {  
  data.value = null
  currentUrl.value = url

  loading.start()

  try {
    const options = await getDownloadOptions(url)

    data.value = options
    fileName.value = options.name
    chosenOptionID.value = options.download_options[0].id

    loading.finish()
  } catch(e) {
    notification.error({
      title: 'Внутренняя ошибка сервера, попробуйте позже',
      duration: 3000
    })

    loading.error()
  }
}

// async function onDownloadClicked() {
//   loading.start()
//   try {    
//     const chosenOption = data.value?.download_options.find(option => option.id === chosenOptionID.value)
//     console.log(chosenOption);
    
//     const link = await getDownloadLink({
//       id: chosenOptionID.value || '',
//       quality: chosenOption?.quality || 360,
//       file_name: fileName.value || 'suka'
//     })
//     console.log('link: ', link);
    
//     loading.finish()
//   } catch(e) {
//     notification.error({
//       title: 'Внутренняя ошибка сервера, попробуйте позже',
//       duration: 3000
//     })
//     loading.error()
//   }
// }

// function mapDownloadOptions(data: AppServiceVideoDownloadOptions[]): SelectOption[] {
//   return data.map(option => ({
//     label: option.quality.toString(),
//     value: option.id
//   }))
// }

// function renderLabel(option: SelectOption): VNode | undefined {
//   const props = data.value?.download_options.find(item => item.id === option.value)
//   if (!props) {
//     return
//   }

//   return h(DownloadOption, 
//     { 
//       style: 'width: 100%',
//       ...props 
//     }
//   )
// }
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


