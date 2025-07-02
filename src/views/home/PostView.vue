<template>
  <div class="post-view">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-header">
        <h3 class="section-title">社区讨论</h3>
        <p class="section-subtitle">分享经验，交流学习心得</p>
      </div>
      
      <div class="search-form">
        <a-form :model="searchParams" layout="inline" class="modern-search-form">
          <a-form-item field="searchText" class="search-input-wrapper">
            <a-input 
              v-model="searchParams.searchText" 
              placeholder="搜索帖子内容..." 
              class="search-input"
              size="large"
            >
              <template #prefix>
                <icon-search />
              </template>
            </a-input>
    </a-form-item>
    <a-form-item>
            <a-button 
              type="primary" 
              size="large" 
              @click="doSubmit"
              class="search-btn"
              :loading="searching"
            >
              <template #icon>
                <icon-search />
              </template>
              搜索
            </a-button>
    </a-form-item>
  </a-form>
      </div>
    </div>

    <!-- 帖子列表 -->
    <div class="posts-list">
  <a-list
        class="modern-posts-list"
      :bordered="false"
      :data="posts"
      :pagination-props="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
          showJumper: true,
          showPageSize: true,
          pageSizeOptions: [10, 20, 50],
          pageSizePosition: 'right'
        }"
      @page-change="onPageChange"
        :loading="loading"
  >
    <a-list-item
          class="post-item"
        v-for="post in posts"
        :key="post.id"
    >
          <div class="post-content">
            <!-- 用户信息 -->
            <div class="post-header">
              <div class="user-info">
                <a-avatar shape="circle" size="large" class="user-avatar">
            <img alt="avatar" :src="post.user?.userAvatar" />
          </a-avatar>
                <div class="user-details">
                  <div class="username">{{ post.user?.userName || '匿名用户' }}</div>
                  <div class="post-time">{{ formatTime(post.createTime || '') }}</div>
                </div>
              </div>
              <div class="post-actions">
                <a-button 
                  type="text" 
                  size="small" 
                  @click="goToPostDetail(post)"
                  class="action-btn"
                >
                  <template #icon>
                    <icon-eye />
                  </template>
                  查看详情
                </a-button>
                <a-button 
                  type="text" 
                  size="small" 
                  @click.stop="toggleContent(post)"
                  class="action-btn"
                >
                  <template #icon>
                    <icon-fullscreen />
        </template>
                  {{ post.isExpanded ? '收起' : '展开' }}
                </a-button>
              </div>
            </div>

            <!-- 帖子内容 -->
            <div class="post-body">
              <h4 class="post-title">{{ post.title }}</h4>
              <div class="post-text" :class="{ expanded: post.isExpanded }">
                {{ post.isExpanded ? (post.content || '') : (post.content || '').substring(0, 200) + ((post.content || '').length > 200 ? '...' : '') }}
              </div>
            </div>

            <!-- 帖子统计 -->
            <div class="post-stats">
              <div class="stat-item" @click="onLikeChange(post.id)">
                <div class="stat-icon" :class="{ active: post.liked }">
                  <icon-heart-fill v-if="post.liked" />
                  <icon-heart v-else />
                </div>
                <span class="stat-number">{{ post.thumbNum }}</span>
              </div>
              <div class="stat-item" @click="onStarChange(post.id)">
                <div class="stat-icon" :class="{ active: post.starred }">
                  <icon-star-fill v-if="post.starred" />
                  <icon-star v-else />
                </div>
                <span class="stat-number">{{ post.favourNum }}</span>
              </div>
              <div class="stat-item">
                <div class="stat-icon">
                  <icon-message />
                </div>
                <span class="stat-number">{{ (post as any).commentNum || 0 }}</span>
              </div>
          </div>
          </div>
    </a-list-item>
  </a-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Post, Service,
} from "../../../generated";
import { useRouter } from "vue-router";
import { 
  IconSearch, 
  IconEye, 
  IconFullscreen, 
  IconHeart, 
  IconHeartFill, 
  IconStar, 
  IconStarFill, 
  IconMessage 
} from '@arco-design/web-vue/es/icon';

// 定义帖子类型
interface PostWithStatus extends Post {
  liked: boolean;
  starred: boolean;
  isExpanded?: boolean;
  user?: {
    userName?: string;
    userAvatar?: string;
  };
}

const posts = ref<PostWithStatus[]>([]);
const loading = ref(false);
const searching = ref(false);
const total = ref(0);

const toggleContent = (post: PostWithStatus) => {
  post.isExpanded = !post.isExpanded;
};

const searchParams = ref({
  pageSize: 10,
  current: 1,
  title: "",
  content: "",
  searchText: "",
  tags: [],
});

const doSubmit = async() => {
  searching.value = true;
  try {
  const res = await Service.searchPostVoByPageUsingPost(
    searchParams.value
  );
  if (res.code === 200) {
    total.value = res.data?.total ?? 0;
      posts.value = res.data?.records.map((post: Post) => ({
      ...post,
      liked: false,
      starred: false,
      })) || [];
    await Promise.all(
      posts.value.map(async (post) => {
        await checkLike(post.id, post);
        await checkStar(post.id, post);
      })
    );
    }
  } finally {
    searching.value = false;
  }
};

const fetchPostsAndCheckStatus = async () => {
  loading.value = true;
  try {
  const res = await Service.listPostVoByPageUsingPost(
    searchParams.value
  );

  if (res.code === 200) {
    total.value = res.data?.total ?? 0;
    // 初始化帖子列表，为每个帖子增加 liked 和 starred 属性
      posts.value = res.data?.records.map((post: Post) => ({
      ...post,
      liked: false,
      starred: false,
      })) || [];

    // 为每个帖子检查点赞和收藏状态
    await Promise.all(
      posts.value.map(async (post) => {
        await checkLike(post.id, post);
        await checkStar(post.id, post);
      })
    );
    }
  } finally {
    loading.value = false;
  }
};

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  fetchPostsAndCheckStatus();
});

const checkLike = async (id: number | undefined, post: PostWithStatus) => {
  if (id === undefined) return;
  const res = await Service.checkThumbUsingPost(id);
  // 直接在对应帖子对象上更新状态
  post.liked = res.data;
};

const checkStar = async (id: number | undefined, post: PostWithStatus) => {
  if (id === undefined) return;
  const res = await Service.checkFavourUsingPost(id);
  // 直接在对应帖子对象上更新状态
  post.starred = res.data;
};

const onLikeChange = async (id: number | undefined) => {
  if (id === undefined) return;
  await Service.doThumbUsingPost({
    postId: id,
  });
  // 再次检查更新点赞状态
  const post = posts.value.find((post) => post.id === id);
  if (post) {
    await checkLike(id, post);
  }
};

const onStarChange = async (id: number | undefined) => {
  if (id === undefined) return;
  await Service.doPostFavourUsingPost({
    postId: id,
  });
  // 再次检查更新收藏状态
  const post = posts.value.find((post) => post.id === id);
  if (post) {
    await checkStar(id, post);
  }
};

onMounted(async () => {
  await fetchPostsAndCheckStatus();
});

const router = useRouter();
const goToPostDetail = (post: Post) => {
  router.push({
    path: `/post/${post.id}`,
  });
};

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
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
.post-view {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

// 搜索区域
.search-section {
  padding: 32px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid #f1f5f9;
}

.search-header {
  margin-bottom: 24px;
  
  .section-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #1d2129;
  }
  
  .section-subtitle {
    font-size: 14px;
  margin: 0;
    color: #86909c;
  }
}

.search-form {
  .modern-search-form {
    display: flex;
    gap: 16px;
    align-items: center;
    
    .search-input-wrapper {
      flex: 1;
      margin-bottom: 0;
    }
    
    .search-input {
      border-radius: 12px;
      border: 2px solid #e2e8f0;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #165dff;
      }
      
      &:focus-within {
        border-color: #165dff;
        box-shadow: 0 4px 12px rgba(22, 93, 255, 0.1);
      }
    }
    
    .search-btn {
      height: 48px;
      padding: 0 24px;
      border-radius: 12px;
      font-weight: 600;
      background: linear-gradient(135deg, #165dff 0%, #4080ff 100%);
      border: none;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(22, 93, 255, 0.3);
      }
    }
  }
}

// 帖子列表
.posts-list {
  padding: 32px;
}

.modern-posts-list {
  :deep(.arco-list-item) {
  padding: 0;
    border: none;
    margin-bottom: 24px;
  }
  
  :deep(.arco-pagination) {
    margin-top: 32px;
    justify-content: center;
  }
}

.post-item {
  background: #f8fafc;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
    background: white;
  }
}

.post-content {
  width: 100%;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .user-avatar {
    border: 3px solid #e2e8f0;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #165dff;
      transform: scale(1.05);
    }
  }
  
  .user-details {
    .username {
      font-size: 16px;
      font-weight: 600;
      color: #1d2129;
      margin-bottom: 4px;
    }
    
    .post-time {
      font-size: 12px;
      color: #86909c;
    }
  }
}

.post-actions {
  display: flex;
  gap: 8px;
  
  .action-btn {
    color: #86909c;
    border-radius: 8px;
    
    &:hover {
      color: #165dff;
      background: #e8f3ff;
    }
  }
}

.post-body {
  margin-bottom: 20px;
  
  .post-title {
    font-size: 18px;
    font-weight: 600;
    color: #1d2129;
    margin: 0 0 12px 0;
    line-height: 1.4;
}

  .post-text {
    font-size: 14px;
    color: #4e5969;
    line-height: 1.6;
    margin: 0;
    
    &.expanded {
      display: block;
    }
  }
}

.post-stats {
  display: flex;
  gap: 24px;
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      background: #e8f3ff;
    }
    
    .stat-icon {
      font-size: 16px;
      color: #86909c;
      transition: all 0.3s ease;
      
      &.active {
        color: #f53f3f;
        animation: pulse 0.6s ease;
      }
      
      &:hover {
        transform: scale(1.1);
      }
    }
    
    .stat-number {
      font-size: 14px;
      font-weight: 500;
      color: #1d2129;
    }
  }
}

// 动画效果
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .search-section,
  .posts-list {
    padding: 20px;
  }
  
  .search-form .modern-search-form {
    flex-direction: column;
    align-items: stretch;
    
    .search-btn {
      width: 100%;
    }
  }
  
  .post-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .post-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .post-stats {
    gap: 16px;
    
    .stat-item {
      padding: 6px 8px;
    }
  }
}
</style>
