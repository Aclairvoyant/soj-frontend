<template>
  <div class="contest-ranking-view">
    <a-spin :loading="loading" class="loading-container">
      <!-- 排行榜头部 -->
      <div class="ranking-header">
        <div class="header-content">
          <div class="contest-info">
            <h1 class="contest-title">{{ contest?.title }}</h1>
            <div class="contest-meta">
              <a-tag :color="getContestTypeColor(contest?.contestType)" size="large">
                {{ getContestTypeName(contest?.contestType) }}
              </a-tag>
              <a-tag :color="getContestStatusColor(contest?.status)" size="large">
                {{ getContestStatusName(contest?.status) }}
              </a-tag>
              <span class="participant-count">
                <icon-user /> {{ totalParticipants }} 人参赛
              </span>
            </div>
          </div>

          <div class="header-actions">
            <a-button @click="exportToPdf" :loading="exporting">
              <template #icon>
                <icon-download />
              </template>
              导出PDF
            </a-button>
            <a-button @click="refreshRanking" :loading="refreshing">
              <template #icon>
                <icon-refresh />
              </template>
              刷新排名
            </a-button>
            <a-button @click="goToContest">
              <template #icon>
                <icon-left />
              </template>
              返回比赛
            </a-button>
          </div>
        </div>
      </div>

      <!-- 排名控制栏 -->
      <div class="ranking-controls">
        <a-card :bordered="false" class="controls-card">
          <div class="controls-content">
            <div class="left-controls">
              <a-radio-group v-model="rankingType" @change="handleTypeChange">
                <a-radio value="all">全部排名</a-radio>
                <a-radio value="official">正式参赛</a-radio>
                <a-radio value="virtual" v-if="contest?.allowVirtual">虚拟参赛</a-radio>
              </a-radio-group>

              <a-checkbox v-model="showMyRank" @change="handleShowMyRank" v-if="store.state.user.loginUser.id">
                只看我的排名
              </a-checkbox>
            </div>

            <div class="right-controls">
              <div class="time-info">
                <icon-clock-circle />
                <span v-if="contest?.status === 1">
                  {{ getTimeRemaining() }}
                </span>
                <span v-else>
                  比赛已{{ contest?.status === 0 ? '未开始' : '结束' }}
                </span>
              </div>

              <div class="auto-refresh">
                <a-switch
                  v-model="autoRefresh"
                  @change="toggleAutoRefresh"
                  size="small"
                />
                <span>自动刷新</span>
              </div>
            </div>
          </div>
        </a-card>
      </div>

      <!-- 排行榜表格 -->
      <div class="ranking-table-container">

        <a-card :bordered="false" class="ranking-card">
          <!-- ACM/ICPC 赛制排行榜 -->
          <a-table
            v-if="contest?.contestType === 1"
            :data="rankings"
            :pagination="{
              current: currentPage,
              pageSize: pageSize,
              total: totalParticipants,
              showTotal: true,
              showJumper: true
            }"
            @page-change="handlePageChange"
            class="ranking-table acm-table"
            :scroll="{ x: 'max-content' }"
          >
            <template #columns>
              <a-table-column title="排名" width="80" align="center" fixed="left">
                <template #cell="{ record }">
                  <div class="rank-cell" :class="getRankClass(record.rank)">
                    <icon-trophy v-if="record.rank <= 3" class="trophy-icon" />
                    {{ record.rank }}
                  </div>
                </template>
              </a-table-column>

              <a-table-column title="用户" width="200" fixed="left">
                <template #cell="{ record }">
                  <div class="user-cell">
                    <a-avatar  size="small">
                      <img :src="record.user?.userAvatar" alt="用户头像" />
                      {{ record.userName?.[0] }}
                    </a-avatar>
                    <span class="username">{{ record.user?.userName }}</span>
                    <a-tag v-if="record.isVirtual" color="orange" size="mini">虚拟</a-tag>
                  </div>
                </template>
              </a-table-column>

              <a-table-column title="解题数" width="100" align="center" :sortable="{ sortDirections: ['ascend', 'descend'] }">
                <template #cell="{ record }">
                  <div class="solved-count">{{ record.acceptCount || 0 }}</div>
                </template>
              </a-table-column>

              <a-table-column title="总用时" width="100" align="center" :sortable="{ sortDirections: ['ascend', 'descend'] }">
                <template #cell="{ record }">
                  <div class="total-time">{{ formatTime(record.totalTime) }}</div>
                </template>
              </a-table-column>

              <!-- 动态题目列 -->
              <a-table-column
                v-for="(problem, index) in getProblemsForDisplay()"
                :key="problem.questionId || index"
                :title="`${String.fromCharCode(65 + index)}`"
                width="70"
                align="center"
              >
                <template #cell="{ record }">
                  <div class="problem-result" :class="getProblemResultClass(record, problem.questionId)">
                    <div class="result-score">
                      {{ getProblemResultTime(record, problem.questionId) }}
                    </div>
                    <div class="result-attempts">
                      {{ getProblemResultAttemptText(record, problem.questionId) }}
                    </div>
                  </div>
                </template>
              </a-table-column>
            </template>
          </a-table>

          <!-- OI/IOI 赛制排行榜 -->
          <a-table
            v-else
            :data="rankings"
            :pagination="{
              current: currentPage,
              pageSize: pageSize,
              total: totalParticipants,
              showTotal: true,
              showJumper: true
            }"
            @page-change="handlePageChange"
            class="ranking-table oi-table"
            :scroll="{ x: 'max-content' }"
          >
            <template #columns>
              <a-table-column title="排名" width="80" align="center" fixed="left">
                <template #cell="{ record }">
                  <div class="rank-cell" :class="getRankClass(record.rank)">
                    <icon-trophy v-if="record.rank <= 3" class="trophy-icon" />
                    {{ record.rank }}
                  </div>
                </template>
              </a-table-column>

              <a-table-column title="用户" width="200" fixed="left">
                <template #cell="{ record }">
                  <div class="user-cell">
                    <a-avatar  size="small">
                      <img :src="record.userAvatar" alt="用户头像" />
                      {{ record.userName?.[0] }}
                    </a-avatar>
                    <span class="username">{{ record.userName }}</span>
                    <a-tag v-if="record.isVirtual" color="orange" size="mini">虚拟</a-tag>
                  </div>
                </template>
              </a-table-column>

              <a-table-column title="总分" width="100" align="center" :sortable="{ sortDirections: ['ascend', 'descend'] }">
                <template #cell="{ record }">
                  <div class="total-score">{{ record.totalScore || 0 }}</div>
                </template>
              </a-table-column>

              <!-- 动态题目列 -->
              <a-table-column
                v-for="(problem, index) in contestQuestion.value"
                :key="problem.questionId"
                :title="`${String.fromCharCode(65 + index)} (${problem.score}分)`"
                width="120"
                align="center"
              >
                <template #cell="{ record }">
                  <div class="problem-score" :class="getProblemScoreClass(record, problem.questionId)">
                    {{ getProblemScore(record, problem.questionId) }}
                  </div>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </a-card>
      </div>

      <!-- 我的排名浮动窗口 -->
      <div v-if="myRanking && !showMyRank" class="my-ranking-float">
        <a-card size="small" class="my-rank-card">
          <div class="my-rank-content">
            <div class="my-rank-info">
              <span class="rank-label">我的排名:</span>
              <span class="rank-value">#{{ myRanking.rank }}</span>
              <span class="score-info" v-if="contest?.contestType === 1">
                {{ myRanking.acceptCount || 0 }}题 | {{ formatTime(myRanking.totalTime) }}
              </span>
              <span class="score-info" v-else>
                {{ myRanking.totalScore || 0 }}分
              </span>
            </div>
            <a-button size="mini" @click="scrollToMyRank">
              定位
            </a-button>
          </div>
        </a-card>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Message } from '@arco-design/web-vue'
import { Service } from "../../../generated";
import type { ContestVO, ContestRankingVO, ContestQuestionVO, ACMContestRankingVO } from '../../../generated'
import moment from 'moment'
import jsPDF from 'jspdf'
import './../../utils/KaiShu-normal.js'


const route = useRoute()
const router = useRouter()
const store = useStore()

// 基础数据
const contest = ref<ContestVO>()
const contestQuestion = ref<ContestQuestionVO[]>([])
const rankings = ref<ContestRankingVO[]>([])
const acmRankings = ref<ACMContestRankingVO[]>([])
const myRanking = ref<ContestRankingVO>()
const loading = ref(false)
const refreshing = ref(false)
const exporting = ref(false)

// 分页和筛选
const currentPage = ref(1)
const pageSize = ref(50)
const totalParticipants = ref(0)
const rankingType = ref('all')
const showMyRank = ref(false)

// 自动刷新
const autoRefresh = ref(false)
const refreshTimer = ref<ReturnType<typeof setInterval>>()
const refreshInterval = 30000 // 30秒

// 获取比赛信息
const loadContestInfo = async () => {
  try {
    const contestId = route.params.id as string
    const response = await Service.getContestByIdUsingGet(contestId as any)

    if (response.code === 200 && response.data) {
      contest.value = response.data
      //console.log('比赛信息:', response);
    } else {
      Message.error(response.message || '获取比赛信息失败')
    }
  } catch (error) {
    console.error('获取比赛信息失败:', error)
    Message.error('获取比赛信息失败')
  }
}

// 获取题目信息
const loadContestQuestions = async () => {
  try {
    const contestId = route.params.id as string
    const response = await Service.getContestQuestionsUsingGet(contestId as any)
    console.log('题目信息:', response);
    if (response.code === 200 && response.data) {
      contestQuestion.value = response.data
    } else {
      Message.error(response.message || '获取题目信息失败')
    }
  } catch (error) {
    console.error('获取题目信息失败:', error)
    Message.error('获取题目信息失败')
  }
}

// 获取排行榜数据
const loadRankings = async (showLoading = true) => {
  if (showLoading) loading.value = true

  try {
    const contestId = route.params.id as string
    let response

    if (contest.value?.contestType === 1) {
      // ACM 赛制 - 使用新的ACM排名接口
      if (rankingType.value === 'official') {
        response = await Service.getAcmOfficialRankingUsingGet(contestId as any, currentPage.value, pageSize.value)
      } else if (rankingType.value === 'virtual') {
        // 对于虚拟参赛，使用通用ACM接口
        response = await Service.getAcmVirtualRankingUsingGet(contestId as any, currentPage.value, pageSize.value)
      } else {
        // 全部排名 - 使用ACM排名接口
        response = await Service.getAcmRankingUsingGet(contestId as any, currentPage.value, pageSize.value)
      }

      if (response.code === 200 && response.data) {
        acmRankings.value = response.data
        // 将ACM排名数据转换为通用格式以兼容现有显示逻辑
        rankings.value = response.data.map((acmRank: ACMContestRankingVO) => ({
          ...acmRank,
          userName: acmRank.user?.userName,
          userAvatar: acmRank.user?.userAvatar,
          isVirtual: acmRank.participationType === 2
        }))
      }
    } else if (contest.value?.contestType === 2) {
      // OI 赛制 - 使用新的OI排名接口
      if (rankingType.value === 'official') {
        response = await Service.getOiOfficialRankingUsingGet(contestId as any, currentPage.value, pageSize.value)
      } else if (rankingType.value === 'virtual') {
        response = await Service.getOiVirtualRankingUsingGet(contestId as any, currentPage.value, pageSize.value)
      } else {
        // 全部排名 - 使用OI排名接口
        response = await Service.getOiRankingUsingGet(contestId as any, currentPage.value, pageSize.value)
      }

      if (response.code === 200 && response.data) {
        rankings.value = response.data
      }
    } else if (contest.value?.contestType === 3) {
      // IOI 赛制 - 使用新的IOI排名接口
      if (rankingType.value === 'official') {
        response = await Service.getIoiOfficialRankingUsingGet(contestId as any, currentPage.value, pageSize.value)
      } else if (rankingType.value === 'virtual') {
        response = await Service.getIoiVirtualRankingUsingGet(contestId as any, currentPage.value, pageSize.value)
      } else {
        // 全部排名 - 使用IOI排名接口
        response = await Service.getIoiRankingUsingGet(contestId as any, currentPage.value, pageSize.value)
      }

      if (response.code === 200 && response.data) {
        rankings.value = response.data
      }
    } else {
      // 兜底：使用通用排名接口（如果其他类型或未知类型）
      response = await Service.getContestRankingUsingGet(contestId as any, currentPage.value, pageSize.value)

      if (response.code === 200 && response.data) {
        rankings.value = response.data
      }
    }

    if (response.code === 200 && response.data) {
      // 获取参赛总人数
      try {
        const countResponse = await Service.getParticipantCountUsingGet(contestId as any)
        if (countResponse.code === 200) {
          totalParticipants.value = countResponse.data || 0
        }
      } catch (error) {
        console.error('获取参赛人数失败:', error)
        // 如果获取参赛人数失败，使用返回的数据长度作为估算
        totalParticipants.value = response.data.length || 0
      }

      // 获取我的排名
      if (store.state.user.loginUser.id) {
        await loadMyRanking()
      }
    } else {
      Message.error(response.message || '获取排行榜失败')
    }
  } catch (error) {
    console.error('获取排行榜失败:', error)
    Message.error('获取排行榜失败')
  } finally {
    if (showLoading) loading.value = false
  }
}

// 获取我的排名
const loadMyRanking = async () => {
  try {
    const contestId = route.params.id as string
    const response = await Service.getMyRankingUsingGet(contestId as any)

    if (response.code === 200 && response.data) {
      myRanking.value = response.data
    }
  } catch (error) {
    console.error('获取我的排名失败:', error)
  }
}

// 刷新排名
const refreshRanking = async () => {
  refreshing.value = true
  await loadRankings(false)
  refreshing.value = false
  Message.success('排名已刷新')
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadRankings()
}

// 排名类型变化
const handleTypeChange = () => {
  currentPage.value = 1
  loadRankings()
}

// 只看我的排名
const handleShowMyRank = () => {
  if (showMyRank.value && myRanking.value) {
    rankings.value = [myRanking.value]
  } else {
    loadRankings()
  }
}

// 自动刷新切换
const toggleAutoRefresh = () => {
  if (autoRefresh.value) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

const startAutoRefresh = () => {
  stopAutoRefresh()
  refreshTimer.value = setInterval(() => {
    loadRankings(false)
  }, refreshInterval)
}

const stopAutoRefresh = () => {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
    refreshTimer.value = undefined
  }
}

// 定位到我的排名
const scrollToMyRank = () => {
  if (!myRanking.value) return

  const rankPerPage = pageSize.value
  const targetPage = Math.ceil((myRanking.value.rank || 1) / rankPerPage)

  if (targetPage !== currentPage.value) {
    currentPage.value = targetPage
    loadRankings()
  }

  // 滚动到对应行
  setTimeout(() => {
    const targetRow = document.querySelector(`[data-rank="${myRanking.value?.rank}"]`)
    if (targetRow) {
      targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, 500)
}

// 返回比赛
const goToContest = () => {
  router.push(`/contest/${contest.value?.id}`)
}

// 获取所有用户的提交记录（用于PDF导出）
const getAllSubmissions = async () => {
  try {
    const contestId = route.params.id as string
    console.log('开始获取提交记录，比赛ID:', contestId)

    const response = await Service.getAllContestSubmissionsUsingGet(
      contestId as any,
      1,
      undefined,
      undefined,
      1000, // 获取大量数据
      undefined
    )

    console.log('提交记录响应:', response)

    if (response.code === 200 && response.data) {
      const submissions = response.data.records || []
      console.log('获取到的提交记录数量:', submissions.length)
      console.log('第一条提交记录样本:', submissions[0])
      return submissions
    }
    console.log('未获取到提交记录数据')
    return []
  } catch (error) {
    console.error('获取提交记录失败:', error)
    return []
  }
}

// 导出PDF功能
const exportToPdf = async () => {
  if (exporting.value) return

  exporting.value = true
  try {
    Message.info('正在生成PDF，请稍候...')

    // 获取所有排名数据（不分页）
    const allRankingsResponse = await loadAllRankingsForExport()

    // 获取所有提交记录
    const submissions = await getAllSubmissions()
    console.log('PDF导出中获取的提交记录数量:', submissions.length)

    // 创建PDF文档
    const pdf = new jsPDF('l', 'mm', 'a4') // 横向A4

    // 设置中文字体
    pdf.setFont('KaiShu')

    let yPosition = 20
    const pageWidth = 297 // A4横向宽度
    const marginLeft = 10
    const marginRight = 10
    const contentWidth = pageWidth - marginLeft - marginRight

    // 标题
    pdf.setFontSize(20)
    const title = `${contest.value?.title || '比赛'} - 排名报告`
    const titleWidth = pdf.getTextWidth(title)
    pdf.text(title, (pageWidth - titleWidth) / 2, yPosition)
    yPosition += 15

    // 基本信息
    pdf.setFontSize(12)
    pdf.text(`比赛ID: ${contest.value?.id || '未知'}`, marginLeft, yPosition)
    yPosition += 8
    pdf.text(`比赛类型: ${getContestTypeName(contest.value?.contestType)}`, marginLeft, yPosition)
    yPosition += 8
    pdf.text(`导出时间: ${moment().format('YYYY-MM-DD HH:mm:ss')}`, marginLeft, yPosition)
    yPosition += 15

    // 排名榜标题
    pdf.setFontSize(16)
    pdf.text('排名榜', marginLeft, yPosition)
    yPosition += 10

    // 排名表格表头
    pdf.setFontSize(10)
    const headers = ['排名', '用户名', contest.value?.contestType === 1 ? '解题数' : '总分']
    if (contest.value?.contestType === 1) {
      headers.push('总用时')
    }

    let xPosition = marginLeft
    const colWidths = contest.value?.contestType === 1 ? [30, 80, 40, 50] : [30, 100, 60]

    // 绘制表头
    headers.forEach((header, index) => {
      pdf.rect(xPosition, yPosition - 5, colWidths[index], 8)
      pdf.text(header, xPosition + 2, yPosition)
      xPosition += colWidths[index]
    })
    yPosition += 8

    // 绘制排名数据
    allRankingsResponse.slice(0, 30).forEach((ranking: any) => {
      if (yPosition > 180) { // 换页
        pdf.addPage()
        pdf.setFont('KaiShu')
        yPosition = 20
      }

      xPosition = marginLeft
      const rowData = [
        ranking.rank?.toString() || '',
        ranking.userName || ranking.user?.userName || '用户',
        contest.value?.contestType === 1 ? (ranking.acceptCount || 0).toString() : (ranking.totalScore || 0).toString()
      ]
      if (contest.value?.contestType === 1) {
        rowData.push(formatTime(ranking.totalTime))
      }

      rowData.forEach((data, index) => {
        pdf.rect(xPosition, yPosition - 5, colWidths[index], 8)
        pdf.text(data, xPosition + 2, yPosition)
        xPosition += colWidths[index]
      })
      yPosition += 8
    })


    // 保存PDF
    const fileName = `${contest.value?.title || '比赛'}_排名报告_${moment().format('YYYYMMDD_HHmmss')}.pdf`
    pdf.save(fileName)

    Message.success('PDF导出成功')

  } catch (error) {
    console.error('导出PDF失败:', error)
    Message.error('导出PDF失败')
  } finally {
    exporting.value = false
  }
}

// 获取所有排名数据（不分页，用于导出）
const loadAllRankingsForExport = async () => {
  try {
    const contestId = route.params.id as string
    let response

    if (contest.value?.contestType === 1) {
      // ACM赛制
      response = await Service.getAcmRankingUsingGet(contestId as any, 1, 1000)
    } else if (contest.value?.contestType === 2) {
      // OI赛制
      response = await Service.getOiRankingUsingGet(contestId as any, 1, 1000)
    } else if (contest.value?.contestType === 3) {
      // IOI赛制
      response = await Service.getIoiRankingUsingGet(contestId as any, 1, 1000)
    } else {
      // 兜底
      response = await Service.getContestRankingUsingGet(contestId as any, 1, 1000)
    }

    if (response.code === 200 && response.data) {
      if (contest.value?.contestType === 1) {
        // 转换ACM排名数据格式
        return response.data.map((acmRank: any) => ({
          ...acmRank,
          userName: acmRank.user?.userName,
          userAvatar: acmRank.user?.userAvatar,
          isVirtual: acmRank.participationType === 2
        }))
      }
      return response.data
    }
    return []
  } catch (error) {
    console.error('获取所有排名数据失败:', error)
    return []
  }
}


// 计算属性
const getTimeRemaining = () => {
  if (!contest.value?.endTime) return ''

  const endTime = moment(contest.value.endTime)
  const now = moment()
  const remaining = endTime.diff(now)

  if (remaining <= 0) return '比赛已结束'

  const duration = moment.duration(remaining)
  const hours = Math.floor(duration.asHours())
  const minutes = duration.minutes()
  const seconds = duration.seconds()

  return `剩余 ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 工具函数
const getProblemsForDisplay = () => {
  // 优先使用新的 contestQuestion 数据
  if (contestQuestion.value?.length) {
    return contestQuestion.value
  }

  // 兼容老的 contest.questions 数据
  if (contest.value?.questions?.length) {
    return contest.value.questions
  }

  // 如果没有题目数据，从排名数据中推断题目
  if (rankings.value?.length) {
    const problemIds = new Set<string | number>()
    rankings.value.forEach(ranking => {
      ranking.problemResults?.forEach(result => {
        if (result.questionId) {
          problemIds.add(result.questionId)
        }
      })
    })

    // 转换为题目对象数组并排序
    const problems = Array.from(problemIds)
      .sort((a, b) => {
        // 处理字符串和数字的混合排序
        const numA = typeof a === 'string' ? parseInt(a) : a
        const numB = typeof b === 'string' ? parseInt(b) : b
        return numA - numB
      })
      .map(id => ({ questionId: id }))

    if (problems.length > 0) {
      return problems
    }
  }

  // 如果都没有数据，返回空数组
  return []
}

const getContestTypeName = (type?: number) => {
  const typeMap: Record<number, string> = { 1: 'ACM', 2: 'OI', 3: 'IOI' }
  return typeMap[type || 1] || '未知'
}

const getContestTypeColor = (type?: number) => {
  const colorMap: Record<number, string> = { 1: 'blue', 2: 'green', 3: 'orange' }
  return colorMap[type || 1] || 'gray'
}

const getContestStatusName = (status?: number) => {
  const statusMap: Record<number, string> = { 0: '未开始', 1: '进行中', 2: '已结束' }
  return statusMap[status || 0] || '未知'
}

const getContestStatusColor = (status?: number) => {
  const colorMap: Record<number, string> = { 0: 'gray', 1: 'green', 2: 'red' }
  return colorMap[status || 0] || 'gray'
}

const getRankClass = (rank: number) => {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return ''
}

const formatTime = (minutes?: number) => {
  if (!minutes) return '-'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}:${mins.toString().padStart(2, '0')}`
}

// ACM 赛制相关函数
const getProblemResultTime = (record: ContestRankingVO, problemId: string | number) => {
  const result = record.problemResults?.find(p => p.questionId?.toString() === problemId?.toString())
  if (!result) return ''

  // 对于ACM赛制，显示通过时间
  if (result.status === 2) {
    return formatTime(result.totalTime)
  }
  return ''
}

const getProblemResultAttemptText = (record: ContestRankingVO, problemId: string | number) => {
  const result = record.problemResults?.find(p => p.questionId?.toString() === problemId?.toString())
  if (!result) return ''

  const attempts = result.submitCount || 0
  if (attempts === 0) return ''

  // 对于ACM赛制，显示尝试次数
  if (result.status === 2) {
    // 通过的情况显示尝试次数
    return attempts === 1 ? '1 try' : `${attempts} tries`
  } else if (attempts > 0) {
    // 未通过但有尝试的情况显示负数
    return `-${attempts}`
  }
  return ''
}

const getProblemResultClass = (record: ContestRankingVO, problemId: string | number) => {
  const result = record.problemResults?.find(p => p.questionId?.toString() === problemId?.toString())
  if (!result) return ''

  if (result.status === 2) return 'accepted' // AC状态 - 绿色
  if ((result.submitCount || 0) > 0) return 'wrong-answer' // 有提交但未AC - 红色
  return '' // 未提交 - 无背景
}

// OI 赛制相关函数
const getProblemScore = (record: ContestRankingVO, problemId: string | number) => {
  const result = record.problemResults?.find(p => p.questionId?.toString() === problemId?.toString())
  if (!result) return ''

  // For ACM mode, show the score (time) if accepted, otherwise show empty
  if (contest.value?.contestType === 1) {
    if (result.status === 2) {
      return result.totalTime || 0
    }
    return ''
  }

  // For OI/IOI mode, show the score points
  return result?.score || 0
}

const getProblemScoreClass = (record: ContestRankingVO, problemId: string | number) => {
  const result = record.problemResults?.find(p => p.questionId?.toString() === problemId?.toString())
  if (!result || !result.score) return ''

  const problem = contestQuestion.value?.find((q: any) => q.questionId?.toString() === problemId?.toString()) ||
                 contest.value?.questions?.find((q: any) => q.questionId?.toString() === problemId?.toString())
  if (!problem?.score) return ''

  const percentage = (result.score / problem.score) * 100

  if (percentage === 100) return 'full-score'
  if (percentage >= 60) return 'partial-score'
  return 'low-score'
}

// 页面生命周期
onMounted(() => {
  Promise.all([loadContestInfo(), loadContestQuestions(), loadRankings()])

  // 如果比赛正在进行，启动自动刷新
  if (contest.value?.status === 1) {
    autoRefresh.value = true
    startAutoRefresh()
  }
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped lang="less">
.contest-ranking-view {
  background: #f5f5f5;
  min-height: 100vh;
}

.loading-container {
  min-height: 60vh;
  width: 100%;
}

.ranking-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 24px;

  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 48px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .contest-info {
      .contest-title {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 16px;
        color: white;
      }

      .contest-meta {
        display: flex;
        align-items: center;
        gap: 16px;

        .participant-count {
          display: flex;
          align-items: center;
          gap: 6px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
        }
      }
    }

    .header-actions {
      display: flex;
      gap: 12px;

      .arco-btn {
        height: 44px;
        padding: 0 20px;
        font-size: 15px;
      }
    }
  }
}

.ranking-controls {
  max-width: 1400px;
  margin: 0 auto 24px;
  padding: 0 24px;

  .controls-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .controls-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left-controls {
        display: flex;
        align-items: center;
        gap: 24px;
      }

      .right-controls {
        display: flex;
        align-items: center;
        gap: 20px;

        .time-info {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #86909c;
          font-weight: 500;
        }

        .auto-refresh {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4e5969;
        }
      }
    }
  }
}

.ranking-table-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;

  .ranking-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .ranking-table {
      :deep(.arco-table-th) {
        background: #f7f8fa;
        border-bottom: 2px solid #e5e6eb;
        font-weight: 600;
      }

      .rank-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        font-weight: 600;

        &.gold {
          color: #ffd700;
          .trophy-icon {
            color: #ffd700;
          }
        }

        &.silver {
          color: #c0c0c0;
          .trophy-icon {
            color: #c0c0c0;
          }
        }

        &.bronze {
          color: #cd7f32;
          .trophy-icon {
            color: #cd7f32;
          }
        }

        .trophy-icon {
          font-size: 16px;
        }
      }

      .user-cell {
        display: flex;
        align-items: center;
        gap: 8px;

        .username {
          font-weight: 500;
          color: #1d2129;
        }
      }

      .solved-count,
      .total-time,
      .total-score {
        font-weight: 600;
        color: #1d2129;
      }

      // ACM 赛制样式
      &.acm-table {
        .problem-result {
          text-align: center;
          padding: 4px 2px;
          border-radius: 3px;
          min-height: 45px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;

          .result-score {
            font-size: 18px;
            font-weight: bold;
            line-height: 1;
            margin-bottom: 1px;
          }

          .result-attempts {
            font-size: 9px;
            line-height: 1;
            font-weight: 500;
          }

          // 通过的题目 - 绿色背景
          &.accepted {
            background-color: #4ade80;
            color: white;
          }

          // 尝试但未通过的题目 - 红色背景
          &.wrong-answer {
            background-color: #f87171;
            color: white;
          }

          // 未尝试的题目 - 无背景色
          &:not(.accepted):not(.wrong-answer) {
            background-color: transparent;
            color: #6b7280;
          }
        }
      }

      // OI 赛制样式
      &.oi-table {
        .problem-score {
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 4px;
          text-align: center;

          &.full-score {
            background: #f0f9ff;
            color: #00b42a;
            border: 1px solid #b9e7dc;
          }

          &.partial-score {
            background: #fff7e8;
            color: #ff7d00;
            border: 1px solid #ffb65d;
          }

          &.low-score {
            background: #ffece8;
            color: #f53f3f;
            border: 1px solid #fbaca3;
          }
        }
      }
    }
  }
}

.my-ranking-float {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;

  .my-rank-card {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    border-radius: 8px;

    .my-rank-content {
      display: flex;
      align-items: center;
      gap: 16px;

      .my-rank-info {
        display: flex;
        align-items: center;
        gap: 8px;

        .rank-label {
          color: #86909c;
        }

        .rank-value {
          font-weight: 600;
          color: #165dff;
          font-size: 16px;
        }

        .score-info {
          color: #4e5969;
          font-size: 14px;
        }
      }
    }
  }
}

@media (max-width: 1200px) {
  .ranking-table-container,
  .ranking-controls {
    padding: 0 16px;
  }

  .ranking-header .header-content {
    padding: 32px 16px;
  }
}

@media (max-width: 768px) {
  .ranking-header .header-content {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;

    .contest-title {
      font-size: 24px;
    }

    .header-actions {
      width: 100%;
      justify-content: space-between;
    }
  }

  .controls-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;

    .left-controls {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .right-controls {
      width: 100%;
      justify-content: space-between;
    }
  }

  .my-ranking-float {
    bottom: 16px;
    right: 16px;
    left: 16px;

    .my-rank-content {
      flex-direction: column;
      gap: 12px;
    }
  }

  .ranking-table {
    :deep(.arco-table-cell) {
      padding: 8px 4px;
      font-size: 12px;
    }

    .user-cell {
      flex-direction: column;
      gap: 4px;
      align-items: flex-start;

      .username {
        font-size: 12px;
      }
    }
  }
}
</style>
