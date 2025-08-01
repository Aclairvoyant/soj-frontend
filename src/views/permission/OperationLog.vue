<template>
  <div class="operation-log">
    <a-card>
      <template #title>
        <div class="page-header">
          <h2>权限操作日志</h2>
          <p>查看系统权限操作的详细记录</p>
        </div>
      </template>

      <template #extra>
        <a-space>
          <a-button @click="handleExport('excel')">
            <template #icon>
              <IconDownload />
            </template>
            导出Excel
          </a-button>
          <a-button @click="handleExport('csv')">
            <template #icon>
              <IconDownload />
            </template>
            导出CSV
          </a-button>
        </a-space>
      </template>

      <!-- 搜索筛选区域 -->
      <div class="search-section">
        <a-row :gutter="16" align="middle">
          <a-col :span="4">
            <a-select
              v-model="searchForm.operationType"
              placeholder="操作类型"
              allow-clear
              style="width: 100%"
            >
              <a-option value="">全部类型</a-option>
              <a-option value="PERMISSION_CHECK">权限检查</a-option>
              <a-option value="RESOURCE_PERMISSION">资源权限</a-option>
              <a-option value="PERMISSION_MANAGEMENT">权限管理</a-option>
              <a-option value="CREATE_ROLE">创建角色</a-option>
              <a-option value="DELETE_ROLE">删除角色</a-option>
              <a-option value="CHANGE_ROLE">角色变更</a-option>
              <a-option value="CONFIGURE_PERMISSION">权限配置</a-option>
              <a-option value="GRANT_RESOURCE_PERMISSION">授予资源权限</a-option>
              <a-option value="REVOKE_RESOURCE_PERMISSION">撤销资源权限</a-option>
            </a-select>
          </a-col>

          <a-col :span="4">
            <a-input
              v-model:value="searchForm.operatorName"
              placeholder="操作人"
              allow-clear
            >
              <template #prefix>
                <IconUser />
              </template>
            </a-input>
          </a-col>

          <a-col :span="4">
            <a-input
              v-model:value="searchForm.targetName"
              placeholder="目标对象"
              allow-clear
            >
              <template #prefix>
                <IconUserGroup />
              </template>
            </a-input>
          </a-col>

          <a-col :span="6">
            <a-range-picker
              v-model:value="searchForm.timeRange"
              :placeholder="['开始时间', '结束时间']"
              style="width: 100%"
            />
          </a-col>

          <a-col :span="6">
            <a-space>
              <a-button type="primary" @click="handleSearch">
                <template #icon>
                  <IconSearch />
                </template>
                搜索
              </a-button>

              <a-button @click="handleReset">
                <template #icon>
                  <IconRefresh />
                </template>
                重置
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </div>

      <!-- 日志列表表格 -->
      <a-table
        :columns="columns"
        :data="logList"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
      >
        <!-- 操作类型列 -->
        <template #operationType="{ record }">
          <a-tag :color="getOperationColor(record.operationType)">
            {{ getOperationText(record.operationType) }}
          </a-tag>
        </template>

        <!-- 操作人列 -->
        <template #operator="{ record }">
          <div class="operator-info">
            <div class="name">{{ record.operatorName }}</div>
            <div class="id">ID: {{ record.operatorId }}</div>
          </div>
        </template>

        <!-- 目标对象列 -->
        <template #target="{ record }">
          <div class="target-info">
            <div class="target-type">
              <a-tag size="small" :color="getTargetTypeColor(record.targetType)">
                {{ getTargetTypeText(record.targetType) }}
              </a-tag>
            </div>
            <div class="target-name">{{ record.targetName }}</div>
          </div>
        </template>

        <!-- 执行时间列 -->
        <template #executionTime="{ record }">
          <span class="execution-time">
            {{ record.operationDetailsMap?.executionTime || '-' }}
          </span>
        </template>

        <!-- 操作时间列 -->
        <template #createTime="{ record }">
          <div class="time-info">
            <div class="date">{{ formatDate(record.createTime) }}</div>
            <div class="time">{{ formatTimeOnly(record.createTime) }}</div>
          </div>
        </template>

        <!-- 状态列 -->
        <template #status="{ record }">
          <div class="status-indicator">
            <a-tag :color="record.operationResult === 1 ? 'green' : 'red'" class="status-tag">
              <template #icon>
                <IconCheckCircle v-if="record.operationResult === 1" />
                <IconCloseCircle v-else />
              </template>
              {{ record.operationResult === 1 ? '成功' : '失败' }}
            </a-tag>
          </div>
        </template>

        <!-- IP地址列 -->
        <template #clientIp="{ record }">
          <span class="ip-address">
            {{ formatIpAddress(record.clientIp) }}
          </span>
        </template>

        <!-- 操作列 -->
        <template #action="{ record }">
          <a-button type="outline" size="small" @click="handleViewDetail(record)">
            查看详情
          </a-button>
        </template>
      </a-table>
    </a-card>

    <!-- 日志详情模态框 -->
    <a-modal
      v-model:visible="detailModalVisible"
      title="操作日志详情"
      width="900px"
      :footer="null"
      class="operation-detail-modal"
    >
      <div v-if="selectedLog" class="detail-container">
        <a-descriptions :column="2" bordered size="large" class="detail-descriptions">
          <a-descriptions-item label="操作ID">
            <a-typography-text copyable>{{ selectedLog.id }}</a-typography-text>
          </a-descriptions-item>

          <a-descriptions-item label="操作类型">
            <a-tag :color="getOperationColor(selectedLog.operationType)" size="large">
              {{ getOperationText(selectedLog.operationType) }}
            </a-tag>
          </a-descriptions-item>

          <a-descriptions-item label="操作人">
            <div class="operator-detail">
              <div class="name">{{ selectedLog.operatorName }}</div>
              <div class="id">ID: {{ selectedLog.operatorId }}</div>
            </div>
          </a-descriptions-item>

          <a-descriptions-item label="目标对象">
            <div class="target-detail">
              <a-tag :color="getTargetTypeColor(selectedLog.targetType)" size="small">
                {{ getTargetTypeText(selectedLog.targetType) }}
              </a-tag>
              <div class="target-name">{{ selectedLog.targetName }}</div>
              <div class="target-id">ID: {{ selectedLog.targetId }}</div>
            </div>
          </a-descriptions-item>

          <a-descriptions-item label="操作时间">
            <div class="time-detail">
              <div class="main-time">{{ formatTime(selectedLog.createTime) }}</div>
              <div class="execution-time">执行时长: {{ selectedLog.operationDetailsMap?.executionTime || '-' }}</div>
            </div>
          </a-descriptions-item>

          <a-descriptions-item label="操作状态">
            <a-tag :color="selectedLog.operationResult === 1 ? 'green' : 'red'" size="large">
              <template #icon>
                <IconCheckCircle v-if="selectedLog.operationResult === 1" />
                <IconCloseCircle v-else />
              </template>
              {{ selectedLog.operationResult === 1 ? '成功' : '失败' }}
            </a-tag>
          </a-descriptions-item>

          <a-descriptions-item label="客户端IP">
            <a-typography-text code>{{ formatIpAddress(selectedLog.clientIp) }}</a-typography-text>
          </a-descriptions-item>

          <a-descriptions-item v-if="selectedLog.errorMessage" label="错误信息" :span="2">
            <a-alert :message="selectedLog.errorMessage" type="error" show-icon />
          </a-descriptions-item>
        </a-descriptions>

        <a-divider orientation="left">操作详情</a-divider>

        <div class="operation-details">
          <a-card class="details-card" :bordered="false">
            <template #title>
              <div class="card-title">
                <IconCode />
                详细信息
              </div>
            </template>

            <div class="details-grid">
              <div v-if="selectedLog.operationDetailsMap?.method" class="detail-item">
                <div class="label">调用方法</div>
                <div class="value method-name">{{ selectedLog.operationDetailsMap.method }}</div>
              </div>

              <div v-if="selectedLog.operationDetailsMap?.userRole" class="detail-item">
                <div class="label">用户角色</div>
                <div class="value">
                  <a-tag color="blue">{{ selectedLog.operationDetailsMap.userRole }}</a-tag>
                </div>
              </div>

              <div v-if="selectedLog.operationDetailsMap?.requiredRole" class="detail-item">
                <div class="label">所需角色</div>
                <div class="value">
                  <a-tag color="orange">{{ selectedLog.operationDetailsMap.requiredRole }}</a-tag>
                </div>
              </div>
            </div>

            <a-divider />

            <div class="raw-data">
              <a-typography-title :heading="6">原始数据</a-typography-title>
              <pre class="json-data">{{ formatJSON(selectedLog.operationDetails) }}</pre>
            </div>
          </a-card>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  IconSearch,
  IconRefresh,
  IconDownload,
  IconUser,
  IconUserGroup,
  IconCheckCircle,
  IconCloseCircle,
  IconCode,
} from '@arco-design/web-vue/es/icon'
import dayjs, { type Dayjs } from 'dayjs'
import { Service } from '../../../generated'
import {Message} from "@arco-design/web-vue";

// 数据定义 - 根据后端返回结构更新
interface LogData {
  id: string
  operatorId: string
  operatorName: string
  operationType: string
  targetType: string
  targetId: string
  targetName: string
  operationDetails: string
  operationDetailsMap: {
    method?: string
    userId?: string
    userRole?: string
    requiredRole?: string
    executionTime?: string
    [key: string]: any
  }
  operationResult: number  // 1 成功，0 失败
  errorMessage: string | null
  clientIp: string
  createTime: string
}

const loading = ref(false)
const logList = ref<LogData[]>([])
const detailModalVisible = ref(false)
const selectedLog = ref<LogData | null>(null)

// 搜索表单
const searchForm = reactive({
  operationType: '',
  operatorName: '',
  targetName: '',
  timeRange: undefined as [Dayjs, Dayjs] | undefined,
})

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
})

// 表格列配置
const columns = [
  {
    title: '操作类型',
    slotName: 'operationType',
    width: 120,
    align: 'center',
  },
  {
    title: '操作人',
    slotName: 'operator',
    width: 160,
  },
  {
    title: '目标对象',
    slotName: 'target',
    width: 160,
  },
  {
    title: '执行时间',
    slotName: 'executionTime',
    width: 100,
    align: 'center',
  },
  {
    title: '操作时间',
    slotName: 'createTime',
    width: 160,
    align: 'center',
  },
  {
    title: '状态',
    slotName: 'status',
    width: 80,
    align: 'center',
  },
  {
    title: 'IP地址',
    slotName: 'clientIp',
    width: 140,
    align: 'center',
  },
  {
    title: '操作',
    slotName: 'action',
    width: 100,
    fixed: 'right',
    align: 'center',
  },
]

// 工具方法
const getOperationColor = (type: string) => {
  const colorMap: Record<string, string> = {
    PERMISSION_CHECK: 'blue',
    RESOURCE_PERMISSION: 'cyan',
    PERMISSION_MANAGEMENT: 'purple',
    CREATE_ROLE: 'green',
    DELETE_ROLE: 'red',
    CHANGE_ROLE: 'orange',
    CONFIGURE_PERMISSION: 'magenta',
    GRANT_RESOURCE_PERMISSION: 'lime',
    REVOKE_RESOURCE_PERMISSION: 'volcano',
    // 兼容旧版本
    ROLE_CHECK: 'blue',
    ROLE_CHANGE: 'orange',
    PERMISSION_CONFIG: 'purple',
    BATCH_OPERATION: 'magenta',
    CACHE_OPERATION: 'green',
    LOGIN: 'cyan',
    LOGOUT: 'gray',
  }
  return colorMap[type] || 'default'
}

const getOperationText = (type: string) => {
  const textMap: Record<string, string> = {
    PERMISSION_CHECK: '权限检查',
    RESOURCE_PERMISSION: '资源权限',
    PERMISSION_MANAGEMENT: '权限管理',
    CREATE_ROLE: '创建角色',
    DELETE_ROLE: '删除角色',
    CHANGE_ROLE: '角色变更',
    CONFIGURE_PERMISSION: '权限配置',
    GRANT_RESOURCE_PERMISSION: '授予资源权限',
    REVOKE_RESOURCE_PERMISSION: '撤销资源权限',
    // 兼容旧版本
    ROLE_CHECK: '权限检查',
    ROLE_CHANGE: '角色变更',
    PERMISSION_CONFIG: '权限配置',
    BATCH_OPERATION: '批量操作',
    CACHE_OPERATION: '缓存操作',
    LOGIN: '登录',
    LOGOUT: '登出',
  }
  return textMap[type] || type
}

const getTargetTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    USER: 'blue',
    user: 'blue',
    ROLE: 'orange',
    role: 'orange',
    PERMISSION: 'purple',
    permission: 'purple',
    SYSTEM: 'green',
    system: 'green',
    resource_permission: 'cyan',
  }
  return colorMap[type] || 'default'
}

const getTargetTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    USER: '用户',
    user: '用户',
    ROLE: '角色',
    role: '角色',
    PERMISSION: '权限',
    permission: '权限',
    SYSTEM: '系统',
    system: '系统',
    resource_permission: '资源权限',
  }
  return textMap[type] || type
}

const formatDate = (time: string) => {
  return dayjs(time).format('MM-DD')
}

const formatTimeOnly = (time: string) => {
  return dayjs(time).format('HH:mm:ss')
}

const formatIpAddress = (ip: string) => {
  // 处理IPv6本地地址显示
  return ip === '0:0:0:0:0:0:0:1' ? '本机' : ip
}

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const formatJSON = (jsonStr?: string) => {
  if (!jsonStr) return '无数据'
  try {
    return JSON.stringify(JSON.parse(jsonStr), null, 2)
  } catch {
    return jsonStr
  }
}

// 事件处理方法
const handleSearch = () => {
  pagination.current = 1
  fetchLogList()
}

const handleReset = () => {
  Object.assign(searchForm, {
    operationType: '',
    operatorName: '',
    targetName: '',
    timeRange: undefined,
  })
  pagination.current = 1
  fetchLogList()
}


const handleViewDetail = (log: LogData) => {
  selectedLog.value = log
  detailModalVisible.value = true
}

const handleExport = async (format: 'excel' | 'csv') => {
  try {
    const response = await Service.exportOperationLogsUsingGet(
      pagination.current,
      searchForm.timeRange?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
      undefined, // operationResult
      searchForm.operationType || undefined,
      undefined, // operatorId
      searchForm.operatorName || undefined,
      pagination.pageSize,
      undefined, // sortField
      undefined, // sortOrder
      searchForm.timeRange?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
      searchForm.targetName || undefined,
      format
    )

    if (response.code === 200 && response.data) {
      // 处理下载链接
      const link = document.createElement('a')
      link.href = response.data
      link.download = `operation-logs-${dayjs().format('YYYY-MM-DD')}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      Message.success(`${format.toUpperCase()}文件导出成功`)
    } else {
      Message.error(response.message || '导出失败')
    }
  } catch (error) {
    console.error('导出失败:', error)
    Message.error('导出失败')
  }
}

// 数据获取方法
const fetchLogList = async () => {
  loading.value = true

  try {
    const response = await Service.getOperationLogListUsingGet(
      pagination.current,
      searchForm.timeRange?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
      undefined, // operationResult
      searchForm.operationType || undefined,
      undefined, // operatorId
      searchForm.operatorName || undefined,
      pagination.pageSize,
      undefined, // sortField
      undefined, // sortOrder
      searchForm.timeRange?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
      searchForm.targetName || undefined
    )

    if (response.code === 200 && response.data?.records) {
      logList.value = response.data.records
      pagination.total = response.data.total || 0
    } else {
      Message.error(response.message || '获取操作日志失败')
      logList.value = []
      pagination.total = 0
    }

  } catch (error) {
    console.error('获取操作日志失败:', error)
    Message.error('获取操作日志失败')
    logList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchLogList()
})
</script>

<style scoped lang="less">
.operation-log {
  .page-header {
    h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
      color: #1d2129;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    p {
      margin: 0;
      color: #86909c;
      font-size: 14px;
    }
  }

  .search-section {
    margin-bottom: 20px;
    padding: 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
  }

  // 表格样式美化
  :deep(.arco-table) {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

    .arco-table-thead {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

      .arco-table-th {
        background: transparent;
        color: white;
        font-weight: 600;
        font-size: 14px;
        border-bottom: none;
        padding: 16px 12px;

        &:first-child {
          border-top-left-radius: 12px;
        }

        &:last-child {
          border-top-right-radius: 12px;
        }
      }
    }

    .arco-table-tbody {
      .arco-table-tr {
        transition: all 0.3s ease;

        &:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .arco-table-td {
          padding: 14px 12px;
          border-bottom: 1px solid #f2f3f5;

          &:first-child {
            border-left: 3px solid transparent;
          }
        }

        &:hover .arco-table-td:first-child {
          border-left-color: #667eea;
        }
      }
    }
  }

  // 操作人信息样式
  .operator-info {
    .name {
      font-weight: 600;
      font-size: 14px;
      color: #1d2129;
      margin-bottom: 4px;
    }

    .id {
      color: #86909c;
      font-size: 12px;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
    }
  }

  // 目标对象信息样式
  .target-info {
    .target-type {
      margin-bottom: 4px;
    }

    .target-name {
      font-weight: 500;
      font-size: 13px;
      color: #1d2129;
      margin-bottom: 2px;
    }
  }

  // 时间显示样式
  .time-info {
    .date {
      font-weight: 600;
      font-size: 13px;
      color: #1d2129;
      margin-bottom: 2px;
    }

    .time {
      font-size: 12px;
      color: #86909c;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
    }
  }

  // 执行时间样式
  .execution-time {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-size: 12px;
    color: #722ed1;
    font-weight: 500;
  }

  // 状态指示器样式
  .status-indicator {
    .status-tag {
      font-weight: 600;
      border-radius: 20px;
      padding: 4px 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  // IP地址样式
  .ip-address {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-size: 12px;
    color: #86909c;
    background: #f2f3f5;
    padding: 2px 6px;
    border-radius: 4px;
  }

  // 详情模态框样式
  .operation-detail-modal {
    :deep(.arco-modal-header) {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;

      .arco-modal-title {
        color: white;
        font-weight: 600;
      }

      .arco-modal-close-btn {
        color: white;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }

    :deep(.arco-modal-body) {
      padding: 24px;
    }
  }

  .detail-container {
    .detail-descriptions {
      :deep(.arco-descriptions-item-label) {
        background: #fafbfc;
        font-weight: 600;
        color: #1d2129;
      }

      :deep(.arco-descriptions-item-value) {
        background: white;
      }
    }

    .operator-detail, .target-detail {
      .name, .target-name {
        font-weight: 600;
        color: #1d2129;
        margin-bottom: 4px;
      }

      .id, .target-id {
        font-size: 12px;
        color: #86909c;
        font-family: 'JetBrains Mono', 'Courier New', monospace;
      }
    }

    .target-detail {
      .target-name {
        margin: 4px 0 2px 0;
      }
    }

    .time-detail {
      .main-time {
        font-weight: 600;
        color: #1d2129;
        margin-bottom: 4px;
      }

      .execution-time {
        font-size: 12px;
        color: #722ed1;
        font-family: 'JetBrains Mono', 'Courier New', monospace;
      }
    }
  }

  .operation-details {
    .details-card {
      background: linear-gradient(135deg, #f8f9ff 0%, #f5f7fa 100%);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

      .card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #1d2129;
        font-weight: 600;
      }

      .details-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 16px;

        .detail-item {
          .label {
            font-size: 12px;
            color: #86909c;
            margin-bottom: 4px;
            font-weight: 500;
          }

          .value {
            font-weight: 500;

            &.method-name {
              font-family: 'JetBrains Mono', 'Courier New', monospace;
              font-size: 12px;
              color: #722ed1;
              word-break: break-all;
            }
          }
        }
      }

      .raw-data {
        .json-data {
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 16px;
          border-radius: 8px;
          font-size: 12px;
          line-height: 1.6;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          max-height: 300px;
          overflow-y: auto;
          white-space: pre-wrap;
          word-break: break-all;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

          &::-webkit-scrollbar {
            width: 6px;
          }

          &::-webkit-scrollbar-track {
            background: #2a2a2a;
            border-radius: 3px;
          }

          &::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 3px;

            &:hover {
              background: #777;
            }
          }
        }
      }
    }
  }
}</style>
