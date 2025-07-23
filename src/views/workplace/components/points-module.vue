<template>
  <div class="points-module">
    <!-- 积分概览卡片 -->
    <a-card class="points-overview-card" title="积分概览" :bordered="false">
      <template #extra>
        <a-space>
          <a-tag color="blue" size="large">
            <template #icon>
              <icon-trophy />
            </template>
            当前积分: {{ currentPoints }}
          </a-tag>
          <a-button size="small" @click="refreshData">
            <template #icon>
              <icon-refresh />
            </template>
            刷新
          </a-button>
        </a-space>
      </template>

      <div class="overview-stats">
        <a-statistic
          title="本月获得"
          :value="monthlyGain"
          suffix="分"
          :value-style="{ color: '#0fbf60' }"
        >
          <template #prefix>
            <icon-arrow-up />
          </template>
        </a-statistic>
        <a-statistic
          title="历史最高"
          :value="historicalHigh"
          suffix="分"
          :value-style="{ color: '#ff7d00' }"
        >
          <template #prefix>
            <icon-fire />
          </template>
        </a-statistic>
        <a-statistic
          title="当前排名"
          :value="currentRank"
          suffix="名"
          :value-style="{ color: '#165dff' }"
        >
          <template #prefix>
            <icon-star />
          </template>
        </a-statistic>
      </div>
    </a-card>

    <!-- 积分变化图表 -->
    <a-card class="points-chart-card" title="积分变化趋势" :bordered="false">
      <template #extra>
        <a-radio-group v-model="chartTimeRange" type="button" size="small">
          <a-radio value="7d">近7天</a-radio>
          <a-radio value="30d">近30天</a-radio>
          <a-radio value="90d">近3个月</a-radio>
        </a-radio-group>
      </template>

      <div class="chart-container" v-loading="chartLoading">
        <v-chart :option="chartOption" style="height: 300px;" />
      </div>
    </a-card>

    <!-- 功能选项卡 -->
    <a-card class="points-tabs-card" :bordered="false">
      <a-tabs v-model:active-key="activeTab" type="card">
        <!-- 积分历史 -->
        <a-tab-pane key="history" title="积分历史">
          <template #title>
            <icon-history />
            积分历史
          </template>

          <div class="history-container">
            <div class="history-filters">
              <a-space>
                <a-select
                  v-model="historyFilter.type"
                  placeholder="选择类型"
                  style="width: 120px;"
                  @change="loadPointsHistory"
                >
                  <a-option value="">全部</a-option>
                  <a-option value="AC">通过题目</a-option>
                  <a-option value="CONTEST">比赛奖励</a-option>
                  <a-option value="DAILY">每日打卡</a-option>
                  <a-option value="PENALTY">扣分</a-option>
                </a-select>

                <a-range-picker
                  v-model="historyFilter.dateRange"
                  @change="loadPointsHistory"
                />

                <a-button @click="exportHistory">
                  <template #icon>
                    <icon-download />
                  </template>
                  导出
                </a-button>
              </a-space>
            </div>

            <a-table
              :data="pointsHistory"
              :columns="historyColumns"
              :loading="historyLoading"
              :pagination="historyPagination"
              @page-change="onHistoryPageChange"
              class="points-history-table"
            >
              <template #changePoints="{ record }">
                <span :class="getChangePointsClass(record.changePoints)">
                  {{ record.changePoints > 0 ? '+' : '' }}{{ record.changePoints }}
                </span>
              </template>

              <template #type="{ record }">
                <a-tag :color="getTypeColor(record.type)">
                  {{ getTypeLabel(record.type) }}
                </a-tag>
              </template>

              <template #createTime="{ record }">
                {{ formatDateTime(record.createTime) }}
              </template>
            </a-table>
          </div>
        </a-tab-pane>

        <!-- 积分排行榜 -->
        <a-tab-pane key="ranking" title="排行榜">
          <template #title>
            <icon-trophy />
            排行榜
          </template>

          <div class="ranking-container">
            <div class="ranking-filters">
              <a-space>
                <a-radio-group v-model="rankingFilter.period" @change="loadRanking">
                  <a-radio value="all">总排行</a-radio>
                  <a-radio value="month">本月</a-radio>
                  <a-radio value="week">本周</a-radio>
                </a-radio-group>

                <a-input-search
                  v-model="rankingFilter.keyword"
                  placeholder="搜索用户"
                  style="width: 200px;"
                  @search="loadRanking"
                />
              </a-space>
            </div>

            <a-table
              :data="ranking"
              :columns="rankingColumns"
              :loading="rankingLoading"
              :pagination="rankingPagination"
              @page-change="onRankingPageChange"
              class="points-ranking-table"
            >
              <template #rank="{ record }">
                <div class="rank-cell">
                  <span v-if="record.rank <= 3" class="rank-medal">
                    <icon-trophy v-if="record.rank === 1" style="color: #f59e0b; font-size: 24px;" />
                    <icon-trophy v-else-if="record.rank === 2" style="color: #9ca3af; font-size: 22px;" />
                    <icon-trophy v-else-if="record.rank === 3" style="color: #ea580c; font-size: 20px;" />
                  </span>
                  <span class="rank-number">{{ record.rank }}</span>
                  <div v-if="record.rank === 1" class="crown-effect">👑</div>
                </div>
              </template>

              <template #userName="{ record }">
                <div class="user-cell">
                  <a-avatar :size="32" class="user-avatar">
                    {{ record.userName?.charAt(0)?.toUpperCase() }}
                  </a-avatar>
                  <div class="user-info">
                    <span class="user-name">{{ record.userName }}</span>
                    <a-tag v-if="record.isCurrentUser" class="current-user-tag">
                      <icon-user />
                      我
                    </a-tag>
                  </div>
                </div>
              </template>

              <template #points="{ record }">
                <div class="points-container">
                  <span class="points-value">{{ record.points.toLocaleString() }}</span>
                  <div class="points-sparkle">✨</div>
                </div>
              </template>

              <template #change="{ record }">
                <div class="change-container">
                  <span :class="getChangeClass(record.change)">
                    {{ record.change > 0 ? `+${record.change}` : record.change }}
                  </span>
                </div>
              </template>
            </a-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { Message } from '@arco-design/web-vue'
import moment from 'moment'
import { useStore } from 'vuex'
import { Service } from '../../../../generated'
import type { UserRatingVO, UserRatingHistoryVO } from '../../../../generated'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// Store
const store = useStore()
const loginUser = computed(() => store.state.user.loginUser)

// 响应式数据
const currentPoints = ref(0)
const monthlyGain = ref(0)
const historicalHigh = ref(0)
const currentRank = ref(0)
const userRating = ref<UserRatingVO | null>(null)

const chartTimeRange = ref('30d')
const chartLoading = ref(false)
const activeTab = ref('history')

// 图表数据
const chartData = ref<{ date: string; points: number; change: number }[]>([])

// 积分历史相关
const pointsHistory = ref<any[]>([])
const historyLoading = ref(false)
const historyPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: true,
  showJumper: true,
  showPageSize: true
})

const historyFilter = reactive({
  type: '',
  dateRange: [] as any[]
})

// 排行榜相关
const ranking = ref<any[]>([])
const rankingLoading = ref(false)
const rankingPagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0,
  showTotal: true,
  showJumper: true,
  showPageSize: true
})

const rankingFilter = reactive({
  period: 'all',
  keyword: ''
})

// 图表配置
const chartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(102, 126, 234, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    textStyle: {
      color: '#1e293b',
      fontSize: 13
    },
    axisPointer: {
      type: 'cross',
      lineStyle: {
        color: 'rgba(102, 126, 234, 0.6)',
        width: 2
      },
      crossStyle: {
        color: 'rgba(102, 126, 234, 0.6)'
      },
      label: {
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderRadius: 6
      }
    },
    formatter: (params: any) => {
      const data = params[0]
      const change = chartData.value[data.dataIndex]?.change || 0
      return `
        <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="font-weight: 700; font-size: 14px; color: #1e293b; margin-bottom: 8px;">${data.axisValue}</div>
          <div style="color: #667eea; font-weight: 600; margin-bottom: 4px;">
            <span style="display: inline-block; width: 8px; height: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin-right: 6px;"></span>
            积分: ${data.value.toLocaleString()}
          </div>
          <div style="color: ${change >= 0 ? '#059669' : '#dc2626'}; font-weight: 600;">
            <span style="display: inline-block; width: 8px; height: 8px; background: ${change >= 0 ? '#059669' : '#dc2626'}; border-radius: 50%; margin-right: 6px;"></span>
            变化: ${change >= 0 ? '+' : ''}${change}
          </div>
        </div>
      `
    }
  },
  legend: {
    data: ['积分'],
    textStyle: {
      color: '#64748b',
      fontSize: 14,
      fontWeight: 600
    },
    itemGap: 20,
    icon: 'roundRect'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '8%',
    top: '15%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: chartData.value.map(item => moment(item.date).format('MM-DD')),
      axisLine: {
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.2)',
          width: 2
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#64748b',
        fontSize: 12,
        fontWeight: 500,
        margin: 12
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.1)',
          type: 'dashed'
        }
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        formatter: '{value}',
        color: '#64748b',
        fontSize: 12,
        fontWeight: 500
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(102, 126, 234, 0.1)',
          type: 'dashed'
        }
      }
    }
  ],
  series: [
    {
      name: '积分',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 4,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ]
        },
        shadowColor: 'rgba(102, 126, 234, 0.3)',
        shadowBlur: 10,
        shadowOffsetY: 3
      },
      itemStyle: {
        color: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.5,
          colorStops: [
            { offset: 0, color: '#ffffff' },
            { offset: 0.7, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ]
        },
        borderColor: '#667eea',
        borderWidth: 3,
        shadowColor: 'rgba(102, 126, 234, 0.4)',
        shadowBlur: 8
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(102, 126, 234, 0.4)' },
            { offset: 0.5, color: 'rgba(102, 126, 234, 0.2)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0.05)' }
          ]
        }
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowColor: 'rgba(102, 126, 234, 0.6)',
          shadowBlur: 15,
          borderWidth: 4,
          scale: 1.2
        }
      },
      data: chartData.value.map(item => item.points)
    }
  ]
}))

// 表格列定义
const historyColumns = [
  {
    title: '时间',
    dataIndex: 'createTime',
    slotName: 'createTime',
    width: 160
  },
  {
    title: '类型',
    dataIndex: 'type',
    slotName: 'type',
    width: 100
  },
  {
    title: '积分变化',
    dataIndex: 'changePoints',
    slotName: 'changePoints',
    width: 100,
    align: 'center'
  },
  {
    title: '原因',
    dataIndex: 'reason',
    ellipsis: true,
    tooltip: true
  },
  {
    title: '当时积分',
    dataIndex: 'totalPoints',
    width: 100,
    align: 'right'
  }
]

const rankingColumns = [
  {
    title: '排名',
    dataIndex: 'rank',
    slotName: 'rank',
    width: 80,
    align: 'center'
  },
  {
    title: '用户',
    dataIndex: 'userName',
    slotName: 'userName',
    width: 200
  },
  {
    title: '积分',
    dataIndex: 'points',
    slotName: 'points',
    width: 120,
    align: 'right'
  },
  {
    title: '变化',
    dataIndex: 'change',
    slotName: 'change',
    width: 100,
    align: 'center'
  }
]

// 方法
const loadUserRating = async () => {
  if (!loginUser.value?.id) {
    // 用户未登录，清空数据
    currentPoints.value = 0
    monthlyGain.value = 0
    historicalHigh.value = 0
    currentRank.value = 0
    return
  }

  try {
    const response = await Service.getUserRatingUsingGet(loginUser.value.id)
    if (response.code === 200 && response.data) {
      userRating.value = response.data
      currentPoints.value = response.data.currentRating || 0
      historicalHigh.value = response.data.maxRating || 0
      currentRank.value = response.data.rank || 0
      monthlyGain.value = response.data.recentChange || 0
    }
  } catch (error) {
    console.error('加载用户积分信息失败:', error)
    // 清空数据
    currentPoints.value = 0
    monthlyGain.value = 0
    historicalHigh.value = 0
    currentRank.value = 0
  }
}

const refreshData = async () => {
  await Promise.all([
    loadUserRating(),
    loadChartData(),
    loadPointsHistory(),
    loadRanking()
  ])
  Message.success('数据刷新成功')
}

const loadChartData = async () => {
  chartLoading.value = true
  try {
    chartData.value = []

    if (!loginUser.value?.id) {
      // 如果用户未登录，清空数据
      return
    }

    // 获取用户积分历史数据
    const response = await Service.getRatingHistoryUsingGet(loginUser.value.id)
    if (response.code === 200 && response.data) {
      const historyData = response.data
      chartData.value = convertHistoryToChartData(historyData, chartTimeRange.value)
    }
  } catch (error) {
    console.error('加载图表数据失败:', error)
    chartData.value = []
  } finally {
    chartLoading.value = false
  }
}

const loadPointsHistory = async () => {
  historyLoading.value = true
  try {
    pointsHistory.value = []
    historyPagination.total = 0

    if (!loginUser.value?.id) {
      // 如果用户未登录，清空数据
      return
    }

    // 获取用户积分历史数据
    const response = await Service.getRatingHistoryUsingGet(loginUser.value.id)
    if (response.code === 200 && response.data) {
      const historyData = response.data.map((item: UserRatingHistoryVO) => ({
        id: item.id,
        createTime: item.createTime,
        type: item.changeType || (item.contestTitle ? 'CONTEST_RANK' : 'RATING_CHANGE'),
        changePoints: item.ratingChange || 0,
        reason: item.reason || item.contestTitle || `积分变化：${item.ratingChange > 0 ? '+' : ''}${item.ratingChange}`,
        totalPoints: item.newRating || 0
      }))
      pointsHistory.value = historyData
      historyPagination.total = historyData.length
    }
  } catch (error) {
    console.error('加载积分历史失败:', error)
    pointsHistory.value = []
    historyPagination.total = 0
  } finally {
    historyLoading.value = false
  }
}

const loadRanking = async () => {
  rankingLoading.value = true
  try {
    // 获取积分排行榜数据
    const response = await Service.getRatingLeaderboardUsingGet(
      rankingPagination.current,
      rankingPagination.pageSize
    )

    if (response.code === 200 && response.data) {
      const rankingData = response.data.map((item: UserRatingVO, index: number) => ({
        rank: item.rank || ((rankingPagination.current - 1) * rankingPagination.pageSize + index + 1),
        userName: item.user?.userName || `用户${item.userId}`,
        points: item.currentRating || 0,
        change: item.recentChange || 0,
        isCurrentUser: loginUser.value?.id === item.userId
      }))
      ranking.value = rankingData
      rankingPagination.total = 1000 // 这个数据需要从响应头或其他地方获取
    } else {
      // 如果没有数据，清空排行榜
      ranking.value = []
      rankingPagination.total = 0
    }
  } catch (error) {
    console.error('加载排行榜失败:', error)
    // 出错时清空数据
    ranking.value = []
    rankingPagination.total = 0
  } finally {
    rankingLoading.value = false
  }
}

// 分页处理
const onHistoryPageChange = (page: number) => {
  historyPagination.current = page
  loadPointsHistory()
}

const onRankingPageChange = (page: number) => {
  rankingPagination.current = page
  loadRanking()
}

// 导出历史
const exportHistory = () => {
  Message.info('导出功能开发中...')
}

// 工具方法
const formatDateTime = (dateTime: string) => {
  return moment(dateTime).format('MM-DD HH:mm')
}

const convertHistoryToChartData = (historyData: UserRatingHistoryVO[], range: string) => {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const endDate = moment()
  const startDate = moment().subtract(days - 1, 'days')

  // 筛选指定时间范围内的数据
  const filteredData = historyData.filter(item => {
    const itemDate = moment(item.createTime)
    return itemDate.isBetween(startDate, endDate, 'day', '[]')
  }).sort((a, b) => moment(a.createTime!).valueOf() - moment(b.createTime!).valueOf())

  // 生成连续的日期数据
  const chartData = []
  let currentRating = filteredData.length > 0 ? (filteredData[0].oldRating || 0) : currentPoints.value

  for (let i = 0; i < days; i++) {
    const date = moment(startDate).add(i, 'days').format('YYYY-MM-DD')

    // 查找当天的积分变化
    const dayChanges = filteredData.filter(item =>
      moment(item.createTime).format('YYYY-MM-DD') === date
    )

    let dayChange = 0
    if (dayChanges.length > 0) {
      dayChange = dayChanges.reduce((sum, item) => sum + (item.ratingChange || 0), 0)
      currentRating = dayChanges[dayChanges.length - 1].newRating || currentRating
    }

    chartData.push({
      date,
      points: currentRating,
      change: dayChange
    })
  }

  return chartData
}

const getChangePointsClass = (change: number) => {
  return change > 0 ? 'points-gain' : 'points-loss'
}

const getChangeClass = (change: number) => {
  return change > 0 ? 'ranking-up' : change < 0 ? 'ranking-down' : 'ranking-same'
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'AC': 'green',
    'CONTEST': 'blue',
    'CONTEST_RANK': 'purple',
    'DAILY': 'orange',
    'PENALTY': 'red',
    'RATING_CHANGE': 'blue',
    'UNKNOWN': 'gray'
  }
  return colors[type] || 'gray'
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'AC': '通过题目',
    'CONTEST': '比赛奖励',
    'CONTEST_RANK': '比赛排名',
    'DAILY': '每日打卡',
    'PENALTY': '扣分',
    'RATING_CHANGE': '积分变化',
    'UNKNOWN': '未知'
  }
  return labels[type] || type
}


// 监听器
watch(chartTimeRange, () => {
  loadChartData()
})

// 生命周期
onMounted(() => {
  refreshData()
})
</script>

<style scoped lang="less">
.points-module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.points-overview-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;

  :deep(.arco-card-header) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 20px 20px 0 0;
    padding: 20px 24px;

    .arco-card-header-title {
      color: white;
      font-weight: 600;
      font-size: 18px;
    }
  }

  .overview-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 32px;
    margin-top: 24px;
    padding: 8px;

    :deep(.arco-statistic) {
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
      padding: 24px;
      border-radius: 16px;
      border: 1px solid rgba(102, 126, 234, 0.1);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 0 2px 2px 0;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
        border-color: rgba(102, 126, 234, 0.3);
      }

      .arco-statistic-title {
        color: #64748b;
        font-weight: 500;
        font-size: 14px;
        margin-bottom: 8px;
      }

      .arco-statistic-content {
        .arco-statistic-value {
          font-weight: 700;
          font-size: 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      }
    }
  }
}

.points-chart-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  }

  :deep(.arco-card-header) {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
    border-radius: 20px 20px 0 0;
    padding: 20px 24px;

    .arco-card-header-title {
      color: white;
      font-weight: 600;
      font-size: 18px;
    }
  }

  .chart-container {
    min-height: 320px;
    padding: 16px;
    background: linear-gradient(135deg, #fafbff 0%, #f0f4ff 100%);
    border-radius: 0 0 20px 20px;
  }
}

.points-tabs-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  }

  :deep(.arco-tabs-nav) {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border-radius: 20px 20px 0 0;
    padding: 8px 16px 0;

    .arco-tabs-tab {
      border-radius: 12px 12px 0 0;
      margin-right: 8px;
      transition: all 0.3s ease;

      &.arco-tabs-tab-active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;

        .arco-tabs-tab-title {
          color: white;
        }
      }

      &:hover:not(.arco-tabs-tab-active) {
        background: rgba(102, 126, 234, 0.1);
      }
    }
  }

  .history-container,
  .ranking-container {
    padding: 24px;

    .history-filters,
    .ranking-filters {
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 2px solid rgba(102, 126, 234, 0.1);
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      padding: 20px;
      border-radius: 12px;
    }
  }

  .points-history-table {
    .points-gain {
      color: #059669;
      font-weight: 700;
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 13px;
    }

    .points-loss {
      color: #dc2626;
      font-weight: 700;
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 13px;
    }
  }

  .points-ranking-table {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);



    :deep(.arco-table-th) {
      background: #f7f8fa;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e5e7eb;
    }

    :deep(.arco-table-tbody .arco-table-tr) {
      transition: background-color 0.2s ease;

      &:hover {
        background: #f0f9ff;
      }
    }

    .rank-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 70px;
      position: relative;

      .rank-medal {
        filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2));
        animation: pulse 2s infinite;
        transition: all 0.3s ease;

        &:hover {
          transform: scale(1.1) rotate(10deg);
        }
      }

      .rank-number {
        font-weight: 800;
        font-size: 18px;
        color: #1e293b;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      .crown-effect {
        position: absolute;
        top: -8px;
        right: -8px;
        font-size: 16px;
        animation: rotate 3s linear infinite;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
      }
    }

    .user-cell {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 0;

      .user-avatar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-weight: 700;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        border: 2px solid white;
        transition: all 0.3s ease;

        &:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }
      }

      .user-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
      }

      .user-name {
        font-weight: 600;
        font-size: 15px;
        color: #1e293b;
        transition: color 0.3s ease;
        line-height: 1.2;
      }

      .current-user-tag {
        font-size: 11px;
        font-weight: 600;
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 2px 6px;
        animation: glow 2s ease-in-out infinite alternate;
        display: inline-flex;
        align-items: center;
        gap: 2px;
        width: fit-content;

        .arco-icon {
          font-size: 10px;
        }
      }
    }

    .points-container {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;
    }

    .points-value {
      font-weight: 800;
      font-size: 18px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-align: right;
      font-variant-numeric: tabular-nums;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .points-sparkle {
      font-size: 12px;
      animation: sparkle 2s ease-in-out infinite;
      opacity: 0.7;
    }

    .change-container {
      display: flex;
      justify-content: center;
    }

    .ranking-up {
      color: #059669;
      font-weight: 700;
      font-size: 15px;
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      padding: 6px 10px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      gap: 4px;

      &::before {
        content: '↗';
        font-size: 16px;
        animation: bounce 1s infinite;
      }
    }

    .ranking-down {
      color: #dc2626;
      font-weight: 700;
      font-size: 15px;
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      padding: 6px 10px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      gap: 4px;

      &::before {
        content: '↘';
        font-size: 16px;
        animation: bounce 1s infinite;
      }
    }

    .ranking-same {
      color: #64748b;
      font-size: 15px;
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      padding: 6px 10px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      gap: 4px;

      &::before {
        content: '—';
        font-size: 16px;
      }
    }

    // 前三名特殊样式
    :deep(.arco-table-tbody .arco-table-tr) {
      &:nth-child(1) {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border-left: 6px solid #f59e0b;
        position: relative;

        &::before {
          content: '👑';
          position: absolute;
          left: -3px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          animation: rotate 3s linear infinite;
        }

        &:hover {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;

          .user-name, .rank-number {
            color: white;
          }
        }
      }

      &:nth-child(2) {
        background: linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%);
        border-left: 6px solid #9ca3af;

        &:hover {
          background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
          color: white;

          .user-name, .rank-number {
            color: white;
          }
        }
      }

      &:nth-child(3) {
        background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
        border-left: 6px solid #ea580c;

        &:hover {
          background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
          color: white;

          .user-name, .rank-number {
            color: white;
          }
        }
      }
    }
  }
}

// 简化动画，移除复杂效果

/* 响应式设计 */
@media (max-width: 768px) {
  .points-module {
    gap: 20px;
    padding: 16px;
  }

  .overview-stats {
    grid-template-columns: 1fr;
    gap: 20px;

    :deep(.arco-statistic) {
      padding: 20px;
    }
  }

  .chart-container {
    min-height: 280px;
    padding: 12px;
  }

  .history-filters,
  .ranking-filters {
    padding: 16px;

    :deep(.arco-space) {
      flex-wrap: wrap;
      gap: 12px;
    }
  }

  .points-ranking-table {
    .rank-cell {
      min-width: 60px;
      gap: 6px;

      .rank-medal {
        font-size: 18px;
      }

      .rank-number {
        font-size: 16px;
      }
    }

    .user-cell {
      gap: 12px;

      .arco-avatar {
        width: 28px;
        height: 28px;
        font-size: 12px;
      }

      .user-name {
        font-size: 14px;
      }
    }

    .points-value {
      font-size: 16px;
    }

    .ranking-up,
    .ranking-down,
    .ranking-same {
      font-size: 13px;
      padding: 4px 8px;
    }

    :deep(.arco-table-tbody .arco-table-tr) {
      &:hover {
        transform: none;
      }

      &:nth-child(1)::before,
      &:nth-child(2)::before,
      &:nth-child(3)::before {
        display: none;
      }
    }
  }
}

@media (max-width: 480px) {
  .points-module {
    padding: 12px;
    gap: 16px;
  }

  .overview-stats {
    :deep(.arco-statistic) {
      padding: 16px;

      .arco-statistic-content .arco-statistic-value {
        font-size: 24px;
      }
    }
  }

  .points-ranking-table {
    :deep(.arco-table-th) {
      padding: 12px 8px;
      font-size: 12px;
    }

    :deep(.arco-table-tbody .arco-table-tr .arco-table-td) {
      padding: 12px 8px;
    }

    .rank-cell {
      min-width: 50px;

      .rank-medal {
        font-size: 16px;
      }

      .rank-number {
        font-size: 14px;
      }
    }

    .user-cell {
      gap: 8px;

      .arco-avatar {
        width: 24px;
        height: 24px;
        font-size: 10px;
      }

      .user-name {
        font-size: 13px;
      }
    }

    .points-value {
      font-size: 14px;
    }
  }
}
</style>
