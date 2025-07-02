<template>
  <div id="homeView">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">欢迎来到 SOJ 在线判题系统</h1>
        <p class="page-subtitle">提升编程技能，挑战自我极限</p>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <div class="stat-number">{{ todayStats.submissions }}</div>
          <div class="stat-label">今日提交</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ todayStats.solved }}</div>
          <div class="stat-label">已解决</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ todayStats.users }}</div>
          <div class="stat-label">在线用户</div>
        </div>
      </div>
    </div>

    <a-row :gutter="24" class="main-content">
      <a-col :span="18">
        <!-- 轮播图区域 -->
        <div class="carousel-section">
          <CarouselView />
        </div>
        
        <!-- 帖子列表区域 -->
        <div class="posts-section">
          <PostView />
        </div>
      </a-col>

      <a-col :span="6">
        <a-space direction="vertical" size="large" class="sidebar">
          <!-- 公告区域 -->
          <div class="sidebar-card">
            <AnnouncementView />
          </div>
          
          <!-- 打卡签到区域 -->
          <div class="sidebar-card">
            <CheckInCalendar 
              :checkInDays="checkInDays" 
              :todayChecked="todayChecked"
              @check-in="handleCheckIn"
            />
          </div>
          
          <!-- 快速导航区域 -->
          <div class="sidebar-card">
            <QuickNavigation />
          </div>
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PostView from "@/views/home/PostView.vue";
import AnnouncementView from "@/views/home/AnnouncementView.vue";
import CarouselView from "@/views/home/CarouselView.vue";
import CheckInCalendar from "@/components/CheckInCalendar.vue";
import QuickNavigation from "@/components/QuickNavigation.vue";

// 今日统计数据
const todayStats = ref({
  submissions: 128,
  solved: 45,
  users: 89
});

// 打卡相关数据
const checkInDays = ref([]);
const todayChecked = ref(false);

// 处理打卡签到
const handleCheckIn = async () => {
  try {
    // 这里可以调用后端API进行打卡
    // const res = await Service.checkIn();
    
    // 模拟打卡成功
    todayChecked.value = true;
    const today = new Date();
    checkInDays.value.push(today.toISOString().split('T')[0]);
    
    // 显示成功提示
    // message.success('打卡成功！');
  } catch (error) {
    // message.error('打卡失败，请重试');
  }
};

// 初始化打卡数据
onMounted(() => {
  // 模拟获取打卡历史数据
  const today = new Date();
  const mockCheckInDays = [];
  
  // 生成最近30天的随机打卡数据
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // 随机生成打卡记录（80%的概率打卡）
    if (Math.random() < 0.8) {
      mockCheckInDays.push(dateStr);
    }
  }
  
  checkInDays.value = mockCheckInDays;
  
  // 检查今天是否已打卡
  const todayStr = today.toISOString().split('T')[0];
  todayChecked.value = mockCheckInDays.includes(todayStr);
});
</script>

<style lang="less" scoped>
#homeView {
  width: 100%;
  margin: 0;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  box-sizing: border-box;
}

// 页面头部样式
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 32px;
  color: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: float 6s ease-in-out infinite;
  }
}

.header-content {
  position: relative;
  z-index: 2;
  margin-bottom: 32px;
}

.page-title {
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 12px 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
  font-weight: 400;
}

.header-stats {
  display: flex;
  gap: 40px;
  position: relative;
  z-index: 2;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.2);
  }
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
  font-weight: 500;
}

// 主内容区域
.main-content {
  position: relative;
  z-index: 1;
}

// 轮播图区域
.carousel-section {
  margin-bottom: 32px;
  
  :deep(.arco-carousel) {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
}

// 帖子列表区域
.posts-section {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  :deep(.arco-form) {
    margin-bottom: 24px;
  }
  
  :deep(.arco-list) {
    .arco-list-item {
      border-radius: 12px;
      margin-bottom: 16px;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

// 侧边栏样式
.sidebar {
  .sidebar-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }
  }
}

// 动画效果
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .header-stats {
    gap: 20px;
  }
  
  .stat-item {
    padding: 16px;
  }
  
  .stat-number {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  #homeView {
    padding: 16px;
  }
  
  .page-header {
    padding: 24px;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
  
  .header-stats {
    flex-direction: column;
    gap: 16px;
  }
  
  .posts-section {
    padding: 20px;
  }
}
</style>
