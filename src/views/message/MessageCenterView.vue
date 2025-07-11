<template>
  <div class="message-center-container">
    <a-row :gutter="16">
      <!-- 左侧消息列表 -->
      <a-col :span="8">
        <a-card class="message-sidebar" :bordered="false">
          <template #title>
            <div class="sidebar-header">
              <span>消息中心</span>
              <a-badge v-if="unreadCount > 0" :count="unreadCount" />
            </div>
          </template>
          <template #extra>
            <a-button type="text" @click="refresh">
              <template #icon>
                <icon-refresh />
              </template>
            </a-button>
          </template>

          <div class="message-tabs">
            <a-button
              type="text"
              :class="{ active: activeTab === 'remind' }"
              @click="switchTab('remind')"
              class="tab-button"
            >
              <icon-notification />
              消息提醒
              <a-badge v-if="remindUnreadCount > 0" :count="remindUnreadCount" />
            </a-button>

            <a-button
              type="text"
              :class="{ active: activeTab === 'system' }"
              @click="switchTab('system')"
              class="tab-button"
            >
              <icon-exclamation-circle />
              系统通知
              <a-badge v-if="systemUnreadCount > 0" :count="systemUnreadCount" />
            </a-button>
          </div>

          <div class="message-list">
            <a-spin :loading="loading">
              <div v-if="messageList.length === 0" class="empty-message">
                <a-empty description="暂无消息" />
              </div>
              <div v-else>
                <div
                  v-for="message in messageList"
                  :key="message.id"
                  class="message-item"
                  :class="{
                    active: selectedMessage?.id === message.id,
                    unread: message.state === 0
                  }"
                  @click="selectMessage(message)"
                >
                  <div class="message-item-content">
                    <div class="message-header">
                      <span class="message-title">
                        {{ getMessageTitle(message) }}
                      </span>
                      <span class="message-time">
                        {{ formatTime(message.createTime || message.noticeCreateTime) }}
                      </span>
                    </div>
                    <div class="message-summary">
                      {{ getMessageSummary(message) }}
                    </div>
                  </div>
                  <div v-if="message.state === 0" class="unread-indicator"></div>
                </div>
              </div>
            </a-spin>
          </div>

          <div v-if="hasMore" class="load-more">
            <a-button type="text" @click="loadMore" :loading="loadingMore">
              加载更多
            </a-button>
          </div>
        </a-card>
      </a-col>

      <!-- 右侧消息详情 -->
      <a-col :span="16">
        <a-card class="message-detail-card" :bordered="false">
          <div v-if="!selectedMessage" class="no-selection">
            <a-empty description="请选择一条消息查看详情" />
          </div>

          <div v-else class="message-detail">
            <!-- 消息提醒详情 -->
            <div v-if="activeTab === 'remind'" class="remind-detail">
              <div class="detail-header">
                <div class="sender-info">
                  <a-avatar>
                    <img :src="selectedMessage.senderAvatar" />
                  </a-avatar>
                  <div class="sender-details">
                    <div class="sender-name">{{ selectedMessage.senderName }}</div>
                    <div class="action-info">
                      <a-tag :color="getActionColor(selectedMessage.action)">
                        {{ getActionText(selectedMessage.action) }}
                      </a-tag>
                      <span>了你的{{ getSourceTypeText(selectedMessage.sourceType) }}</span>
                    </div>
                  </div>
                </div>
                <div class="message-time">
                  {{ formatTime(selectedMessage.createTime) }}
                </div>
              </div>

              <div class="detail-content">
                <div v-if="selectedMessage.sourceContent" class="source-content">
                  <div class="content-label">原内容:</div>
                  <div class="content-text">{{ selectedMessage.sourceContent }}</div>
                </div>

                <div v-if="selectedMessage.quoteId" class="quote-content">
                  <div class="content-label">引用内容:</div>
                  <div class="content-text">{{ selectedMessage.quoteContent }}</div>
                </div>
              </div>

              <div class="detail-actions">
                <a-space>
                  <a-button v-if="selectedMessage.url" type="primary" @click="goToSource">
                    查看详情
                  </a-button>
                  <a-button v-if="selectedMessage.state === 0" @click="markAsRead">
                    标记已读
                  </a-button>
                  <a-button status="danger" @click="deleteMessage">
                    删除
                  </a-button>
                </a-space>
              </div>
            </div>

            <!-- 系统通知详情 -->
            <div v-else-if="activeTab === 'system'" class="system-detail">
              <div class="detail-header">
                <div class="notice-title">{{ selectedMessage.noticeTitle }}</div>
                <div class="notice-meta">
                  <a-tag :color="getNoticeTypeColor(selectedMessage.noticeType)">
                    {{ getNoticeTypeText(selectedMessage.noticeType) }}
                  </a-tag>
                  <span class="notice-time">{{ formatTime(selectedMessage.noticeCreateTime) }}</span>
                </div>
              </div>

              <div class="detail-content">
                <div class="notice-content" v-html="selectedMessage.noticeContent"></div>
              </div>

              <div class="detail-actions">
                <a-space>
                  <a-button status="danger" @click="deleteSystemNotice">
                    删除
                  </a-button>
                </a-space>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import {
  IconRefresh,
  IconNotification,
  IconExclamationCircle,
  IconDown,
  IconMessage,
  IconUser,
  IconFile,
  IconQuote,
  IconLink,
  IconCheck,
  IconDelete
} from '@arco-design/web-vue/es/icon'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import moment from 'moment'
import {
  MsgRemindControllerService,
  UserSysNoticeControllerService
} from '../../../generated'
import type { MsgRemindVO, UserSysNoticeVO } from '../../../generated'

const router = useRouter()
const store = useStore()

const activeTab = ref<'remind' | 'system'>('remind')
const loading = ref(false)
const loadingMore = ref(false)
const messageList = ref<(MsgRemindVO | UserSysNoticeVO)[]>([])
const selectedMessage = ref<MsgRemindVO | UserSysNoticeVO | null>(null)
const unreadCount = ref(0)
const remindUnreadCount = ref(0)
const systemUnreadCount = ref(0)

const pageNum = ref(1)
const pageSize = ref(20)
const hasMore = ref(true)

const formatTime = (time: string | undefined) => {
  if (!time) return ''
  return moment(time).fromNow()
}

const getActionText = (action: string | undefined) => {
  const actionMap: Record<string, string> = {
    'LIKE': '点赞',
    'COMMENT': '评论',
    'REPLY': '回复',
    'FOLLOW': '关注',
    'MENTION': '提及'
  }
  return actionMap[action || ''] || action || ''
}

const getSourceTypeText = (sourceType: string | undefined) => {
  const sourceTypeMap: Record<string, string> = {
    'POST': '帖子',
    'COMMENT': '评论',
    'QUESTION': '题目',
    'SOLUTION': '题解'
  }
  return sourceTypeMap[sourceType || ''] || sourceType || ''
}

const getNoticeTypeText = (noticeType: string | undefined) => {
  const noticeTypeMap: Record<string, string> = {
    'SYSTEM': '系统通知',
    'ANNOUNCEMENT': '公告',
    'MAINTENANCE': '维护通知',
    'ACTIVITY': '活动通知'
  }
  return noticeTypeMap[noticeType || ''] || noticeType || ''
}

const getActionColor = (action: string | undefined) => {
  const colorMap: Record<string, string> = {
    'LIKE': 'red',
    'COMMENT': 'blue',
    'REPLY': 'green',
    'FOLLOW': 'purple',
    'MENTION': 'orange'
  }
  return colorMap[action || ''] || 'blue'
}

const getNoticeTypeColor = (noticeType: string | undefined) => {
  const colorMap: Record<string, string> = {
    'SYSTEM': 'blue',
    'ANNOUNCEMENT': 'green',
    'MAINTENANCE': 'orange',
    'ACTIVITY': 'purple'
  }
  return colorMap[noticeType || ''] || 'blue'
}

const getMessageTitle = (message: MsgRemindVO | UserSysNoticeVO) => {
  if ('noticeTitle' in message) {
    return message.noticeTitle || '系统通知'
  }
  return `${message.senderName} ${getActionText(message.action)}了你`
}

const getMessageSummary = (message: MsgRemindVO | UserSysNoticeVO) => {
  if ('noticeContent' in message) {
    const content = message.noticeContent || ''
    return content.length > 50 ? content.substring(0, 50) + '...' : content
  }
  return message.sourceContent || ''
}

const loadRemindMessages = async (append = false) => {
  loading.value = !append
  loadingMore.value = append

  try {
    const response = await MsgRemindControllerService.pageUsingGet(pageNum.value, pageSize.value)
    if (response.code === 200 && response.data) {
      const newMessages = response.data.records || []
      if (append) {
        messageList.value = [...messageList.value, ...newMessages]
      } else {
        messageList.value = newMessages
      }
      hasMore.value = (response.data.total || 0) > messageList.value.length
    }
  } catch (error) {
    console.error('加载消息提醒失败:', error)
    Message.error('加载消息提醒失败')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadSystemNotices = async (append = false) => {
  loading.value = !append
  loadingMore.value = append

  try {
    const loginUser = store.state.user.loginUser
    const response = await UserSysNoticeControllerService.pageUsingGet1(
      pageNum.value,
      pageSize.value,
      loginUser.id
    )
    if (response.code === 200 && response.data) {
      const newMessages = response.data.records || []
      if (append) {
        messageList.value = [...messageList.value, ...newMessages]
      } else {
        messageList.value = newMessages
      }
      hasMore.value = (response.data.total || 0) > messageList.value.length
    }
  } catch (error) {
    console.error('加载系统通知失败:', error)
    Message.error('加载系统通知失败')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadUnreadCounts = async () => {
  try {
    const remindResponse = await MsgRemindControllerService.getUnreadCountUsingGet1()
    if (remindResponse.code === 200 && remindResponse.data !== undefined) {
      remindUnreadCount.value = remindResponse.data
    }
  } catch (error) {
    console.error('加载未读数量失败:', error)
  }
}

const switchTab = (tab: 'remind' | 'system') => {
  activeTab.value = tab
  pageNum.value = 1
  selectedMessage.value = null
  hasMore.value = true

  if (tab === 'remind') {
    loadRemindMessages()
  } else {
    loadSystemNotices()
  }
}

const selectMessage = (message: MsgRemindVO | UserSysNoticeVO) => {
  selectedMessage.value = message

  // 如果是未读消息，自动标记为已读
  if (message.state === 0) {
    if (activeTab.value === 'remind') {
      markAsRead()
    }
  }
}

const markAsRead = async () => {
  if (!selectedMessage.value || selectedMessage.value.state === 1) return

  try {
    const response = await MsgRemindControllerService.markAsReadUsingPost(selectedMessage.value.id!)
    if (response.code === 200) {
      selectedMessage.value.state = 1
      // 更新列表中的状态
      const index = messageList.value.findIndex(m => m.id === selectedMessage.value!.id)
      if (index !== -1) {
        messageList.value[index].state = 1
      }
      loadUnreadCounts()
      Message.success('标记已读成功')
    }
  } catch (error) {
    console.error('标记已读失败:', error)
    Message.error('标记已读失败')
  }
}

const deleteMessage = async () => {
  if (!selectedMessage.value) return

  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条消息吗？',
    onOk: async () => {
      try {
        const response = await MsgRemindControllerService.deleteMessageUsingPost(selectedMessage.value!.id!)
        if (response.code === 200) {
          messageList.value = messageList.value.filter(m => m.id !== selectedMessage.value!.id)
          selectedMessage.value = null
          loadUnreadCounts()
          Message.success('删除成功')
        }
      } catch (error) {
        console.error('删除失败:', error)
        Message.error('删除失败')
      }
    }
  })
}

const deleteSystemNotice = async () => {
  if (!selectedMessage.value) return

  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条系统通知吗？',
    onOk: async () => {
      try {
        const loginUser = store.state.user.loginUser
        const response = await UserSysNoticeControllerService.deleteUsingPost(
          selectedMessage.value!.id!,
          loginUser.id
        )
        if (response.code === 200) {
          messageList.value = messageList.value.filter(m => m.id !== selectedMessage.value!.id)
          selectedMessage.value = null
          Message.success('删除成功')
        }
      } catch (error) {
        console.error('删除失败:', error)
        Message.error('删除失败')
      }
    }
  })
}

const goToSource = () => {
  const message = selectedMessage.value as MsgRemindVO
  if (message.url) {
    if (message.url.startsWith('http')) {
      window.open(message.url, '_blank')
    } else {
      router.push(message.url)
    }
  }
}

const loadMore = () => {
  pageNum.value += 1
  if (activeTab.value === 'remind') {
    loadRemindMessages(true)
  } else {
    loadSystemNotices(true)
  }
}

const refresh = () => {
  pageNum.value = 1
  hasMore.value = true
  selectedMessage.value = null

  if (activeTab.value === 'remind') {
    loadRemindMessages()
  } else {
    loadSystemNotices()
  }
  loadUnreadCounts()
}

// 计算总未读数量
const unreadCountComputed = computed(() => {
  return remindUnreadCount.value + systemUnreadCount.value
})

watch(unreadCountComputed, (newCount) => {
  unreadCount.value = newCount
})

onMounted(() => {
  loadRemindMessages()
  loadUnreadCounts()
})
</script>

<style lang="less" scoped>
.message-center-container {
  padding: 24px;
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.message-sidebar {
  height: 100%;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;

    span {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
    }
  }

  .message-tabs {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
    padding: 0 8px;

    .tab-button {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-radius: 12px;
      justify-content: flex-start;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: 500;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        height: 100%;

        transition: width 0.3s ease;
        z-index: 0;
      }

      > * {
        position: relative;
        z-index: 1;
      }

      &.active {
        color: #fff;
        background: linear-gradient(135deg, #1890ff, #40a9ff);
        box-shadow: 0 4px 20px rgba(24, 144, 255, 0.3);
        transform: translateY(-2px);

        &::before {
          width: 100%;
        }
      }

      &:hover:not(.active) {
        background: linear-gradient(135deg, #f0f9ff, #e6f7ff);
        color: #1890ff;
        transform: translateY(-1px);
        box-shadow: 0 2px 12px rgba(24, 144, 255, 0.15);
      }
    }
  }

  .message-list {
    max-height: calc(100vh - 380px);
    overflow-y: auto;
    padding: 0 8px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 10px;

      &:hover {
        background: #a8a8a8;
      }
    }

    .empty-message {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    .message-item {
      position: relative;
      padding: 16px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      margin-bottom: 12px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(0, 0, 0, 0.05);

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        height: 100%;
        background: linear-gradient(90deg, #1890ff, #40a9ff);
        border-radius: 12px 0 0 12px;
        transition: width 0.3s ease;
        opacity: 0;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);

        &::before {
          width: 4px;
          opacity: 1;
        }
      }

      &.active {
        background: linear-gradient(135deg, #e6f7ff, #bae7ff);
        border-color: #1890ff;
        box-shadow: 0 4px 24px rgba(24, 144, 255, 0.2);
        transform: translateY(-1px);

        &::before {
          width: 4px;
          opacity: 1;
        }
      }

      &.unread {
        background: linear-gradient(135deg, #fff7e6, #ffecc7);
        border-left: 4px solid #fa8c16;

        &::after {
          content: '';
          position: absolute;
          top: 16px;
          right: 16px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ff4d4f, #ff7875);
          box-shadow: 0 0 0 3px rgba(255, 77, 79, 0.2);
          animation: pulse 2s infinite;
        }
      }

      .message-item-content {
        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;

          .message-title {
            font-weight: 600;
            color: #1a1a1a;
            font-size: 14px;
            line-height: 1.4;
            flex: 1;
            margin-right: 8px;
          }

          .message-time {
            font-size: 11px;
            color: #999;
            white-space: nowrap;
            background: rgba(153, 153, 153, 0.1);
            padding: 2px 8px;
            border-radius: 10px;
          }
        }

        .message-summary {
          font-size: 12px;
          color: #666;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }

      .unread-indicator {
        display: none;
      }
    }
  }

  .load-more {
    text-align: center;
    padding: 20px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    margin-top: 16px;

    .arco-btn {
      border-radius: 20px;
      padding: 8px 24px;
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.message-detail-card {
  height: 100%;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  .no-selection {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999;

    .arco-empty-description {
      margin-top: 16px;
      font-size: 16px;
    }
  }

  .message-detail {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 24px;

    .detail-header {
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
      margin-bottom: 20px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 60px;
        height: 2px;
        background: linear-gradient(90deg, #1890ff, #40a9ff);
        border-radius: 1px;
      }

      .sender-info {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 12px;

        .arco-avatar {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.8);
        }

        .sender-details {
          flex: 1;

          .sender-name {
            font-weight: 600;
            color: #1a1a1a;
            font-size: 16px;
            margin-bottom: 4px;
          }

          .action-info {
            font-size: 13px;
            color: #666;
            display: flex;
            align-items: center;
            gap: 8px;

            .arco-tag {
              font-size: 11px;
              font-weight: 500;
              border-radius: 12px;
              padding: 2px 8px;
            }
          }
        }
      }

      .notice-title {
        font-size: 20px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 12px;
        line-height: 1.4;
      }

      .notice-meta {
        display: flex;
        align-items: center;
        gap: 16px;

        .arco-tag {
          font-weight: 500;
          border-radius: 12px;
          padding: 4px 12px;
        }

        .notice-time {
          font-size: 13px;
          color: #999;
          background: rgba(153, 153, 153, 0.1);
          padding: 4px 12px;
          border-radius: 12px;
        }
      }

      .message-time {
        font-size: 13px;
        color: #999;
        background: rgba(153, 153, 153, 0.1);
        padding: 4px 12px;
        border-radius: 12px;
        display: inline-block;
      }
    }

    .detail-content {
      flex: 1;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 10px;

        &:hover {
          background: #a8a8a8;
        }
      }

      .source-content,
      .quote-content {
        margin-bottom: 20px;

        .content-label {
          font-size: 13px;
          color: #666;
          margin-bottom: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;

          .arco-icon {
            color: #1890ff;
          }
        }

        .content-text {
          padding: 16px 20px;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 12px;
          line-height: 1.6;
          border: 1px solid rgba(0, 0, 0, 0.05);
          position: relative;

          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(180deg, #1890ff, #40a9ff);
            border-radius: 2px 0 0 2px;
          }
        }
      }

      .notice-content {
        padding: 20px 24px;
        background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        border-radius: 12px;
        line-height: 1.6;
        border: 1px solid rgba(0, 0, 0, 0.05);
        position: relative;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #1890ff, #40a9ff);
          border-radius: 2px 0 0 2px;
        }
      }
    }

    .detail-actions {
      padding-top: 20px;
      border-top: 2px solid #f0f0f0;
      margin-top: 20px;

      .arco-btn {
        border-radius: 20px;
        padding: 8px 20px;
        font-weight: 500;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        &.arco-btn-primary {
          background: linear-gradient(135deg, #1890ff, #40a9ff);
          border: none;

          &:hover {
            box-shadow: 0 4px 16px rgba(24, 144, 255, 0.3);
          }
        }
      }
    }
  }
}

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

// 响应式设计
@media (max-width: 768px) {
  .message-center-container {
    padding: 16px;

    .arco-row {
      flex-direction: column;

      .arco-col {
        width: 100% !important;
        margin-bottom: 16px;
      }
    }
  }
}
</style>
