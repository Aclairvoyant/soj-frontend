<template>
  <a-card :style="{ width: '360px' }" title="公告">
    <template #extra>
      <a-link>More</a-link>
    </template>
<!--    <a-carousel-->
<!--        @change="handleCarouselChange"-->
<!--        dotPosition="bottom"-->
<!--        arrows-->
<!--        :autoplay="false"-->
<!--    >-->
<!--      <a-carousel-item v-for="(announcement) in announcements" :key="announcement.id">-->
<!--        &lt;!&ndash; 只展示标题，点击切换显示内容 &ndash;&gt;-->
<!--        <div>{{ announcement.title }}</div>-->
<!--      </a-carousel-item>-->
<!--    </a-carousel>-->
    <!-- 在轮播组件外展示当前激活公告的详细信息 -->
    <div class="announcement-details" v-if="activeAnnouncement">
      <h3>{{ activeAnnouncement.title }}</h3>
      <p>{{ activeAnnouncement.content }}</p>
      <span>{{ formatTime(activeAnnouncement.createTime) }}</span>
    </div>
  </a-card>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import { AnnouncementControllerService } from "../../../generated";

const announcements = ref([]);
const activeIndex = ref(0); // 存储当前激活公告的索引
const activeAnnouncement = ref(null); // 当前激活的公告详细信息

// 加载数据并初始化激活公告
onMounted(async () => {
  const res = await AnnouncementControllerService.getAllVisibleUsingGet();
  if (res.code === 200 && res.data.length > 0) {
    announcements.value = res.data;
    // 初始化显示第一个公告的内容
    activeAnnouncement.value = res.data[0];
  }
});

// 处理轮播切换事件
const handleCarouselChange = (currentSlide) => {
  activeIndex.value = currentSlide;
  activeAnnouncement.value = announcements.value[currentSlide];
};

const formatTime = (time) => {
  return new Date(time).toLocaleDateString();
};
</script>

<style scoped>
/* 确保父容器没有限制内容的大小 */
.a-card {
  display: flex;
  flex-direction: column;
  align-items: stretch; /* 子项拉伸填满容器宽度 */
}

.announcement-details {
  margin-top: 20px;
}
</style>
