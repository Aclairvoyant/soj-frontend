<template>
  <div class="contest-manage-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <a-typography-title :heading="2" class="page-title">
            <icon-settings class="title-icon" />
            比赛管理
          </a-typography-title>
          <a-typography-text class="subtitle">管理和监控所有比赛的运行状态</a-typography-text>
        </div>
        <div class="header-actions">
          <a-button type="primary" size="large" @click="$router.push('/add/contest')">
            <template #icon>
              <icon-plus />
            </template>
            创建比赛
          </a-button>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <a-row :gutter="[24, 24]">
        <a-col :sm="12" :lg="6">
          <a-card class="stat-card" :bordered="false">
            <a-statistic
              title="总比赛数"
              :value="stats.totalContests"
              :value-style="{ color: '#165dff' }"
            >
              <template #suffix>
                <icon-trophy />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :sm="12" :lg="6">
          <a-card class="stat-card" :bordered="false">
            <a-statistic
              title="进行中"
              :value="stats.runningContests"
              :value-style="{ color: '#00b42a' }"
            >
              <template #suffix>
                <icon-play-circle />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :sm="12" :lg="6">
          <a-card class="stat-card" :bordered="false">
            <a-statistic
              title="即将开始"
              :value="stats.upcomingContests"
              :value-style="{ color: '#ff7d00' }"
            >
              <template #suffix>
                <icon-clock-circle />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :sm="12" :lg="6">
          <a-card class="stat-card" :bordered="false">
            <a-statistic
              title="总参赛人次"
              :value="stats.totalParticipants"
              :value-style="{ color: '#f53f3f' }"
            >
              <template #suffix>
                <icon-user />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 筛选和搜索 -->
    <div class="filter-section">
      <a-card :bordered="false" class="filter-card">
        <a-form :model="searchParams" layout="inline" class="filter-form">
          <a-form-item field="title" label="比赛名称">
            <a-input
              v-model="searchParams.title"
              placeholder="搜索比赛名称"
              allow-clear
              style="width: 200px"
              @press-enter="handleSearch"
            />
          </a-form-item>
          <a-form-item field="type" label="比赛类型">
            <a-select
              v-model="searchParams.type"
              placeholder="选择比赛类型"
              allow-clear
              style="width: 150px"
            >
              <a-option :value="1">ACM</a-option>
              <a-option :value="2">OI</a-option>
              <a-option :value="3">IOI</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="status" label="比赛状态">
            <a-select
              v-model="searchParams.status"
              placeholder="选择比赛状态"
              allow-clear
              style="width: 150px"
            >
              <a-option :value="0">未开始</a-option>
              <a-option :value="1">进行中</a-option>
              <a-option :value="2">已结束</a-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSearch">
              <template #icon>
                <icon-search />
              </template>
              搜索
            </a-button>
            <a-button @click="handleReset" style="margin-left: 8px">
              重置
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </div>

    <!-- 比赛列表 -->
    <div class="contest-table-section">
      <a-card :bordered="false" class="table-card">
        <template #title>
          <div class="table-header">
            <span>比赛列表</span>
            <div class="table-actions">
              <a-button @click="refreshList" :loading="loading" size="small">
                <template #icon>
                  <icon-refresh />
                </template>
                刷新
              </a-button>
              <a-button @click="batchUpdateStatus" size="small" :disabled="!selectedRowKeys.length">
                批量操作
              </a-button>
            </div>
          </div>
        </template>

        <a-table
          :data="contests"
          :loading="loading"
          :pagination="{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showTotal: true,
            showJumper: true,
            showPageSize: true
          }"
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
          @selection-change="handleSelectionChange"
          class="contest-table"
          :scroll="{ x: 'max-content' }"
          row-selection
        >
          <template #columns>
            <a-table-column title="ID" data-index="id" width="100" fixed="left" />

            <a-table-column title="比赛信息" width="300" fixed="left">
              <template #cell="{ record }">
                <div class="contest-info-cell">
                  <div class="contest-title">{{ record.title }}</div>
                  <div class="contest-meta">
                    <a-tag :color="getContestTypeColor(record.contestType)" size="small">
                      {{ getContestTypeName(record.contestType) }}
                    </a-tag>
                    <a-tag :color="getContestStatusColor(record.status)" size="small">
                      {{ getContestStatusName(record.status) }}
                    </a-tag>
                    <span v-if="!record.isPublic" class="private-tag">
                      <icon-lock /> 私有
                    </span>
                  </div>
                </div>
              </template>
            </a-table-column>

            <a-table-column title="时间安排" width="220">
              <template #cell="{ record }">
                <div class="time-info">
                  <div class="time-item">
                    <span class="time-label">开始:</span>
                    <span class="time-value">{{ formatDateTime(record.startTime) }}</span>
                  </div>
                  <div class="time-item">
                    <span class="time-label">结束:</span>
                    <span class="time-value">{{ formatDateTime(record.endTime) }}</span>
                  </div>
                </div>
              </template>
            </a-table-column>

            <a-table-column title="参赛情况" width="120" align="center">
              <template #cell="{ record }">
                <div class="participant-info">
                  <div class="participant-count">{{ record.participantCount || 0 }}</div>
                  <div class="participant-limit">
                    / {{ record.maxParticipants || '不限' }}
                  </div>
                </div>
              </template>
            </a-table-column>

            <a-table-column title="题目数" width="80" align="center">
              <template #cell="{ record }">
                {{ record.questions?.length || 0 }}
              </template>
            </a-table-column>

            <a-table-column title="创建者" width="120">
              <template #cell="{ record }">
                <div class="creator-info">
                  <div>{{ record.creator?.userName || '未知' }}</div>
                </div>
              </template>
            </a-table-column>

            <a-table-column title="创建时间" width="160">
              <template #cell="{ record }">
                {{ formatDateTime(record.createTime) }}
              </template>
            </a-table-column>

            <a-table-column title="操作" width="200" fixed="right">
              <template #cell="{ record }">
                <div class="action-buttons">
                  <a-button @click="viewContest(record.id)" size="mini" type="text">
                    查看
                  </a-button>
                  <a-button @click="editContest(record.id)" size="mini" type="text">
                    编辑
                  </a-button>
                  <a-button @click="viewRanking(record.id)" size="mini" type="text">
                    排名
                  </a-button>
                  <a-dropdown>
                    <a-button size="mini" type="text">
                      更多
                      <icon-down />
                    </a-button>
                    <template #content>
                      <a-doption @click="updateContestStatus(record.id, getNextStatus(record.status))">
                        {{ getStatusActionText(record.status) }}
                      </a-doption>
                      <a-doption @click="viewSubmissions(record.id)">
                        查看提交
                      </a-doption>
                      <a-doption @click="exportData(record.id)">
                        导出数据
                      </a-doption>
                      <a-doption @click="deleteContest(record.id)" style="color: #f53f3f">
                        删除比赛
                      </a-doption>
                    </template>
                  </a-dropdown>
                </div>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-card>
    </div>

    <!-- 批量操作弹窗 -->
    <a-modal
      v-model:visible="batchModalVisible"
      title="批量操作"
      @ok="confirmBatchOperation"
      @cancel="batchModalVisible = false"
      :ok-loading="batchProcessing"
    >
      <a-form :model="batchForm" layout="vertical">
        <a-form-item field="operation" label="操作类型" :rules="[{ required: true, message: '请选择操作类型' }]">
          <a-select v-model="batchForm.operation" placeholder="选择要执行的操作">
            <a-option value="start">开始比赛</a-option>
            <a-option value="end">结束比赛</a-option>
            <a-option value="delete">删除比赛</a-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <div class="selected-info">
            已选择 {{ selectedRowKeys.length }} 个比赛
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 删除确认弹窗 -->
    <a-modal
      v-model:visible="deleteModalVisible"
      title="确认删除"
      @ok="confirmDelete"
      @cancel="deleteModalVisible = false"
      :ok-loading="deleting"
      ok-text="确认删除"
      cancel-text="取消"
    >
      <div class="delete-warning">
        <icon-exclamation-circle-fill style="color: #f53f3f; font-size: 24px;" />
        <div>
          <div style="font-weight: 600; margin-bottom: 8px;">确定要删除这个比赛吗？</div>
          <div style="color: #86909c;">删除后将无法恢复，包括所有提交记录和排名数据。</div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import { Service } from '../../../generated'
import type { ContestVO, ContestQueryRequest } from '../../../generated'
import moment from 'moment'

const router = useRouter()

// 数据状态
const contests = ref<ContestVO[]>([])
const stats = reactive({
  totalContests: 0,
  runningContests: 0,
  upcomingContests: 0,
  totalParticipants: 0
})
const loading = ref(false)
const deleting = ref(false)
const batchProcessing = ref(false)

// 分页
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 选择
const selectedRowKeys = ref<number[]>([])

// 弹窗状态
const deleteModalVisible = ref(false)
const batchModalVisible = ref(false)
const currentDeleteId = ref<number>()

// 搜索参数
const searchParams = reactive<ContestQueryRequest>({
  title: '',
  type: undefined,
  status: undefined,
  current: 1,
  pageSize: 20,
  sortField: 'createTime',
  sortOrder: 'desc'
})

// 批量操作表单
const batchForm = reactive({
  operation: ''
})

// 加载统计数据
const loadStats = async () => {
  try {
    stats.totalContests = contests.value.length
    stats.runningContests = contests.value.filter(c => c.status === 1).length
    stats.upcomingContests = contests.value.filter(c => c.status === 0).length
    stats.totalParticipants = contests.value.reduce((sum, c) => sum + (c.participantCount || 0), 0)
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 加载比赛列表
const loadContests = async () => {
  loading.value = true
  try {
    const params = {
      ...searchParams,
      current: currentPage.value,
      pageSize: pageSize.value
    }

    const response = await Service.listContestByPageUsingPost(params)

    if (response.code === 200 && response.data) {
      contests.value = response.data.records || []
      total.value = response.data.total || 0
      await loadStats()
    } else {
      Message.error(response.message || '获取比赛列表失败')
    }
  } catch (error) {
    console.error('获取比赛列表失败:', error)
    Message.error('获取比赛列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadContests()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchParams, {
    title: '',
    type: undefined,
    status: undefined,
    creatorId: ''
  })
  handleSearch()
}

// 刷新列表
const refreshList = () => {
  loadContests()
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadContests()
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadContests()
}

// 选择变化
const handleSelectionChange = (keys: number[]) => {
  selectedRowKeys.value = keys
}

// 比赛操作
const viewContest = (contestId: string) => {
  router.push(`/contest/${contestId}`)
}

const editContest = (contestId: string) => {
  router.push(`/update/contest?id=${contestId}`)
}

const viewRanking = (contestId: string) => {
  router.push(`/contest/${contestId}/ranking`)
}

const viewSubmissions = (contestId: string) => {
  router.push(`/contest/${contestId}/submissions`)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const exportData = (_contestId: number) => {
  // TODO: 实现数据导出功能
  Message.info('功能开发中')
}

// 更新比赛状态
const updateContestStatus = async (contestId: number, status: number) => {
  try {
    const response = await Service.updateContestStatusUsingPost(contestId, status)

    if (response.code === 200) {
      Message.success('状态更新成功')
      loadContests()
    } else {
      Message.error(response.message || '状态更新失败')
    }
  } catch (error) {
    console.error('状态更新失败:', error)
    Message.error('状态更新失败')
  }
}

// 删除比赛
const deleteContest = (contestId: number) => {
  currentDeleteId.value = contestId
  deleteModalVisible.value = true
}

const confirmDelete = async () => {
  if (!currentDeleteId.value) return

  deleting.value = true
  try {
    const response = await Service.deleteContestUsingPost({
      id: currentDeleteId.value
    })

    if (response.code === 200) {
      Message.success('删除成功')
      deleteModalVisible.value = false
      loadContests()
    } else {
      Message.error(response.message || '删除失败')
    }
  } catch (error) {
    console.error('删除失败:', error)
    Message.error('删除失败')
  } finally {
    deleting.value = false
  }
}

// 批量操作
const batchUpdateStatus = () => {
  if (!selectedRowKeys.value.length) {
    Message.warning('请先选择要操作的比赛')
    return
  }
  batchModalVisible.value = true
}

const confirmBatchOperation = async () => {
  if (!batchForm.operation) {
    Message.error('请选择操作类型')
    return
  }

  batchProcessing.value = true
  try {
    let response

    switch (batchForm.operation) {
      case 'start': {
        response = await Service.batchUpdateContestStatusUsingPost(
          selectedRowKeys.value, 1)
        break
      }
      case 'end': {
        response = await Service.batchUpdateContestStatusUsingPost(selectedRowKeys.value, 2)
        break
      }
      case 'delete': {
        // 批量删除需要确认
        const confirmed = await new Promise(resolve => {
          Modal.confirm({
            title: '确认批量删除',
            content: `确定要删除选中的 ${selectedRowKeys.value.length} 个比赛吗？此操作不可恢复。`,
            onOk: () => resolve(true),
            onCancel: () => resolve(false)
          })
        })

        if (!confirmed) return

        // TODO: 实现批量删除接口
        Message.info('批量删除功能开发中')
        return
      }
    }

    if (response && response.code === 200) {
      Message.success('批量操作成功')
      batchModalVisible.value = false
      selectedRowKeys.value = []
      loadContests()
    } else {
      Message.error(response?.message || '批量操作失败')
    }
  } catch (error) {
    console.error('批量操作失败:', error)
    Message.error('批量操作失败')
  } finally {
    batchProcessing.value = false
  }
}

// 工具函数
const getContestTypeName = (type: number) => {
  const typeMap: Record<number, string> = { 1: 'ACM', 2: 'OI', 3: 'IOI' }
  return typeMap[type] || '未知'
}

const getContestTypeColor = (type: number) => {
  const colorMap: Record<number, string> = { 1: 'blue', 2: 'green', 3: 'orange' }
  return colorMap[type] || 'gray'
}

const getContestStatusName = (status: number) => {
  const statusMap: Record<number, string> = { 0: '未开始', 1: '进行中', 2: '已结束' }
  return statusMap[status] || '未知'
}

const getContestStatusColor = (status: number) => {
  const colorMap: Record<number, string> = { 0: 'gray', 1: 'green', 2: 'red' }
  return colorMap[status] || 'gray'
}

const getNextStatus = (currentStatus: number) => {
  if (currentStatus === 0) return 1 // 未开始 -> 进行中
  if (currentStatus === 1) return 2 // 进行中 -> 已结束
  return currentStatus
}

const getStatusActionText = (status: number) => {
  if (status === 0) return '开始比赛'
  if (status === 1) return '结束比赛'
  return '无操作'
}

const formatDateTime = (dateTime?: string) => {
  return dateTime ? moment(dateTime).format('YYYY-MM-DD HH:mm') : '-'
}

// 页面加载
onMounted(() => {
  loadContests()
})
</script>

<style scoped lang="less">
.contest-manage-view {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow: hidden;

  .header-content {
    padding: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    .title-section {
      .page-title {
        color: white;
        margin-bottom: 8px;
        display: flex;
        align-items: center;

        .title-icon {
          margin-right: 12px;
          font-size: 32px;
        }
      }

      .subtitle {
        color: rgba(255, 255, 255, 0.8);
        font-size: 16px;
      }
    }

    .header-actions {
      .arco-btn {
        height: 44px;
        padding: 0 24px;
        font-size: 16px;
        border-radius: 6px;
      }
    }
  }
}

.stats-section {
  margin-bottom: 24px;

  .stat-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    :deep(.arco-statistic) {
      .arco-statistic-title {
        color: #86909c;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .arco-statistic-content {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  }
}

.filter-section {
  margin-bottom: 24px;

  .filter-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .filter-form {
      .arco-form-item {
        margin-bottom: 16px;
      }
    }
  }
}

.contest-table-section {
  .table-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .table-actions {
        display: flex;
        gap: 8px;
      }
    }

    .contest-table {
      .contest-info-cell {
        .contest-title {
          font-weight: 600;
          color: #1d2129;
          margin-bottom: 8px;
          cursor: pointer;

          &:hover {
            color: #165dff;
          }
        }

        .contest-meta {
          display: flex;
          align-items: center;
          gap: 8px;

          .private-tag {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #86909c;
            font-size: 12px;
          }
        }
      }

      .time-info {
        .time-item {
          display: flex;
          margin-bottom: 4px;
          font-size: 12px;

          .time-label {
            color: #86909c;
            min-width: 36px;
          }

          .time-value {
            color: #4e5969;
          }
        }
      }

      .participant-info {
        text-align: center;

        .participant-count {
          font-weight: 600;
          color: #165dff;
          font-size: 16px;
        }

        .participant-limit {
          color: #86909c;
          font-size: 12px;
        }
      }

      .creator-info {
        .creator-id {
          color: #86909c;
          font-size: 12px;
        }
      }

      .action-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
    }
  }
}

.delete-warning {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #fff7e6;
  border-radius: 6px;
  border: 1px solid #ffec3d;
}

.selected-info {
  padding: 12px;
  background: #f0f9ff;
  border: 1px solid #91caff;
  border-radius: 6px;
  color: #165dff;
  text-align: center;
}

@media (max-width: 768px) {
  .contest-manage-view {
    padding: 16px;
  }

  .page-header .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .filter-form {
    .arco-form-item {
      width: 100%;
    }
  }

  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .contest-table {
    :deep(.arco-table-cell) {
      padding: 8px 4px;
    }

    .action-buttons {
      flex-direction: column;
    }
  }
}
</style>
