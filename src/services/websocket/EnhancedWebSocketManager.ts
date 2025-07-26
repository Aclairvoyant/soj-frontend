// 根据新文档增强的WebSocket管理器
import { WebSocketMessageFormat } from '@/types/message';

export class EnhancedMessageWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;
  private reconnectDecay = 1.5;
  private heartbeatInterval: number | null = null;
  private heartbeatDelay = 30000; // 30秒心跳
  private userId: number | null = null;
  private currentPath = ''; // 记录当前连接路径用于重连
  
  // 事件监听器
  private messageHandlers: Map<string, Set<(data: any) => void>> = new Map();
  
  constructor(private baseUrl: string = '') {
    // 根据协议选择ws或wss
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    
    // 智能端口映射：前端开发服务器通常在8080，后端在8081
    const host = window.location.hostname;
    let port = '8081'; // 默认后端端口
    
    // 如果是开发环境，尝试连接到8081端口
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      port = '8081';
    } else {
      // 生产环境使用相同端口
      port = window.location.port || (protocol === 'wss:' ? '443' : '80');
    }
    
    this.baseUrl = baseUrl || `${protocol}//${host}:${port}`;
  }
  
  /**
   * 设置用户ID
   */
  setUserId(userId: number): void {
    this.userId = userId;
  }
  
  /**
   * 连接通用WebSocket
   */
  connectGeneral(userId?: number): void {
    if (userId) {
      this.setUserId(userId);
    }
    
    if (this.userId) {
      this.connect(`/api/websocket/general/${this.userId}`);
    } else {
      console.error('用户ID未设置，无法建立WebSocket连接');
    }
  }
  
  /**
   * 连接比赛WebSocket
   */
  connectContest(contestId: number, userId?: number): void {
    if (userId) {
      this.setUserId(userId);
    }
    
    if (this.userId) {
      this.connect(`/api/websocket/contest/${contestId}/${this.userId}`);
    } else {
      console.error('用户ID未设置，无法建立WebSocket连接');
    }
  }
  
  /**
   * 建立WebSocket连接
   */
  private connect(path: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }
    
    this.currentPath = path; // 记录路径用于重连
    
    try {
      const url = `${this.baseUrl}${path}`;
      console.log(`连接WebSocket: ${url}`);
      
      this.ws = new WebSocket(url);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      
    } catch (error) {
      console.error('WebSocket连接失败:', error);
      this.scheduleReconnect();
    }
  }
  
  /**
   * 处理连接打开
   */
  private handleOpen(): void {
    console.log('WebSocket连接已建立');
    this.reconnectAttempts = 0;
    this.reconnectDelay = 1000; // 重置重连延迟
    
    // 开始心跳检测
    this.startHeartbeat();
    
    // 触发连接成功事件
    this.emit('connected');
  }
  
  /**
   * 处理收到消息
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessageFormat = JSON.parse(event.data);
      console.log('收到WebSocket消息:', message);
      
      // 根据消息类型处理
      switch (message.type) {
        case 'NEW_MESSAGE':
          this.handleNewMessage(message.data);
          break;
        case 'SYSTEM_BROADCAST':
          this.handleSystemBroadcast(message.data);
          break;
        case 'CONTEST_UPDATE':
          this.handleContestUpdate(message.data);
          break;
        default:
          console.warn('未知的消息类型:', message.type);
      }
      
      // 触发通用消息事件
      this.emit('message', message);
      
    } catch (error) {
      console.error('解析WebSocket消息失败:', error);
    }
  }
  
  /**
   * 处理新消息
   */
  private handleNewMessage(data: any): void {
    // 显示桌面通知
    this.showNotification(data);
    
    // 更新未读消息计数
    this.emit('newMessage', data);
    
    // 更新消息列表
    this.emit('updateMessages');
  }
  
  /**
   * 处理系统广播
   */
  private handleSystemBroadcast(data: any): void {
    // 显示系统通知
    this.showSystemNotification(data);
    
    // 触发系统广播事件
    this.emit('systemBroadcast', data);
  }
  
  /**
   * 处理比赛更新
   */
  private handleContestUpdate(data: any): void {
    // 更新比赛信息
    this.emit('contestUpdate', data);
  }
  
  /**
   * 处理连接关闭
   */
  private handleClose(event: CloseEvent): void {
    console.log('WebSocket连接已关闭:', event.code, event.reason);
    
    // 停止心跳
    this.stopHeartbeat();
    
    // 触发断开连接事件
    this.emit('disconnected', { code: event.code, reason: event.reason });
    
    // 尝试重连（非主动关闭）
    if (event.code !== 1000) {
      this.scheduleReconnect();
    }
  }
  
  /**
   * 处理连接错误
   */
  private handleError(error: Event): void {
    console.error('WebSocket错误:', error);
    
    // 增加重连延迟
    this.reconnectDelay = Math.min(
      this.reconnectDelay * this.reconnectDecay,
      this.maxReconnectDelay
    );
    
    // 触发错误事件
    this.emit('error', error);
    
    // 显示错误通知
    this.showConnectionError();
  }
  
  /**
   * 安排重连
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('WebSocket重连次数超过限制，停止重连');
      this.emit('reconnectFailed');
      return;
    }
    
    this.reconnectAttempts++;
    
    console.log(`${this.reconnectDelay}ms后进行第${this.reconnectAttempts}次重连`);
    
    setTimeout(() => {
      if (this.ws?.readyState !== WebSocket.OPEN) {
        this.connect(this.currentPath); // 使用记录的路径重连
      }
    }, this.reconnectDelay);
  }
  
  /**
   * 开始心跳检测
   */
  private startHeartbeat(): void {
    this.stopHeartbeat(); // 先停止之前的心跳
    
    this.heartbeatInterval = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, this.heartbeatDelay);
  }
  
  /**
   * 停止心跳检测
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
  
  /**
   * 显示桌面通知
   */
  private showNotification(data: any): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(data.title, {
        body: data.content,
        icon: '/favicon.ico',
        tag: `message-${data.id}`,
        requireInteraction: data.priority === '4' // 紧急消息需要用户交互
      });
    }
  }
  
  /**
   * 显示系统通知
   */
  private showSystemNotification(data: any): void {
    // 系统广播使用更醒目的通知方式
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🔔 ' + data.title, {
        body: data.content,
        icon: '/favicon.ico',
        tag: 'system-broadcast',
        requireInteraction: true // 系统广播需要用户确认
      });
    }
    
    // 也可以在页面上显示模态框或横幅
    this.emit('systemNotification', data);
  }
  
  /**
   * 显示连接错误提示
   */
  private showConnectionError(): void {
    // 可以在这里显示用户友好的错误提示
    this.emit('connectionError', {
      message: '实时消息连接中断，正在尝试重连...',
      attempts: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts
    });
  }
  
  /**
   * 添加事件监听器
   */
  on(event: string, handler: (data?: any) => void): void {
    if (!this.messageHandlers.has(event)) {
      this.messageHandlers.set(event, new Set());
    }
    this.messageHandlers.get(event)!.add(handler);
  }
  
  /**
   * 移除事件监听器
   */
  off(event: string, handler?: (data?: any) => void): void {
    if (!this.messageHandlers.has(event)) {
      return;
    }
    
    if (handler) {
      this.messageHandlers.get(event)!.delete(handler);
    } else {
      this.messageHandlers.get(event)!.clear();
    }
  }
  
  /**
   * 触发事件
   */
  private emit(event: string, data?: any): void {
    if (this.messageHandlers.has(event)) {
      const handlers = this.messageHandlers.get(event)!;
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`事件处理器错误 [${event}]:`, error);
        }
      });
    }
  }
  
  /**
   * 发送消息
   */
  send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket未连接，无法发送消息');
    }
  }
  
  /**
   * 手动断开连接
   */
  disconnect(): void {
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, '用户主动断开连接');
      this.ws = null;
    }
    
    this.reconnectAttempts = 0;
    this.reconnectDelay = 1000;
  }
  
  /**
   * 获取连接状态
   */
  getReadyState(): number | undefined {
    return this.ws?.readyState;
  }
  
  /**
   * 是否已连接
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
  
  /**
   * 请求通知权限
   */
  static async requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  }
}

// 全局WebSocket管理器实例
export const messageWebSocket = new EnhancedMessageWebSocket();