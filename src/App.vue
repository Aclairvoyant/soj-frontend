<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
    <!-- 全局通知组件 -->
    <NotificationToast ref="notificationRef" />
  </div>
</template>

<style>
#app {
}
</style>

<style lang="less">
@import './theme/index.less';
</style>

<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import NotificationToast from "@/components/NotificationToast.vue";
import {onMounted, onUnmounted, ref} from "vue";
import {useRoute} from "vue-router";
import {useStore} from "vuex";
import { messageWebSocket, EnhancedMessageWebSocket } from '@/services/websocket/EnhancedWebSocketManager';

const route = useRoute();
const store = useStore();
const notificationRef = ref();

const doInit = async () => {
  console.log("欢迎来到SOJ");
  
  // 初始化WebSocket连接
  await initWebSocket();
};

// 初始化WebSocket连接
const initWebSocket = async () => {
  const user = store.state.user?.loginUser;
  if (user && user.id && user.userName !== '未登录') {
    try {
      // 请求桌面通知权限
      await EnhancedMessageWebSocket.requestNotificationPermission();
      
      // 监听新消息事件
      messageWebSocket.on('newMessage', (messageData) => {
        // 通过通知组件显示新消息
        if (notificationRef.value) {
          notificationRef.value.handleWebSocketMessage({
            type: 'message',
            data: messageData
          });
        }
        
        // 更新未读消息数量
        store.dispatch('message/loadUnreadCounts');
      });
      
      // 监听连接状态
      messageWebSocket.on('connected', () => {
        console.log('WebSocket连接成功');
      });
      
      messageWebSocket.on('disconnected', () => {
        console.log('WebSocket连接断开');
      });
      
      messageWebSocket.on('error', (error) => {
        console.error('WebSocket连接错误:', error);
      });
      
      messageWebSocket.on('systemBroadcast', (data) => {
        // 处理系统广播
        if (notificationRef.value) {
          notificationRef.value.handleWebSocketMessage({
            type: 'systemBroadcast',
            data: data
          });
        }
      });
      
      messageWebSocket.on('contestUpdate', (data) => {
        // 处理比赛更新
        console.log('比赛更新:', data);
      });
      
      // 建立连接
      messageWebSocket.connectGeneral(user.id);
      
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }
};

onMounted(() => {
  doInit();
});

// 组件卸载时断开WebSocket连接
onUnmounted(() => {
  messageWebSocket.disconnect();
});

const debounce = (callback: (...args: any[]) => void, delay: number) => {
  let tid: any;
  return function (...args: any[]) {
    const ctx = self;
    tid && clearTimeout(tid);
    tid = setTimeout(() => {
      callback.apply(ctx, args);
    }, delay);
  };
};

const _ = (window as any).ResizeObserver;
(window as any).ResizeObserver = class ResizeObserver extends _ {
  constructor(callback: (...args: any[]) => void) {
    callback = debounce(callback, 20);
    super(callback);
  }
};
</script>
