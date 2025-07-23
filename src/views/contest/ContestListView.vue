<template>
  <div class="contest-list-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <a-typography-title :heading="2" class="page-title">
            <icon-trophy class="title-icon" />
            比赛列表
          </a-typography-title>
          <a-typography-text class="subtitle">参与编程竞赛，提升自己的技能水平</a-typography-text>
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

    <!-- 筛选条件 -->
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

    <!-- 比赛状态标签页 -->
    <div class="tabs-section">
      <a-tabs v-model:active-key="activeTab" @change="handleTabChange" class="contest-tabs">
        <a-tab-pane key="all" title="全部比赛" />
        <a-tab-pane key="upcoming" title="即将开始" />
        <a-tab-pane key="running" title="进行中" />
        <a-tab-pane key="ended" title="已结束" />
        <a-tab-pane key="registered" title="我的报名" />
      </a-tabs>
    </div>

    <!-- 比赛列表 -->
    <div class="contest-list">
      <a-list
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
        class="contest-list-content"
      >
        <template #item="{ item }">
          <a-list-item class="contest-item">
            <div class="contest-card">
              <div class="contest-info">
                <div class="contest-header">
                  <div class="contest-title-section">
                    <h3 class="contest-title" @click="goToContest(item.id)">
                      {{ item.title }}
                    </h3>
                    <div class="contest-meta">
                      <a-tag :color="getContestTypeColor(item.contestType)" class="contest-type">
                        {{ getContestTypeName(item.contestType) }}
                      </a-tag>
                      <a-tag :color="getContestStatusColor(item.status)" class="contest-status">
                        {{ getContestStatusName(item.status) }}
                      </a-tag>
                      <span v-if="!item.isPublic" class="private-icon">
                        <icon-lock /> 私有
                      </span>
                    </div>
                  </div>
                  <div class="contest-actions">
                    <a-button type="outline" @click="goToContest(item.id)">
                      查看详情
                    </a-button>
                    <a-button
                      type="primary"
                      @click="goToContest(item.id)"
                      v-if="item.status === 1"
                    >
                      进入比赛
                    </a-button>
                  </div>
                </div>

                <div class="contest-description">
                  <p>{{ item.description || '暂无描述' }}</p>
                </div>

                <div class="contest-details">
                  <div class="detail-item">
                    <icon-clock-circle />
                    <span class="label">比赛时间：</span>
                    <span class="value">{{ formatDateTime(item.startTime) }} - {{ formatDateTime(item.endTime) }}</span>
                  </div>
                  <div class="detail-item">
                    <icon-user />
                    <span class="label">参赛人数：</span>
                    <span class="value">{{ item.participantCount || 0 }} / {{ item.maxParticipants || '不限' }}</span>
                  </div>
                  <div class="detail-item" v-if="item.registerStartTime">
                    <icon-calendar />
                    <span class="label">报名时间：</span>
                    <span class="value">{{ formatDateTime(item.registerStartTime) }} - {{ formatDateTime(item.registerEndTime) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </a-list-item>
        </template>

        <template #empty>
          <a-empty description="暂无比赛数据" />
        </template>
      </a-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { Service } from '../../../generated'
import type { ContestVO, ContestQueryRequest } from '../../../generated'
import moment from 'moment'

const router = useRouter()

// 数据状态
const contests = ref<ContestVO[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const activeTab = ref('all')

// 搜索参数
const searchParams = reactive<ContestQueryRequest>({
  title: '',
  type: undefined,
  status: undefined,
  isPublic: undefined,
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'desc'
})

// 获取比赛列表
const loadContests = async () => {
  loading.value = true
  try {
    const params = {
      ...searchParams,
      current: currentPage.value,
      pageSize: pageSize.value
    }

    let response
    switch (activeTab.value) {
      case 'upcoming':
        response = await Service.getUpcomingContestsUsingGet()
        break
      case 'running':
        response = await Service.getRunningContestsUsingGet()
        break
      case 'registered':
        response = await Service.getMyRegistrationsUsingGet()
        break
      default:
        response = await Service.listContestByPageUsingPost(params)
    }

    if (response.code === 200) {
      if (response.data?.records) {
        contests.value = response.data.records
        total.value = response.data.total || 0
      } else {
        contests.value = response.data || []
        total.value = contests.value.length
      }
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
    isPublic: undefined
  })
  handleSearch()
}

// 标签页切换
const handleTabChange = (key: string) => {
  activeTab.value = key
  currentPage.value = 1

  // 根据标签页调整搜索参数
  switch (key) {
    case 'upcoming':
      searchParams.status = 0
      break
    case 'running':
      searchParams.status = 1
      break
    case 'ended':
      searchParams.status = 2
      break
    default:
      searchParams.status = undefined
  }

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

// 跳转到比赛详情
const goToContest = (contestId: number) => {
  router.push(`/contest/${contestId}`)
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

const formatDateTime = (dateTime: string) => {
  return moment(dateTime).format('YYYY-MM-DD HH:mm')
}

// 页面加载
onMounted(() => {
  loadContests()
})
</script>

<style scoped lang="less">
.contest-list-view {
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
      .ant-btn {
        height: 44px;
        padding: 0 24px;
        font-size: 16px;
        border-radius: 6px;
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

.tabs-section {
  margin-bottom: 24px;

  .contest-tabs {
    background: white;
    border-radius: 8px;
    padding: 0 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.contest-list {
  .contest-list-content {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .contest-item {
    border: none;
    padding: 0;

    .contest-card {
      padding: 24px;
      border-bottom: 1px solid #f0f0f0;

      &:hover {
        background: #fafafa;
      }

      .contest-info {
        .contest-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;

          .contest-title-section {
            flex: 1;

            .contest-title {
              font-size: 20px;
              font-weight: 600;
              color: #1d2129;
              cursor: pointer;
              margin-bottom: 8px;

              &:hover {
                color: #165dff;
              }
            }

            .contest-meta {
              display: flex;
              align-items: center;
              gap: 8px;

              .private-icon {
                display: flex;
                align-items: center;
                gap: 4px;
                color: #86909c;
                font-size: 12px;
              }
            }
          }

          .contest-actions {
            display: flex;
            gap: 8px;
          }
        }

        .contest-description {
          margin-bottom: 16px;
          color: #4e5969;
          line-height: 1.5;
        }

        .contest-details {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .detail-item {
            display: flex;
            align-items: center;
            color: #86909c;
            font-size: 14px;

            .anticon {
              margin-right: 8px;
              color: #165dff;
            }

            .label {
              margin-right: 4px;
              font-weight: 500;
            }

            .value {
              color: #4e5969;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .contest-list-view {
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

  .contest-card .contest-info .contest-header {
    flex-direction: column;
    gap: 16px;
  }

  .contest-details {
    .detail-item {
      flex-wrap: wrap;
    }
  }
}
</style>
