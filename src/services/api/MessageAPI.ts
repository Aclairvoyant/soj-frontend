// 根据现有生成的API封装消息服务类
import { UnifiedMessageControllerService } from '../../../generated/services/UnifiedMessageControllerService';
import type { AdminSendMessageRequest } from '../../../generated/models/AdminSendMessageRequest';

export class MessageAPI {
  // 分页查询用户消息
  static async getMessages(params: {
    pageNum?: number;
    pageSize?: number;
    category?: string;
    status?: number;
  }): Promise<any> {
    return await UnifiedMessageControllerService.pageUserMessagesUsingGet(
      params.category,
      params.pageNum || 1,
      params.pageSize || 10,
      params.status
    );
  }

  // 获取未读消息列表
  static async getUnreadMessages(params: {
    category?: string;
    limit?: number;
  }): Promise<any> {
    return await UnifiedMessageControllerService.getUnreadMessagesUsingGet(
      params.category,
      params.limit || 20
    );
  }

  // 获取未读消息数量
  static async getUnreadCount(): Promise<any> {
    return await UnifiedMessageControllerService.getUnreadCountUsingGet();
  }

  // 标记消息为已读
  static async markAsRead(messageId: number): Promise<any> {
    return await UnifiedMessageControllerService.markAsReadUsingPost(messageId);
  }

  // 批量标记已读
  static async markBatchAsRead(messageIds: number[]): Promise<any> {
    return await UnifiedMessageControllerService.markBatchAsReadUsingPost(messageIds);
  }

  // 全部标记已读
  static async markAllAsRead(category?: string): Promise<any> {
    return await UnifiedMessageControllerService.markAllAsReadUsingPost(category);
  }

  // 删除消息
  static async deleteMessage(messageId: number): Promise<any> {
    return await UnifiedMessageControllerService.deleteMessageUsingPost(messageId);
  }

  // 批量删除消息
  static async batchDeleteMessages(messageIds: number[]): Promise<any> {
    return await UnifiedMessageControllerService.batchDeleteMessagesUsingPost(messageIds);
  }

  // 清空所有消息
  static async clearAllMessages(category?: string): Promise<any> {
    return await UnifiedMessageControllerService.clearAllMessagesUsingPost(category);
  }

  // 用户推送设置
  static async getPushSettings(): Promise<any> {
    return await UnifiedMessageControllerService.getPushSettingsUsingGet();
  }

  static async updatePushSettings(settings: any): Promise<any> {
    return await UnifiedMessageControllerService.updatePushSettingsUsingPost(settings);
  }

  // 消息统计
  static async getStatistics(days = 7): Promise<any> {
    return await UnifiedMessageControllerService.getMessageStatisticsUsingGet(days);
  }

  // 检查在线状态
  static async checkOnlineStatus(): Promise<any> {
    return await UnifiedMessageControllerService.checkOnlineStatusUsingGet();
  }

  // 管理员消息接口

  // 发送全站广播消息
  static async sendBroadcastMessage(data: {
    title: string;
    content: string;
    messageType: string;
    priority: string;
    extraData?: string;
  }): Promise<any> {
    const request: AdminSendMessageRequest = {
      title: data.title,
      content: data.content,
      messageType: data.messageType,
      priority: data.priority,
      extraData: data.extraData,
      sendMode: 'broadcast',
      pushNotification: true,
    };
    return await UnifiedMessageControllerService.sendBroadcastMessageUsingPost(request);
  }

  // 发送指定用户消息
  static async sendPrivateMessage(data: {
    title: string;
    content: string;
    messageType: string;
    priority: string;
    recipientIds: number[];
    extraData?: string;
  }): Promise<any> {
    const request: AdminSendMessageRequest = {
      title: data.title,
      content: data.content,
      messageType: data.messageType,
      priority: data.priority,
      recipientIds: data.recipientIds,
      extraData: data.extraData,
      sendMode: 'specific',
      pushNotification: true,
    };
    return await UnifiedMessageControllerService.sendPrivateMessageUsingPost(request);
  }

  // 发送比赛相关消息（批量发送）
  static async sendContestMessage(data: {
    title: string;
    content: string;
    messageType: string;
    priority: string;
    contestId: number;
    extraData?: string;
  }): Promise<any> {
    const request: AdminSendMessageRequest = {
      title: data.title,
      content: data.content,
      messageType: data.messageType,
      priority: data.priority,
      extraData: JSON.stringify({
        contestId: data.contestId,
        ...(data.extraData ? JSON.parse(data.extraData) : {})
      }),
      sendMode: 'contest',
      pushNotification: true,
    };
    return await UnifiedMessageControllerService.sendBatchMessageUsingPost(request);
  }

  // 发送紧急通知
  static async sendEmergencyNotice(data: {
    title: string;
    content: string;
    noticeType: string;
    extraData?: string;
  }): Promise<any> {
    const params = {
      title: data.title,
      content: data.content,
      messageType: 'EMERGENCY_NOTICE',
      noticeType: data.noticeType,
      priority: '4', // 紧急通知固定为最高优先级
      extraData: data.extraData,
    };
    return await UnifiedMessageControllerService.sendEmergencyNoticeUsingPost(params);
  }

  // 获取管理员消息统计
  static async getAdminStatistics(days = 30): Promise<any> {
    return await UnifiedMessageControllerService.getMessageSendStatisticsUsingGet(days);
  }
}
