<template>
  <div class="message-list-container">
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <icon-notification class="header-icon" />
          <h2>消息列表</h2>
          <a-badge v-if="unreadCount > 0" :count="unreadCount" :max="99" />
        </div>
        <div class="header-actions">
          <a-space>
            <a-button
              type="outline"
              @click="markAllAsRead"
              :loading="markAllLoading"
              :disabled="unreadCount === 0"
            >
              <template #icon>
                <icon-check />
              </template>
              全部已读
            </a-button>
            <a-button
              type="outline"
              status="danger"
              @click="showBatchDeleteModal"
              :disabled="selectedKeys.length === 0"
            >
              <template #icon>
                <icon-delete />
              </template>
              批量删除
            </a-button>
            <a-button type="primary" @click="refresh">
              <template #icon>
                <icon-refresh />
              </template>
              刷新
            </a-button>
          </a-space>
        </div>
      </div>
    </div>

    <div class="message-content">
      <div class="filter-tabs">
        <a-button
          type="text"
          @click="activeTab = 'all'"
          :class="{ active: activeTab === 'all' }"
          class="tab-button"
        >
          <icon-list />
          <span>全部消息</span>
        </a-button>
        <a-button
          type="text"
          @click="activeTab = 'unread'"
          :class="{ active: activeTab === 'unread' }"
          class="tab-button"
        >
          <icon-notification />
          <span>未读消息</span>
          <a-badge v-if="unreadCount > 0" :count="unreadCount" :max="99" />
        </a-button>
        <a-button
          type="text"
          @click="activeTab = 'system'"
          :class="{ active: activeTab === 'system' }"
          class="tab-button"
        >
          <icon-exclamation-circle />
          <span>系统通知</span>
        </a-button>
      </div>

      <div class="table-container">
        <a-spin :loading="loading || systemLoading" class="loading-spinner">
          <!-- 消息提醒列表 -->
          <div v-if="activeTab === 'all' || activeTab === 'unread'" class="message-table">
            <a-table
              :columns="messageColumns"
              :data="messageList"
              :pagination="pagination"
              :row-selection="rowSelection"
              :loading="loading"
              @page-change="handlePageChange"
              @page-size-change="handlePageSizeChange"
              row-key="id"
              :bordered="false"
              size="large"
              class="modern-table"
            >
              <template #state="{ record }">
                <a-tag :color="record.state === 0 ? 'red' : 'green'" class="status-tag">
                  {{ record.state === 0 ? '未读' : '已读' }}
                </a-tag>
              </template>
              <template #createTime="{ record }">
                <div class="time-cell">
                  {{ formatTime(record.createTime) }}
                </div>
              </template>
              <template #action="{ record }">
                <a-space class="action-buttons">
                  <a-button type="text" size="small" @click="viewMessage(record)" class="action-btn view-btn">
                    <template #icon>
                      <icon-eye />
                    </template>
                    查看
                  </a-button>
                  <a-button v-if="record.state === 0" type="text" size="small" @click="markAsRead(record.id)" class="action-btn read-btn">
                    <template #icon>
                      <icon-check />
                    </template>
                    已读
                  </a-button>
                  <a-button type="text" size="small" status="danger" @click="deleteMessage(record.id)" class="action-btn delete-btn">
                    <template #icon>
                      <icon-delete />
                    </template>
                    删除
                  </a-button>
                </a-space>
              </template>
            </a-table>
          </div>

          <!-- 系统通知列表 -->
          <div v-else-if="activeTab === 'system'" class="system-table">
            <a-table
              :columns="systemNoticeColumns"
              :data="systemNoticeList"
              :pagination="systemPagination"
              :row-selection="systemRowSelection"
              :loading="systemLoading"
              @page-change="handleSystemPageChange"
              @page-size-change="handleSystemPageSizeChange"
              row-key="id"
              :bordered="false"
              size="large"
              class="modern-table"
            >
              <template #state="{ record }">
                <a-tag :color="record.state === 0 ? 'red' : 'green'" class="status-tag">
                  {{ record.state === 0 ? '未读' : '已读' }}
                </a-tag>
              </template>
              <template #createTime="{ record }">
                <div class="time-cell">
                  {{ formatTime(record.noticeCreateTime) }}
                </div>
              </template>
              <template #action="{ record }">
                <a-space class="action-buttons">
                  <a-button type="text" size="small" @click="viewSystemNotice(record)" class="action-btn view-btn">
                    <template #icon>
                      <icon-eye />
                    </template>
                    查看
                  </a-button>
                  <a-button type="text" size="small" status="danger" @click="deleteSystemNotice(record.id)" class="action-btn delete-btn">
                    <template #icon>
                      <icon-delete />
                    </template>
                    删除
                  </a-button>
                </a-space>
              </template>
            </a-table>
          </div>
        </a-spin>
      </div>
    </div>

    <!-- 消息详情弹窗 -->
    <a-modal
      v-model:visible="messageDetailVisible"
      title="消息详情"
      :footer="false"
      width="700px"
      class="detail-modal"
    >
      <div v-if="currentMessage" class="message-detail">
        <div class="detail-header">
          <div class="sender-info">
            <a-avatar :src="currentMessage.senderAvatar" :size="48">
              <template #trigger-icon>
                <icon-user />
              </template>
            </a-avatar>
            <div class="sender-details">
              <div class="sender-name">{{ currentMessage.senderName }}</div>
              <div class="action-info">
                <a-tag :color="getActionColor(currentMessage.action)">
                  {{ getActionText(currentMessage.action) }}
                </a-tag>
                <span>了你的{{ getSourceTypeText(currentMessage.sourceType) }}</span>
              </div>
            </div>
          </div>
          <div class="message-meta">
            <div class="message-time">{{ formatTime(currentMessage.createTime) }}</div>
          </div>
        </div>

        <div class="detail-content">
          <div v-if="currentMessage.sourceContent" class="content-section">
            <div class="content-label">
              <icon-file-text />
              原内容
            </div>
            <div class="content-text">{{ currentMessage.sourceContent }}</div>
          </div>
        </div>

        <div v-if="currentMessage.url" class="detail-actions">
          <a-button type="primary" @click="goToSource(currentMessage.url)">
            <template #icon>
              <icon-link />
            </template>
            查看详情
          </a-button>
        </div>
      </div>
    </a-modal>

    <!-- 系统通知详情弹窗 -->
    <a-modal
      v-model:visible="systemNoticeDetailVisible"
      title="系统通知详情"
      :footer="false"
      width="700px"
      class="detail-modal"
    >
      <div v-if="currentSystemNotice" class="system-notice-detail">
        <div class="detail-header">
          <div class="notice-header">
            <div class="notice-title">{{ currentSystemNotice.noticeTitle }}</div>
            <div class="notice-meta">
              <a-tag :color="getNoticeTypeColor(currentSystemNotice.noticeType)">
                {{ getNoticeTypeText(currentSystemNotice.noticeType) }}
              </a-tag>
              <span class="notice-time">{{ formatTime(currentSystemNotice.noticeCreateTime) }}</span>
            </div>
          </div>
        </div>

        <div class="detail-content">
          <div class="notice-content" v-html="currentSystemNotice.noticeContent"></div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { Message, Modal } from '@arco-design/web-vue'
import {
  IconRefresh,
  IconNotification,
  IconExclamationCircle,
  IconCheck,
  IconDelete,
  IconList,
  IconEye,
  IconUser,
  IconFile,
  IconLink
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

const activeTab = ref('all')
const loading = ref(false)
const systemLoading = ref(false)
const markAllLoading = ref(false)
const messageDetailVisible = ref(false)
const systemNoticeDetailVisible = ref(false)

const messageList = ref<MsgRemindVO[]>([])
const systemNoticeList = ref<UserSysNoticeVO[]>([])
const currentMessage = ref<MsgRemindVO | null>(null)
const currentSystemNotice = ref<UserSysNoticeVO | null>(null)
const unreadCount = ref(0)

const selectedKeys = ref<number[]>([])
const systemSelectedKeys = ref<number[]>([])

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: true,
  showPageSize: true,
  pageSizeOptions: ['10', '20', '50', '100']
})

const systemPagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: true,
  showPageSize: true,
  pageSizeOptions: ['10', '20', '50', '100']
})

const messageColumns = [
  {
    title: '发送者',
    dataIndex: 'senderName',
    width: 120
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 100,
    render: ({ record }: { record: MsgRemindVO }) => getActionText(record.action)
  },
  {
    title: '来源',
    dataIndex: 'sourceType',
    width: 100,
    render: ({ record }: { record: MsgRemindVO }) => getSourceTypeText(record.sourceType)
  },
  {
    title: '内容',
    dataIndex: 'sourceContent',
    ellipsis: true,
    tooltip: true
  },
  {
    title: '状态',
    dataIndex: 'state',
    slotName: 'state',
    width: 80
  },
  {
    title: '时间',
    dataIndex: 'createTime',
    slotName: 'createTime',
    width: 160
  },
  {
    title: '操作',
    slotName: 'action',
    width: 150,
    fixed: 'right'
  }
]

const systemNoticeColumns = [
  {
    title: '标题',
    dataIndex: 'noticeTitle',
    ellipsis: true,
    tooltip: true
  },
  {
    title: '类型',
    dataIndex: 'noticeType',
    width: 100,
    render: ({ record }: { record: UserSysNoticeVO }) => getNoticeTypeText(record.noticeType)
  },
  {
    title: '状态',
    dataIndex: 'state',
    slotName: 'state',
    width: 80
  },
  {
    title: '时间',
    dataIndex: 'noticeCreateTime',
    slotName: 'createTime',
    width: 160
  },
  {
    title: '操作',
    slotName: 'action',
    width: 120,
    fixed: 'right'
  }
]

const rowSelection = computed(() => ({
  selectedRowKeys: selectedKeys.value,
  onSelect: (rowKeys: number[]) => {
    selectedKeys.value = rowKeys
  },
  onSelectAll: (selected: boolean) => {
    if (selected) {
      selectedKeys.value = messageList.value.map(item => item.id!)
    } else {
      selectedKeys.value = []
    }
  }
}))

const systemRowSelection = computed(() => ({
  selectedRowKeys: systemSelectedKeys.value,
  onSelect: (rowKeys: number[]) => {
    systemSelectedKeys.value = rowKeys
  },
  onSelectAll: (selected: boolean) => {
    if (selected) {
      systemSelectedKeys.value = systemNoticeList.value.map(item => item.id!)
    } else {
      systemSelectedKeys.value = []
    }
  }
}))

const formatTime = (time: string | undefined) => {
  if (!time) return ''
  return moment(time).format('YYYY-MM-DD HH:mm:ss')
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

const loadMessages = async () => {
  loading.value = true
  try {
    const isUnreadOnly = activeTab.value === 'unread'
    const response = isUnreadOnly
      ? await MsgRemindControllerService.unreadPageUsingGet(pagination.value.current, pagination.value.pageSize)
      : await MsgRemindControllerService.pageUsingGet(pagination.value.current, pagination.value.pageSize)

    if (response.code === 200 && response.data) {
      messageList.value = response.data.records || []
      pagination.value.total = response.data.total || 0
    }
  } catch (error) {
    console.error('加载消息失败:', error)
    Message.error('加载消息失败')
  } finally {
    loading.value = false
  }
}

const loadSystemNotices = async () => {
  systemLoading.value = true
  try {
    const loginUser = store.state.user.loginUser
    const response = await UserSysNoticeControllerService.pageUsingGet1(
      systemPagination.value.current,
      systemPagination.value.pageSize,
      loginUser.id
    )

    if (response.code === 200 && response.data) {
      systemNoticeList.value = response.data.records || []
      systemPagination.value.total = response.data.total || 0
    }
  } catch (error) {
    console.error('加载系统通知失败:', error)
    Message.error('加载系统通知失败')
  } finally {
    systemLoading.value = false
  }
}

const loadUnreadCount = async () => {
  try {
    const response = await MsgRemindControllerService.getUnreadCountUsingGet1()
    if (response.code === 200 && response.data !== undefined) {
      unreadCount.value = response.data
    }
  } catch (error) {
    console.error('加载未读数量失败:', error)
  }
}

const handlePageChange = (page: number) => {
  pagination.value.current = page
  loadMessages()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize
  pagination.value.current = 1
  loadMessages()
}

const handleSystemPageChange = (page: number) => {
  systemPagination.value.current = page
  loadSystemNotices()
}

const handleSystemPageSizeChange = (pageSize: number) => {
  systemPagination.value.pageSize = pageSize
  systemPagination.value.current = 1
  loadSystemNotices()
}

const viewMessage = (message: MsgRemindVO) => {
  currentMessage.value = message
  messageDetailVisible.value = true

  if (message.state === 0) {
    markAsRead(message.id!)
  }
}

const viewSystemNotice = (notice: UserSysNoticeVO) => {
  currentSystemNotice.value = notice
  systemNoticeDetailVisible.value = true
}

const markAsRead = async (id: number) => {
  try {
    const response = await MsgRemindControllerService.markAsReadUsingPost(id)
    if (response.code === 200) {
      const message = messageList.value.find(m => m.id === id)
      if (message) {
        message.state = 1
      }
      loadUnreadCount()
      Message.success('标记已读成功')
    }
  } catch (error) {
    console.error('标记已读失败:', error)
    Message.error('标记已读失败')
  }
}

const markAllAsRead = async () => {
  markAllLoading.value = true
  try {
    const response = await MsgRemindControllerService.markAllAsReadUsingPost()
    if (response.code === 200) {
      Message.success('全部标记已读成功')
      loadMessages()
      loadUnreadCount()
    }
  } catch (error) {
    console.error('全部标记已读失败:', error)
    Message.error('全部标记已读失败')
  } finally {
    markAllLoading.value = false
  }
}

const deleteMessage = async (id: number) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条消息吗？',
    onOk: async () => {
      try {
        const response = await MsgRemindControllerService.deleteMessageUsingPost(id)
        if (response.code === 200) {
          Message.success('删除成功')
          loadMessages()
          loadUnreadCount()
        }
      } catch (error) {
        console.error('删除失败:', error)
        Message.error('删除失败')
      }
    }
  })
}

const deleteSystemNotice = async (id: number) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条系统通知吗？',
    onOk: async () => {
      try {
        const loginUser = store.state.user.loginUser
        const response = await UserSysNoticeControllerService.deleteUsingPost(id, loginUser.id)
        if (response.code === 200) {
          Message.success('删除成功')
          loadSystemNotices()
        }
      } catch (error) {
        console.error('删除失败:', error)
        Message.error('删除失败')
      }
    }
  })
}

const showBatchDeleteModal = () => {
  Modal.confirm({
    title: '确认批量删除',
    content: `确定要删除选中的 ${selectedKeys.value.length} 条消息吗？`,
    onOk: async () => {
      try {
        const response = await MsgRemindControllerService.batchDeleteMessageUsingPost(selectedKeys.value)
        if (response.code === 200) {
          Message.success('批量删除成功')
          selectedKeys.value = []
          loadMessages()
          loadUnreadCount()
        }
      } catch (error) {
        console.error('批量删除失败:', error)
        Message.error('批量删除失败')
      }
    }
  })
}

const goToSource = (url: string) => {
  if (url.startsWith('http')) {
    window.open(url, '_blank')
  } else {
    router.push(url)
  }
  messageDetailVisible.value = false
}

const refresh = () => {
  if (activeTab.value === 'system') {
    loadSystemNotices()
  } else {
    loadMessages()
  }
  loadUnreadCount()
}

onMounted(() => {
  loadMessages()
  loadUnreadCount()
})

// 监听tab切换
watch(activeTab, (newTab) => {
  if (newTab === 'system') {
    loadSystemNotices()
  } else {
    loadMessages()
  }
  selectedKeys.value = []
  systemSelectedKeys.value = []
})
</script>

<style lang="less" scoped>
.message-list-container {
  padding: 24px;
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  margin-bottom: 24px;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 20px 24px;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);

    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;

      .header-icon {
        font-size: 24px;
        color: #1890ff;
      }

      h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: #1a1a1a;
      }
    }

    .header-actions {
      .arco-btn {
        border-radius: 20px;
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

.message-content {
  .filter-tabs {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 16px 24px;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: none;
    display: flex;
    gap: 8px;

    .tab-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 12px;
      font-weight: 500;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        height: 100%;
        background: linear-gradient(90deg, #1890ff, #40a9ff);
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

  .table-container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 0 0 16px 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-top: none;
    overflow: hidden;

    .loading-spinner {
      min-height: 200px;
    }

    .modern-table {
      .arco-table-th {
        background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        border-bottom: 2px solid #e5e7eb;
        font-weight: 600;
        color: #374151;
        padding: 16px 12px;
      }

      .arco-table-td {
        padding: 16px 12px;
        border-bottom: 1px solid #f3f4f6;

        &:hover {
          background-color: rgba(24, 144, 255, 0.03);
        }
      }

      .arco-table-tr {
        transition: all 0.2s ease;

        &:hover {
          background-color: rgba(24, 144, 255, 0.05);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      }

      .status-tag {
        font-weight: 500;
        border-radius: 12px;
        padding: 4px 12px;
        font-size: 11px;
      }

      .time-cell {
        font-size: 13px;
        color: #6b7280;
        background: rgba(107, 114, 128, 0.1);
        padding: 4px 8px;
        border-radius: 8px;
        display: inline-block;
      }

      .action-buttons {
        .action-btn {
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          &.view-btn:hover {
            color: #1890ff;
            background: rgba(24, 144, 255, 0.1);
          }

          &.read-btn:hover {
            color: #52c41a;
            background: rgba(82, 196, 26, 0.1);
          }

          &.delete-btn:hover {
            background: rgba(255, 77, 79, 0.1);
          }
        }
      }
    }
  }
}

.detail-modal {
  .arco-modal-header {
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    border-bottom: 2px solid #e5e7eb;
    border-radius: 8px 8px 0 0;
  }

  .arco-modal-body {
    padding: 24px;
  }

  .message-detail,
  .system-notice-detail {
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

      .notice-header {
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
      }

      .message-meta {
        .message-time {
          font-size: 13px;
          color: #999;
          background: rgba(153, 153, 153, 0.1);
          padding: 4px 12px;
          border-radius: 12px;
          display: inline-block;
        }
      }
    }

    .detail-content {
      margin-bottom: 20px;

      .content-section {
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
      text-align: right;

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

// 响应式设计
@media (max-width: 768px) {
  .message-list-container {
    padding: 16px;

    .page-header .header-content {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }

    .filter-tabs {
      flex-direction: column;
      gap: 8px;

      .tab-button {
        justify-content: center;
      }
    }
  }
}
</style>
