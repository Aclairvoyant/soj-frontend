<template>
  <a-watermark :content=contest?.id alpha="0.3">
  <div class="contest-problem-view">
    <a-spin :loading="loading" class="loading-container">
      <!-- 比赛导航栏 -->
      <div class="contest-navbar">
        <div class="navbar-content">
          <div class="contest-info">
            <h3 class="contest-title">{{ contest?.title }}</h3>

            <div class="contest-meta">
              <a-tag :color="getContestTypeColor(contest?.contestType)">
                {{ getContestTypeName(contest?.contestType) }}
              </a-tag>
              <span class="time-info">
                <icon-clock-circle />
                {{ getTimeInfo() }}
              </span>
            </div>
          </div>

          <div class="navbar-actions">
            <a-button @click="viewRanking" size="small">
              <template #icon>
                <icon-trophy />
              </template>
              排名
            </a-button>
            <a-button @click="viewSubmissions" size="small">
              <template #icon>
                <icon-file />
              </template>
              提交记录
            </a-button>
            <a-button @click="exitContest" size="small">
              退出比赛
            </a-button>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="content-container">
        <!-- 顶部题目导航和统计 -->
        <div class="top-navigation">
          <a-row :gutter="[16, 16]">
            <!-- 题目导航 -->
            <a-col :span="18">
              <a-card title="题目列表" size="small" :bordered="false" class="problems-nav-card">
                <div class="problems-horizontal-list">
                  <div
                    v-for="(problem, index) in contest?.questions"
                    :key="problem.questionId"
                    class="problem-item-horizontal"
                    :class="{
                      active: currentProblemId === problem.questionId,
                      solved: getProblemStatus(problem.questionId) === 'AC',
                      attempted: getProblemStatus(problem.questionId) && getProblemStatus(problem.questionId) !== 'AC'
                    }"
                    @click="switchProblem(problem.questionId)"
                  >
                    <div class="problem-label">{{ getProblemLabel(index) }}</div>
                    <div class="problem-title">{{ problem.title }}</div>
                    <div class="problem-score">{{ problem.score }}分</div>
                    <div class="problem-status">
                      <icon-check-circle v-if="getProblemStatus(problem.questionId) === 'AC'" class="ac-icon" />
                      <icon-close-circle v-else-if="getProblemStatus(problem.questionId)" class="wa-icon" />
                    </div>
                  </div>
                </div>
              </a-card>
            </a-col>

            <!-- 统计信息 -->
            <a-col :span="6">
              <a-card title="提交统计" size="small" :bordered="false" class="stats-card">
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-statistic
                      title="AC题数"
                      :value="solvedCount"
                      :value-style="{ color: '#00b42a', fontSize: '18px' }"
                    />
                  </a-col>
                  <a-col :span="12">
                    <a-statistic
                      title="总分"
                      :value="totalScore"
                      :value-style="{ color: '#165dff', fontSize: '18px' }"
                    />
                  </a-col>
                </a-row>
              </a-card>
            </a-col>
          </a-row>
        </div>

        <!-- 主内容区域 -->
        <a-row :gutter="[16, 16]" class="main-content">
          <!-- 题目详情 -->
          <a-col :span="14">
            <div class="problem-content">
              <a-card :bordered="false" class="problem-detail-card">
                <template #title>
                  <div class="problem-header">
                    <h2 class="problem-title">
                      {{ getProblemLabel(getProblemIndex()) }}. {{ currentProblem?.title }}
                    </h2>
                  </div>
                </template>

                <a-tabs v-model:active-key="activeTab" class="problem-tabs">
                  <a-tab-pane key="problem" title="题目描述">
                    <div class="tab-content">
                      <div v-if="currentProblem" class="problem-info">
                        <!-- 题目信息 -->
                        <div class="problem-meta">
                          <div class="meta-item">
                            <span class="label">分值：</span>
                            <span class="value">{{ currentProblem.score }}分</span>
                          </div>
                          <div class="meta-item">
                            <span class="label">时间限制：</span>
                            <span class="value">{{ currentProblem.timeLimit || 1000 }}ms</span>
                          </div>
                          <div class="meta-item">
                            <span class="label">内存限制：</span>
                            <span class="value">{{ currentProblem.memoryLimit || 128 }}MB</span>
                          </div>
                        </div>

                        <!-- 题目内容 -->
                        <div class="problem-description">
                          <div class="content-section">
                            <h4>题目描述</h4>
                            <div class="markdown-content">
                              <MdViewerV3 :value="currentProblem?.content || '暂无题目描述'" />
                            </div>
                          </div>

                          <div class="content-section" v-if="currentProblem?.judgeConfig?.inputCase">
                            <h4>输入格式</h4>
                            <div class="markdown-content">
                              <MdViewerV3 :value="currentProblem.judgeConfig.inputCase" />
                            </div>
                          </div>

                          <div class="content-section" v-if="currentProblem?.judgeConfig?.outputCase">
                            <h4>输出格式</h4>
                            <div class="markdown-content">
                              <MdViewerV3 :value="currentProblem.judgeConfig.outputCase" />
                            </div>
                          </div>

                          <div class="content-section" v-if="currentProblem?.judgeCase?.length">
                            <h4>样例</h4>
                            <div v-for="(example, index) in currentProblem.judgeCase.slice(0, 2)" :key="index" class="example">
                              <div class="example-title">样例 {{ index + 1 }}</div>
                              <div class="example-content">
                                <div class="example-input">
                                  <div class="example-label">输入：</div>
                                  <pre class="example-code">{{ example.input }}</pre>
                                </div>
                                <div class="example-output">
                                  <div class="example-label">输出：</div>
                                  <pre class="example-code">{{ example.output }}</pre>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="no-problem-data">
                        <p>题目数据加载中...</p>
                        <p>当前题目ID: {{ currentProblemId }}</p>
                        <p>比赛ID: {{ contest?.id }}</p>
                      </div>
                    </div>
                  </a-tab-pane>

                  <a-tab-pane key="submissions" title="我的提交">
                    <div class="submissions-content">
                      <a-table
                        :data="problemSubmissions"
                        :pagination="false"
                        size="small"
                        :scroll="{ x: 'max-content' }"
                      >
                        <template #columns>
                          <a-table-column title="提交时间" width="160">
                            <template #cell="{ record }">
                              {{ formatDateTime(record.submitTime) }}
                            </template>
                          </a-table-column>
                          <a-table-column title="语言" data-index="language" width="80" />
                          <a-table-column title="状态" width="100">
                            <template #cell="{ record }">
                              <a-tag :color="getSubmissionStatusColor(record.status)">
                                {{ getSubmissionStatusText(record.status) }}
                              </a-tag>
                            </template>
                          </a-table-column>
                          <a-table-column title="得分" data-index="score" width="80" />
                          <a-table-column title="时间" width="100">
                            <template #cell="{ record }">
                              {{ getExecutionTime(record.judgeInfo) }}
                            </template>
                          </a-table-column>
                          <a-table-column title="内存" width="100">
                            <template #cell="{ record }">
                              {{ getMemoryUsage(record.judgeInfo) }}
                            </template>
                          </a-table-column>
                          <a-table-column title="操作" width="100">
                            <template #cell="{ record }">
                              <a-button
                                size="small"
                                @click="viewSubmissionCode(record)"
                                :disabled="!record.code"
                              >
                                查看代码
                              </a-button>
                            </template>
                          </a-table-column>
                        </template>
                      </a-table>
                    </div>
                  </a-tab-pane>
                </a-tabs>
              </a-card>
            </div>
          </a-col>

          <!-- 右侧代码编辑器 -->
          <a-col :span="10">
            <div class="code-editor-section">
              <a-card title="代码编辑" :bordered="false" class="code-card">
                <template #extra>
                  <a-select
                    v-model="selectedLanguage"
                    style="width: 120px"
                    size="small"
                  >
                    <a-option value="java">Java</a-option>
                    <a-option value="cpp">C++</a-option>
                    <a-option value="c">C</a-option>
                    <a-option value="python">Python</a-option>
                    <a-option value="go">Go</a-option>
                  </a-select>
                </template>

                <div class="code-editor">
                  <Monaco
                    :value="code"
                    :language="getMonacoLanguage(selectedLanguage)"
                    :handleChange="handleCodeChange"
                  />
                </div>

                <div class="editor-actions">
                  <a-button
                    type="primary"
                    @click="submitCode"
                    :loading="submitting"
                    class="submit-btn"
                  >
                    <template #icon>
                      <icon-send />
                    </template>
                    提交
                  </a-button>
                </div>
              </a-card>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-spin>

    <!-- 代码查看弹窗 -->
    <a-modal
      v-model:visible="codeModalVisible"
      title="提交代码"
      :width="900"
      :footer="false"
      @close="codeModalVisible = false"
    >
      <div class="code-modal-content" v-if="selectedSubmission">
        <div class="code-info">
          <div class="info-item">
            <span class="label">提交ID:</span>
            <span class="value">#{{ selectedSubmission.id }}</span>
          </div>
          <div class="info-item">
            <span class="label">语言:</span>
            <span class="value">{{ selectedSubmission.language }}</span>
          </div>
          <div class="info-item">
            <span class="label">状态:</span>
            <a-tag :color="getSubmissionStatusColor(selectedSubmission.status)">
              {{ getSubmissionStatusText(selectedSubmission.status) }}
            </a-tag>
          </div>
          <div class="info-item">
            <span class="label">得分:</span>
            <span class="value">{{ selectedSubmission.score || 0 }}</span>
          </div>
          <div class="info-item">
            <span class="label">时间:</span>
            <span class="value">{{ getExecutionTime(selectedSubmission.judgeInfo) }}</span>
          </div>
          <div class="info-item">
            <span class="label">内存:</span>
            <span class="value">{{ getMemoryUsage(selectedSubmission.judgeInfo) }}</span>
          </div>
          <div class="info-item">
            <span class="label">提交时间:</span>
            <span class="value">{{ formatDateTime(selectedSubmission.submitTime) }}</span>
          </div>
        </div>
        <div class="code-content">
          <MdViewerV3 :modelValue="selectedSubmission.code || '' " />
        </div>
      </div>
    </a-modal>
  </div>
  </a-watermark>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { Service } from '../../../generated'
import type { ContestVO, ContestSubmission } from '../../../generated'
import moment from 'moment'
import Monaco from '@/components/CodeEditor.vue'
import MdViewerV3 from '@/components/MdViewerV3.vue'

const route = useRoute()
const router = useRouter()

// 基础数据
const contest = ref<ContestVO>()
const currentProblem = ref<any>()
const currentProblemId = ref<number>()
const problemSubmissions = ref<ContestSubmission[]>([])
const problemStatusMap = ref<Map<number, string>>(new Map()) // 存储题目状态映射
const loading = ref(false)
const submitting = ref(false)
const activeTab = ref('problem')
const codeModalVisible = ref(false)
const selectedSubmission = ref<any>()

// 代码编辑器
const selectedLanguage = ref('java')
const code = ref('')

// 处理代码变化
const handleCodeChange = (newCode: string) => {
  code.value = newCode
}

// 计算属性 - 使用缓存避免频繁重新计算
const solvedCount = computed(() => {
  if (!contest.value?.questions || !problemStatusMap.value.size) return 0

  let count = 0
  for (const question of contest.value.questions) {
    if (question.questionId && getProblemStatus(question.questionId) === 'AC') {
      count++
    }
  }
  return count
})

const totalScore = computed(() => {
  if (!contest.value?.questions || !problemStatusMap.value.size) return 0

  let score = 0
  for (const question of contest.value.questions) {
    if (question.questionId && getProblemStatus(question.questionId) === 'AC') {
      score += question.score || 0
    }
  }
  return score
})

// 获取题目标签 (A, B, C...)
const getProblemLabel = (index: number) => {
  if (index < 0 || index > 25) return 'A'
  return String.fromCharCode(65 + index)
}

// 获取题目索引
const getProblemIndex = () => {
  if (!contest.value?.questions || !currentProblemId.value) {
    console.log('Debug: No contest questions or currentProblemId:', {
      hasQuestions: !!contest.value?.questions,
      questionsLength: contest.value?.questions?.length,
      currentProblemId: currentProblemId.value
    })
    return 0
  }
  const index = contest.value.questions.findIndex(q => q.questionId === currentProblemId.value)
  // console.log('Debug: Problem index:', index, 'for problemId:', currentProblemId.value)
  return index >= 0 ? index : 0
}

// 加载比赛信息
const loadContestInfo = async () => {
  loading.value = true
  try {
    const contestId = route.params.contestId as string

    const response = await Service.getContestByIdUsingGet(contestId as any)
    if (response.code === 200 && response.data) {
      contest.value = response.data

      // 加载比赛题目列表
      const questionsResponse = await Service.getContestQuestionsUsingGet(contestId as any)
      if (questionsResponse.code === 200 && questionsResponse.data) {
        contest.value.questions = questionsResponse.data
        // 加载题目状态
        await loadAllProblemStatus()
      }

      // 检查当前路由是否已经有 problemId
      const problemId = route.params.problemId

      if (!problemId && contest.value.questions?.length) {
        // 如果没有指定题目，跳转到第一题
        const firstQuestionId = contest.value.questions[0].questionId
        currentProblemId.value = firstQuestionId
        await router.replace(`/contest/${contestId}/problem/${firstQuestionId}`)
        return
      }

      if (problemId) {
        // 如果有指定题目，设置当前题目ID并加载详情
        currentProblemId.value = problemId as any
        await loadProblemDetail()
      }
    } else {
      Message.error(response.message || '获取比赛信息失败')
    }
  } catch (error) {
    console.error('获取比赛信息失败:', error)
    Message.error('获取比赛信息失败')
  } finally {
    loading.value = false
  }
}

// 加载题目详情
const loadProblemDetail = async () => {
  // console.log('Debug: Loading problem detail for ID:', currentProblemId.value)

  if (!currentProblemId.value) {
    console.log('Debug: No currentProblemId, skipping load')
    return
  }

  try {
    // 从已加载的比赛题目列表中找到当前题目
    if (contest.value?.questions) {
      const problem = contest.value.questions.find(q => q.questionId === currentProblemId.value)
      if (problem) {
        currentProblem.value = problem
        // 直接加载当前题目的提交记录
        await loadCurrentProblemSubmissions()
        return
      } else {
        console.log('Debug: Problem not found in existing questions')
      }
    }

    // 如果比赛信息中没有题目列表，则重新加载
    const contestId = route.params.contestId as string
    //console.log('Debug: Reloading contest questions for:', contestId)
    const response = await Service.getContestQuestionsUsingGet(contestId as any)
    if (response.code === 200 && response.data) {
      //console.log('Debug: Got contest questions:', response.data.length)
      // 设置比赛题目列表
      if (contest.value) {
        contest.value.questions = response.data
      }

      // 找到当前题目
      const problem = response.data.find((q: any) => q.questionId === currentProblemId.value)
      if (problem) {
        //console.log('Debug: Found problem in new data:', problem.title)
        currentProblem.value = problem
        await loadCurrentProblemSubmissions()
      } else {
        console.log('Debug: Problem still not found in new data')
      }
    } else {
      console.log('Debug: Failed to get contest questions:', response)
    }
  } catch (error) {
    console.error('获取题目详情失败:', error)
  }
}

// 加载所有题目的状态信息
const loadAllProblemStatus = async () => {
  if (!contest.value?.id || !contest.value?.questions) return

  try {
    // 获取我的所有提交记录
    const response = await Service.getMySubmissionsUsingGet(contest.value.id, 1, undefined, 1000)

    if (response.code === 200 && response.data?.records) {
      const submissions = response.data.records

      // 为每个题目计算最优状态
      contest.value.questions.forEach(question => {
        if (!question.questionId) return

        const questionSubmissions = submissions.filter(s => s.questionId === question.questionId)

        if (questionSubmissions.length === 0) {
          problemStatusMap.value.delete(question.questionId)
        } else {
          // 检查是否有AC
          const hasAC = questionSubmissions.some(s => s.status === 2)
          if (hasAC) {
            problemStatusMap.value.set(question.questionId, 'AC')
          } else {
            // 如果没有AC，标记为已尝试
            problemStatusMap.value.set(question.questionId, 'WA')
          }
        }
      })

      console.log('Debug: Problem status map:', problemStatusMap.value)
    }
  } catch (error) {
    console.error('获取题目状态失败:', error)
  }
}

// 直接获取当前题目的我的提交记录
const loadCurrentProblemSubmissions = async () => {
  if (!contest.value?.id || !currentProblemId.value) return

  try {
    // 使用新的API直接获取当前题目的我的提交记录
    const response = await Service.getMySubmissionsUsingGet(
      contest.value.id,
      1,
      currentProblemId.value,
      50
    )

    if (response.code === 200 && response.data?.records) {
      problemSubmissions.value = response.data.records
      console.log('Debug: Loaded current problem submissions:', problemSubmissions.value.length)
    }
  } catch (error) {
    console.error('获取当前题目提交记录失败:', error)
  }
}


// 切换题目
const switchProblem = async (problemId: any) => {
  console.log('Debug: Switching to problem:', problemId)

  if (!contest.value?.id) {
    console.log('Debug: No contest ID available')
    return
  }

  // 更新当前题目ID
  currentProblemId.value = problemId
  console.log('Debug: Set currentProblemId to:', currentProblemId.value)

  // 更新路由
  try {
    await router.push(`/contest/${contest.value.id}/problem/${problemId}`)
    console.log('Debug: Router updated successfully')
  } catch (error) {
    console.error('Debug: Router update failed:', error)
  }

  // 加载题目详情
  await loadProblemDetail()
}


// 提交代码
const submitCode = async () => {
  const codeContent = code.value || ''
  if (!codeContent.trim()) {
    Message.error('请输入代码')
    return
  }

  submitting.value = true
  try {
    const response = await Service.submitContestQuestionUsingPost(
      contest.value!.id as any,
      {
        questionId: currentProblemId.value!,
        language: selectedLanguage.value,
        code: codeContent
      }
    )

    if (response.code === 200) {
      Message.success('代码已提交！')
      // 刷新提交记录和题目状态
      setTimeout(() => {
        loadCurrentProblemSubmissions()
        loadAllProblemStatus()
      }, 1000)
    } else {
      Message.error(response.message || '提交失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
    Message.error('提交失败')
  } finally {
    submitting.value = false
  }
}

// 查看排名
const viewRanking = () => {
  router.push(`/contest/${contest.value?.id}/ranking`)
}

// 查看提交记录
const viewSubmissions = () => {
  router.push(`/contest/${contest.value?.id}/submissions`)
}

// 退出比赛
const exitContest = () => {
  router.push(`/contest/${contest.value?.id}`)
}

// 工具函数
const getContestTypeName = (type?: number) => {
  const typeMap: Record<number, string> = { 1: 'ACM', 2: 'OI', 3: 'IOI' }
  return typeMap[type || 1] || '未知'
}

const getContestTypeColor = (type?: number) => {
  const colorMap: Record<number, string> = { 1: 'blue', 2: 'green', 3: 'orange' }
  return colorMap[type || 1] || 'gray'
}

const getTimeInfo = () => {
  if (!contest.value) return ''

  if (contest.value.status === 1) {
    const endTime = moment(contest.value.endTime)
    const now = moment()
    const remaining = endTime.diff(now)

    if (remaining > 0) {
      const duration = moment.duration(remaining)
      const hours = Math.floor(duration.asHours())
      const minutes = duration.minutes()
      return `剩余时间: ${hours}:${minutes.toString().padStart(2, '0')}`
    }
  }

  return `${formatDateTime(contest.value.startTime)} - ${formatDateTime(contest.value.endTime)}`
}

const formatDateTime = (dateTime?: string) => {
  return dateTime ? moment(dateTime).format('MM-DD HH:mm') : ''
}

const getProblemStatus = (problemId?: number) => {
  if (!problemId) return null
  return problemStatusMap.value.get(problemId) || null
}

const getMonacoLanguage = (lang: string) => {
  const langMap: Record<string, string> = {
    java: 'java',
    cpp: 'cpp',
    python: 'python',
    javascript: 'javascript'
  }
  return langMap[lang] || 'java'
}

const getSubmissionStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: 'Pending',
    1: 'Judging',
    2: 'AC',
    3: 'WA',
    4: 'TLE',
    5: 'MLE',
    6: 'RE',
    7: 'CE',
    8: 'PE'
  }
  return statusMap[status] || 'Unknown'
}

const getSubmissionStatusColor = (status: number) => {
  const colorMap: Record<number, string> = {
    0: 'gray',
    1: 'blue',
    2: 'green',
    3: 'red',
    4: 'orange',
    5: 'purple',
    6: 'red',
    7: 'red',
    8: 'orange'
  }
  return colorMap[status] || 'gray'
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

// 查看提交代码
const viewSubmissionCode = (submission: any) => {
  selectedSubmission.value = submission
  codeModalVisible.value = true
}

// 监听路由变化
watch(() => route.params.problemId, async (newId, oldId) => {
  console.log('Debug: Route change detected:', { newId, oldId, currentProblemId: currentProblemId.value })

  if (newId) {
    const newProblemId = newId as any
    if (newProblemId !== currentProblemId.value) {
      console.log('Debug: Updating problemId from route:', newId)
      currentProblemId.value = newProblemId

      // 如果已经有比赛数据，直接加载题目详情
      if (contest.value?.questions) {
        await loadProblemDetail()
      }
    }
  }
}, { immediate: false })

// 页面加载
onMounted(async () => {
  console.log('Debug: Component mounted, current route:', route.params)

  // 使用 nextTick 确保 DOM 完全渲染后再加载数据
  await nextTick()

  try {
    await loadContestInfo()
  } catch (error) {
    console.error('Failed to load contest info:', error)
  }
})
</script>

<style scoped lang="less">
.contest-problem-view {
  min-height: 100vh;
  background: #f5f5f5;
}

.loading-container {
  min-height: 80vh;
  width: 100%;
}

.contest-navbar {
  background: white;
  border-bottom: 1px solid #e5e6eb;
  position: sticky;
  top: 0;
  z-index: 100;

  .navbar-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .contest-info {
      .contest-title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 4px;
        color: #1d2129;
      }

      .contest-meta {
        display: flex;
        align-items: center;
        gap: 12px;

        .time-info {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #86909c;
          font-size: 14px;
        }
      }
    }

    .navbar-actions {
      display: flex;
      gap: 8px;
    }
  }
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.top-navigation {
  margin-bottom: 24px;

  .problems-nav-card {
    .problems-horizontal-list {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;

      .problem-item-horizontal {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid #f0f0f0;
        background: white;
        min-width: 120px;

        &:hover {
          background: #f7f8fa;
        }

        &.active {
          background: #e8f4ff;
          border-color: #165dff;
        }

        &.solved {
          background: #f0f9ff;
          border-color: #00b42a;

          .problem-label {
            background: #00b42a;
            color: white;
          }
        }

        &.attempted {
          background: #fff7e8;
          border-color: #ff7d00;
        }

        .problem-label {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f2f3f5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-right: 8px;
          font-size: 12px;
        }

        .problem-title {
          font-size: 14px;
          font-weight: 500;
          color: #1d2129;
          margin-right: 8px;
          flex: 1;
        }

        .problem-score {
          font-size: 12px;
          color: #86909c;
          margin-right: 8px;
        }

        .problem-status {
          .ac-icon {
            color: #00b42a;
          }

          .wa-icon {
            color: #f53f3f;
          }
        }
      }
    }
  }

  .stats-card {
    :deep(.arco-statistic-title) {
      font-size: 12px;
    }
  }
}

.main-content {
  margin-top: 16px;
}

.problem-detail-card {
  min-height: 600px;

  .problem-header {
    .problem-title {
      font-size: 20px;
      font-weight: 600;
      color: #1d2129;
      margin: 0;
    }
  }

  .problem-meta {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
    padding: 16px;
    background: #f7f8fa;
    border-radius: 6px;

    .meta-item {
      .label {
        color: #86909c;
        margin-right: 4px;
      }

      .value {
        color: #1d2129;
        font-weight: 500;
      }
    }
  }

  .problem-description {
    .content-section {
      margin-bottom: 32px;

      h4 {
        color: #1d2129;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #f0f0f0;
      }

      .markdown-content {
        :deep(.md-editor-preview) {
          background: transparent !important;
        }

        :deep(.md-editor-preview-wrapper) {
          padding: 0 !important;
        }
      }

      .example {
        border: 1px solid #e5e6eb;
        border-radius: 6px;
        margin-bottom: 16px;
        overflow: hidden;

        .example-title {
          background: #f7f8fa;
          padding: 8px 16px;
          font-weight: 500;
          color: #4e5969;
          font-size: 14px;
        }

        .example-content {
          .example-input,
          .example-output {
            padding: 12px 16px;

            .example-label {
              color: #86909c;
              font-size: 12px;
              margin-bottom: 4px;
            }

            .example-code {
              background: #f7f8fa;
              padding: 8px;
              border-radius: 4px;
              font-family: 'Monaco', 'Menlo', monospace;
              font-size: 13px;
              margin: 0;
              white-space: pre-wrap;
            }
          }

          .example-output {
            border-top: 1px solid #f0f0f0;
          }
        }
      }
    }
  }

  .submissions-content {
    max-height: 400px;
    overflow-y: auto;
  }
}

.code-card {
  min-height: 600px;

  .code-editor {
    border: 1px solid #e5e6eb;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 16px;
  }

  .editor-actions {
    display: flex;
    gap: 12px;
    justify-content: center;

    .arco-btn {
      min-width: 100px;
    }
  }
}

.no-problem-data {
  padding: 40px;
  text-align: center;
  color: #86909c;
  background: #fafbfc;
  border-radius: 6px;
  border: 1px solid #e5e6eb;
}

@media (max-width: 1024px) {
  .content-container {
    padding: 16px;
  }

  .top-navigation {
    .problems-horizontal-list {
      .problem-item-horizontal {
        min-width: 100px;

        .problem-title {
          display: none;
        }
      }
    }
  }

  .main-content {
    flex-direction: column;

    .a-col {
      width: 100% !important;
    }
  }
}

// 代码查看弹窗样式
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
        min-width: 60px;
      }

      .value {
        color: #1d2129;
        font-weight: 600;
      }
    }
  }

  .code-content {
    max-height: 500px;
    overflow-y: auto;
    border: 1px solid #e5e6eb;
    border-radius: 6px;

    :deep(.md-editor-preview) {
      background: #fafbfc !important;
      padding: 16px !important;
    }

    :deep(.md-editor-preview-wrapper) {
      padding: 0 !important;
    }

    :deep(pre) {
      background: #f7f8fa !important;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', monospace;
    }
  }
}

@media (max-width: 768px) {
  .contest-navbar .navbar-content {
    padding: 8px 16px;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;

    .contest-title {
      font-size: 16px;
    }

    .navbar-actions {
      flex-wrap: wrap;
    }
  }

  .problem-meta {
    flex-direction: column;
    gap: 8px;
  }

  .problem-header {
    .problem-title {
      font-size: 16px;
    }
  }

  .top-navigation {
    .a-col {
      width: 100% !important;
    }
  }

  .code-modal-content {
    .code-info {
      flex-direction: column;
      gap: 8px;
    }
  }
}
</style>
