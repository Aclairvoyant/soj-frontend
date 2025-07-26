// 基于新消息系统API的优化Vuex模块
import { Module } from 'vuex';
import { MessageAPI } from '@/services/api/MessageAPI';
import { messageWebSocket } from '@/services/websocket/EnhancedWebSocketManager';
import { NewMessageVO, MessageCategory, MessageType } from '@/types/message';

interface MessageState {
  // 消息列表
  messages: NewMessageVO[];
  currentPage: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  loading: boolean;

  // 未读消息统计
  unreadCounts: {
    system: number;
    social: number;
    academic: number;
    contest: number;
    admin: number;
  };

  // 推送设置
  pushSettings: {
    enableWebNotification: boolean;
    enableEmailNotification: boolean;
    enableSMSNotification: boolean;
    mutedCategories: string[];
    mutedUsers: number[];
    quietHours: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };

  // 当前选中的分类
  activeCategory: string;

  // 连接状态
  wsConnected: boolean;
  wsReconnecting: boolean;
}

const messageModule: Module<MessageState, any> = {
  namespaced: true,

  state: (): MessageState => ({
    messages: [],
    currentPage: 1,
    pageSize: 20,
    total: 0,
    hasMore: true,
    loading: false,

    unreadCounts: {
      system: 0,
      social: 0,
      academic: 0,
      contest: 0,
      admin: 0
    },

    pushSettings: {
      enableWebNotification: true,
      enableEmailNotification: false,
      enableSMSNotification: false,
      mutedCategories: [],
      mutedUsers: [],
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00'
      }
    },

    activeCategory: '',
    wsConnected: false,
    wsReconnecting: false
  }),

  getters: {
    // 总未读数
    totalUnreadCount: (state) => {
      return Object.values(state.unreadCounts).reduce((sum, count) => sum + count, 0);
    },

    // 过滤后的消息
    filteredMessages: (state) => {
      if (!state.activeCategory) {
        return state.messages;
      }
      return state.messages.filter(msg => msg.category === state.activeCategory);
    },

    // 获取指定分类的未读数
    getCategoryUnreadCount: (state) => (category: string) => {
      return state.unreadCounts[category as keyof typeof state.unreadCounts] || 0;
    },

    // 是否在免打扰时间
    isQuietTime: (state) => {
      if (!state.pushSettings.quietHours.enabled) {
        return false;
      }

      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const startParts = state.pushSettings.quietHours.startTime.split(':');
      const endParts = state.pushSettings.quietHours.endTime.split(':');

      const startTime = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
      const endTime = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

      if (startTime < endTime) {
        return currentTime >= startTime && currentTime <= endTime;
      } else {
        // 跨天的情况
        return currentTime >= startTime || currentTime <= endTime;
      }
    }
  },

  mutations: {
    // 设置消息列表
    SET_MESSAGES(state, messages: NewMessageVO[]) {
      state.messages = messages;
    },

    // 添加消息到列表开头
    ADD_MESSAGE(state, message: NewMessageVO) {
      state.messages.unshift(message);
    },

    // 添加消息到列表末尾
    APPEND_MESSAGES(state, messages: NewMessageVO[]) {
      state.messages.push(...messages);
    },

    // 更新消息状态
    UPDATE_MESSAGE(state, { messageId, updates }: { messageId: number, updates: Partial<NewMessageVO> }) {
      const index = state.messages.findIndex(msg => msg.id === messageId);
      if (index !== -1) {
        Object.assign(state.messages[index], updates);
      }
    },

    // 删除消息
    REMOVE_MESSAGE(state, messageId: number) {
      const index = state.messages.findIndex(msg => msg.id === messageId);
      if (index !== -1) {
        state.messages.splice(index, 1);
      }
    },

    // 设置分页信息
    SET_PAGINATION(state, { currentPage, total, hasMore }: { currentPage: number, total: number, hasMore: boolean }) {
      state.currentPage = currentPage;
      state.total = total;
      state.hasMore = hasMore;
    },

    // 设置加载状态
    SET_LOADING(state, loading: boolean) {
      state.loading = loading;
    },

    // 设置未读数
    SET_UNREAD_COUNTS(state, counts: Partial<typeof state.unreadCounts>) {
      Object.assign(state.unreadCounts, counts);
    },

    // 更新单个分类的未读数
    UPDATE_UNREAD_COUNT(state, { category, count }: { category: string, count: number }) {
      if (category in state.unreadCounts) {
        (state.unreadCounts as any)[category] = count;
      }
    },

    // 减少未读数
    DECREASE_UNREAD_COUNT(state, category: string) {
      if (category in state.unreadCounts && (state.unreadCounts as any)[category] > 0) {
        (state.unreadCounts as any)[category]--;
      }
    },

    // 设置推送设置
    SET_PUSH_SETTINGS(state, settings: Partial<typeof state.pushSettings>) {
      Object.assign(state.pushSettings, settings);
    },

    // 设置当前分类
    SET_ACTIVE_CATEGORY(state, category: string) {
      state.activeCategory = category;
    },

    // 设置WebSocket连接状态
    SET_WS_CONNECTED(state, connected: boolean) {
      state.wsConnected = connected;
    },

    // 设置WebSocket重连状态
    SET_WS_RECONNECTING(state, reconnecting: boolean) {
      state.wsReconnecting = reconnecting;
    }
  },

  actions: {
    // 初始化消息模块
    async initialize({ dispatch }: any, userId: number) {
      try {
        // 初始化时获取未读消息数量
        await dispatch('loadUnreadCounts');

        // 获取推送设置
        await dispatch('loadPushSettings');

        // 初始化WebSocket连接
        dispatch('initWebSocket');

        console.log('消息模块初始化完成:', userId);
      } catch (error) {
        console.error('消息模块初始化失败:', error);
        // 不抛出错误，让应用继续运行
      }
    },

    // updateUnreadCount 别名，兼容旧代码
    async updateUnreadCount({ dispatch }: any) {
      return await dispatch('loadUnreadCounts');
    },

    // fetchPushSettings 别名，兼容旧代码
    async fetchPushSettings({ dispatch }: any) {
      return await dispatch('loadPushSettings');
    },

    // 获取未读消息列表
    async fetchUnreadMessages({ commit }, { category, limit }: { category?: string, limit?: number } = {}) {
      try {
        const response = await MessageAPI.getUnreadMessages({
          category,
          limit: limit || 20
        });
        
        if (response.code === 200 && response.data) {
          const messages = Array.isArray(response.data) ? response.data : [];
          return messages;
        }
        
        console.warn('Invalid response format for unread messages:', response);
        return [];
      } catch (error) {
        console.error('Failed to fetch unread messages:', error);
        return [];
      }
    },

    // 标记消息为未读 (兼容旧代码)
    async markAsUnread({ commit, state }, messageId: number) {
      try {
        // 注意：这里假设后端有对应的API，如果没有需要添加
        // 临时实现：直接更新本地状态
        const message = state.messages.find(msg => msg.id === messageId);
        if (message) {
          commit('UPDATE_MESSAGE', {
            messageId,
            updates: { status: 0, readTime: null }
          });

          // 更新未读数
          if (message.category) {
            const currentCount = state.unreadCounts[message.category as keyof typeof state.unreadCounts] || 0;
            commit('UPDATE_UNREAD_COUNT', { category: message.category, count: currentCount + 1 });
          }
        }

        return { code: 200, message: 'success' };
      } catch (error) {
        console.error('Failed to mark message as unread:', error);
        throw error;
      }
    },

    // 加载消息列表
    async loadMessages({ commit, state }, { reset = true, category = '' } = {}) {
      if (state.loading) return;

      commit('SET_LOADING', true);

      try {
        const page = reset ? 1 : state.currentPage + 1;

        const response = await MessageAPI.getMessages({
          pageNum: page,
          pageSize: state.pageSize,
          category: category || undefined,
          status: undefined
        });

        if (response.code === 200) {
          const { records, total, current, pages } = response.data;

          if (reset) {
            commit('SET_MESSAGES', records);
          } else {
            commit('APPEND_MESSAGES', records);
          }

          commit('SET_PAGINATION', {
            currentPage: current,
            total,
            hasMore: current < pages
          });
        }

      } catch (error) {
        console.error('加载消息失败:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // 加载未读消息数量
    async loadUnreadCounts({ commit }) {
      try {
        const response = await MessageAPI.getUnreadCount();
        if (response.code === 200) {
          commit('SET_UNREAD_COUNTS', response.data);
        }
      } catch (error) {
        console.error('获取未读数量失败:', error);
      }
    },

    // 标记消息为已读
    async markAsRead({ commit, state }, messageId: number) {
      try {
        const response = await MessageAPI.markAsRead(messageId);
        if (response.code === 200) {
          const message = state.messages.find(msg => msg.id === messageId);
          if (message && message.status === 200) {
            commit('UPDATE_MESSAGE', {
              messageId,
              updates: { status: 1, readTime: new Date().toISOString() }
            });

            // 更新未读数
            if (message.category) {
              commit('DECREASE_UNREAD_COUNT', message.category);
            }
          }
        }
      } catch (error) {
        console.error('标记已读失败:', error);
        throw error;
      }
    },

    // 批量标记已读
    async markAllAsRead({ commit, state }, category?: string) {
      try {
        const response = await MessageAPI.markAllAsRead(category);
        if (response.code === 200) {
          // 更新本地消息状态
          state.messages.forEach(message => {
            if (!category || message.category === category) {
              if (message.status === 200) {
                commit('UPDATE_MESSAGE', {
                  messageId: message.id,
                  updates: { status: 1, readTime: new Date().toISOString() }
                });
              }
            }
          });

          // 更新未读数
          if (category) {
            commit('UPDATE_UNREAD_COUNT', { category, count: 0 });
          } else {
            const zeroCounts = Object.keys(state.unreadCounts).reduce((acc, key) => {
              acc[key] = 0;
              return acc;
            }, {} as any);
            commit('SET_UNREAD_COUNTS', zeroCounts);
          }
        }
      } catch (error) {
        console.error('全部标记已读失败:', error);
        throw error;
      }
    },

    // 删除消息
    async deleteMessage({ commit, state }, messageId: number) {
      try {
        const response = await MessageAPI.deleteMessage(messageId);
        if (response.code === 200) {
          const message = state.messages.find(msg => msg.id === messageId);

          commit('REMOVE_MESSAGE', messageId);

          // 如果是未读消息，更新未读数
          if (message && message.status === 0 && message.category) {
            commit('DECREASE_UNREAD_COUNT', message.category);
          }
        }
      } catch (error) {
        console.error('删除消息失败:', error);
        throw error;
      }
    },

    // 加载推送设置
    async loadPushSettings({ commit }) {
      try {
        const response = await MessageAPI.getPushSettings();
        if (response.code === 200) {
          commit('SET_PUSH_SETTINGS', response.data);
        }
      } catch (error) {
        console.error('获取推送设置失败:', error);
      }
    },

    // 保存推送设置
    async savePushSettings({ commit }, settings: Partial<MessageState['pushSettings']>) {
      try {
        const response = await MessageAPI.updatePushSettings(settings);
        if (response.code === 200) {
          commit('SET_PUSH_SETTINGS', settings);
        }
        return response; // 返回API响应
      } catch (error) {
        console.error('保存推送设置失败:', error);
        throw error;
      }
    },

    // updatePushSettings 别名，兼容旧代码
    async updatePushSettings({ dispatch }, settings: any) {
      return await dispatch('savePushSettings', settings);
    },

    // 初始化WebSocket连接
    initWebSocket({ commit, dispatch }) {
      // 连接WebSocket
      messageWebSocket.connectGeneral();

      // 监听连接状态
      messageWebSocket.on('connected', () => {
        commit('SET_WS_CONNECTED', true);
        commit('SET_WS_RECONNECTING', false);
      });

      messageWebSocket.on('disconnected', () => {
        commit('SET_WS_CONNECTED', false);
      });

      messageWebSocket.on('reconnectFailed', () => {
        commit('SET_WS_RECONNECTING', false);
      });

      // 监听新消息
      messageWebSocket.on('newMessage', (data: NewMessageVO) => {
        commit('ADD_MESSAGE', data);

        // 更新未读数
        if (data.category) {
          const currentCount = this.getters['message/getCategoryUnreadCount'](data.category);
          commit('UPDATE_UNREAD_COUNT', { category: data.category, count: currentCount + 1 });
        }
      });

      // 监听系统广播
      messageWebSocket.on('systemBroadcast', (data: any) => {
        // 系统广播可以在这里处理特殊逻辑
        console.log('收到系统广播:', data);
      });

      // 监听连接错误
      messageWebSocket.on('connectionError', () => {
        commit('SET_WS_RECONNECTING', true);
      });
    },

    // 切换分类
    async switchCategory({ commit, dispatch }, category: string) {
      commit('SET_ACTIVE_CATEGORY', category);
      await dispatch('loadMessages', { reset: true, category });
    },

    // 刷新数据
    async refresh({ dispatch, state }) {
      await Promise.all([
        dispatch('loadMessages', { reset: true, category: state.activeCategory }),
        dispatch('loadUnreadCounts')
      ]);
    }
  }
};

export default messageModule;
