<template>
  <div class="message-center">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h2>
            <SettingOutlined />
            消息中心
          </h2>
          <p>管理您的所有消息通知</p>
          <a-tag color="blue" v-if="totalUnread > 0">{{ totalUnread }} 条未读</a-tag>
        </div>
        <div class="header-actions">
          <a-button @click="showSettingsModal = true">
            <template #icon>
              <SettingOutlined />
            </template>
            推送设置
          </a-button>
          <a-button @click="refreshMessages">
            <template #icon>
              <ReloadOutlined />
            </template>
            刷新
          </a-button>
        </div>
      </div>
    </div>

    <!-- 操作区域 -->
    <a-card title="消息筛选与操作" class="operations-card">
      <!-- 分类筛选 -->
      <div class="filter-section">
        <div class="filter-left">
          <a-radio-group v-model:value="selectedCategory" @change="handleCategoryChange">
            <a-radio value="">全部</a-radio>
            <a-radio
              v-for="(label, category) in categoryLabels"
              :key="category"
              :value="category"
            >
              {{ label }}
              <a-badge
                v-if="(unreadCount[category] || 0) > 0"
                :count="unreadCount[category] || 0"
                :number-style="{ backgroundColor: getCategoryColor(category) }"
              />
            </a-radio>
          </a-radio-group>
        </div>
        <div class="filter-right">
          <a-select
            v-model:value="selectedStatus"
            style="width: 120px"
            @change="handleStatusChange"
          >
            <a-option value="">全部状态</a-option>
            <a-option value="0">未读</a-option>
            <a-option value="1">已读</a-option>
          </a-select>
        </div>
      </div>

      <!-- 批量操作栏 -->
      <div class="batch-actions" v-if="selectedMessages.length > 0">
        <div class="batch-info">
          已选择 {{ selectedMessages.length }} 条消息
        </div>
        <div class="batch-buttons">
          <a-button size="small" @click="handleBatchRead">批量标记已读</a-button>
          <a-button size="small" @click="handleBatchDelete" danger>批量删除</a-button>
          <a-button size="small" @click="clearSelection">取消选择</a-button>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions">
        <a-button
          size="small"
          @click="handleMarkAllRead"
          :disabled="!hasUnreadInCurrentView"
        >
          <CheckOutlined />
          全部已读
        </a-button>
        <a-button
          size="small"
          @click="handleClearAll"
          danger
          :disabled="messages.length === 0"
        >
          <DeleteOutlined />
          清空消息
        </a-button>
      </div>
    </a-card>

    <!-- 消息列表 -->
    <a-card title="消息列表" class="message-list-card" v-if="!loading">
      <div class="message-selector" v-if="messages.length > 0">
        <a-checkbox
          v-model:checked="selectAll"
          :indeterminate="indeterminate"
          @change="handleSelectAll"
        >
          全选
        </a-checkbox>
      </div>

      <div v-if="messages.length === 0" class="empty-state">
        <a-empty description="暂无消息" />
      </div>

      <div v-else class="messages-container">
        <div
          v-for="message in messages"
          :key="message.id"
          class="message-wrapper"
        >
          <a-checkbox
            v-model:checked="selectedMessages"
            :value="message.id"
            class="message-checkbox"
          />
          <MessageItem
            :message="message"
            @read="handleMessageRead"
            @delete="handleMessageDelete"
          />
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="totalCount > 0">
        <a-pagination
          v-model:current="currentPage"
          :total="totalCount"
          :page-size="pageSize"
          :show-total="(total: number, range: [number, number]) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`"
          :show-jumper="totalPages > 1"
          :show-size-changer="true"
          :page-size-options="['10', '20', '50', '100']"
          @change="onPageChange"
          @show-size-change="onPageSizeChange"
        />
      </div>
    </a-card>

    <!-- 加载状态 -->
    <div v-else class="loading-container">
      <a-spin size="large" />
    </div>

    <!-- 设置弹窗 -->
    <MessageSettingsModal
      v-model:modelValue="showSettingsModal"
      :key="showSettingsModal ? 'modal-open' : 'modal-closed'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { Message } from '@arco-design/web-vue';
import {
  SettingOutlined,
  ReloadOutlined,
  CheckOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';
import { UnifiedMessageVO } from '../../../generated/models/UnifiedMessageVO';
import { formatMessageTime, getMessageCategoryInfo, getPriorityInfo } from '@/utils/messageUtils';
import MessageItem from './components/MessageItem.vue';
import MessageSettingsModal from './components/MessageSettingsModal.vue';

// 使用生成的类型
type MessageCategory = UnifiedMessageVO.categoryEnum;

const store = useStore();

// 响应式数据
const loading = ref(false);
const showSettingsModal = ref(false);
const selectedCategory = ref<string>('');
const selectedStatus = ref<number | string>('');
const selectedMessages = ref<number[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

// 计算属性 - 适配新的 message-optimized 模块
const messages = computed(() => store.state.message.messages);
const unreadCounts = computed(() => store.state.message.unreadCounts);
const totalUnread = computed(() => store.getters['message/totalUnreadCount']);
const totalPages = computed(() => Math.ceil(store.state.message.total / store.state.message.pageSize));
const totalCount = computed(() => store.state.message.total || 0);

// 分类标签映射 - 使用生成的分类
const categoryLabels: Record<MessageCategory, string> = {
  [UnifiedMessageVO.categoryEnum.INTERACTION]: '互动',
  [UnifiedMessageVO.categoryEnum.SYSTEM]: '系统',
  [UnifiedMessageVO.categoryEnum.CONTEST]: '比赛',
  [UnifiedMessageVO.categoryEnum.RATING]: '评级',
  [UnifiedMessageVO.categoryEnum.JUDGE]: '判题'
};

// 未读数量计算 - 适配新结构
const unreadCount = computed(() => {
  return {
    [UnifiedMessageVO.categoryEnum.INTERACTION]: unreadCounts.value.INTERACTION || 0,
    [UnifiedMessageVO.categoryEnum.SYSTEM]: unreadCounts.value.SYSTEM || 0,
    [UnifiedMessageVO.categoryEnum.CONTEST]: unreadCounts.value.CONTEST || 0,
    [UnifiedMessageVO.categoryEnum.RATING]: unreadCounts.value.RATING || 0,
    [UnifiedMessageVO.categoryEnum.JUDGE]: unreadCounts.value.JUDGE || 0
  };
});

// 全选相关
const selectAll = computed({
  get: () => {
    return messages.value.length > 0 && selectedMessages.value.length === messages.value.length;
  },
  set: (value: boolean) => {
    if (value) {
      selectedMessages.value = messages.value
        .map((msg: any) => msg.id)
        .filter((id: any) => id !== undefined) as number[];
    } else {
      selectedMessages.value = [];
    }
  }
});

const indeterminate = computed(() => {
  return selectedMessages.value.length > 0 && selectedMessages.value.length < messages.value.length;
});

// 当前视图是否有未读消息
const hasUnreadInCurrentView = computed(() => {
  return messages.value.some((msg: any) => msg.status === 0); // 0 表示未读
});

// 获取分类颜色
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    [UnifiedMessageVO.categoryEnum.INTERACTION]: '#1890ff',
    [UnifiedMessageVO.categoryEnum.SYSTEM]: '#52c41a',
    [UnifiedMessageVO.categoryEnum.CONTEST]: '#fa8c16',
    [UnifiedMessageVO.categoryEnum.RATING]: '#722ed1',
    [UnifiedMessageVO.categoryEnum.JUDGE]: '#f5222d'
  };
  return colors[category] || '#d9d9d9';
};

// 加载消息列表
const loadMessages = async () => {
  try {
    loading.value = true;
    const params: any = {
      reset: true
    };

    // 确保参数格式正确
    if (selectedCategory.value && selectedCategory.value.trim() !== '') {
      params.category = selectedCategory.value;
    }

    await store.dispatch('message/loadMessages', params);

    // 清除选择
    selectedMessages.value = [];
  } catch (error) {
    Message.error('加载消息失败');
  } finally {
    loading.value = false;
  }
};

// 刷新消息
const refreshMessages = async () => {
  await Promise.all([
    loadMessages(),
    store.dispatch('message/loadUnreadCounts')
  ]);
  Message.success('刷新成功');
};

// 处理分类变化
const handleCategoryChange = () => {
  currentPage.value = 1;
  store.dispatch('message/switchCategory', selectedCategory.value);
};

// 处理状态变化
const handleStatusChange = () => {
  currentPage.value = 1;
  loadMessages();
};

// 处理页码变化
const onPageChange = (page: number) => {
  currentPage.value = page;
  loadMessages();
};

// 处理每页大小变化
const onPageSizeChange = (newPageSize: number) => {
  currentPage.value = 1;
  pageSize.value = newPageSize;
  loadMessages();
};

// 处理全选
const handleSelectAll = (checked: boolean) => {
  selectAll.value = checked;
};

// 清除选择
const clearSelection = () => {
  selectedMessages.value = [];
};

// 处理消息已读
const handleMessageRead = (messageId: number) => {
  // 从选择列表中移除
  const index = selectedMessages.value.indexOf(messageId);
  if (index > -1) {
    selectedMessages.value.splice(index, 1);
  }
};

// 处理消息删除
const handleMessageDelete = (messageId: number) => {
  // 从选择列表中移除
  const index = selectedMessages.value.indexOf(messageId);
  if (index > -1) {
    selectedMessages.value.splice(index, 1);
  }
};

// 批量标记已读
const handleBatchRead = async () => {
  try {
    // 使用新的批量标记已读方法
    for (const messageId of selectedMessages.value) {
      await store.dispatch('message/markAsRead', messageId);
    }
    Message.success(`已标记 ${selectedMessages.value.length} 条消息为已读`);
    selectedMessages.value = [];
  } catch (error) {
    console.error('Failed to batch mark as read:', error);
    Message.error('批量标记已读失败');
  }
};

// 批量删除
const handleBatchDelete = async () => {
  try {
    // 使用新的删除方法
    for (const messageId of selectedMessages.value) {
      await store.dispatch('message/deleteMessage', messageId);
    }
    Message.success(`已删除 ${selectedMessages.value.length} 条消息`);
    selectedMessages.value = [];
    // 如果当前页没有消息了，返回上一页
    if (messages.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
      loadMessages();
    }
  } catch (error) {
    console.error('Failed to batch delete:', error);
    Message.error('批量删除失败');
  }
};

// 全部标记已读
const handleMarkAllRead = async () => {
  try {
    const category = selectedCategory.value as MessageCategory || undefined;
    await store.dispatch('message/markAllAsRead', category);
    Message.success('已标记全部消息为已读');
    loadMessages();
  } catch (error) {
    console.error('Failed to mark all as read:', error);
    Message.error('标记全部已读失败');
  }
};

// 清空所有消息
const handleClearAll = async () => {
  try {
    const category = selectedCategory.value as MessageCategory || undefined;
    // todo message-optimized 模块没有 clearAllMessages action，用删除代替
    await store.dispatch('message/deleteMessage', category);
    Message.success('已标记所有消息为已读');
    currentPage.value = 1;
    loadMessages();
  } catch (error) {
    console.error('Failed to clear all messages:', error);
    Message.error('清空消息失败');
  }
};

// 组件挂载时加载数据
onMounted(async () => {
  await Promise.all([
    loadMessages(),
    store.dispatch('message/loadUnreadCounts')
  ]);
});
</script>

<style scoped lang="less">
.message-center {
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;

  .page-header {
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    margin-bottom: 32px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.2);

    .header-content {
      padding: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.05"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        opacity: 0.3;
      }

      .header-left {
        position: relative;
        z-index: 1;

        h2 {
          color: white;
          margin: 0 0 12px 0;
          font-size: 32px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 16px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 18px;
          margin: 0 0 16px 0;
          font-weight: 400;
          letter-spacing: 0.5px;
        }

        .ant-tag {
          border-radius: 8px;
          font-weight: 600;
          padding: 6px 16px;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      }

      .header-actions {
        display: flex;
        gap: 16px;
        position: relative;
        z-index: 1;

        .ant-btn {
          border-radius: 10px;
          font-weight: 600;
          height: 44px;
          padding: 0 24px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: white;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;

          &:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.4);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }
        }
      }
    }
  }

  .operations-card,
  .message-list-card {
    margin-bottom: 32px;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06);
      transform: translateY(-2px);
    }

    :deep(.ant-card-head) {
      border-bottom: 1px solid rgba(240, 240, 240, 0.8);
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
      border-radius: 16px 16px 0 0;

      .ant-card-head-title {
        font-size: 20px;
        font-weight: 700;
        color: #1d2129;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
  }

  .filter-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 20px;
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
    border-radius: 12px;
    border: 1px solid #e2e8f0;

    .filter-left {
      flex: 1;

      :deep(.ant-radio-group) {
        .ant-radio-wrapper {
          margin-right: 24px;
          font-weight: 500;
          color: #475569;
          transition: all 0.3s ease;

          &:hover {
            color: #667eea;
          }

          .ant-radio {
            .ant-radio-inner {
              border-color: #cbd5e1;
              transition: all 0.3s ease;

              &:hover {
                border-color: #667eea;
              }
            }

            &.ant-radio-checked .ant-radio-inner {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-color: #667eea;
            }
          }
        }
      }
    }

    .filter-right {
      margin-left: 24px;

      :deep(.ant-select) {
        .ant-select-selector {
          border-radius: 8px;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;

          &:hover,
          &:focus,
          &.ant-select-focused {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }
        }
      }
    }
  }

  .batch-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
    padding: 16px 24px;
    background: linear-gradient(135deg, #fff7e6 0%, #fef3ec 100%);
    border: 2px solid #ffd591;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(255, 213, 145, 0.3);

    .batch-info {
      color: #d46b08;
      font-weight: 600;
      font-size: 15px;
    }

    .batch-buttons {
      display: flex;
      gap: 12px;

      .ant-btn {
        border-radius: 8px;
        font-weight: 600;
        height: 36px;
        padding: 0 16px;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-1px);
        }

        &:not(.ant-btn-danger) {
          border: 2px solid #e2e8f0;
          color: #64748b;

          &:hover {
            border-color: #667eea;
            color: #667eea;
            background: rgba(102, 126, 234, 0.05);
          }
        }

        &.ant-btn-danger {
          &:hover {
            background: #ff7875;
            border-color: #ff7875;
          }
        }
      }
    }
  }

  .quick-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding: 0 20px;

    .ant-btn {
      border-radius: 8px;
      font-weight: 600;
      height: 36px;
      padding: 0 16px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
      }

      &:not(.ant-btn-danger) {
        border: 2px solid #e2e8f0;
        color: #64748b;

        &:hover {
          border-color: #667eea;
          color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }
      }

      &.ant-btn-danger {
        &:hover {
          background: #ff7875;
          border-color: #ff7875;
        }
      }
    }
  }

  .message-selector {
    padding: 20px 24px;
    border-bottom: 1px solid rgba(240, 240, 240, 0.8);
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);

    :deep(.ant-checkbox-wrapper) {
      font-weight: 600;
      color: #475569;

      .ant-checkbox {
        .ant-checkbox-inner {
          border-radius: 4px;
          border: 2px solid #cbd5e1;
          transition: all 0.3s ease;

          &:hover {
            border-color: #667eea;
          }
        }

        &.ant-checkbox-checked .ant-checkbox-inner {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
        }
      }
    }
  }

  .messages-container {
    .message-wrapper {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 0 24px;
      border-bottom: 1px solid rgba(240, 240, 240, 0.6);
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        transform: translateX(4px);
      }

      &:last-child {
        border-bottom: none;
      }

      .message-checkbox {
        margin-top: 24px;
        flex-shrink: 0;

        :deep(.ant-checkbox) {
          .ant-checkbox-inner {
            border-radius: 4px;
            border: 2px solid #cbd5e1;
            transition: all 0.3s ease;

            &:hover {
              border-color: #667eea;
            }
          }

          &.ant-checkbox-checked .ant-checkbox-inner {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: #667eea;
          }
        }
      }

      .message-item {
        flex: 1;
        margin: 0;
        border: none;
        box-shadow: none;
        background: transparent;
        border-radius: 0;
      }
    }
  }

  .pagination {
    padding: 32px 24px;
    text-align: center;
    border-top: 1px solid rgba(240, 240, 240, 0.8);
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);

    :deep(.ant-pagination) {
      .ant-pagination-item {
        border-radius: 8px;
        border: 2px solid #e2e8f0;
        transition: all 0.3s ease;

        &:hover {
          border-color: #667eea;
          color: #667eea;
        }

        &.ant-pagination-item-active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
        }
      }

      .ant-pagination-prev,
      .ant-pagination-next {
        border-radius: 8px;
        border: 2px solid #e2e8f0;
        transition: all 0.3s ease;

        &:hover {
          border-color: #667eea;
          color: #667eea;
        }
      }

      .ant-select {
        .ant-select-selector {
          border-radius: 8px;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;

          &:hover {
            border-color: #667eea;
          }
        }
      }
    }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(10px);
  }

  .empty-state {
    padding: 60px 20px;
    text-align: center;

    :deep(.ant-empty) {
      .ant-empty-description {
        color: #64748b;
        font-size: 16px;
        font-weight: 500;
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    padding: 16px;

    .page-header .header-content {
      flex-direction: column;
      gap: 20px;
      align-items: stretch;
      padding: 32px 24px;

      .header-left h2 {
        font-size: 28px;
      }

      .header-actions {
        justify-content: center;
        width: 100%;

        .ant-btn {
          flex: 1;
          max-width: 140px;
        }
      }
    }

    .filter-section {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;

      .filter-right {
        margin-left: 0;
        align-self: stretch;
      }
    }

    .batch-actions {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;

      .batch-buttons {
        justify-content: center;
      }
    }

    .quick-actions {
      justify-content: center;
    }

    .messages-container .message-wrapper {
      padding: 0 16px;

      &:hover {
        transform: none;
      }
    }
  }

  @media (max-width: 480px) {
    padding: 12px;

    .page-header .header-content {
      padding: 24px 16px;

      .header-left h2 {
        font-size: 24px;
        flex-direction: column;
        gap: 8px;
      }
    }

    .operations-card,
    .message-list-card {
      border-radius: 12px;

      :deep(.ant-card-head) {
        border-radius: 12px 12px 0 0;
      }
    }

    .filter-section {
      padding: 16px;

      .filter-left {
        :deep(.ant-radio-group) {
          .ant-radio-wrapper {
            margin-right: 12px;
            margin-bottom: 8px;
          }
        }
      }
    }
  }
}
</style>
