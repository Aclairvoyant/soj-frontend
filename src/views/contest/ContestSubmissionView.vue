<template>
  <div class="contest-submission-view">
    <a-spin :loading="loading" class="loading-container">
      <!-- 比赛信息头部 -->
      <div class="contest-header">
        <div class="header-content">
          <div class="contest-info">
            <h2 class="contest-title">{{ contest?.title }}</h2>
            <div class="contest-meta">
              <a-tag :color="getContestTypeColor(contest?.contestType)">
                {{ getContestTypeName(contest?.contestType) }}
              </a-tag>
              <span class="divider">|</span>
              <span class="section-title">提交记录</span>
            </div>
          </div>
          <div class="header-actions">
            <a-button @click="goBack" size="large">
              <template #icon>
                <icon-arrow-left />
              </template>
              返回比赛
            </a-button>
            <a-button @click="viewRanking" size="large">
              <template #icon>
                <icon-trophy />
              </template>
              查看排名
            </a-button>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="stats-section">
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :sm="12" :md="6">
            <a-card class="stat-card" :bordered="false">
              <a-statistic
                title="总提交数"
                :value="totalSubmissions"
                :value-style="{ color: '#165dff' }"
              />
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="12" :md="6">
            <a-card class="stat-card" :bordered="false">
              <a-statistic
                title="通过数"
                :value="acceptedSubmissions"
                :value-style="{ color: '#00b42a' }"
              />
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="12" :md="6">
            <a-card class="stat-card" :bordered="false">
              <a-statistic
                title="参与选手"
                :value="uniqueUsers"
                :value-style="{ color: '#ff7d00' }"
              />
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="12" :md="6">
            <a-card class="stat-card" :bordered="false">
              <a-statistic
                title="通过率"
                :value="acceptanceRate"
                :value-style="{ color: '#f53f3f' }"
              >
              <template #suffix>%</template>
              </a-statistic>
            </a-card>
          </a-col>
        </a-row>
      </div>

      <!-- 筛选条件 -->
      <div class="filter-section">
        <a-card :bordered="false">
          <a-row :gutter="[16, 16]">
            <a-col :xs="24" :sm="12" :md="6">
              <a-select
                v-model="filters.language"
                placeholder="筛选语言"
                allow-clear
                @change="handleFilterChange"
              >
                <a-option value="">所有语言</a-option>
                <a-option value="java">Java</a-option>
                <a-option value="cpp">C++</a-option>
                <a-option value="c">C</a-option>
                <a-option value="python">Python</a-option>
                <a-option value="go">Go</a-option>
                <a-option value="javascript">JavaScript</a-option>
              </a-select>
            </a-col>
            <a-col :xs="24" :sm="12" :md="6">
              <a-select
                v-model="filters.status"
                placeholder="筛选状态"
                allow-clear
                @change="handleFilterChange"
              >
                <a-option value="">所有状态</a-option>
                <a-option value="0">等待中</a-option>
                <a-option value="1">判题中</a-option>
                <a-option value="2">通过</a-option>
                <a-option value="3">失败</a-option>
              </a-select>
            </a-col>
            <a-col :xs="24" :sm="12" :md="6">
              <a-select
                v-model="filters.questionId"
                placeholder="筛选题目"
                allow-clear
                @change="handleFilterChange"
              >
                <a-option value="">所有题目</a-option>
                <a-option
                  v-for="(question, index) in contest?.questions"
                  :key="question.questionId"
                  :value="question.questionId"
                >
                  {{ getProblemLabel(index) }}. {{ question.title }}
                </a-option>
              </a-select>
            </a-col>
            <a-col :xs="24" :sm="12" :md="6">
              <a-input
                v-model="filters.userName"
                placeholder="筛选用户名"
                allow-clear
                @change="handleFilterChange"
              >
                <template #prefix>
                  <icon-user />
                </template>
              </a-input>
            </a-col>
          </a-row>
        </a-card>
      </div>

      <!-- 提交记录表格 -->
      <div class="submissions-section">
        <a-card title="提交记录" :bordered="false">
          <template #extra>
            <a-space>
              <a-button @click="exportToPdf" :loading="exporting" size="small">
                <template #icon>
                  <icon-download />
                </template>
                导出PDF
              </a-button>
              <a-button @click="fetchSubmissions" :loading="loading" size="small">
                <template #icon>
                  <icon-refresh />
                </template>
                刷新
              </a-button>
            </a-space>
          </template>

          <a-table
            :data="submissions"
            :pagination="{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showTotal: true,
              pageSizeOptions: ['10', '20', '50', '100']
            }"
            :scroll="{ x: 'max-content' }"
            @page-change="onPageChange"
            @page-size-change="onPageSizeChange"
          >
            <template #columns>
              <a-table-column title="提交ID" data-index="id" width="100" align="center">
                <template #cell="{ record }">
                  <span class="submission-id">#{{ record.id }}</span>
                </template>
              </a-table-column>

              <a-table-column title="用户名" data-index="userName" width="150">
                <template #cell="{ record }">
                  <div class="user-info">
<!--                    <a-avatar :size="28" class="user-avatar">-->
<!--                      <icon-user />-->
<!--                    </a-avatar>-->
                    <span class="user-name">{{ record.userName || '未知用户' }}</span>
                  </div>
                </template>
              </a-table-column>

              <a-table-column title="题目" data-index="questionTitle" width="200">
                <template #cell="{ record }">
                  <div class="problem-info">
                    <span class="problem-label">{{ getProblemLabelById(record.questionId) }}</span>
                    <span class="problem-title">{{ record.questionTitle || '未知题目' }}</span>
                  </div>
                </template>
              </a-table-column>

              <a-table-column title="语言" data-index="language" width="100" align="center">
                <template #cell="{ record }">
                  <a-tag :color="getLanguageColor(record.language)">
                    {{ getLanguageName(record.language) }}
                  </a-tag>
                </template>
              </a-table-column>

              <a-table-column title="状态" data-index="status" width="120" align="center">
                <template #cell="{ record }">
                  <a-tag :color="getStatusColor(record.status)">
                    {{ getStatusText(record.status) }}
                  </a-tag>
                </template>
              </a-table-column>

              <a-table-column title="得分" data-index="score" width="80" align="center">
                <template #cell="{ record }">
                  <span class="score">{{ record.score || 0 }}</span>
                </template>
              </a-table-column>

              <a-table-column title="执行时间" width="100" align="center">
                <template #cell="{ record }">
                  <span class="time">{{ getExecutionTime(record.judgeInfo) }}</span>
                </template>
              </a-table-column>

              <a-table-column title="内存使用" width="100" align="center">
                <template #cell="{ record }">
                  <span class="memory">{{ getMemoryUsage(record.judgeInfo) }}</span>
                </template>
              </a-table-column>

              <a-table-column title="提交时间" data-index="submitTime" width="160" align="center">
                <template #cell="{ record }">
                  <span class="submit-time">{{ formatDateTime(record.submitTime) }}</span>
                </template>
              </a-table-column>

              <a-table-column title="操作" width="120" align="center" fixed="right">
                <template #cell="{ record }">
                  <a-button
                    size="small"
                    @click="viewSubmissionDetail(record)"
                    :disabled="!record.code"
                  >
                    查看代码
                  </a-button>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </a-card>
      </div>
    </a-spin>

    <!-- 代码查看弹窗 -->
    <a-modal
      v-model:visible="codeModalVisible"
      title="提交代码"
      :width="800"
      :footer="false"
      @close="codeModalVisible = false"
    >
      <div class="code-modal-content">
        <div class="code-info">
          <div class="info-item">
            <span class="label">提交ID:</span>
            <span class="value">{{ selectedSubmission?.id }}</span>
          </div>
          <div class="info-item">
            <span class="label">用户:</span>
            <span class="value">{{ selectedSubmission?.userName }}</span>
          </div>
          <div class="info-item">
            <span class="label">语言:</span>
            <a-tag :color="getLanguageColor(selectedSubmission?.language)">
              {{ getLanguageName(selectedSubmission?.language) }}
            </a-tag>
          </div>
          <div class="info-item">
            <span class="label">状态:</span>
            <a-tag :color="getStatusColor(selectedSubmission?.status)">
              {{ getStatusText(selectedSubmission?.status) }}
            </a-tag>
          </div>
        </div>
        <div class="code-content">
          <pre><code>{{ selectedSubmission?.code || '代码不可查看' }}</code></pre>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { Service } from '../../../generated'
import type { ContestVO, ContestSubmission, UserVO } from '../../../generated'
import moment from 'moment'
import jsPDF from 'jspdf'
import './../../utils/KaiShu-normal.js'

const route = useRoute()
const router = useRouter()

// 基础数据
const contest = ref<ContestVO>()
const submissions = ref<any[]>([])
const loading = ref(false)
const codeModalVisible = ref(false)
const selectedSubmission = ref<any>()
const exporting = ref(false)
const userCache = ref<Map<number, UserVO>>(new Map())

// 筛选条件
const filters = reactive({
  language: '',
  status: '',
  questionId: '',
  userName: ''
})

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
})

// 统计数据
const stats = ref({
  totalSubmissions: 0,
  acceptedSubmissions: 0,
  uniqueUsers: 0,
  acceptanceRate: 0
})

// 计算属性
const totalSubmissions = computed(() => Number(stats.value.totalSubmissions) || 0)
const acceptedSubmissions = computed(() => stats.value.acceptedSubmissions)
const uniqueUsers = computed(() => stats.value.uniqueUsers)
const acceptanceRate = computed(() => stats.value.acceptanceRate)

// 获取统计数据
const fetchStats = async () => {
  console.log('开始获取统计数据...')
  try {
    const contestId = route.params.id as string
    console.log('比赛ID:', contestId)

    // 先获取第一页数据，了解总数
    const firstResponse = await Service.getAllContestSubmissionsUsingGet(
      contestId as any,
      1,
      undefined,
      undefined,
      1000,
      undefined
    )

    console.log('API响应:', firstResponse)

    if (firstResponse.code === 200 && firstResponse.data) {
      const totalSubmissions = firstResponse.data.total || 0
      console.log('总提交数:', totalSubmissions)

      if (totalSubmissions === 0) {
        // 没有提交记录
        stats.value = {
          totalSubmissions: 0,
          acceptedSubmissions: 0,
          uniqueUsers: 0,
          acceptanceRate: 0
        }
        return
      }

      // 如果总数超过1000，需要分页获取所有数据来计算准确统计
      let allSubmissions = firstResponse.data.records || []
      const totalPages = Math.ceil(totalSubmissions / 1000)

      // 如果有多页，获取剩余页面的数据
      if (totalPages > 1) {
        for (let page = 2; page <= totalPages; page++) {
          try {
            const pageResponse = await Service.getAllContestSubmissionsUsingGet(
              contestId as any,
              page,
              undefined,
              undefined,
              1000,
              undefined
            )
            if (pageResponse.code === 200 && pageResponse.data?.records) {
              allSubmissions = allSubmissions.concat(pageResponse.data.records)
            }
          } catch (error) {
            console.error(`获取第${page}页数据失败:`, error)
          }
        }
      }

      // 计算统计数据
      const acceptedCount = allSubmissions.filter(s => s.status === 2).length
      const uniqueUserSet = new Set(allSubmissions.map(s => s.userId))

      stats.value = {
        totalSubmissions: totalSubmissions,
        acceptedSubmissions: acceptedCount,
        uniqueUsers: uniqueUserSet.size,
        acceptanceRate: totalSubmissions > 0 ? Math.round((acceptedCount / totalSubmissions) * 100) : 0
      }

      console.log('统计数据:', stats.value, '实际获取记录数:', allSubmissions.length)
    } else {
      console.error('API响应异常:', firstResponse)
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    // 设置默认值避免页面显示异常
    stats.value = {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
      uniqueUsers: 0,
      acceptanceRate: 0
    }
  }
}

// 处理过滤条件变化
const handleFilterChange = () => {
  pagination.current = 1 // 重置到第一页
  fetchSubmissions()
}

// 获取比赛信息
const loadContestInfo = async () => {
  try {
    const contestId = route.params.id as string
    const response = await Service.getContestByIdUsingGet(contestId as any)

    if (response.code === 200 && response.data) {
      contest.value = response.data

      // 加载题目列表
      const questionsResponse = await Service.getContestQuestionsUsingGet(contestId as any)
      if (questionsResponse.code === 200 && questionsResponse.data) {
        contest.value.questions = questionsResponse.data
      }
    }
  } catch (error) {
    console.error('获取比赛信息失败:', error)
    Message.error('获取比赛信息失败')
  }
}

// 获取用户信息
const fetchUserInfo = async (userId: number): Promise<UserVO | null> => {
  if (userCache.value.has(userId)) {
    return userCache.value.get(userId) || null
  }

  try {
    const response = await Service.getUserVoByIdUsingGet(userId)
    if (response.code === 200 && response.data) {
      userCache.value.set(userId, response.data)
      return response.data
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
  return null
}

// 获取提交记录
const fetchSubmissions = async () => {
  loading.value = true
  try {
    const contestId = route.params.id as string
    const response = await Service.getAllContestSubmissionsUsingGet(
      contestId as any,
      pagination.current,
      filters.language || undefined,
      filters.questionId ? parseInt(filters.questionId) : undefined,
      pagination.pageSize,
      filters.status !== '' ? parseInt(filters.status) : undefined
    )

    if (response.code === 200 && response.data) {
      const submissionsData = response.data.records || []

      // 处理提交记录数据，添加用户名和题目标题
      const submissionsWithUserInfo = await Promise.all(
        submissionsData.map(async (submission: ContestSubmission) => {
          const question = contest.value?.questions?.find(q => q.questionId === submission.questionId)
          const userInfo = submission.userId ? await fetchUserInfo(submission.userId) : null

          return {
            ...submission,
            userName: userInfo?.userName || `User${submission.userId}`,
            questionTitle: question?.title || '未知题目'
          }
        })
      )

      // 前端过滤用户名（后端不支持用户名过滤）
      let filteredSubmissions = submissionsWithUserInfo
      if (filters.userName) {
        filteredSubmissions = submissionsWithUserInfo.filter(s =>
          s.userName && s.userName.toLowerCase().includes(filters.userName.toLowerCase())
        )
      }

      submissions.value = filteredSubmissions
      pagination.total = response.data.total || 0
      console.log(submissions.value);
    }
  } catch (error) {
    console.error('获取提交记录失败:', error)
    Message.error('获取提交记录失败')
  } finally {
    loading.value = false
  }
}

// 分页处理
const onPageChange = (page: number) => {
  pagination.current = page
  fetchSubmissions()
}

const onPageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  fetchSubmissions()
}

// 查看提交详情
const viewSubmissionDetail = (submission: any) => {
  selectedSubmission.value = submission
  codeModalVisible.value = true
}

// 导航方法
const goBack = () => {
  // router.push(`/contest/${contest.value?.id}`)
  router.back()
}

const viewRanking = () => {
  router.push(`/contest/${contest.value?.id}/ranking`)
}

// 工具函数
const getProblemLabel = (index: number) => {
  return String.fromCharCode(65 + index)
}

const getProblemLabelById = (questionId: any) => {
  const question = contest.value?.questions?.find(q => q.questionId === questionId)
  if (!question) return '?'
  const index = contest.value?.questions?.findIndex(q => q.questionId === questionId)
  return index !== undefined && index >= 0 ? String.fromCharCode(65 + index) : '?'
}

const getContestTypeName = (type?: number) => {
  const typeMap: Record<number, string> = { 1: 'ACM', 2: 'OI', 3: 'IOI' }
  return typeMap[type || 1] || '未知'
}


const getContestTypeColor = (type?: number) => {
  const colorMap: Record<number, string> = { 1: 'blue', 2: 'green', 3: 'orange' }
  return colorMap[type || 1] || 'gray'
}

const getLanguageName = (language?: string) => {
  const langMap: Record<string, string> = {
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    python: 'Python',
    go: 'Go',
    javascript: 'JavaScript'
  }
  return langMap[language || ''] || language || '未知'
}

const getLanguageColor = (language?: string) => {
  const colorMap: Record<string, string> = {
    java: 'orange',
    cpp: 'blue',
    c: 'cyan',
    python: 'green',
    go: 'purple',
    javascript: 'yellow'
  }
  return colorMap[language || ''] || 'gray'
}

const getStatusText = (status?: number) => {
  const statusMap: Record<number, string> = {
    0: '等待中',
    1: '判题中',
    2: '通过',
    3: '失败'
  }
  return statusMap[status || 0] || '未知'
}

const getStatusColor = (status?: number) => {
  const colorMap: Record<number, string> = {
    0: 'gray',
    1: 'blue',
    2: 'green',
    3: 'red'
  }
  return colorMap[status || 0] || 'gray'
}

const getExecutionTime = (judgeInfo?: string) => {
  if (!judgeInfo) return '-'
  try {
    const info = JSON.parse(judgeInfo)
    return info.time ? `${info.time}ms` : '-'
  } catch {
    return '-'
  }
}

const getMemoryUsage = (judgeInfo?: string) => {
  if (!judgeInfo) return '-'
  try {
    const info = JSON.parse(judgeInfo)
    return info.memory ? `${info.memory}KB` : '-'
  } catch {
    return '-'
  }
}

const formatDateTime = (dateTime?: string) => {
  return dateTime ? moment(dateTime).format('MM-DD HH:mm') : '-'
}

// 导出PDF功能
const exportToPdf = async () => {
  if (exporting.value) return

  exporting.value = true
  try {
    Message.info('正在生成PDF，请稍候...')

    // 获取所有提交记录数据
    const allSubmissions = await getAllSubmissionsForExport()

    // 创建PDF文档
    const pdf = new jsPDF('l', 'mm', 'a4') // 横向A4

    // 设置中文字体
    pdf.setFont('KaiShu')

    let yPosition = 20
    const pageWidth = 297 // A4横向宽度
    const marginLeft = 10

    // 标题
    pdf.setFontSize(20)
    const title = `${contest.value?.title || '比赛'} - 提交记录报告`
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
    yPosition += 8

    // 统计信息
    const statsText = `总提交数: ${totalSubmissions.value} | 通过数: ${acceptedSubmissions.value} | 参与选手: ${uniqueUsers.value} | 通过率: ${acceptanceRate.value}%`
    pdf.text(statsText, marginLeft, yPosition)
    yPosition += 15

    // 提交记录表格标题
    pdf.setFontSize(16)
    pdf.text('提交记录详情', marginLeft, yPosition)
    yPosition += 10

    // 提交记录表格表头
    pdf.setFontSize(9)
    const headers = ['ID', '用户名', '题目', '语言', '状态', '得分', '时间', '内存', '提交时间']
    const colWidths = [35, 35, 45, 25, 30, 25, 25, 25, 35]

    let xPosition = marginLeft
    // 绘制表头
    headers.forEach((header, index) => {
      pdf.rect(xPosition, yPosition - 5, colWidths[index], 8)
      pdf.text(header, xPosition + 1, yPosition)
      xPosition += colWidths[index]
    })
    yPosition += 8

    // 按时间排序提交记录
    const sortedSubmissions = allSubmissions.sort((a: any, b: any) =>
      new Date(a.submitTime).getTime() - new Date(b.submitTime).getTime()
    )

    // 绘制提交记录数据
    sortedSubmissions.slice(0, 100).forEach((submission: any) => {
      if (yPosition > 180) { // 换页
        pdf.addPage()
        pdf.setFont('KaiShu')
        yPosition = 20
      }

      // 查找题目信息
      const contestQuestions = contest.value?.questions || []
      const question = contestQuestions.find(q => q.questionId === submission.questionId)
      const questionIndex = contestQuestions.findIndex(q => q.questionId === submission.questionId)
      const problemLabel = question && questionIndex >= 0 ?
        String.fromCharCode(65 + questionIndex) : '?'

      xPosition = marginLeft
      // 获取用户名 - 优先使用userName，如果没有则使用user对象中的userName
      const userName = submission.userName ||
                      submission.user?.userName ||
                      submission.userVO?.userName ||
                      `用户${submission.userId}`

      // 获取题目显示 - 如果找不到题目，使用题目标题或ID
      let problemDisplay = `${problemLabel}.${(submission.questionTitle || '').substring(0, 8)}`
      if (problemLabel === '?') {
        if (submission.questionTitle) {
          problemDisplay = submission.questionTitle.substring(0, 12) + (submission.questionTitle.length > 12 ? '...' : '')
        } else {
          problemDisplay = `题目${submission.questionId}`
        }
      }

      const submissionData = [
        `#${submission.id}`,
        userName,
        problemDisplay,
        getLanguageName(submission.language).substring(0, 6),
        getStatusText(submission.status).substring(0, 6),
        (submission.score || 0).toString(),
        getExecutionTime(submission.judgeInfo),
        getMemoryUsage(submission.judgeInfo),
        moment(submission.submitTime).format('MM-DD HH:mm:ss')
      ]

      submissionData.forEach((data, index) => {
        pdf.rect(xPosition, yPosition - 5, colWidths[index], 8)
        // 文字过长时截断
        const maxWidth = colWidths[index] - 2
        const text = pdf.getTextWidth(data) > maxWidth ? data.substring(0, Math.floor(maxWidth/2)) : data
        pdf.text(text, xPosition + 1, yPosition)
        xPosition += colWidths[index]
      })
      yPosition += 8
    })

    // 保存PDF
    const fileName = `${contest.value?.title || '比赛'}_提交记录报告_${moment().format('YYYYMMDD_HHmmss')}.pdf`
    pdf.save(fileName)

    Message.success('PDF导出成功')

  } catch (error) {
    console.error('导出PDF失败:', error)
    Message.error('导出PDF失败')
  } finally {
    exporting.value = false
  }
}

// 获取所有提交记录（用于导出）
const getAllSubmissionsForExport = async () => {
  try {
    const contestId = route.params.id as string
    const allSubmissions: any[] = []

    // 分页获取所有数据
    let page = 1
    const pageSize = 1000
    let hasMore = true

    while (hasMore) {
      const response = await Service.getAllContestSubmissionsUsingGet(
        contestId as any,
        page,
        filters.language || undefined,
        filters.questionId ? parseInt(filters.questionId) : undefined,
        pageSize,
        filters.status !== '' ? parseInt(filters.status) : undefined
      )

      if (response.code === 200 && response.data?.records) {
        const submissions = response.data.records

        // 处理提交记录数据，添加用户名和题目标题
        const submissionsWithUserInfo = await Promise.all(
          submissions.map(async (submission: ContestSubmission) => {
            const question = contest.value?.questions?.find(q => q.questionId === submission.questionId)
            const userInfo = submission.userId ? await fetchUserInfo(submission.userId) : null

            return {
              ...submission,
              userName: userInfo?.userName || `User${submission.userId}`,
              questionTitle: question?.title || '未知题目'
            }
          })
        )

        allSubmissions.push(...submissionsWithUserInfo)

        // 检查是否还有更多数据
        if (submissions.length < pageSize) {
          hasMore = false
        } else {
          page++
        }
      } else {
        hasMore = false
      }
    }

    return allSubmissions
  } catch (error) {
    console.error('获取所有提交记录失败:', error)
    return []
  }
}

// 页面加载
onMounted(async () => {
  await loadContestInfo()
  await fetchSubmissions()
  await fetchStats()
})
</script>

<style scoped lang="less">
.contest-submission-view {
  background: #f5f5f5;
  min-height: 100vh;
}

.loading-container {
  min-height: 60vh;
  width: 100%;
}

.contest-header {
  background: white;
  border-bottom: 1px solid #e5e6eb;
  margin-bottom: 24px;

  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .contest-info {
      .contest-title {
        font-size: 24px;
        font-weight: 600;
        color: #1d2129;
        margin-bottom: 8px;
      }

      .contest-meta {
        display: flex;
        align-items: center;
        gap: 12px;

        .divider {
          color: #86909c;
        }

        .section-title {
          color: #4e5969;
          font-size: 16px;
          font-weight: 500;
        }
      }
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }
}

.stats-section,
.filter-section,
.submissions-section {
  max-width: 1400px;
  margin: 0 auto 24px;
  padding: 0 24px;
}

.stat-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  :deep(.arco-statistic-title) {
    color: #86909c;
    font-weight: 500;
  }
}

.submissions-section {
  .arco-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .submission-id {
    font-family: 'Monaco', 'Menlo', monospace;
    font-weight: 600;
    color: #165dff;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .user-avatar {
      background: #f2f3f5;
      color: #86909c;
    }

    .user-name {
      font-weight: 500;
      color: #1d2129;
    }
  }

  .problem-info {
    display: flex;
    align-items: center;
    gap: 8px;

    .problem-label {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: #e8f3ff;
      color: #165dff;
      border-radius: 50%;
      font-size: 12px;
      font-weight: 600;
    }

    .problem-title {
      color: #1d2129;
      font-weight: 500;
    }
  }

  .score {
    font-weight: 600;
    color: #165dff;
  }

  .time,
  .memory {
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 13px;
    color: #4e5969;
  }

  .submit-time {
    color: #86909c;
    font-size: 13px;
  }
}

.code-modal-content {
  .code-info {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
    padding: 16px;
    background: #f7f8fa;
    border-radius: 6px;

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .label {
        color: #86909c;
        font-weight: 500;
      }

      .value {
        color: #1d2129;
        font-weight: 600;
      }
    }
  }

  .code-content {
    max-height: 400px;
    overflow-y: auto;
    background: #f7f8fa;
    border-radius: 6px;
    padding: 16px;

    pre {
      margin: 0;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 14px;
      line-height: 1.5;
      color: #1d2129;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}

@media (max-width: 768px) {
  .contest-header .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;

    .header-actions {
      width: 100%;

      .arco-btn {
        flex: 1;
      }
    }
  }

  .stats-section,
  .filter-section,
  .submissions-section {
    padding: 0 16px;
  }

  .contest-header .header-content {
    padding: 16px;
  }
}
</style>
