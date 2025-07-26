// 消息系统工具函数
import { UnifiedMessageVO } from '../../generated/models/UnifiedMessageVO';
import { messageWebSocket } from '@/services/websocket/EnhancedWebSocketManager';
import dayjs from 'dayjs';

// 使用生成的类型作为别名，保持兼容性
type NewMessageVO = UnifiedMessageVO;
type MessageType = UnifiedMessageVO.messageTypeEnum;
type MessageCategory = UnifiedMessageVO.categoryEnum;

// 消息类型映射 - 使用生成的枚举值
export const messageTypeMap: Record<MessageType, string> = {
  // 管理员可手动发送的消息类型
  [UnifiedMessageVO.messageTypeEnum.SYSTEM_ANNOUNCEMENT]: '系统公告',
  [UnifiedMessageVO.messageTypeEnum.EMERGENCY_NOTICE]: '紧急通知',
  [UnifiedMessageVO.messageTypeEnum.MAINTENANCE_NOTICE]: '维护通知',
  [UnifiedMessageVO.messageTypeEnum.ADMIN_ANNOUNCEMENT]: '管理员公告',
  [UnifiedMessageVO.messageTypeEnum.SYSTEM_NOTICE]: '系统通知',
  
  // 互动消息类型
  [UnifiedMessageVO.messageTypeEnum.LIKE_POST]: '帖子点赞',
  [UnifiedMessageVO.messageTypeEnum.COMMENT_POST]: '帖子评论',
  [UnifiedMessageVO.messageTypeEnum.REPLY_COMMENT]: '回复评论',
  [UnifiedMessageVO.messageTypeEnum.FAVOUR_POST]: '帖子收藏',
  [UnifiedMessageVO.messageTypeEnum.FOLLOW_USER]: '用户关注',
  [UnifiedMessageVO.messageTypeEnum.MENTION_USER]: '用户提及',
  
  // 比赛相关消息
  [UnifiedMessageVO.messageTypeEnum.CONTEST_REGISTRATION_SUCCESS]: '比赛报名成功',
  [UnifiedMessageVO.messageTypeEnum.CONTEST_START_REMINDER]: '比赛开始提醒',
  [UnifiedMessageVO.messageTypeEnum.CONTEST_END_REMINDER]: '比赛结束提醒',
  [UnifiedMessageVO.messageTypeEnum.CONTEST_STATUS_CHANGE]: '比赛状态变化',
  [UnifiedMessageVO.messageTypeEnum.CONTEST_RANKING_UPDATE]: '排名更新',
  [UnifiedMessageVO.messageTypeEnum.CONTEST_RESULT_PUBLISHED]: '比赛结果发布',
  
  // 评级相关消息
  [UnifiedMessageVO.messageTypeEnum.RATING_CHANGE]: '评级变化',
  [UnifiedMessageVO.messageTypeEnum.RANK_PROMOTION]: '排名提升',
  [UnifiedMessageVO.messageTypeEnum.ACHIEVEMENT_UNLOCK]: '成就解锁',
  [UnifiedMessageVO.messageTypeEnum.MILESTONE_REACHED]: '里程碑达成',
  
  // 判题相关消息
  [UnifiedMessageVO.messageTypeEnum.SUBMIT_RESULT]: '提交结果',
  [UnifiedMessageVO.messageTypeEnum.CONTEST_SUBMIT_RESULT]: '比赛提交结果',
  
  // 其他消息类型
  [UnifiedMessageVO.messageTypeEnum.PRIVATE_MESSAGE]: '私人消息',
  [UnifiedMessageVO.messageTypeEnum.POLICY_UPDATE]: '政策更新',
  [UnifiedMessageVO.messageTypeEnum.SECURITY_ALERT]: '安全警报',
  [UnifiedMessageVO.messageTypeEnum.CUSTOM_MESSAGE]: '自定义消息'
};

// 消息分类映射（使用生成的枚举）
export const messageCategoryMap: Record<MessageCategory, { name: string; color: string; icon: string }> = {
  [UnifiedMessageVO.categoryEnum.INTERACTION]: { name: '互动', color: 'green', icon: '👥' },
  [UnifiedMessageVO.categoryEnum.SYSTEM]: { name: '系统', color: 'blue', icon: '🔧' },
  [UnifiedMessageVO.categoryEnum.CONTEST]: { name: '比赛', color: 'orange', icon: '🏆' },
  [UnifiedMessageVO.categoryEnum.RATING]: { name: '评级', color: 'purple', icon: '⭐' },
  [UnifiedMessageVO.categoryEnum.JUDGE]: { name: '判题', color: 'red', icon: '⚖️' }
};

// 优先级映射
export const priorityMap: Record<string, { name: string; color: string; icon: string }> = {
  '1': { name: '低优先级', color: 'gray', icon: '⬇️' },
  '2': { name: '中优先级', color: 'blue', icon: '➡️' },
  '3': { name: '高优先级', color: 'orange', icon: '⬆️' },
  '4': { name: '紧急', color: 'red', icon: '🚨' }
};

/**
 * 判断消息是否未读（兼容后端的多种状态表示）
 */
export function isMessageUnread(message: NewMessageVO): boolean {
  // 优先使用unread布尔字段
  if (message.unread !== undefined) {
    return message.unread;
  }
  
  // 其次使用read布尔字段
  if (message.read !== undefined) {
    return !message.read;
  }
  
  // 最后使用status数字字段（0=未读，1=已读）
  if (message.status !== undefined) {
    return message.status === 0;
  }
  
  // 默认认为是未读
  return true;
}

/**
 * 判断消息是否已读（兼容后端的多种状态表示）
 */
export function isMessageRead(message: NewMessageVO): boolean {
  return !isMessageUnread(message);
}

/**
 * 获取消息的读取状态数字（统一转换为数字格式）
 */
export function getMessageStatus(message: NewMessageVO): number {
  if (isMessageUnread(message)) {
    return 0; // 未读
  }
  return 1; // 已读
}

/**
 * 格式化时间显示
 */
export function formatMessageTime(time: string): string {
  const now = dayjs();
  const messageTime = dayjs(time);
  const diffMinutes = now.diff(messageTime, 'minute');

  if (diffMinutes < 1) {
    return '刚刚';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  } else if (diffMinutes < 1440) {
    return `${Math.floor(diffMinutes / 60)}小时前`;
  } else if (diffMinutes < 10080) {
    return `${Math.floor(diffMinutes / 1440)}天前`;
  } else {
    return messageTime.format('MM-DD HH:mm');
  }
}

/**
 * 获取消息类型显示文本
 */
export function getMessageTypeText(type: string): string {
  return messageTypeMap[type as MessageType] || '未知类型';
}

/**
 * 获取消息分类信息
 */
export function getMessageCategoryInfo(category: string) {
  return messageCategoryMap[category as MessageCategory] || { name: '未知', color: 'gray', icon: '❓' };
}

/**
 * 获取优先级信息
 */
export function getPriorityInfo(priority: string) {
  return priorityMap[priority] || { name: '普通', color: 'blue', icon: '➡️' };
}

/**
 * 判断消息是否为紧急消息
 */
export function isUrgentMessage(message: NewMessageVO): boolean {
  return message.priority === 4 || message.messageType === UnifiedMessageVO.messageTypeEnum.EMERGENCY_NOTICE;
}

/**
 * 判断消息是否为系统消息
 */
export function isSystemMessage(message: NewMessageVO): boolean {
  return message.category === UnifiedMessageVO.categoryEnum.SYSTEM ||
         message.messageType === UnifiedMessageVO.messageTypeEnum.SYSTEM_ANNOUNCEMENT ||
         message.messageType === UnifiedMessageVO.messageTypeEnum.SYSTEM_NOTICE;
}

/**
 * 格式化消息内容（处理长文本）
 */
export function formatMessageContent(content: string, maxLength = 100): string {
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength) + '...';
}

/**
 * 生成消息摘要
 */
export function generateMessageSummary(message: NewMessageVO): string {
  const typeText = getMessageTypeText(message.messageType || '');
  const content = formatMessageContent(message.content || '', 50);
  return `${typeText}: ${content}`;
}

/**
 * 检查消息是否应该显示桌面通知
 */
export function shouldShowNotification(
  message: NewMessageVO,
  settings: {
    enableWebNotification: boolean;
    mutedCategories: string[];
    mutedUsers: number[];
    quietHours: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  }
): boolean {
  // 检查总开关
  if (!settings.enableWebNotification) {
    return false;
  }

  // 检查是否静音该分类
  if (message.category && settings.mutedCategories.includes(message.category)) {
    return false;
  }

  // 检查是否静音该用户
  if (message.senderId && settings.mutedUsers.includes(message.senderId)) {
    return false;
  }

  // 检查免打扰时间
  if (settings.quietHours.enabled) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const startParts = settings.quietHours.startTime.split(':');
    const endParts = settings.quietHours.endTime.split(':');

    const startTime = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
    const endTime = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

    let inQuietTime = false;
    if (startTime < endTime) {
      inQuietTime = currentTime >= startTime && currentTime <= endTime;
    } else {
      // 跨天的情况
      inQuietTime = currentTime >= startTime || currentTime <= endTime;
    }

    // 在免打扰时间内，只有紧急消息才显示通知
    if (inQuietTime && !isUrgentMessage(message)) {
      return false;
    }
  }

  return true;
}

/**
 * 显示桌面通知
 */
export function showDesktopNotification(message: NewMessageVO): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    const categoryInfo = getMessageCategoryInfo(message.category || '');
    const priorityInfo = getPriorityInfo(message.priority?.toString() || '1');

    const notification = new Notification(
      `${categoryInfo.icon} ${message.title || ''}`,
      {
        body: formatMessageContent(message.content || '', 200),
        icon: '/favicon.ico',
        tag: `message-${message.id || 0}`,
        requireInteraction: isUrgentMessage(message),
        badge: '/favicon.ico',
        timestamp: message.createTime ? new Date(message.createTime).getTime() : Date.now()
      }
    );

    // 点击通知时的处理
    notification.onclick = () => {
      window.focus();
      // 这里可以添加跳转到消息详情的逻辑
      notification.close();
    };

    // 自动关闭时间
    if (!isUrgentMessage(message)) {
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  }
}

/**
 * 请求通知权限
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if ('Notification' in window) {
    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }
    return Notification.permission;
  }
  return 'denied';
}

/**
 * 批量处理消息（用于性能优化）
 */
export function batchProcessMessages<T>(
  messages: NewMessageVO[],
  processor: (message: NewMessageVO) => T,
  batchSize = 50
): T[] {
  const results: T[] = [];

  for (let i = 0; i < messages.length; i += batchSize) {
    const batch = messages.slice(i, i + batchSize);
    const batchResults = batch.map(processor);
    results.push(...batchResults);
  }

  return results;
}

/**
 * 消息去重（基于ID）
 */
export function deduplicateMessages(messages: NewMessageVO[]): NewMessageVO[] {
  const seen = new Set<string>();
  const uniqueMessages: NewMessageVO[] = [];

  for (const message of messages) {
    const key = message.id?.toString() || Math.random().toString();

    if (!seen.has(key)) {
      seen.add(key);
      uniqueMessages.push(message);
    } else {
      // 如果是重复消息，更新聚合计数
      const existingMessage = uniqueMessages.find(m => 
        m.id?.toString() === key
      );
      if (existingMessage) {
        existingMessage.aggregateCount = (existingMessage.aggregateCount || 1) + 1;
      }
    }
  }

  return uniqueMessages;
}

/**
 * 按分类分组消息
 */
export function groupMessagesByCategory(messages: NewMessageVO[]): Record<MessageCategory, NewMessageVO[]> {
  const groups: Record<MessageCategory, NewMessageVO[]> = {
    [UnifiedMessageVO.categoryEnum.INTERACTION]: [],
    [UnifiedMessageVO.categoryEnum.SYSTEM]: [],
    [UnifiedMessageVO.categoryEnum.CONTEST]: [],
    [UnifiedMessageVO.categoryEnum.RATING]: [],
    [UnifiedMessageVO.categoryEnum.JUDGE]: []
  };

  messages.forEach(message => {
    if (message.category && groups[message.category as MessageCategory]) {
      groups[message.category as MessageCategory].push(message);
    }
  });

  return groups;
}

/**
 * 消息搜索过滤
 */
export function filterMessages(
  messages: NewMessageVO[],
  filters: {
    keyword?: string;
    category?: MessageCategory;
    messageType?: MessageType;
    priority?: string;
    dateRange?: [string, string];
    status?: number;
  }
): NewMessageVO[] {
  return messages.filter(message => {
    // 关键词搜索
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      const title = message.title?.toLowerCase() || '';
      const content = message.content?.toLowerCase() || '';
      if (!title.includes(keyword) && !content.includes(keyword)) {
        return false;
      }
    }

    // 分类过滤
    if (filters.category && message.category !== filters.category) {
      return false;
    }

    // 消息类型过滤
    if (filters.messageType && message.messageType !== filters.messageType) {
      return false;
    }

    // 优先级过滤
    if (filters.priority && message.priority?.toString() !== filters.priority.toString()) {
      return false;
    }

    // 日期范围过滤
    if (filters.dateRange && message.createTime) {
      const messageDate = dayjs(message.createTime);
      const startDate = dayjs(filters.dateRange[0]);
      const endDate = dayjs(filters.dateRange[1]);

      if (messageDate.isBefore(startDate) || messageDate.isAfter(endDate)) {
        return false;
      }
    }

    // 状态过滤
    if (filters.status !== undefined && message.status !== filters.status) {
      return false;
    }

    return true;
  });
}

/**
 * 计算消息统计信息
 */
export function calculateMessageStats(messages: NewMessageVO[]) {
  const total = messages.length;
  const unread = messages.filter(m => isMessageUnread(m)).length;
  const urgent = messages.filter(m => isUrgentMessage(m)).length;

  const categoryStats = groupMessagesByCategory(messages);
  const categoryCounts = Object.entries(categoryStats).reduce((acc, [category, msgs]) => {
    acc[category] = {
      total: msgs.length,
      unread: msgs.filter(m => isMessageUnread(m)).length
    };
    return acc;
  }, {} as Record<string, { total: number; unread: number }>);

  return {
    total,
    unread,
    urgent,
    readRate: total > 0 ? ((total - unread) / total * 100).toFixed(1) : '0',
    categoryStats: categoryCounts
  };
}

/**
 * 生成消息导出数据
 */
export function exportMessages(messages: NewMessageVO[], format: 'json' | 'csv' = 'json') {
  if (format === 'json') {
    return JSON.stringify(messages, null, 2);
  }

  if (format === 'csv') {
    const headers = ['ID', '标题', '内容', '类型', '分类', '优先级', '状态', '发送者', '创建时间', '读取时间'];
    const rows = messages.map(msg => [
      msg.id || '',
      msg.title || '',
      msg.content || '',
      getMessageTypeText(msg.messageType || ''),
      getMessageCategoryInfo(msg.category || '').name,
      getPriorityInfo(msg.priority?.toString() || '1').name,
      msg.status === 0 ? '未读' : '已读',
      msg.senderName || '系统',
      msg.createTime || '',
      msg.readTime || ''
    ]);

    return [headers, ...rows].map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }

  return '';
}

export default {
  formatMessageTime,
  getMessageTypeText,
  getMessageCategoryInfo,
  getPriorityInfo,
  isUrgentMessage,
  isSystemMessage,
  formatMessageContent,
  generateMessageSummary,
  shouldShowNotification,
  showDesktopNotification,
  requestNotificationPermission,
  batchProcessMessages,
  deduplicateMessages,
  groupMessagesByCategory,
  filterMessages,
  calculateMessageStats,
  exportMessages
};
