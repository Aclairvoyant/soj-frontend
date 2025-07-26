# WebSocket 服务说明

## 概述

该模块实现了完整的WebSocket客户端管理系统，支持：

- 通用消息推送（用户消息、系统通知等）
- 比赛专用消息推送（排名更新、提交结果等）
- 自动重连机制
- 心跳保活
- 事件监听机制

## 文件结构

```
src/services/websocket/
├── WebSocketManager.ts        # WebSocket管理器基类
├── GeneralWebSocketClient.ts  # 通用消息WebSocket客户端
├── ContestWebSocketClient.ts  # 比赛WebSocket客户端
├── WebSocketApiService.ts     # WebSocket管理API服务
├── index.ts                   # 导出文件
└── README.md                  # 说明文档
```

## 使用方法

### 1. 通用消息WebSocket

```typescript
import { GeneralWebSocketClient, webSocketManager } from '@/services/websocket';

// 创建客户端
const generalClient = new GeneralWebSocketClient(userId);

// 监听事件
generalClient.on('newMessage', (messageData) => {
  console.log('收到新消息:', messageData);
});

// 注册到管理器
webSocketManager.register('general', generalClient);

// 建立连接
generalClient.connect();
```

### 2. 比赛WebSocket

```typescript
import { ContestWebSocketClient, webSocketManager } from '@/services/websocket';

// 创建客户端
const contestClient = new ContestWebSocketClient(contestId, userId);

// 监听排名更新
contestClient.on('rankingUpdate', (rankingData) => {
  console.log('排名更新:', rankingData);
});

// 监听提交结果
contestClient.on('submitResult', (submitData) => {
  console.log('提交结果:', submitData);
});

// 注册到管理器
webSocketManager.register(`contest-${contestId}`, contestClient);

// 建立连接
contestClient.connect();
```

### 3. 管理员功能

```typescript
import { webSocketApiService } from '@/services/websocket';

// 发送紧急通知
await webSocketApiService.sendEmergencyNotice({
  type: 'EMERGENCY',
  title: '紧急通知',
  content: '系统将在5分钟后进行维护',
  priority: 4
});

// 获取连接统计
const stats = await webSocketApiService.getWebSocketStats();
console.log('连接统计:', stats);
```

## 事件列表

### 通用消息事件

- `connected`: 连接成功
- `disconnected`: 连接断开
- `error`: 连接错误
- `newMessage`: 收到新消息
- `connectionConfirmed`: 连接确认

### 比赛消息事件

- `rankingUpdate`: 排名更新
- `contestStatusUpdate`: 比赛状态更新
- `submitResult`: 提交结果
- `contestNotification`: 比赛通知

## 配置说明

### 连接参数

- `maxReconnectAttempts`: 最大重连次数（默认5次）
- `reconnectInterval`: 重连间隔（默认5秒）
- `heartbeatInterval`: 心跳间隔（默认30秒）

### URL格式

- 通用消息: `ws://host/websocket/general/{userId}`
- 比赛消息: `ws://host/websocket/contest/{contestId}/{userId}`

## 注意事项

1. 确保用户已登录再建立WebSocket连接
2. 页面卸载时记得断开所有连接
3. 处理网络异常和重连逻辑
4. 桌面通知需要用户授权

## 故障排除

### 连接失败
- 检查后端WebSocket服务是否启动
- 确认URL格式是否正确
- 检查用户权限

### 消息丢失
- 检查网络连接状态
- 确认心跳机制是否正常
- 查看浏览器控制台错误

### 重连异常
- 检查重连参数配置
- 确认服务端是否支持重连
- 查看连接状态管理逻辑