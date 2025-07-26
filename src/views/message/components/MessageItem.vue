<template>
  <div
    class="message-item"
    :class="{
      'unread': isUnread,
      'high-priority': isHighPriority,
      'urgent-priority': isUrgentPriority
    }"
  >
    <!-- 未读指示器 -->
    <div v-if="isUnread" class="unread-indicator"></div>

    <div class="message-header">
      <div class="message-info">
        <!-- 头像区域 -->
        <div class="avatar-container">
          <img
            v-if="message.senderAvatar"
            :src="message.senderAvatar"
            :alt="message.senderName || '系统'"
            class="sender-avatar"
          />
          <div v-else class="avatar-placeholder" :style="{ backgroundColor: getAvatarColor(message.senderName) }">
            {{ getAvatarText(message.senderName) }}
          </div>
          <!-- 在线状态指示器 -->
          <div v-if="message.senderId" class="online-indicator"></div>
        </div>

        <div class="message-meta">
          <div class="meta-row">
            <span class="sender-name">{{ message.senderName || '系统' }}</span>
            <span class="message-time">{{ formatTime(message.createTime) }}</span>
          </div>
          <div class="meta-row">
            <a-tag :color="getCategoryColor(message.category)" size="small" class="category-tag">
              <template #icon>
                <component :is="getCategoryIcon(message.category)" />
              </template>
              {{ getCategoryText(message.category) }}
            </a-tag>
            <a-tag
              v-if="isHighPriority"
              :color="getPriorityColor(message.priority)"
              size="small"
              class="priority-tag"
            >
              <template #icon>
                <component :is="getPriorityIcon(message.priority)" />
              </template>
              {{ getPriorityText(message.priority) }}
            </a-tag>
          </div>
        </div>
      </div>

      <div class="message-actions">
        <a-dropdown placement="bottomRight" trigger="click">
          <a-button type="text" size="small" class="action-button">
            <template #icon>
              <MoreOutlined />
            </template>
          </a-button>
          <template #overlay>
            <a-menu @click="handleAction">
              <a-menu-item key="read" v-if="isUnread">
                <template #icon>
                  <EyeOutlined />
                </template>
                标记已读
              </a-menu-item>
              <a-menu-item key="unread" v-if="!isUnread">
                <template #icon>
                  <EyeInvisibleOutlined />
                </template>
                标记未读
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="delete" class="danger-item">
                <template #icon>
                  <DeleteOutlined />
                </template>
                删除消息
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>

    <div class="message-content" @click="handleClick">
      <h4 class="message-title">{{ message.title || '无标题' }}</h4>
      <p class="message-text" v-if="message.content">{{ message.content }}</p>
      <div class="message-source" v-if="message.sourceType && message.sourceId">
        <LinkOutlined class="source-icon" />
        <span>{{ getSourceText(message.sourceType) }}: #{{ message.sourceId }}</span>
      </div>
    </div>

    <div class="message-footer" v-if="hasAggregateInfo">
      <div class="aggregate-info">
        <TeamOutlined class="aggregate-icon" />
        <span>共 {{ message.aggregateCount }} 条相似消息</span>
      </div>
      <div class="footer-actions">
        <a-button type="text" size="small" @click.stop="viewAllSimilar">
          查看全部
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Message, Modal } from '@arco-design/web-vue';
import {
  MoreOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  DeleteOutlined,
  LinkOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  TrophyOutlined,
  CodeOutlined,
  BellOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  FireOutlined
} from '@ant-design/icons-vue';
// 使用生成的类型
type MessageCategory = UnifiedMessageVO.categoryEnum;
import { formatMessageTime, getMessageCategoryInfo, getPriorityInfo } from '@/utils/messageUtils';
import { UnifiedMessageVO } from '../../../../generated/models/UnifiedMessageVO';
import moment from 'moment';

interface Props {
  message: UnifiedMessageVO;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'read', messageId: number): void;
  (e: 'delete', messageId: number): void;
}>();

const router = useRouter();
const store = useStore();

// 计算属性
const isUnread = computed(() => (props.message.status ?? 0) === 0);
const isHighPriority = computed(() => (props.message.priority ?? 1) >= 3);
const isUrgentPriority = computed(() => (props.message.priority ?? 1) === 4);
const hasAggregateInfo = computed(() => (props.message.aggregateCount ?? 1) > 1);

// 格式化时间
const formatTime = (time?: string): string => {
  if (!time) return '';
  return formatMessageTime(time);
};

// 获取头像颜色
const getAvatarColor = (name?: string): string => {
  if (!name) return '#1890ff';
  const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1890ff', '#52c41a', '#eb2f96'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// 获取头像文本
const getAvatarText = (name?: string): string => {
  if (!name) return 'S';
  return name.charAt(0).toUpperCase();
};

// 获取分类颜色
const getCategoryColor = (category?: string): string => {
  const categoryInfo = getMessageCategoryInfo(category as MessageCategory);
  const colorMap: Record<string, string> = {
    'blue': 'blue',
    'green': 'green', 
    'purple': 'purple',
    'orange': 'orange',
    'red': 'red'
  };
  return colorMap[categoryInfo.color] || 'default';
};

// 获取分类图标
const getCategoryIcon = (category?: string) => {
  const icons: Record<string, any> = {
    [UnifiedMessageVO.categoryEnum.INTERACTION]: UserOutlined,
    [UnifiedMessageVO.categoryEnum.SYSTEM]: SettingOutlined,
    [UnifiedMessageVO.categoryEnum.CONTEST]: TrophyOutlined,
    [UnifiedMessageVO.categoryEnum.RATING]: CodeOutlined,
    [UnifiedMessageVO.categoryEnum.JUDGE]: BellOutlined
  };
  return icons[category || ''] || BellOutlined;
};

// 获取分类文本
const getCategoryText = (category?: string): string => {
  const categoryInfo = getMessageCategoryInfo(category as MessageCategory);
  return categoryInfo.name;
};

// 获取优先级颜色
const getPriorityColor = (priority?: number): string => {
  const priorityInfo = getPriorityInfo(String(priority || 1));
  const colorMap: Record<string, string> = {
    'gray': 'default',
    'blue': 'blue',
    'orange': 'orange', 
    'red': 'red'
  };
  return colorMap[priorityInfo.color] || 'default';
};

// 获取优先级图标
const getPriorityIcon = (priority?: number) => {
  const icons: Record<number, any> = {
    1: BellOutlined,
    2: ExclamationCircleOutlined,
    3: WarningOutlined,
    4: FireOutlined
  };
  return icons[priority || 1] || BellOutlined;
};

// 获取优先级文本
const getPriorityText = (priority?: number): string => {
  const priorityInfo = getPriorityInfo(String(priority || 1));
  return priorityInfo.name.replace('优先级', '');
};

// 获取来源文本
const getSourceText = (sourceType?: string): string => {
  const texts: Record<string, string> = {
    post: '帖子',
    question: '题目',
    contest: '比赛',
    user: '用户'
  };
  return texts[sourceType || ''] || (sourceType || '未知');
};

// 处理消息点击
const handleClick = async () => {
  if (!props.message.id) return;

  // 如果未读，先标记为已读
  if (isUnread.value) {
    try {
      await store.dispatch('message/markAsRead', props.message.id);
      emit('read', props.message.id);
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      Message.error('标记已读失败');
      return;
    }
  }

  // 跳转到相关页面
  if (props.message.url) {
    try {
      await router.push(props.message.url);
    } catch (error) {
      console.error('Failed to navigate:', error);
      Message.warning('无法跳转到目标页面');
    }
  } else if (props.message.sourceType && props.message.sourceId) {
    // 根据消息类型跳转到对应页面
    try {
      let targetRoute = '';
      switch (props.message.sourceType) {
        case 'question':
          targetRoute = `/question/view/${props.message.sourceId}`;
          break;
        case 'post':
          targetRoute = `/post/detail/${props.message.sourceId}`;
          break;
        case 'contest':
          targetRoute = `/contest/detail/${props.message.sourceId}`;
          break;
        case 'user':
          targetRoute = `/user/profile/${props.message.sourceId}`;
          break;
        default:
          console.warn('Unknown source type:', props.message.sourceType);
          return;
      }
      await router.push(targetRoute);
    } catch (error) {
      console.error('Failed to navigate to source:', error);
      Message.warning('无法跳转到目标页面');
    }
  }
};

// 处理操作菜单
const handleAction = async ({ key }: { key: string }) => {
  if (!props.message.id) {
    Message.error('消息ID无效');
    return;
  }

  try {
    switch (key) {
      case 'read':
        await store.dispatch('message/markAsRead', props.message.id);
        emit('read', props.message.id);
        Message.success('已标记为已读');
        break;
      case 'unread':
        await store.dispatch('message/markAsUnread', props.message.id);
        emit('read', props.message.id); // 触发父组件刷新
        Message.success('已标记为未读');
        break;
      case 'delete': {
        // 添加确认对话框
        const confirmDelete = await new Promise((resolve) => {
          Modal.confirm({
            title: '确认删除',
            content: '您确定要删除这条消息吗？',
            okText: '删除',
            cancelText: '取消',
            onOk: () => resolve(true),
            onCancel: () => resolve(false)
          });
        });
        
        if (confirmDelete) {
          await store.dispatch('message/deleteMessage', props.message.id);
          emit('delete', props.message.id);
          Message.success('消息已删除');
        }
        break;
      }
      default:
        console.warn('Unknown action:', key);
    }
  } catch (error) {
    console.error('Failed to handle action:', error);
    Message.error('操作失败，请重试');
  }
};

// 查看所有相似消息
const viewAllSimilar = async () => {
  try {
    if (props.message.sourceType && props.message.sourceId) {
      await router.push({
        path: '/message/center',
        query: {
          sourceType: props.message.sourceType,
          sourceId: String(props.message.sourceId)
        }
      });
    }
  } catch (error) {
    console.error('Failed to navigate to message center:', error);
    Message.warning('无法跳转到消息中心');
  }
};
</script>

<style scoped lang="less">
.message-item {
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
  background: white;
  transition: all 0.3s;
  cursor: pointer;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 8px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: transparent;
    transition: all 0.3s;
  }

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
    border-color: #cbd5e1;
  }

  &.unread {
    background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
    border-color: #93c5fd;

    &::before {
      background: #3b82f6;
    }

    .unread-indicator {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 8px;
      height: 8px;
      background: #3b82f6;
      border-radius: 50%;
      
      @media (max-width: 768px) {
        top: 12px;
        right: 12px;
        width: 6px;
        height: 6px;
      }
    }
  }

  &.high-priority {
    &::before {
      background: #f59e0b;
    }
  }

  &.urgent-priority {
    background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
    border-color: #fca5a5;

    &::before {
      background: #ef4444;
    }
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    
    @media (max-width: 768px) {
      margin-bottom: 10px;
    }

    .message-info {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      flex: 1;

      .avatar-container {
        position: relative;
        flex-shrink: 0;

        .sender-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e5e7eb;
          transition: all 0.3s;
          
          @media (max-width: 768px) {
            width: 32px;
            height: 32px;
          }
        }

        .avatar-placeholder {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s;
          
          @media (max-width: 768px) {
            width: 32px;
            height: 32px;
            font-size: 12px;
          }
        }

        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 8px;
          height: 8px;
          background: #10b981;
          border: 2px solid white;
          border-radius: 50%;
          
          @media (max-width: 768px) {
            width: 6px;
            height: 6px;
            border-width: 1px;
          }
        }
      }

      .message-meta {
        flex: 1;
        min-width: 0;

        .meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          
          @media (max-width: 768px) {
            gap: 6px;
            margin-bottom: 4px;
          }

          &:last-child {
            margin-bottom: 0;
          }
        }

        .sender-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
          
          @media (max-width: 768px) {
            font-size: 13px;
          }
        }

        .message-time {
          font-size: 12px;
          color: #9ca3af;
          margin-left: auto;
          
          @media (max-width: 768px) {
            font-size: 11px;
          }
        }

        .category-tag {
          border-radius: 4px;
          font-weight: 500;
          font-size: 11px;
          padding: 2px 6px;
          
          @media (max-width: 768px) {
            font-size: 10px;
            padding: 1px 4px;
          }

          :deep(.ant-tag-icon) {
            margin-right: 3px;
          }
        }

        .priority-tag {
          border-radius: 4px;
          font-weight: 500;
          font-size: 11px;
          padding: 2px 6px;
          
          @media (max-width: 768px) {
            font-size: 10px;
            padding: 1px 4px;
          }

          :deep(.ant-tag-icon) {
            margin-right: 3px;
          }
        }
      }
    }

    .message-actions {
      .action-button {
        border-radius: 6px;
        transition: all 0.3s;
        width: 28px;
        height: 28px;
        
        @media (max-width: 768px) {
          width: 24px;
          height: 24px;
        }

        &:hover {
          background: #f3f4f6;
          transform: scale(1.05);
        }
      }
    }
  }

  .message-content {
    padding: 0 40px 0 0;
    
    @media (max-width: 768px) {
      padding: 0 28px 0 0;
    }

    .message-title {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 8px 0;
      line-height: 1.4;
      transition: color 0.3s;
      
      @media (max-width: 768px) {
        font-size: 14px;
        margin: 0 0 6px 0;
      }

      &:hover {
        color: #3b82f6;
      }
    }

    .message-text {
      color: #6b7280;
      line-height: 1.5;
      margin: 0 0 8px 0;
      font-size: 13px;
      
      @media (max-width: 768px) {
        font-size: 12px;
        margin: 0 0 6px 0;
      }
    }

    .message-source {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #9ca3af;
      padding: 6px 10px;
      background: #f8fafc;
      border-radius: 6px;
      border-left: 3px solid #cbd5e1;
      transition: all 0.3s;
      
      @media (max-width: 768px) {
        font-size: 11px;
        padding: 4px 8px;
      }

      .source-icon {
        font-size: 12px;
        color: #3b82f6;
        
        @media (max-width: 768px) {
          font-size: 11px;
        }
      }

      &:hover {
        background: #f1f5f9;
        border-left-color: #3b82f6;
      }
    }
  }

  .message-footer {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f1f5f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    @media (max-width: 768px) {
      margin-top: 8px;
      padding-top: 8px;
      flex-direction: column;
      gap: 8px;
    }

    .aggregate-info {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #9ca3af;
      
      @media (max-width: 768px) {
        font-size: 11px;
      }

      .aggregate-icon {
        font-size: 12px;
        color: #3b82f6;
        
        @media (max-width: 768px) {
          font-size: 11px;
        }
      }
    }

    .footer-actions {
      .ant-btn {
        border-radius: 4px;
        font-size: 11px;
        height: 24px;
        padding: 0 8px;
        
        @media (max-width: 768px) {
          font-size: 10px;
          height: 22px;
          padding: 0 6px;
        }

        &:hover {
          color: #3b82f6;
          background: #eff6ff;
        }
      }
    }
  }
}

// 动画效果
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

// 菜单样式
:deep(.ant-dropdown-menu) {
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);

  .ant-dropdown-menu-item {
    border-radius: 6px;
    margin: 4px 8px;
    transition: all 0.3s;

    &:hover {
      background: #f0f6ff;
    }

    &.danger-item {
      color: #f5222d;

      &:hover {
        background: #fff2f0;
        color: #f5222d;
      }
    }
  }

  .ant-dropdown-menu-item-icon {
    margin-right: 8px;
  }
}
</style>
