<template>
  <div class="notification-toast-container">
    <transition-group name="toast" tag="div" class="toast-list">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-toast"
        :class="[`type-${notification.type}`, `priority-${notification.priority}`]"
        @click="handleClick(notification)"
      >
        <div class="toast-icon">
          <component :is="getIcon(notification.type)" />
        </div>
        
        <div class="toast-content">
          <div class="toast-title">{{ notification.title }}</div>
          <div class="toast-message" v-if="notification.message">
            {{ notification.message }}
          </div>
          <div class="toast-time">{{ formatTime(notification.timestamp) }}</div>
        </div>
        
        <div class="toast-actions">
          <a-button
            type="text"
            size="small"
            @click.stop="dismissNotification(notification.id)"
          >
            <CloseOutlined />
          </a-button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  CloseOutlined,
  MessageOutlined,
  NotificationOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue';
import moment from 'moment';

// 通知类型定义
interface ToastNotification {
  id: string;
  type: 'message' | 'system' | 'success' | 'warning' | 'error' | 'info';
  priority: number;
  title: string;
  message?: string;
  timestamp: number;
  duration?: number;
  url?: string;
  data?: any;
}

const router = useRouter();

// 响应式数据
const notifications = ref<ToastNotification[]>([]);
const maxNotifications = 5;
const defaultDuration = 5000;

// 获取图标组件
const getIcon = (type: string) => {
  const icons: Record<string, any> = {
    message: MessageOutlined,
    system: NotificationOutlined,
    success: CheckCircleOutlined,
    warning: WarningOutlined,
    error: WarningOutlined,
    info: InfoCircleOutlined
  };
  return icons[type] || NotificationOutlined;
};

// 格式化时间
const formatTime = (timestamp: number): string => {
  return moment(timestamp).fromNow();
};

// 添加通知
const addNotification = (notification: Omit<ToastNotification, 'id' | 'timestamp'>) => {
  const newNotification: ToastNotification = {
    ...notification,
    id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now()
  };

  // 添加到列表开头
  notifications.value.unshift(newNotification);

  // 限制最大数量
  if (notifications.value.length > maxNotifications) {
    notifications.value = notifications.value.slice(0, maxNotifications);
  }

  // 设置自动消失
  const duration = notification.duration ?? defaultDuration;
  if (duration > 0) {
    setTimeout(() => {
      dismissNotification(newNotification.id);
    }, duration);
  }

  return newNotification.id;
};

// 消除通知
const dismissNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};

// 清空所有通知
const clearAllNotifications = () => {
  notifications.value = [];
};

// 处理通知点击
const handleClick = (notification: ToastNotification) => {
  // 如果有跳转URL，进行页面跳转
  if (notification.url) {
    router.push(notification.url);
  }
  
  // 点击后自动消除通知
  dismissNotification(notification.id);
};

// 处理WebSocket消息通知
const handleWebSocketMessage = (message: any) => {
  let type: ToastNotification['type'] = 'message';
  let title = '新消息';
  
  // 根据消息类型设置通知样式
  switch (message.data?.category) {
    case 'SYSTEM':
      type = 'system';
      title = '系统通知';
      break;
    case 'CONTEST':
      type = 'info';
      title = '比赛通知';
      break;
    case 'RATING':
      type = 'success';
      title = '积分通知';
      break;
    case 'JUDGE':
      type = 'info';
      title = '判题结果';
      break;
    default:
      type = 'message';
      title = '新消息';
  }

  // 根据优先级设置持续时间
  let duration = defaultDuration;
  if (message.data?.priority >= 4) {
    duration = 10000; // 紧急消息显示更久
  } else if (message.data?.priority >= 3) {
    duration = 8000; // 高优先级消息显示稍久
  }

  addNotification({
    type,
    priority: message.data?.priority || 2,
    title: message.data?.title || title,
    message: message.data?.content,
    duration,
    url: message.data?.url,
    data: message.data
  });
};

// 处理比赛相关通知
const handleContestMessage = (message: any) => {
  let type: ToastNotification['type'] = 'info';
  let title = '比赛通知';
  
  switch (message.type) {
    case 'submit_result':
      type = message.data?.status === 'Accepted' ? 'success' : 'warning';
      title = message.data?.status === 'Accepted' ? '提交通过' : '提交失败';
      break;
    case 'ranking_update':
      type = 'info';
      title = '排名更新';
      break;
    case 'contest_status_update':
      type = 'warning';
      title = '比赛状态更新';
      break;
    case 'contest_notification':
      type = message.data?.priority === 'high' ? 'warning' : 'info';
      title = '比赛公告';
      break;
  }

  addNotification({
    type,
    priority: message.data?.priority === 'high' ? 4 : 2,
    title: message.data?.title || title,
    message: message.data?.content || getMessage(message),
    duration: type === 'success' ? 3000 : defaultDuration,
    data: message.data
  });
};

// 根据消息类型生成提示文本
const getMessage = (message: any): string => {
  switch (message.type) {
    case 'submit_result':
      return `状态: ${message.data?.status}, 用时: ${message.data?.time}ms`;
    case 'ranking_update':
      return '比赛排名已更新';
    case 'contest_status_update':
      return `比赛状态: ${message.data?.status}`;
    default:
      return message.data?.content || '';
  }
};

// 暴露方法给父组件使用
defineExpose({
  addNotification,
  dismissNotification,
  clearAllNotifications,
  handleWebSocketMessage,
  handleContestMessage
});

// 组件挂载和卸载时的处理
onMounted(() => {
  // 可以在这里监听全局事件
  window.addEventListener('beforeunload', clearAllNotifications);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', clearAllNotifications);
  clearAllNotifications();
});
</script>

<style scoped lang="less">
.notification-toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  pointer-events: none;

  .toast-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .notification-toast {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-width: 320px;
    max-width: 400px;
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-left: 4px solid #d9d9d9;
    cursor: pointer;
    pointer-events: auto;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      transform: translateY(-2px);
    }

    // 不同类型的颜色
    &.type-message {
      border-left-color: #1890ff;
      
      .toast-icon {
        color: #1890ff;
      }
    }

    &.type-system {
      border-left-color: #52c41a;
      
      .toast-icon {
        color: #52c41a;
      }
    }

    &.type-success {
      border-left-color: #52c41a;
      
      .toast-icon {
        color: #52c41a;
      }
    }

    &.type-warning {
      border-left-color: #faad14;
      
      .toast-icon {
        color: #faad14;
      }
    }

    &.type-error {
      border-left-color: #f5222d;
      
      .toast-icon {
        color: #f5222d;
      }
    }

    &.type-info {
      border-left-color: #13c2c2;
      
      .toast-icon {
        color: #13c2c2;
      }
    }

    // 高优先级样式
    &.priority-4 {
      border-left-width: 6px;
      box-shadow: 0 4px 12px rgba(245, 34, 45, 0.2);
      animation: urgent-pulse 2s infinite;
    }

    &.priority-3 {
      border-left-width: 5px;
    }

    .toast-icon {
      font-size: 18px;
      margin-top: 2px;
      flex-shrink: 0;
    }

    .toast-content {
      flex: 1;
      min-width: 0;

      .toast-title {
        font-size: 14px;
        font-weight: 500;
        color: #262626;
        margin-bottom: 4px;
        line-height: 1.4;
      }

      .toast-message {
        font-size: 12px;
        color: #595959;
        margin-bottom: 4px;
        line-height: 1.4;
        word-break: break-word;
      }

      .toast-time {
        font-size: 11px;
        color: #8c8c8c;
      }
    }

    .toast-actions {
      flex-shrink: 0;

      .ant-btn {
        color: #8c8c8c;
        
        &:hover {
          color: #595959;
          background: rgba(0, 0, 0, 0.04);
        }
      }
    }
  }
}

// 动画效果
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

// 紧急消息脉动动画
@keyframes urgent-pulse {
  0% {
    box-shadow: 0 4px 12px rgba(245, 34, 45, 0.2);
  }
  50% {
    box-shadow: 0 4px 12px rgba(245, 34, 45, 0.4);
  }
  100% {
    box-shadow: 0 4px 12px rgba(245, 34, 45, 0.2);
  }
}

// 响应式设计
@media (max-width: 480px) {
  .notification-toast-container {
    left: 10px;
    right: 10px;
    top: 10px;

    .notification-toast {
      min-width: auto;
      max-width: none;
    }
  }
}
</style>