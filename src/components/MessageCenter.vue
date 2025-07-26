<template>
  <div class="message-center">
    <!-- 消息通知图标 -->
    <div class="message-trigger" @click="toggleMessageCenter">
      <a-badge :count="totalUnreadCount" :max-count="99">
        <a-button type="text" size="large">
          <template #icon>
            <BellOutlined />
          </template>
        </a-button>
      </a-badge>
    </div>

    <!-- 消息中心弹窗 -->
    <a-drawer
      v-model:visible="visible"
      title="消息中心"
      width="400"
      placement="right"
    >
      <!-- 分类标签 -->
      <div class="message-tabs">
        <a-radio-group
          v-model:value="activeCategory"
          type="button"
          size="small"
          @change="handleCategoryChange"
        >
          <a-radio value="">
            全部
            <a-badge v-if="totalUnreadCount > 0" :count="totalUnreadCount" />
          </a-radio>
          <a-radio
            v-for="(info, category) in categoryInfo"
            :key="category"
            :value="category"
          >
            {{ info.name }}
            <a-badge v-if="unreadCounts[category] > 0" :count="unreadCounts[category]" />
          </a-radio>
        </a-radio-group>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions">
        <a-space>
          <a-button
            size="small"
            @click="markAllAsRead"
            :disabled="totalUnreadCount === 0"
          >
            全部已读
          </a-button>
          <a-button
            size="small"
            @click="refreshMessages"
            :loading="loading"
          >
            刷新
          </a-button>
          <a-button
            size="small"
            @click="showSettings = true"
          >
            设置
          </a-button>
        </a-space>
      </div>

      <!-- 消息列表 -->
      <div class="message-list" v-loading="loading">
        <div v-if="messages.length === 0" class="empty-state">
          <a-empty description="暂无消息" />
        </div>

        <div v-else class="message-items">
          <div
            v-for="message in messages"
            :key="message.id"
            :class="['message-item', { 'unread': message.status === 0 }]"
            @click="handleMessageClick(message)"
          >
            <!-- 发送者头像 -->
            <div class="message-avatar">
              <a-avatar :size="36">
                <img v-if="message.senderAvatar" :src="message.senderAvatar" />
                <span v-else>{{ message.senderName?.charAt(0) || '系' }}</span>
              </a-avatar>
            </div>

            <!-- 消息内容 -->
            <div class="message-content">
              <div class="message-header">
                <span class="sender-name">{{ message.senderName || '系统' }}</span>
                <span class="message-time">{{ formatTime(message.createTime) }}</span>
              </div>

              <div class="message-title">{{ message.title }}</div>
              <div class="message-text">{{ message.content }}</div>

              <!-- 聚合信息 -->
              <div v-if="message.aggregateCount > 1" class="aggregate-info">
                <a-tag size="small" color="blue">
                  {{ message.aggregateCount }} 条相似消息
                </a-tag>
              </div>

              <!-- 消息标签 -->
              <div class="message-tags">
                <a-tag
                  :color="getCategoryColor(message.category)"
                  size="small"
                >
                  {{ getCategoryName(message.category) }}
                </a-tag>
                <a-tag
                  v-if="message.priority === '4'"
                  color="red"
                  size="small"
                >
                  紧急
                </a-tag>
                <a-tag
                  v-else-if="message.priority === '3'"
                  color="orange"
                  size="small"
                >
                  重要
                </a-tag>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="message-actions">
              <a-dropdown>
                <a-button type="text" size="small">
                  <MoreOutlined />
                </a-button>
                <template #content>
                  <a-doption
                    v-if="message.status === 0"
                    @click.stop="markAsRead(message.id)"
                  >
                    标记已读
                  </a-doption>
                  <a-doption
                    v-else
                    @click.stop="markAsUnread(message.id)"
                  >
                    标记未读
                  </a-doption>
                  <a-doption @click.stop="deleteMessage(message.id)">
                    删除消息
                  </a-doption>
                </template>
              </a-dropdown>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div v-if="hasMore" class="load-more">
          <a-button @click="loadMore" :loading="loadingMore">
            加载更多
          </a-button>
        </div>
      </div>
    </a-drawer>

    <!-- 设置弹窗 -->
    <a-modal
      v-model:visible="showSettings"
      title="消息推送设置"
      width="500"
      @ok="saveSettings"
    >
      <div class="settings-content">
        <!-- 总开关 -->
        <div class="setting-item">
          <div class="setting-label">启用消息推送</div>
          <a-switch v-model:checked="settings.enablePush" />
        </div>

        <!-- 分类开关 -->
        <div class="setting-group">
          <div class="setting-group-title">消息分类设置</div>
          <div
            v-for="(info, category) in categoryInfo"
            :key="category"
            class="setting-item"
          >
            <div class="setting-label">{{ info.name }}</div>
            <a-switch
              v-model:checked="settings.categories[category]"
              :disabled="!settings.enablePush"
            />
          </div>
        </div>

        <!-- 免打扰时间 -->
        <div class="setting-group">
          <div class="setting-group-title">
            免打扰时间
            <a-switch v-model:checked="settings.quietHours.enabled" />
          </div>
          <div v-if="settings.quietHours.enabled" class="quiet-hours">
            <a-time-picker
              v-model:value="quietStart"
              format="HH:mm"
              placeholder="开始时间"
            />
            <span style="margin: 0 8px;">至</span>
            <a-time-picker
              v-model:value="quietEnd"
              format="HH:mm"
              placeholder="结束时间"
            />
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { Message } from '@arco-design/web-vue';
import { BellOutlined, MoreOutlined } from '@ant-design/icons-vue';
import { MessageAPI } from '@/services/api/MessageAPI';
import { messageWebSocket, EnhancedMessageWebSocket } from '@/services/websocket/EnhancedWebSocketManager';
import { NewMessageVO, MessageCategory } from '@/types/message';
import dayjs from 'dayjs';

// 响应式数据
const visible = ref(false);
const loading = ref(false);
const loadingMore = ref(false);
const showSettings = ref(false);
const activeCategory = ref('');
const messages = ref<NewMessageVO[]>([]);
const currentPage = ref(1);
const pageSize = ref(20);
const hasMore = ref(true);

// 未读消息统计
const unreadCounts = reactive<Record<string, number>>({
  system: 0,
  social: 0,
  academic: 0,
  contest: 0,
  admin: 0
});

// 推送设置
const settings = reactive({
  enablePush: true,
  categories: {
    system: true,
    social: true,
    academic: true,
    contest: true,
    admin: true
  },
  quietHours: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00'
  }
});

const quietStart = ref();
const quietEnd = ref();

// 分类信息
const categoryInfo = {
  system: { name: '系统', color: 'blue' },
  social: { name: '社交', color: 'green' },
  academic: { name: '学术', color: 'purple' },
  contest: { name: '比赛', color: 'orange' },
  admin: { name: '管理', color: 'red' }
};

// 计算属性
const totalUnreadCount = computed(() => {
  return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
});

// 生命周期
onMounted(async () => {
  await loadUnreadCounts();
  await loadSettings();
  initWebSocket();

  // 请求通知权限
  if ('Notification' in window && Notification.permission === 'default') {
    await EnhancedMessageWebSocket.requestNotificationPermission();
  }
});

onUnmounted(() => {
  messageWebSocket.disconnect();
});

// 方法定义
const toggleMessageCenter = async () => {
  visible.value = !visible.value;
  if (visible.value && messages.value.length === 0) {
    await loadMessages();
  }
};

const loadMessages = async (reset = true) => {
  if (loading.value) return;

  loading.value = true;

  try {
    if (reset) {
      currentPage.value = 1;
      messages.value = [];
    }

    const response = await MessageAPI.getMessages({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      category: activeCategory.value || undefined,
      status: undefined // 加载所有状态的消息
    });

    if (response.code === 0) {
      const newMessages = response.data.records || [];

      if (reset) {
        messages.value = newMessages;
      } else {
        messages.value.push(...newMessages);
      }

      hasMore.value = currentPage.value < (response.data.pages || 1);
    }

  } catch (error) {
    console.error('加载消息失败:', error);
    Message.error('加载消息失败');
  } finally {
    loading.value = false;
  }
};

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return;

  loadingMore.value = true;
  currentPage.value++;

  try {
    await loadMessages(false);
  } finally {
    loadingMore.value = false;
  }
};

const loadUnreadCounts = async () => {
  try {
    const response = await MessageAPI.getUnreadCount();
    if (response.code === 200) {
      Object.assign(unreadCounts, response.data);
    }
  } catch (error) {
    console.error('获取未读数量失败:', error);
  }
};

const loadSettings = async () => {
  try {
    const response = await MessageAPI.getPushSettings();
    if (response.code === 200) {
      Object.assign(settings, response.data);

      // 更新时间选择器的值
      if (settings.quietHours.enabled) {
        quietStart.value = dayjs(settings.quietHours.startTime, 'HH:mm');
        quietEnd.value = dayjs(settings.quietHours.endTime, 'HH:mm');
      }
    }
  } catch (error) {
    console.error('获取设置失败:', error);
  }
};

const initWebSocket = () => {
  messageWebSocket.connectGeneral();

  // 监听新消息
  messageWebSocket.on('newMessage', (data) => {
    // 更新消息列表
    if (visible.value) {
      messages.value.unshift(data);
    }

    // 更新未读数量
    if (data.category && unreadCounts[data.category] !== undefined) {
      unreadCounts[data.category]++;
    }
  });

  // 监听系统广播
  messageWebSocket.on('systemBroadcast', (data) => {
    // 显示系统通知
    Message.info({
      content: `📢 ${data.title}`,
      duration: 5000
    });
  });

  // 监听连接错误
  messageWebSocket.on('connectionError', (error) => {
    Message.warning('实时消息连接异常，部分功能可能受影响');
  });
};

const handleCategoryChange = () => {
  loadMessages(true);
};

const handleMessageClick = async (message: NewMessageVO) => {
  // 标记为已读
  if (message.status === 0) {
    await markAsRead(message.id);
  }

  // 如果有URL，打开链接
  if (message.url) {
    window.open(message.url, '_blank');
  }
};

const markAsRead = async (messageId: number) => {
  try {
    const response = await MessageAPI.markAsRead(messageId);
    if (response.code === 200) {
      // 更新本地消息状态
      const message = messages.value.find(m => m.id === messageId);
      if (message) {
        message.status = 1;
        message.readTime = new Date().toISOString();

        // 更新未读数量
        if (message.category && unreadCounts[message.category] > 0) {
          unreadCounts[message.category]--;
        }
      }
    }
  } catch (error) {
    console.error('标记已读失败:', error);
    Message.error('操作失败');
  }
};

const markAsUnread = async (messageId: number) => {
  // 这里需要后端支持标记未读的API
  console.log('标记未读:', messageId);
  Message.info('标记未读功能开发中');
};

const deleteMessage = async (messageId: number) => {
  try {
    const response = await MessageAPI.deleteMessage(messageId);
    if (response.code === 200) {
      // 从列表中移除
      const index = messages.value.findIndex(m => m.id === messageId);
      if (index > -1) {
        const message = messages.value[index];
        messages.value.splice(index, 1);

        // 如果是未读消息，更新计数
        if (message.status === 0 && message.category && unreadCounts[message.category] > 0) {
          unreadCounts[message.category]--;
        }
      }

      Message.success('删除成功');
    }
  } catch (error) {
    console.error('删除消息失败:', error);
    Message.error('删除失败');
  }
};

const markAllAsRead = async () => {
  try {
    const response = await MessageAPI.markAllAsRead(activeCategory.value || undefined);
    if (response.code === 200) {
      // 更新本地消息状态
      messages.value.forEach(message => {
        if (message.status === 0) {
          message.status = 1;
          message.readTime = new Date().toISOString();
        }
      });

      // 更新未读数量
      if (activeCategory.value) {
        unreadCounts[activeCategory.value] = 0;
      } else {
        Object.keys(unreadCounts).forEach(key => {
          unreadCounts[key] = 0;
        });
      }

      Message.success('全部已读');
    }
  } catch (error) {
    console.error('全部已读失败:', error);
    Message.error('操作失败');
  }
};

const refreshMessages = async () => {
  await Promise.all([
    loadMessages(true),
    loadUnreadCounts()
  ]);
  Message.success('刷新成功');
};

const saveSettings = async () => {
  try {
    // 更新免打扰时间
    if (settings.quietHours.enabled) {
      settings.quietHours.startTime = quietStart.value?.format('HH:mm') || '22:00';
      settings.quietHours.endTime = quietEnd.value?.format('HH:mm') || '08:00';
    }

    const response = await MessageAPI.updatePushSettings(settings);
    if (response.code === 200) {
      showSettings.value = false;
      Message.success('设置保存成功');
    }
  } catch (error) {
    console.error('保存设置失败:', error);
    Message.error('保存失败');
  }
};

const formatTime = (time: string): string => {
  const now = dayjs();
  const messageTime = dayjs(time);
  const diffMinutes = now.diff(messageTime, 'minute');

  if (diffMinutes < 1) {
    return '刚刚';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  } else if (diffMinutes < 1440) {
    return `${Math.floor(diffMinutes / 60)}小时前`;
  } else {
    return messageTime.format('MM-DD HH:mm');
  }
};

const getCategoryColor = (category: string): string => {
  return categoryInfo[category as keyof typeof categoryInfo]?.color || 'blue';
};

const getCategoryName = (category: string): string => {
  return categoryInfo[category as keyof typeof categoryInfo]?.name || '未知';
};
</script>

<style scoped lang="less">
.message-center {
  .message-trigger {
    cursor: pointer;

    .arco-badge {
      display: block;
    }
  }

  .message-tabs {
    margin-bottom: 16px;

    .arco-radio-group {
      width: 100%;

      .arco-radio-button {
        flex: 1;
        text-align: center;
      }
    }
  }

  .quick-actions {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e5e6eb;
  }

  .message-list {
    height: calc(100vh - 200px);
    overflow-y: auto;

    .empty-state {
      text-align: center;
      padding: 40px 0;
    }

    .message-items {
      .message-item {
        display: flex;
        padding: 12px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: #f7f8fa;
        }

        &.unread {
          background-color: #f0f9ff;
          border-left: 3px solid #1890ff;
        }

        .message-avatar {
          margin-right: 12px;
          flex-shrink: 0;
        }

        .message-content {
          flex: 1;
          min-width: 0;

          .message-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;

            .sender-name {
              font-weight: 600;
              color: #1d2129;
              font-size: 14px;
            }

            .message-time {
              font-size: 12px;
              color: #86909c;
            }
          }

          .message-title {
            font-weight: 500;
            color: #1d2129;
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .message-text {
            color: #4e5969;
            font-size: 13px;
            line-height: 1.4;
            margin-bottom: 8px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .aggregate-info {
            margin-bottom: 8px;
          }

          .message-tags {
            .arco-tag {
              margin-right: 4px;
            }
          }
        }

        .message-actions {
          flex-shrink: 0;
          margin-left: 8px;
        }
      }
    }

    .load-more {
      text-align: center;
      padding: 16px;
    }
  }

  .settings-content {
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }
    }

    .setting-group {
      margin-bottom: 24px;

      .setting-group-title {
        font-weight: 600;
        color: #1d2129;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    .quiet-hours {
      display: flex;
      align-items: center;
      margin-top: 12px;
    }
  }
}
</style>
