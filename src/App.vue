<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<style>
#app {
}
</style>

<style lang="less">
@import './theme/index.less';
</style>

<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import {onMounted} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();

const doInit = () => {
  console.log("欢迎来到SOJ");
};

onMounted(() => {
  doInit();
});

const debounce = (callback: (...args: any[]) => void, delay: number) => {
  let tid: any;
  return function (...args: any[]) {
    const ctx = self;
    tid && clearTimeout(tid);
    tid = setTimeout(() => {
      callback.apply(ctx, args);
    }, delay);
  };
};

const _ = (window as any).ResizeObserver;
(window as any).ResizeObserver = class ResizeObserver extends _ {
  constructor(callback: (...args: any[]) => void) {
    callback = debounce(callback, 20);
    super(callback);
  }
};
</script>
