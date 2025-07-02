<template>
  <div class="quick-navigation">
    <div class="nav-header">
      <h3 class="title">快速导航</h3>
      <p class="subtitle">常用功能一键直达</p>
    </div>

    <div class="nav-grid">
      <div 
        v-for="item in navItems" 
        :key="item.key"
        class="nav-item"
        @click="handleNavClick(item)"
      >
        <div class="nav-icon" :style="{ background: item.color }">
          <component :is="item.icon" />
        </div>
        <div class="nav-info">
          <div class="nav-title">{{ item.title }}</div>
          <div class="nav-desc">{{ item.description }}</div>
        </div>
        <div class="nav-arrow">
          <icon-right />
        </div>
      </div>
    </div>

    <!-- 最近访问 -->
    <div class="recent-section" v-if="recentItems.length > 0">
      <h4 class="recent-title">最近访问</h4>
      <div class="recent-list">
        <div 
          v-for="item in recentItems" 
          :key="item.id"
          class="recent-item"
          @click="handleRecentClick(item)"
        >
          <div class="recent-icon">
            <icon-file />
          </div>
          <div class="recent-info">
            <div class="recent-name">{{ item.name }}</div>
            <div class="recent-time">{{ formatTime(item.lastVisit) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  IconCode, 
  IconBook, 
  IconMessage, 
  IconTrophy, 
  IconUser, 
  IconSettings,
  IconRight,
  IconFile
} from '@arco-design/web-vue/es/icon';

const router = useRouter();

// 导航项配置
const navItems = ref([
  {
    key: 'questions',
    title: '题目列表',
    description: '浏览和练习编程题目',
    icon: 'IconCode',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    path: '/questions'
  },
  {
    key: 'problemsets',
    title: '题单管理',
    description: '创建和管理题目集合',
    icon: 'IconBook',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    path: '/problemsets'
  },
  {
    key: 'posts',
    title: '讨论区',
    description: '分享经验和交流讨论',
    icon: 'IconMessage',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    path: '/posts'
  },
  {
    key: 'workplace',
    title: '个人中心',
    description: '查看学习数据和统计',
    icon: 'IconTrophy',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    path: '/workplace'
  },
  {
    key: 'profile',
    title: '个人资料',
    description: '管理个人信息和设置',
    icon: 'IconUser',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    path: '/profile'
  },
  {
    key: 'settings',
    title: '系统设置',
    description: '配置系统偏好设置',
    icon: 'IconSettings',
    color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    path: '/settings'
  }
]);

// 最近访问项目（模拟数据）
const recentItems = ref([
  {
    id: 1,
    name: '两数之和',
    type: 'question',
    lastVisit: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
    path: '/question/1'
  },
  {
    id: 2,
    name: '算法基础题单',
    type: 'problemset',
    lastVisit: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
    path: '/problemset/1'
  },
  {
    id: 3,
    name: '如何提高编程效率？',
    type: 'post',
    lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
    path: '/post/1'
  }
]);

// 处理导航点击
const handleNavClick = (item) => {
  router.push(item.path);
};

// 处理最近访问点击
const handleRecentClick = (item) => {
  router.push(item.path);
};

// 格式化时间
const formatTime = (time) => {
  const now = new Date();
  const diff = now - time;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (hours < 1) {
    return '刚刚';
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return time.toLocaleDateString();
  }
};
</script>

<style lang="less" scoped>
.quick-navigation {
  padding: 24px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

// 导航头部
.nav-header {
  margin-bottom: 24px;
  
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

// 导航网格
.nav-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: #f7f8fa;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e8f3ff;
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(22, 93, 255, 0.1);
  }
  
  .nav-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
    flex-shrink: 0;
  }
  
  .nav-info {
    flex: 1;
    
    .nav-title {
      font-size: 16px;
      font-weight: 600;
      color: #1d2129;
      margin-bottom: 4px;
    }
    
    .nav-desc {
      font-size: 12px;
      color: #86909c;
      line-height: 1.4;
    }
  }
  
  .nav-arrow {
    color: #c9cdd4;
    font-size: 16px;
    transition: all 0.3s ease;
  }
  
  &:hover .nav-arrow {
    color: #165dff;
    transform: translateX(4px);
  }
}

// 最近访问区域
.recent-section {
  border-top: 1px solid #f2f3f5;
  padding-top: 20px;
  
  .recent-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 16px 0;
    color: #1d2129;
  }
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-item {
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
  
  .recent-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #e8f3ff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #165dff;
    font-size: 14px;
    flex-shrink: 0;
  }
  
  .recent-info {
    flex: 1;
    
    .recent-name {
      font-size: 14px;
      font-weight: 500;
      color: #1d2129;
      margin-bottom: 2px;
    }
    
    .recent-time {
      font-size: 12px;
      color: #86909c;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .quick-navigation {
    padding: 16px;
  }
  
  .nav-item {
    padding: 12px;
    
    .nav-icon {
      width: 40px;
      height: 40px;
      font-size: 16px;
    }
    
    .nav-info .nav-title {
      font-size: 14px;
    }
  }
  
  .recent-item {
    padding: 8px;
    
    .recent-icon {
      width: 28px;
      height: 28px;
      font-size: 12px;
    }
  }
}
</style> 