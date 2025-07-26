// 根据新文档更新的消息类型定义
export enum MessageType {
  // 管理员可手动发送的消息类型
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',    // 系统公告
  EMERGENCY_NOTICE = 'EMERGENCY_NOTICE',          // 紧急通知
  MAINTENANCE_NOTICE = 'MAINTENANCE_NOTICE',      // 维护通知
  ADMIN_ANNOUNCEMENT = 'ADMIN_ANNOUNCEMENT',      // 管理员公告
  CONTEST_ANNOUNCEMENT = 'CONTEST_ANNOUNCEMENT',   // 比赛公告
  PROBLEM_UPDATE_NOTICE = 'PROBLEM_UPDATE_NOTICE', // 题目更新通知

  // 系统自动发送的消息类型（不应出现在管理员发送界面）
  SUBMISSION_RESULT = 'SUBMISSION_RESULT',        // 提交结果（自动）
  SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION',    // 系统通知（自动）
  PERSONAL_MESSAGE = 'PERSONAL_MESSAGE',          // 私人消息（用户间）

  // 用户互动消息（系统自动发送）
  POST_LIKED = 'POST_LIKED',                      // 帖子点赞（自动）
  POST_COMMENTED = 'POST_COMMENTED',              // 帖子评论（自动）
  POST_REPLIED = 'POST_REPLIED',                  // 回复评论（自动）
  USER_FOLLOWED = 'USER_FOLLOWED',                // 用户关注（自动）

  // 学习相关消息（系统自动发送）
  QUESTION_SOLVED = 'QUESTION_SOLVED',            // 题目通过（自动）
  SUBMISSION_JUDGED = 'SUBMISSION_JUDGED',        // 提交判题完成（自动）

  // 比赛消息（系统自动发送）
  CONTEST_REMINDER = 'CONTEST_REMINDER',          // 比赛提醒（自动）
  CONTEST_RANKING_UPDATE = 'CONTEST_RANKING_UPDATE' // 排名更新（自动）
}

// 可以由管理员手动发送的消息类型
export const MANUAL_MESSAGE_TYPES = [
  MessageType.SYSTEM_ANNOUNCEMENT,
  MessageType.EMERGENCY_NOTICE,
  MessageType.MAINTENANCE_NOTICE,
  MessageType.ADMIN_ANNOUNCEMENT,
  MessageType.CONTEST_ANNOUNCEMENT,
  MessageType.PROBLEM_UPDATE_NOTICE
] as const;

// 由系统自动发送的消息类型
export const AUTO_MESSAGE_TYPES = [
  MessageType.CONTEST_REMINDER,
  MessageType.CONTEST_RANKING_UPDATE,
  MessageType.SUBMISSION_RESULT,
  MessageType.SUBMISSION_JUDGED,
  MessageType.QUESTION_SOLVED,
  MessageType.POST_LIKED,
  MessageType.POST_COMMENTED,
  MessageType.POST_REPLIED,
  MessageType.USER_FOLLOWED,
  MessageType.PERSONAL_MESSAGE,
  MessageType.SYSTEM_NOTIFICATION
] as const;

// 使用后端真实的分类枚举 
export enum MessageCategory {
  INTERACTION = 'INTERACTION',  // 互动消息（点赞、评论、关注等）
  SYSTEM = 'SYSTEM',           // 系统消息
  CONTEST = 'CONTEST',         // 比赛相关
  RATING = 'RATING',           // 评级相关
  JUDGE = 'JUDGE'              // 判题相关
}

// 兼容旧代码的映射
export const LEGACY_CATEGORY_MAPPING: Record<string, MessageCategory> = {
  'social': MessageCategory.INTERACTION,
  'academic': MessageCategory.JUDGE,
  'admin': MessageCategory.SYSTEM
};

export enum MessagePriority {
  LOW = '1',      // 低优先级
  MEDIUM = '2',   // 中优先级
  HIGH = '3',     // 高优先级
  URGENT = '4'    // 紧急
}

// 直接使用后端生成的接口定义
export type { UnifiedMessageVO } from '../../generated/models/UnifiedMessageVO';

// 新的消息接口，与后端generated接口保持一致 
export interface NewMessageVO {
  aggregateCount?: number;
  aggregated?: boolean;
  category?: string;
  categoryEnum?: MessageCategory;
  content?: string;
  createTime?: string;
  deleted?: boolean;
  expireTime?: string;
  expired?: boolean;
  id?: number;
  isRealtime?: number;
  messageType?: string;
  messageTypeEnum?: MessageType;
  priority?: number;
  priorityDesc?: string;
  read?: boolean;        // 后端使用布尔字段
  readTime?: string;
  recipientId?: number;
  senderAvatar?: string;
  senderId?: number;
  senderName?: string;
  sourceId?: number;
  sourceType?: string;
  status?: number;       // 后端也有status数字字段
  statusDesc?: string;
  title?: string;
  unread?: boolean;      // 后端使用布尔字段
  updateTime?: string;
  url?: string;
}

// 消息状态枚举
export enum MessageStatus {
  UNREAD = 0,  // 未读
  READ = 1,    // 已读
  DELETED = 2  // 已删除
}

// 消息分页请求参数
export interface MessagePageRequest {
  pageNum?: number;        // 页码，默认1
  pageSize?: number;       // 页大小，默认10
  category?: string;       // 消息分类，可选
  status?: number;         // 消息状态：0-未读，1-已读，2-已删除
}

// 未读消息请求参数
export interface UnreadMessageRequest {
  category?: string;  // 消息分类过滤
  limit?: number;     // 限制数量，默认20
}

// 直接使用后端生成的请求接口
export type { AdminSendMessageRequest } from '../../generated/models/AdminSendMessageRequest';

// 管理员发送消息请求（与后端保持一致）
export interface MessageSendRequest {
  content?: string;
  expireDays?: number;
  extraData?: string;
  messageType?: string;
  priority?: string;      // 后端使用string类型
  pushNotification?: boolean;
  recipientIds?: Array<number>;
  scheduledTime?: number;
  sendMode?: string;
  title?: string;
}

// 消息推送设置（适配新的分类系统）
export interface MessagePushSettings {
  enablePush: boolean;
  categories: Record<MessageCategory, boolean>;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

// 兼容旧代码的推送设置映射
export const mapLegacyPushSettings = (oldSettings: any): MessagePushSettings => {
  return {
    enablePush: oldSettings.enablePush || false,
    categories: {
      [MessageCategory.SYSTEM]: oldSettings.categories?.system || false,
      [MessageCategory.INTERACTION]: oldSettings.categories?.social || false,
      [MessageCategory.JUDGE]: oldSettings.categories?.academic || false,
      [MessageCategory.CONTEST]: oldSettings.categories?.contest || false,
      [MessageCategory.RATING]: oldSettings.categories?.admin || false
    },
    quietHours: oldSettings.quietHours || {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00'
    }
  };
};

// WebSocket消息格式
export interface WebSocketMessageFormat {
  type: 'NEW_MESSAGE' | 'SYSTEM_BROADCAST' | 'CONTEST_UPDATE';
  data: {
    id?: number;
    messageType?: MessageType;
    title: string;
    content: string;
    senderId?: number;
    senderName?: string;
    url?: string;
    priority?: MessagePriority;
    createTime: string;
    broadcastTime?: string;
  };
}
