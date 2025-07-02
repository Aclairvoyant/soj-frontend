<template>
  <div class="announcement-view">
    <!-- 公告头部 -->
    <div class="announcement-header">
      <div class="header-info">
        <h3 class="title">最新公告</h3>
        <p class="subtitle">重要信息及时了解</p>
      </div>
      <div class="header-actions">
        <a-button type="text" size="small" @click="refreshAnnouncements">
          <template #icon>
            <icon-refresh />
          </template>
          刷新
        </a-button>
        <a-button type="text" size="small" @click="showAllAnnouncements">
          <template #icon>
            <icon-more />
          </template>
          更多
        </a-button>
      </div>
    </div>

    <!-- 公告内容 -->
    <div class="announcement-content" v-if="activeAnnouncement">
      <div class="announcement-card">
        <div class="announcement-badge">
          <icon-notification />
          <span>重要</span>
        </div>
        <div class="announcement-body">
          <h4 class="announcement-title">{{ activeAnnouncement.title }}</h4>
          <p class="announcement-text">{{ activeAnnouncement.content }}</p>
          <div class="announcement-meta">
            <span class="announcement-time">
              <icon-clock-circle />
              {{ formatTime(activeAnnouncement.createTime) }}
            </span>
            <span class="announcement-author" v-if="activeAnnouncement.user">
              <icon-user />
              {{ activeAnnouncement.user.userName }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 无公告状态 -->
    <div class="empty-state" v-else>
      <div class="empty-icon">
        <icon-notification />
      </div>
      <p class="empty-text">暂无公告</p>
    </div>

    <!-- 公告列表（如果有多个公告） -->
    <div class="announcement-list" v-if="announcements.length > 1">
      <div class="list-header">
        <span class="list-title">更多公告</span>
        <span class="list-count">({{ announcements.length }})</span>
      </div>
      <div class="list-items">
        <div 
          v-for="(announcement, index) in announcements.slice(1, 4)" 
          :key="announcement.id"
          class="list-item"
          :class="{ active: index === activeIndex - 1 }"
          @click="setActiveAnnouncement(index + 1)"
        >
          <div class="item-dot"></div>
          <div class="item-content">
            <div class="item-title">{{ announcement.title }}</div>
            <div class="item-time">{{ formatTime(announcement.createTime) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Service } from "../../../generated";
import { 
  IconRefresh, 
  IconMore, 
  IconNotification, 
  IconClockCircle, 
  IconUser 
} from '@arco-design/web-vue/es/icon';

const announcements = ref([]);
const activeIndex = ref(0);
const activeAnnouncement = ref(null);
const loading = ref(false);

// 加载数据并初始化激活公告
onMounted(async () => {
  await loadAnnouncements();
});

// 加载公告数据
const loadAnnouncements = async () => {
  loading.value = true;
  try {
    const res = await Service.getAllVisibleUsingGet();
    if (res.code === 200 && res.data.length > 0) {
      announcements.value = res.data;
      // 初始化显示第一个公告的内容
      activeAnnouncement.value = res.data[0];
      activeIndex.value = 0;
    }
  } catch (error) {
    console.error('加载公告失败:', error);
  } finally {
    loading.value = false;
  }
};

// 刷新公告
const refreshAnnouncements = async () => {
  await loadAnnouncements();
};

// 显示所有公告
const showAllAnnouncements = () => {
  // 这里可以跳转到公告列表页面
  console.log('显示所有公告');
};

// 设置激活的公告
const setActiveAnnouncement = (index) => {
  activeIndex.value = index;
  activeAnnouncement.value = announcements.value[index];
};

// 格式化时间
const formatTime = (time) => {
  const date = new Date(time);
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (hours < 1) {
    return '刚刚';
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return date.toLocaleDateString();
  }
};
</script>

<style lang="less" scoped>
.announcement-view {
  padding: 24px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

// 公告头部
.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-info {
  .title {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 4px 0;
    color: #1d2129;
  }
  
  .subtitle {
    font-size: 14px;
    margin: 0;
    color: #86909c;
  }
}

.header-actions {
  display: flex;
  gap: 8px;
  
  .arco-btn {
    color: #86909c;
    
    &:hover {
      color: #165dff;
      background: #e8f3ff;
    }
  }
}

// 公告内容
.announcement-content {
  margin-bottom: 24px;
}

.announcement-card {
  background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
  border: 1px solid #ffd591;
  border-radius: 16px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
  }
}

.announcement-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(250, 140, 22, 0.1);
  color: #fa8c16;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
  
  .arco-icon {
    font-size: 14px;
  }
}

.announcement-body {
  .announcement-title {
    font-size: 16px;
    font-weight: 600;
    color: #1d2129;
    margin: 0 0 12px 0;
    line-height: 1.4;
  }
  
  .announcement-text {
    font-size: 14px;
    color: #4e5969;
    line-height: 1.6;
    margin: 0 0 16px 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.announcement-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #86909c;
  
  .announcement-time,
  .announcement-author {
    display: flex;
    align-items: center;
    gap: 4px;
    
    .arco-icon {
      font-size: 14px;
    }
  }
}

// 空状态
.empty-state {
  text-align: center;
  padding: 40px 20px;
  
  .empty-icon {
    width: 64px;
    height: 64px;
    background: #f7f8fa;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    color: #c9cdd4;
    font-size: 24px;
  }
  
  .empty-text {
    font-size: 14px;
    color: #86909c;
    margin: 0;
  }
}

// 公告列表
.announcement-list {
  border-top: 1px solid #f2f3f5;
  padding-top: 20px;
  
  .list-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    
    .list-title {
      font-size: 16px;
      font-weight: 600;
      color: #1d2129;
    }
    
    .list-count {
      font-size: 12px;
      color: #86909c;
      background: #f7f8fa;
      padding: 2px 8px;
      border-radius: 12px;
    }
  }
}

.list-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f7f8fa;
  }
  
  &.active {
    background: #e8f3ff;
    
    .item-dot {
      background: #165dff;
    }
    
    .item-title {
      color: #165dff;
    }
  }
  
  .item-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #c9cdd4;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }
  
  .item-content {
    flex: 1;
    
    .item-title {
      font-size: 14px;
      font-weight: 500;
      color: #1d2129;
      margin-bottom: 4px;
      line-height: 1.4;
    }
    
    .item-time {
      font-size: 12px;
      color: #86909c;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .announcement-view {
    padding: 16px;
  }
  
  .announcement-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .announcement-card {
    padding: 16px;
  }
  
  .announcement-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .list-item {
    padding: 8px;
  }
}
</style>
