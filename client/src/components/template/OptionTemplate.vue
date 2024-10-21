<template>
  <div class="option-template">
    <div class="option-template__title">
      <slot name="title" />
    </div>
    <slot name="subcontent" />
  </div>
</template>

<style lang="scss" scoped>
  .option-template {
    display: flex;
    justify-content: space-between;

    &__title {
      font-weight: 300;
      font-size: 15px;
      line-height: 20px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
</style>
