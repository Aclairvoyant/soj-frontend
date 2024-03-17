<template>
  <div id="homeView">
    <a-row :gutter="24">
      <a-col :span="18">
        <a-space direction="vertical" size="large">
          <CarouselView />
          <PostView />
        </a-space>
      </a-col>

      <a-col :span="6">
        <a-space direction="vertical" size="large">
          <AnnouncementView />
          <a-calendar v-model="value" />
          <div>select: {{ value }}</div>
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>


import { ref } from 'vue';
import PostView from "@/views/home/PostView.vue";
import AnnouncementView from "@/views/home/AnnouncementView.vue";
import CarouselView from "@/views/home/CarouselView.vue";

const value = ref(new Date());
</script>

<style scoped>
#homeView {
  max-width: 1440px;
  margin: 0 auto;
}
</style>
