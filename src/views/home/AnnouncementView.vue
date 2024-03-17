<template>
  <a-card :style="{ width: '360px' }" title="公告">
    <template #extra>
      <a-link>More</a-link>
    </template>
    <p v-for="announcement in announcements" :key="announcement.id">
      {{ announcement.content }}
    </p>
  </a-card>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {AnnouncementControllerService} from "../../../generated";

const announcements = ref([]);

onMounted(() => {
  loadData();
});

const loadData = async () => {
  // 从API获取数据
  const res = await AnnouncementControllerService.getAllUsingGet();

  if (res.code === 200) {
    announcements.value = res.data;
  } else {
    console.error("通知加载失败，" + res.message);
  }
};
</script>
