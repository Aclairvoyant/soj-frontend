<template>
  <div class="message-badge">
    <!-- 主消息按钮 -->
    <a-badge :count="totalUnread" :dot="showDot" :offset="[10, 0]">
      <a-button
        type="text"
        shape="circle"
        @click="handleClick"
        :class="{ 'has-unread': totalUnread > 0 }"
        class="main-button"
      >
        <template #icon>
          <IconMessage />
        </template>
      </a-button>
    </a-badge>

    <!-- 下拉框触发器 -->
    <a-dropdown
      v-model:popup-visible="dropdownVisible"
      trigger="click"
      placement="br"
    >
      <a-button
        type="text"
        size="small"
        class="dropdown-trigger"
        :class="{ 'active': dropdownVisible }"
      >
        <template #icon>
          <IconDown :class="{ 'rotated': dropdownVisible }" />
        </template>
      </a-button>

      <template #content>
        <div class="message-dropdown" v-if="dropdownVisible">
          <div class="dropdown-header">
            <span class="title">消息通知</span>
            <a-button
              type="text"
              size="small"
              @click="goToMessageCenter"
            >
              查看全部
            </a-button>
          </div>

          <div class="message-list">
            <div v-if="loading" class="loading-state">
              <a-spin size="small" />
              <span>加载中...</span>
            </div>
            <div v-else-if="currentMessages.length === 0" class="empty-state">
              <div class="empty-icon">📭</div>
              <span>暂无消息</span>
            </div>
            <div v-else class="message-items">
              <div
                v-for="(message, index) in currentMessages"
                :key="message.id || `msg-${index}`"
                class="message-item"
                :class="{ 'unread': message.status === 0 }"
                @click="handleMessageClick(message)"
              >
                <div class="message-info">
                  <div class="message-title">{{ message.title || '消息' }}</div>
                  <div class="message-content">{{ message.content || '' }}</div>
                  <div class="message-time">{{ formatMessageTimeDisplay(message.createTime) }}</div>
                </div>
                <div class="message-actions">
                  <a-button type="text" size="small" @click.stop="markAsRead(message)">
                    <template #icon>
                      <IconCheck />
                    </template>
                  </a-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { IconMessage, IconDown, IconCheck } from '@arco-design/web-vue/es/icon';
import { UnifiedMessageVO, MessageCategory } from '@/types/message';
import { formatMessageTime } from '@/utils/messageUtils';

interface Props {
  showDot?: boolean;
  maxDisplay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  showDot: false,
  maxDisplay: 5
});

const router = useRouter();
const store = useStore();

// 响应式数据
const dropdownVisible = ref(false);
const activeTab = ref<string>('all');
const loading = ref(false);
const unreadMessages = ref<Record<string, UnifiedMessageVO[]>>({});

// 计算属性
const totalUnread = computed(() => {
  const count = store.state.message?.totalUnread;
  return typeof count === 'number' ? Math.max(0, count) : 0;
});
const unreadCount = computed(() => store.state.message?.unreadCount || {});


// 当前显示的消息
const currentMessages = computed(() => {
  try {
    if (!unreadMessages.value || typeof unreadMessages.value !== 'object') {
      return [];
    }
    
    const category = activeTab.value === 'all' ? 'all' : activeTab.value;
    const messages = unreadMessages.value[category] || [];
    
    // 确保消息数据的完整性
    const validMessages = Array.isArray(messages) ? 
      messages.filter(msg => msg && (msg.id || msg.title || msg.content)) : [];
    
    return validMessages.slice(0, props.maxDisplay);
  } catch (error) {
    console.error('Error computing current messages:', error);
    return [];
  }
});

// 处理点击事件 - 直接跳转到消息中心
const handleClick = () => {
  router.push('/message/center');
};

// 处理消息点击
const handleMessageClick = async (message: any) => {
  try {
    // 关闭下拉框
    dropdownVisible.value = false;
    
    // 如果是未读消息，先标记为已读
    if (message && message.id && message.status === 0) {
      await store.dispatch('message/markAsRead', message.id);
    }
    
    // 跳转到消息中心
    await router.push('/message/center');
  } catch (error) {
    console.error('Error handling message click:', error);
  }
};

// 标记为已读
const markAsRead = async (message: any) => {
  try {
    if (message && message.id) {
      await store.dispatch('message/markAsRead', message.id);
      // 重新加载消息
      await loadUnreadMessages(activeTab.value === 'all' ? undefined : activeTab.value as MessageCategory);
    }
  } catch (error) {
    console.error('Error marking message as read:', error);
  }
};

// 格式化消息时间
const formatMessageTimeDisplay = (time?: string): string => {
  if (!time) return '刚刚';
  return formatMessageTime(time);
};

// 加载未读消息
const loadUnreadMessages = async (category?: MessageCategory) => {
  try {
    loading.value = true;
    const messages = await store.dispatch('message/fetchUnreadMessages', {
      category,
      limit: props.maxDisplay * 2 // 加载更多消息以防不足
    });

    const key = category || 'all';
    
    // 确保数据是数组格式
    const validMessages = Array.isArray(messages) ? messages : [];
    
    unreadMessages.value = {
      ...unreadMessages.value,
      [key]: validMessages
    };
    
    console.log(`Loaded ${validMessages.length} messages for category: ${key}`);
  } catch (error) {
    console.error('Failed to load unread messages:', error);
    // 加载失败时设置空数组
    const key = category || 'all';
    unreadMessages.value = {
      ...unreadMessages.value,
      [key]: []
    };
  } finally {
    loading.value = false;
  }
};


// 跳转到消息中心
const goToMessageCenter = () => {
  dropdownVisible.value = false;
  router.push('/message/center');
};



// 监听未读数量变化，自动刷新当前标签页的消息
watch(unreadCount, () => {
  if (dropdownVisible.value) {
    loadUnreadMessages(activeTab.value === 'all' ? undefined : activeTab.value as MessageCategory);
  }
}, { deep: true });

// 监听下拉框显示状态
watch(dropdownVisible, (visible) => {
  if (visible) {
    loadUnreadMessages();
  }
});

// 组件挂载时更新未读数量
onMounted(async () => {
  try {
    await store.dispatch('message/updateUnreadCount');
  } catch (error) {
    console.warn('Failed to update unread count on mount:', error);
  }
});

// 组件卸载时清理
onUnmounted(() => {
  // 清理下拉框状态
  dropdownVisible.value = false;
  unreadMessages.value = {};
});
</script>

<style scoped lang="less">
.message-badge {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;

  .main-button {
    border: none;
    box-shadow: none;
    border-radius: 6px;
    transition: all 0.3s;

    &.has-unread {
      color: #1890ff;
      background: #f0f6ff;

      &:hover {
        color: #40a9ff;
        background: #e6f7ff;
      }
    }

    &:hover {
      background: rgba(0, 0, 0, 0.04);
    }
  }

  .dropdown-trigger {
    border: none;
    box-shadow: none;
    border-radius: 6px;
    width: 24px;
    height: 24px;
    padding: 0;
    transition: all 0.3s;

    &:hover {
      background: #f5f5f5;
    }

    &.active {
      background: #e6f7ff;
      color: #1890ff;
    }

    .rotated {
      transform: rotate(180deg);
      transition: transform 0.3s;
    }
  }
}

.message-dropdown {
  width: 360px;
  max-height: 480px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;

  .dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    background: #fafafa;

    .title {
      font-weight: 500;
      color: #262626;
    }
  }

  .message-list {
    max-height: 300px;
    overflow-y: auto;
  }

  .message-list {
    .loading-state,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: #8c8c8c;
      font-size: 14px;

      .arco-icon,
      .empty-icon {
        font-size: 24px;
        margin-bottom: 8px;
      }
    }

    .message-items {
      max-height: 300px;
      overflow-y: auto;

      .message-item {
        display: flex;
        align-items: flex-start;
        padding: 12px 16px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background: #f5f5f5;
        }

        &.unread {
          background: #f6ffed;
          border-left: 3px solid #52c41a;
        }

        .message-info {
          flex: 1;
          min-width: 0;

          .message-title {
            font-size: 14px;
            font-weight: 500;
            color: #262626;
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .message-content {
            font-size: 12px;
            color: #595959;
            margin-bottom: 4px;
            line-height: 1.4;
            word-break: break-all;
          }

          .message-time {
            font-size: 12px;
            color: #8c8c8c;
          }
        }

        .message-actions {
          flex-shrink: 0;
          margin-left: 8px;

          :deep(.arco-btn) {
            color: #52c41a;

            &:hover {
              background: rgba(82, 196, 26, 0.1);
            }
          }
        }
      }
    }

    .dropdown-footer {
      padding: 8px 16px;
      border-top: 1px solid #f0f0f0;
      text-align: center;
      background: #fafafa;

      :deep(.arco-btn) {
        color: #1890ff;
        font-size: 12px;

        &:hover {
          background: rgba(24, 144, 255, 0.1);
        }
      }
    }
  }
}

// 自定义滚动条样式
.message-items::-webkit-scrollbar {
  width: 4px;
}

.message-items::-webkit-scrollbar-track {
  background: #f0f0f0;
}

.message-items::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 2px;

  &:hover {
    background: #bfbfbf;
  }
}
</style>
