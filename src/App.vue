<script setup lang="ts">
import {NMessageProvider, NModalProvider} from 'naive-ui'
// 获取 vue-i18n 的实例
</script>

<template>
  <n-message-provider>
    <n-modal-provider>
      <div class="w-full h-full">
        <router-view></router-view>
      </div>
    </n-modal-provider>
  </n-message-provider>
</template>

<style scoped>

</style>
