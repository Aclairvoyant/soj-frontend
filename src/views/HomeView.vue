<template>
  <a-carousel
      :style="{ width: '66%', height: '540px' }"
      :auto-play="true"
      animation-name="fade"
      show-arrow="never"
  >
    <a-carousel-item v-for="image in images" :key="image.title">
      <img
          :src="image.url"
      :style="{ width: '100%' }"
      />
    </a-carousel-item>
  </a-carousel>
</template>


<script setup lang="ts">
import {ref} from "vue";

const images = ref([
  {
    title: "Image 1",
    url: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp",
  },
]);

</script>
