<template>
  <div class="admin-message-container">
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <icon-message class="header-icon" />
          <h2>消息管理</h2>
        </div>
        <div class="header-actions">
          <a-space>
            <a-button type="primary" @click="showSendModal">
              <template #icon>
                <icon-plus />
              </template>
              发送消息
            </a-button>
            <a-button @click="refresh">
              <template #icon>
                <icon-refresh />
              </template>
              刷新
            </a-button>
          </a-space>
        </div>
      </div>
    </div>

    <div class="content-area">
      <div class="filter-section">
        <a-card class="filter-card" :bordered="false">
          <template #title>
            <div class="filter-header">
              <div class="filter-title">
                <icon-filter class="filter-icon" />
                <span>条件筛选</span>
              </div>
              <a-button type="text" @click="toggleAdvancedFilters" class="toggle-btn">
                <icon-down v-if="!showAdvancedFilters" />
                <icon-up v-else />
                {{ showAdvancedFilters ? '收起' : '展开' }}
              </a-button>
            </div>
          </template>

          <!-- 基础筛选 -->
          <a-row :gutter="16" class="basic-filters">
            <a-col :xl="6" :lg="8" :md="12" :sm="24">
              <a-form-item label="接收用户ID" class="filter-item">
                <a-input
                  v-model="searchForm.recipientId"
                  placeholder="请输入用户ID"
                  allow-clear
                  @change="handleSearch"
                >
                  <template #prefix>
                    <icon-user class="input-icon" />
                  </template>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="12" :sm="24">
              <a-form-item label="消息状态" class="filter-item">
                <a-select
                  v-model="searchForm.state"
                  placeholder="请选择状态"
                  allow-clear
                  @change="handleSearch"
                >
                  <a-option :value="0">
                    <div class="option-item">
                      <icon-exclamation-circle class="status-icon unread" />
                      <span>未读</span>
                    </div>
                  </a-option>
                  <a-option :value="1">
                    <div class="option-item">
                      <icon-check-circle class="status-icon read" />
                      <span>已读</span>
                    </div>
                  </a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="12" :sm="24">
              <a-form-item label="消息类型" class="filter-item">
                <a-select
                  v-model="searchForm.type"
                  placeholder="请选择类型"
                  allow-clear
                  @change="handleSearch"
                >
                  <a-option value="SYSTEM">
                    <div class="option-item">
                      <icon-notification class="type-icon system" />
                      <span>系统通知</span>
                    </div>
                  </a-option>
                  <a-option value="ANNOUNCEMENT">
                    <div class="option-item">
                      <icon-sound class="type-icon announcement" />
                      <span>公告</span>
                    </div>
                  </a-option>
                  <a-option value="MAINTENANCE">
                    <div class="option-item">
                      <icon-tool class="type-icon maintenance" />
                      <span>维护通知</span>
                    </div>
                  </a-option>
                  <a-option value="ACTIVITY">
                    <div class="option-item">
                      <icon-gift class="type-icon activity" />
                      <span>活动通知</span>
                    </div>
                  </a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="12" :sm="24">
              <a-form-item label="操作" class="filter-item">
                <a-space>
                  <a-button type="primary" @click="handleSearch" :loading="loading">
                    <template #icon>
                      <icon-search />
                    </template>
                    搜索
                  </a-button>
                  <a-button @click="resetSearch">
                    <template #icon>
                      <icon-refresh />
                    </template>
                    重置
                  </a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>

          <!-- 高级筛选 -->
          <div v-if="showAdvancedFilters" class="advanced-filters">
            <a-divider class="filter-divider" />
            <a-row :gutter="16">
              <a-col :xl="8" :lg="12" :md="24" :sm="24">
                <a-form-item label="创建时间" class="filter-item">
                  <a-range-picker
                    v-model="searchForm.dateRange"
                    format="YYYY-MM-DD"
                    placeholder="['开始时间', '结束时间']"
                    @change="handleSearch"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :xl="8" :lg="12" :md="24" :sm="24">
                <a-form-item label="消息标题" class="filter-item">
                  <a-input
                    v-model="searchForm.title"
                    placeholder="请输入标题关键字"
                    allow-clear
                    @change="handleSearch"
                  >
                    <template #prefix>
                      <icon-file-text class="input-icon" />
                    </template>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :xl="8" :lg="12" :md="24" :sm="24">
                <a-form-item label="批量操作" class="filter-item">
                  <a-space>
                    <a-button
                      type="primary"
                      status="warning"
                      @click="batchMarkAsPulled"
                      :disabled="selectedKeys.length === 0"
                    >
                      <template #icon>
                        <icon-check />
                      </template>
                      批量标记拉取
                    </a-button>
                    <a-button
                      type="primary"
                      status="danger"
                      @click="batchDelete"
                      :disabled="selectedKeys.length === 0"
                    >
                      <template #icon>
                        <icon-delete />
                      </template>
                      批量删除
                    </a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </div>

      <div class="table-section">
        <a-card class="table-card" :bordered="false">
          <template #title>
            <div class="table-header">
              <div class="table-title">
                <icon-list class="table-icon" />
                <span>消息列表</span>
              </div>
              <div class="table-actions">
                <a-space>
                  <a-tooltip content="导出数据">
                    <a-button type="outline" @click="exportData">
                      <template #icon>
                        <icon-download />
                      </template>
                    </a-button>
                  </a-tooltip>
                  <a-tooltip content="刷新数据">
                    <a-button type="outline" @click="refresh">
                      <template #icon>
                        <icon-refresh />
                      </template>
                    </a-button>
                  </a-tooltip>
                </a-space>
              </div>
            </div>
          </template>

          <a-table
            :columns="tableColumns"
            :data="messageList"
            :pagination="paginationConfig"
            :loading="loading"
            @page-change="handlePageChange"
            @page-size-change="handlePageSizeChange"
            @selection-change="handleSelectionChange"
            row-key="id"
            :bordered="false"
            size="large"
            class="modern-table"
            :row-selection="{ type: 'checkbox', showCheckedAll: true }"
            :scroll="{ x: '100%' }"
          >
            <template #state="{ record }">
              <a-tag :color="record.state === 0 ? 'red' : 'green'" class="status-tag">
                {{ record.state === 0 ? '未读' : '已读' }}
              </a-tag>
            </template>
            <template #type="{ record }">
              <a-tag :color="getTypeColor(record.type)" class="type-tag">
                {{ getTypeText(record.type) }}
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
                <a-button type="text" size="small" @click="markAsPulled(record.id)" class="action-btn read-btn">
                  <template #icon>
                    <icon-check />
                  </template>
                  标记为拉取
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
        </a-card>
      </div>
    </div>

    <!-- 发送消息弹窗 -->
    <a-modal
      v-model:visible="sendModalVisible"
      title="发送消息"
      width="800px"
      class="send-modal"
      @ok="handleSendMessage"
      @cancel="resetSendForm"
    >
      <a-form :model="sendForm" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="消息标题" required>
              <a-input v-model="sendForm.title" placeholder="请输入消息标题" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="消息类型" required>
              <a-select v-model="sendForm.type" placeholder="请选择消息类型">
                <a-option value="SYSTEM">系统通知</a-option>
                <a-option value="ANNOUNCEMENT">公告</a-option>
                <a-option value="MAINTENANCE">维护通知</a-option>
                <a-option value="ACTIVITY">活动通知</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="发送方式" required>
          <a-radio-group v-model="sendType">
            <a-radio value="single">单个用户</a-radio>
            <a-radio value="multiple">多个用户</a-radio>
            <a-radio value="problemSet">题单用户</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="sendType === 'single'" label="接收用户ID" required>
          <a-input-number v-model="sendForm.recipientId" placeholder="请输入用户ID" style="width: 100%" />
        </a-form-item>
        <a-form-item v-if="sendType === 'multiple'" label="接收用户ID列表" required>
          <a-textarea v-model="recipientIds" placeholder="请输入用户ID，用逗号分隔，例如：1,2,3" />
        </a-form-item>
        <a-form-item v-if="sendType === 'problemSet'" label="题单ID" required>
          <a-input-number v-model="sendForm.problemSetId" placeholder="请输入题单ID" style="width: 100%" />
        </a-form-item>
        <a-form-item label="消息内容" required>
          <a-textarea v-model="sendForm.content" placeholder="请输入消息内容" :rows="6" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 消息详情弹窗 -->
    <a-modal
      v-model:visible="detailModalVisible"
      title="消息详情"
      width="700px"
      class="detail-modal"
      :footer="false"
    >
      <div v-if="currentMessage" class="message-detail">
        <div class="detail-header">
          <div class="message-title">{{ currentMessage.title }}</div>
          <div class="message-meta">
            <a-tag :color="getTypeColor(currentMessage.type)">
              {{ getTypeText(currentMessage.type) }}
            </a-tag>
            <span class="message-time">{{ formatTime(currentMessage.createTime) }}</span>
          </div>
        </div>
        <div class="detail-content">
          <div class="content-section">
            <div class="content-label">
              <icon-file-text />
              消息内容
            </div>
            <div class="content-text">{{ currentMessage.content }}</div>
          </div>
          <div class="recipient-info">
            <div class="content-label">
              <icon-user />
              接收用户
            </div>
            <div class="recipient-id">用户ID: {{ currentMessage.recipientId }}</div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import {
  IconMessage,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconEye,
  IconCheck,
  IconDelete,
  IconFileText,
  IconUser,
  IconFilter,
  IconDown,
  IconUp,
  IconExclamationCircle,
  IconCheckCircle,
  IconNotification,
  IconSound,
  IconTool,
  IconGift,
  IconList,
  IconDownload
} from '@arco-design/web-vue/es/icon'
import moment from 'moment'
import { AdminSysNoticeControllerService } from '../../../generated'
import type { AdminSysNoticeVO, AdminSysNoticeAddRequest } from '../../../generated'

const loading = ref(false)
const sendModalVisible = ref(false)
const detailModalVisible = ref(false)
const sendType = ref('single')
const recipientIds = ref('')
const showAdvancedFilters = ref(false)
const selectedKeys = ref<number[]>([])

const messageList = ref<AdminSysNoticeVO[]>([])
const currentMessage = ref<AdminSysNoticeVO | null>(null)

const searchForm = reactive({
  recipientId: undefined as number | undefined,
  state: undefined as number | undefined,
  type: undefined as string | undefined,
  dateRange: undefined as [string, string] | undefined,
  title: undefined as string | undefined
})

const sendForm = reactive<AdminSysNoticeAddRequest>({
  title: '',
  content: '',
  type: 'SYSTEM',
  recipientId: undefined,
  recipientIdList: [],
  problemSetId: undefined
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const paginationConfig = computed(() => ({
  current: pagination.current,
  pageSize: pagination.pageSize,
  total: pagination.total,
  showTotal: true,
  showPageSize: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  showQuickJumper: true,
  simple: false
}))

const tableColumns = [
  {
    title: '消息标题',
    dataIndex: 'title',
    ellipsis: true,
    tooltip: true
  },
  {
    title: '接收用户ID',
    dataIndex: 'recipientId',
    width: 120
  },
  {
    title: '类型',
    dataIndex: 'type',
    slotName: 'type',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'state',
    slotName: 'state',
    width: 80
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    slotName: 'createTime',
    width: 160
  },
  {
    title: '操作',
    slotName: 'action',
    width: 200,
    fixed: 'right'
  }
]

const formatTime = (time: string | undefined) => {
  if (!time) return ''
  return moment(time).format('YYYY-MM-DD HH:mm:ss')
}

const getTypeText = (type: string | undefined) => {
  const typeMap: Record<string, string> = {
    'SYSTEM': '系统通知',
    'ANNOUNCEMENT': '公告',
    'MAINTENANCE': '维护通知',
    'ACTIVITY': '活动通知'
  }
  return typeMap[type || ''] || type || ''
}

const getTypeColor = (type: string | undefined) => {
  const colorMap: Record<string, string> = {
    'SYSTEM': 'blue',
    'ANNOUNCEMENT': 'green',
    'MAINTENANCE': 'orange',
    'ACTIVITY': 'purple'
  }
  return colorMap[type || ''] || 'blue'
}

const loadMessages = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const params: any = {
      current: pagination.current,
      pageSize: pagination.pageSize
    }

    if (searchForm.recipientId !== undefined) {
      params.recipientId = searchForm.recipientId
    }
    if (searchForm.state !== undefined) {
      params.state = searchForm.state
    }
    if (searchForm.type !== undefined) {
      params.type = searchForm.type
    }
    if (searchForm.title !== undefined && searchForm.title.trim() !== '') {
      params.title = searchForm.title.trim()
    }
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
    }

    // 由于后端API限制，暂时只支持recipientId和state参数
    const response = await AdminSysNoticeControllerService.getNoticesUsingGet(
      searchForm.recipientId,
      searchForm.state
    )

    if (response.code === 200 && response.data) {
      let filteredData = response.data

      // 前端过滤其他条件
      if (searchForm.type) {
        filteredData = filteredData.filter(item => item.type === searchForm.type)
      }
      if (searchForm.title && searchForm.title.trim()) {
        const keyword = searchForm.title.trim().toLowerCase()
        filteredData = filteredData.filter(item =>
          item.title?.toLowerCase().includes(keyword)
        )
      }
      if (searchForm.dateRange && searchForm.dateRange.length === 2) {
        const [startDate, endDate] = searchForm.dateRange
        filteredData = filteredData.filter(item => {
          if (!item.createTime) return false
          const createDate = moment(item.createTime).format('YYYY-MM-DD')
          return createDate >= startDate && createDate <= endDate
        })
      }

      // 前端分页
      const startIndex = (pagination.current - 1) * pagination.pageSize
      const endIndex = startIndex + pagination.pageSize
      messageList.value = filteredData.slice(startIndex, endIndex)
      pagination.total = filteredData.length
    }
  } catch (error) {
    console.error('加载消息失败:', error)
    Message.error('加载消息失败')
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  pagination.current = page
  loadMessages()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  loadMessages()
}

const handleSearch = () => {
  pagination.current = 1
  loadMessages()
}

const resetSearch = () => {
  searchForm.recipientId = undefined
  searchForm.state = undefined
  searchForm.type = undefined
  searchForm.dateRange = undefined
  searchForm.title = undefined
  pagination.current = 1
  handleSearch()
}

const toggleAdvancedFilters = () => {
  showAdvancedFilters.value = !showAdvancedFilters.value
}

const handleSelectionChange = (keys: number[]) => {
  selectedKeys.value = keys
}

const batchMarkAsPulled = () => {
  if (selectedKeys.value.length === 0) {
    Message.warning('请选择要操作的消息')
    return
  }

  Modal.confirm({
    title: '确认批量标记',
    content: `确定要将选中的 ${selectedKeys.value.length} 条消息标记为已拉取吗？`,
    onOk: async () => {
      try {
        const promises = selectedKeys.value.map(id =>
          AdminSysNoticeControllerService.markAsPulledUsingPost(id)
        )
        await Promise.all(promises)
        Message.success('批量标记成功')
        selectedKeys.value = []
        loadMessages()
      } catch (error) {
        console.error('批量标记失败:', error)
        Message.error('批量标记失败')
      }
    }
  })
}

const batchDelete = () => {
  if (selectedKeys.value.length === 0) {
    Message.warning('请选择要删除的消息')
    return
  }

  Modal.confirm({
    title: '确认批量删除',
    content: `确定要删除选中的 ${selectedKeys.value.length} 条消息吗？此操作不可撤销！`,
    onOk: async () => {
      try {
        const promises = selectedKeys.value.map(id =>
          AdminSysNoticeControllerService.deleteNoticeUsingPost(id)
        )
        await Promise.all(promises)
        Message.success('批量删除成功')
        selectedKeys.value = []
        loadMessages()
      } catch (error) {
        console.error('批量删除失败:', error)
        Message.error('批量删除失败')
      }
    }
  })
}

const exportData = () => {
  Message.info('导出功能开发中...')
}

const showSendModal = () => {
  sendModalVisible.value = true
}

const resetSendForm = () => {
  sendForm.title = ''
  sendForm.content = ''
  sendForm.type = 'SYSTEM'
  sendForm.recipientId = undefined
  sendForm.recipientIdList = []
  sendForm.problemSetId = undefined
  recipientIds.value = ''
  sendType.value = 'single'
}

const handleSendMessage = async () => {
  if (!sendForm.title || !sendForm.content) {
    Message.warning('请填写完整的消息信息')
    return
  }

  // 根据发送类型设置接收者
  if (sendType.value === 'multiple') {
    const ids = recipientIds.value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
    if (ids.length === 0) {
      Message.warning('请输入有效的用户ID列表')
      return
    }
    sendForm.recipientIdList = ids
    sendForm.recipientId = undefined
  } else if (sendType.value === 'single') {
    if (!sendForm.recipientId) {
      Message.warning('请输入接收用户ID')
      return
    }
    sendForm.recipientIdList = []
  } else if (sendType.value === 'problemSet') {
    if (!sendForm.problemSetId) {
      Message.warning('请输入题单ID')
      return
    }
    sendForm.recipientId = undefined
    sendForm.recipientIdList = []
  }

  try {
    const response = await AdminSysNoticeControllerService.sendNoticeUsingPost(sendForm)
    if (response.code === 200) {
      Message.success('消息发送成功')
      sendModalVisible.value = false
      resetSendForm()
      loadMessages()
    }
  } catch (error) {
    console.error('发送消息失败:', error)
    Message.error('发送消息失败')
  }
}

const viewMessage = (message: AdminSysNoticeVO) => {
  currentMessage.value = message
  detailModalVisible.value = true
}

const markAsPulled = async (id: number) => {
  try {
    const response = await AdminSysNoticeControllerService.markAsPulledUsingPost(id)
    if (response.code === 200) {
      Message.success('标记成功')
      loadMessages()
    }
  } catch (error) {
    console.error('标记失败:', error)
    Message.error('标记失败')
  }
}

const deleteMessage = async (id: number) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条消息吗？',
    onOk: async () => {
      try {
        const response = await AdminSysNoticeControllerService.deleteNoticeUsingPost(id)
        if (response.code === 200) {
          Message.success('删除成功')
          loadMessages()
        }
      } catch (error) {
        console.error('删除失败:', error)
        Message.error('删除失败')
      }
    }
  })
}

const refresh = () => {
  loadMessages()
}

onMounted(() => {
  loadMessages()
})
</script>

<style lang="less" scoped>
.admin-message-container {
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

.content-area {
  .filter-section {
    margin-bottom: 24px;

    .filter-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);

      .filter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;

        .filter-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #1a1a1a;

          .filter-icon {
            color: #1890ff;
          }
        }

        .toggle-btn {
          color: #1890ff;

          &:hover {
            background: rgba(24, 144, 255, 0.1);
          }
        }
      }

      .basic-filters {
        .filter-item {
          margin-bottom: 0;

          .arco-form-item-label {
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
          }

          .input-icon {
            color: #9ca3af;
          }

          .option-item {
            display: flex;
            align-items: center;
            gap: 8px;

            .status-icon {
              &.unread {
                color: #f56565;
              }
              &.read {
                color: #48bb78;
              }
            }

            .type-icon {
              &.system {
                color: #4299e1;
              }
              &.announcement {
                color: #48bb78;
              }
              &.maintenance {
                color: #ed8936;
              }
              &.activity {
                color: #9f7aea;
              }
            }
          }
        }
      }

      .advanced-filters {
        .filter-divider {
          margin: 16px 0;
          border-top: 1px dashed #e5e7eb;
        }
      }

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

  .table-section {
    .table-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);

      .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;

        .table-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #1a1a1a;

          .table-icon {
            color: #1890ff;
          }

          .total-badge {
            :deep(.arco-badge-number) {
              background: linear-gradient(135deg, #1890ff, #40a9ff);
              border: none;
              font-weight: 500;
              border-radius: 12px;
            }
          }
        }

        .table-actions {
          .arco-btn {
            border-radius: 20px;
            transition: all 0.3s ease;

            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
          }
        }
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

        .status-tag,
        .type-tag {
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
}

.send-modal,
.detail-modal {
  .arco-modal-header {
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    border-bottom: 2px solid #e5e7eb;
    border-radius: 8px 8px 0 0;
  }

  .arco-modal-body {
    padding: 24px;
  }
}

.message-detail {
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

    .message-title {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 12px;
      line-height: 1.4;
    }

    .message-meta {
      display: flex;
      align-items: center;
      gap: 16px;

      .arco-tag {
        font-weight: 500;
        border-radius: 12px;
        padding: 4px 12px;
      }

      .message-time {
        font-size: 13px;
        color: #999;
        background: rgba(153, 153, 153, 0.1);
        padding: 4px 12px;
        border-radius: 12px;
      }
    }
  }

  .detail-content {
    .content-section,
    .recipient-info {
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

      .recipient-id {
        font-size: 14px;
        color: #1a1a1a;
        font-weight: 500;
        background: rgba(24, 144, 255, 0.1);
        padding: 8px 12px;
        border-radius: 8px;
        display: inline-block;
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .admin-message-container {
    .content-area {
      .filter-section .filter-card {
        .basic-filters {
          .arco-row {
            .arco-col {
              margin-bottom: 16px;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .admin-message-container {
    padding: 16px;

    .page-header .header-content {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }

    .content-area {
      .filter-section .filter-card {
        .filter-header {
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }

        .basic-filters,
        .advanced-filters {
          .arco-col {
            margin-bottom: 16px;
          }
        }
      }

      .table-section .table-card {
        .table-header {
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }

        .modern-table {
          font-size: 12px;

          .arco-table-th,
          .arco-table-td {
            padding: 8px 6px;
          }

          .action-buttons {
            .action-btn {
              font-size: 11px;
              padding: 2px 6px;
            }
          }
        }
      }
    }
  }
}
</style>
