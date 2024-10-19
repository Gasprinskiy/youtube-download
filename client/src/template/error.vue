<script setup lang="ts">
import { NConfigProvider, NGlobalStyle, darkTheme } from 'naive-ui';
</script>

<template>
  <NConfigProvider :theme="darkTheme">
    <div class="error-template">
      <slot />
    </div>
    <NGlobalStyle />
  </NConfigProvider>
</template>

<style lang="scss" scoped>
  .error-template {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
