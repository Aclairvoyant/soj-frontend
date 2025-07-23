<template>
  <div class="contest-detail-view">
    <a-spin :loading="loading" class="loading-container">
      <div v-if="contest" class="contest-content">
        <!-- 比赛头部信息 -->
        <div class="contest-header">
          <div class="header-background">
            <div class="header-content">
              <div class="contest-title-section">
                <h1 class="contest-title">{{ contest.title }}</h1>
                <div class="contest-meta">
                  <a-tag :color="getContestTypeColor(contest.contestType)" size="large">
                    {{ getContestTypeName(contest.contestType) }}
                  </a-tag>
                  <a-tag :color="getContestStatusColor(contest.status)" size="large">
                    {{ getContestStatusName(contest.status) }}
                  </a-tag>
                  <span v-if="!contest.isPublic" class="private-badge">
                    <icon-lock /> 私有比赛
                  </span>
                </div>
              </div>
              <div class="header-actions">
                <a-button
                  v-if="contest.status === 0 && !contest.isRegistered && canRegister"
                  type="primary"
                  size="large"
                  @click="handleRegister"
                  :loading="registering"
                >
                  <template #icon>
                    <icon-user-add />
                  </template>
                  报名参赛
                </a-button>
                <a-button
                  v-if="contest.isRegistered && contest.status === 0"
                  type="outline"
                  size="large"
                  @click="handleUnregister"
                  :loading="unregistering"
                >
                  取消报名
                </a-button>
                <a-button
                  v-if="contest.status === 1 && contest.isRegistered"
                  type="primary"
                  size="large"
                  @click="enterContest"
                >
                  <template #icon>
                    <icon-play-circle />
                  </template>
                  进入比赛
                </a-button>
                <a-button
                  v-else-if="contest.status === 1 && !contest.isRegistered"
                  type="primary"
                  size="large"
                  @click="handleRegister"
                  :loading="registering"
                >
                  <template #icon>
                    <icon-user-add />
                  </template>
                  报名参赛
                </a-button>
                <a-button
                  v-if="contest.allowVirtual && contest.status === 2 && canStartVirtual"
                  type="primary"
                  size="large"
                  @click="startVirtualParticipation"
                  :loading="startingVirtual"
                >
                  <template #icon>
                    <icon-thunderbolt />
                  </template>
                  开始虚拟参赛
                </a-button>
                <a-button size="large" @click="viewRanking">
                  <template #icon>
                    <icon-trophy />
                  </template>
                  查看排名
                </a-button>
                <a-button size="large" @click="viewSubmissions">
                  <template #icon>
                    <icon-file />
                  </template>
                  提交记录
                </a-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 比赛状态卡片 -->
        <div class="status-cards">
          <a-row :gutter="[24, 24]">
            <a-col :sm="12" :lg="6">
              <a-card class="status-card" :bordered="false">
                <a-statistic
                  title="参赛人数"
                  :value="contest.participantCount || 0"
                  :value-style="{ color: '#165dff' }"
                >
                  <template #suffix>
                    <span v-if="contest.maxParticipants"> / {{ contest.maxParticipants }}</span>
                  </template>
                </a-statistic>
              </a-card>
            </a-col>
            <a-col :sm="12" :lg="6">
              <a-card class="status-card" :bordered="false">
                <a-statistic
                  title="比赛时长"
                  :value="getContestDuration()"
                  :value-style="{ color: '#00b42a' }"
                >
                  <template #suffix>分钟</template>
                </a-statistic>
              </a-card>
            </a-col>
            <a-col :sm="12" :lg="6">
              <a-card class="status-card" :bordered="false">
                <a-statistic
                  title="题目数量"
                  :value="contest.questions?.length || 0"
                  :value-style="{ color: '#ff7d00' }"
                >
                  <template #suffix>道</template>
                </a-statistic>
              </a-card>
            </a-col>
            <a-col :sm="12" :lg="6">
              <a-card class="status-card" :bordered="false">
                <a-statistic
                  title="罚时"
                  :value="contest.penaltyTime || 0"
                  :value-style="{ color: '#f53f3f' }"
                >
                  <template #suffix>分钟</template>
                </a-statistic>
              </a-card>
            </a-col>
          </a-row>
        </div>

        <!-- 主要内容区域 -->
        <a-row :gutter="[24, 24]">
          <!-- 左侧内容 -->
          <a-col :lg="16" :xs="24">
            <!-- 比赛描述 -->
            <a-card title="比赛介绍" class="description-card" :bordered="false">
              <MdViewerV3 class="contest-description" :modelValue="contest.description || '暂无比赛介绍'" />
            </a-card>

            <!-- 题目列表 -->
            <a-card title="题目列表" class="problems-card" :bordered="false">
              <a-table
                :data="contest.questions || []"
                :pagination="false"
                class="problems-table"
                :scroll="{ x: 'max-content' }"
              >
                <template #columns>
                  <a-table-column title="序号" data-index="sortOrder" width="80" align="center" />
                  <a-table-column title="题目标题" data-index="title" min-width="200">
                    <template #cell="{ record }">
                      <a
                        class="problem-link"
                        @click="goToProblem(record)"
                        :class="{
                          disabled: !canAccessProblem,
                          'problem-accessible': canAccessProblem
                        }"
                      >
                        <span class="problem-title">{{ record.title }}</span>
                        <span v-if="!canAccessProblem" class="access-hint">
                          <icon-lock /> {{ getAccessMessage }}
                        </span>
                      </a>
                    </template>
                  </a-table-column>
                  <a-table-column title="分值" data-index="score" width="80" align="center" />
                  <a-table-column title="状态" width="120" align="center">
                    <template #cell="{ record }">
                      <a-tag v-if="getProblemStatus(record.questionId)" :color="getProblemStatusColor(record.questionId)">
                        {{ getProblemStatusText(record.questionId) }}
                      </a-tag>
                      <span v-else class="no-attempt">未尝试</span>
                    </template>
                  </a-table-column>
                </template>
              </a-table>
            </a-card>
          </a-col>

          <!-- 右侧信息 -->
          <a-col :lg="8" :xs="24">
            <!-- 比赛时间信息 -->
            <a-card title="时间安排" class="time-card" :bordered="false">
              <div class="time-info">
                <div class="time-item">
                  <div class="time-label">
                    <icon-calendar />
                    比赛时间
                  </div>
                  <div class="time-value">
                    {{ formatDateTime(contest.startTime) }} 至 {{ formatDateTime(contest.endTime) }}
                  </div>
                </div>

                <div class="time-item" v-if="contest.registerStartTime">
                  <div class="time-label">
                    <icon-user />
                    报名时间
                  </div>
                  <div class="time-value">
                    {{ formatDateTime(contest.registerStartTime) }} 至 {{ formatDateTime(contest.registerEndTime) }}
                  </div>
                </div>

                <div class="time-item" v-if="contest.allowVirtual">
                  <div class="time-label">
                    <icon-thunderbolt />
                    虚拟参赛
                  </div>
                  <div class="time-value">
                    {{ formatDateTime(contest.virtualStartTime) }} 至 {{ formatDateTime(contest.virtualEndTime) }}
                  </div>
                </div>

                <!-- 倒计时 -->
                <div class="countdown-section" v-if="showCountdown">
                  <div class="countdown-label">{{ countdownLabel }}</div>
<!--                  <div class="countdown-value">{{ countdownText }}</div>-->
                  <a-countdown
                    :value="getCountdownTarget()"
                    :now="getCurrentTime()"
                    format="D 天 H 时 m 分 s 秒"
                    :value-style="{ color: '#ffffff', fontSize: '20px', fontWeight: '600' }"
                    @finish="onCountdownFinish"
                  />
                </div>
              </div>
            </a-card>

            <!-- 创建者信息 -->
            <a-card title="比赛信息" class="info-card" :bordered="false">
              <div class="contest-info">
                <div class="info-item">
                  <span class="info-label">创建者：</span>
                  <span class="info-value">{{ contest.creator?.userName || '未知' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">创建时间：</span>
                  <span class="info-value">{{ formatDateTime(contest.createTime) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">比赛类型：</span>
                  <span class="info-value">{{ getContestTypeName(contest.contestType) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">可见性：</span>
                  <span class="info-value">{{ contest.isPublic ? '公开' : '私有' }}</span>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </a-spin>

    <!-- 密码输入弹窗 -->
    <a-modal
      v-model:visible="passwordModalVisible"
      title="输入比赛密码"
      @ok="confirmPassword"
      @cancel="passwordModalVisible = false"
      :ok-loading="passwordChecking"
    >
      <a-form :model="passwordForm" layout="vertical">
        <a-form-item field="password" label="比赛密码" :rules="[{ required: true, message: '请输入比赛密码' }]">
          <a-input-password v-model="passwordForm.password" placeholder="请输入比赛密码" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 虚拟参赛设置弹窗 -->
    <a-modal
      v-model:visible="virtualModalVisible"
      title="虚拟参赛设置"
      @ok="confirmVirtualParticipation"
      @cancel="virtualModalVisible = false"
      :ok-loading="startingVirtual"
    >
      <a-form :model="virtualForm" layout="vertical">
        <a-form-item field="duration" label="参赛时长（分钟）" :rules="[{ required: true, message: '请输入参赛时长' }]">
          <a-input-number
            v-model="virtualForm.duration"
            :min="1"
            :max="getContestDuration() || 300"
            placeholder="请输入参赛时长"
            style="width: 100%"
          />
          <div class="form-hint">建议时长：{{ getContestDuration() }}分钟</div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { Service } from '../../../generated'
import type { ContestVO, ContestQuestionVO } from '../../../generated'
import moment from 'moment'
import MdViewerV3 from "@/components/MdViewerV3.vue";

const route = useRoute()
const router = useRouter()

// 数据状态
const contest = ref<ContestVO>()
const loading = ref(false)
const registering = ref(false)
const unregistering = ref(false)
const startingVirtual = ref(false)
const passwordChecking = ref(false)
const allSubmissions = ref<any[]>([])

// 弹窗状态
const passwordModalVisible = ref(false)
const virtualModalVisible = ref(false)

// 表单数据
const passwordForm = reactive({
  password: ''
})

const virtualForm = reactive({
  duration: 0
})

// 新增计算属性用于题目访问提示
const getAccessMessage = computed(() => {
  if (!contest.value) return ''

  if (contest.value.status === 0) {
    return '比赛尚未开始'
  }

  if (contest.value.status === 2) {
    return '比赛已结束'
  }

  if (!contest.value.isRegistered) {
    return '需要先报名'
  }

  return ''
})

// 计算属性
const canRegister = computed(() => {
  if (!contest.value) return false
  const now = moment()
  const registerStart = contest.value.registerStartTime ? moment(contest.value.registerStartTime) : null
  const registerEnd = contest.value.registerEndTime ? moment(contest.value.registerEndTime) : null

  if (!registerStart || !registerEnd) return false
  return now.isAfter(registerStart) && now.isBefore(registerEnd)
})

const canAccessProblem = computed(() => {
  return contest.value?.isRegistered && contest.value?.status === 1
})

const canStartVirtual = computed(() => {
  if (!contest.value) return false
  const now = moment()
  const virtualStart = contest.value.virtualStartTime ? moment(contest.value.virtualStartTime) : null
  const virtualEnd = contest.value.virtualEndTime ? moment(contest.value.virtualEndTime) : null

  if (!virtualStart || !virtualEnd) return false
  return now.isAfter(virtualStart) && now.isBefore(virtualEnd)
})

const showCountdown = computed(() => {
  return contest.value && contest.value.status !== 2
})

const countdownLabel = computed(() => {
  if (!contest.value) return ''
  return contest.value.status === 0 ? '距离比赛开始' : '距离比赛结束'
})

const countdownText = computed(() => {
  if (!contest.value) return ''
  const targetTime = contest.value.status === 0 ? contest.value.startTime : contest.value.endTime

  if (!targetTime) return '时间未知'

  const now = moment()
  const target = moment(targetTime)
  const diff = target.diff(now)

  if (diff <= 0) return '已结束'

  const duration = moment.duration(diff)
  const days = Math.floor(duration.asDays())
  const hours = duration.hours()
  const minutes = duration.minutes()
  const seconds = duration.seconds()

  if (days > 0) {
    return `${days}天${hours}小时${minutes}分钟${seconds}秒`
  } else if (hours > 0) {
    return `${hours}小时${minutes}分钟${seconds}秒`
  } else {
    return `${minutes}分钟${seconds}秒`
  }
})

// 获取倒计时目标时间
const getCountdownTarget = () => {
  if (!contest.value) return Date.now() + 1000

  const targetTime = contest.value.status === 0 ? contest.value.startTime : contest.value.endTime
  if (!targetTime) return Date.now() + 1000

  return moment(targetTime).valueOf()
}

// 获取当前时间
const getCurrentTime = () => {
  return Date.now()
}

// 倒计时结束处理
const onCountdownFinish = () => {
  Message.info('倒计时结束，请刷新页面查看最新状态')
  // 可以在这里重新加载比赛信息
  loadContestDetail()
}

// 获取比赛详情
const loadContestDetail = async () => {
  loading.value = true
  try {
    const contestId = route.params.id as string
    const response = await Service.getContestByIdUsingGet(contestId as any)
    if (response.code === 200 && response.data) {
      contest.value = response.data
      virtualForm.duration = getContestDuration() || 180

      // 加载比赛题目列表
      await loadContestQuestions(contestId)

      // 加载比赛提交记录
      await loadContestSubmissions(contestId)
    } else {
      Message.error(response.message || '获取比赛详情失败')
    }
  } catch (error) {
    console.error('获取比赛详情失败:', error)
    Message.error('获取比赛详情失败')
  } finally {
    loading.value = false
  }
}

// 获取比赛题目列表
const loadContestQuestions = async (contestId: string) => {
  try {
    const response = await Service.getContestQuestionsUsingGet(contestId as any)

    if (response.code === 200 && response.data) {
      if (contest.value) {
        contest.value.questions = response.data
      }
    } else {
      console.error('ContestDetailView: 获取比赛题目失败:', response)
    }
  } catch (error) {
    console.error('获取比赛题目失败:', error)
  }
}

// 加载比赛提交记录
const loadContestSubmissions = async (contestId: string) => {
  try {
    const response = await Service.getContestSubmissionsUsingGet(contestId as any)

    if (response.code === 200 && response.data) {
      allSubmissions.value = response.data
    }
  } catch (error) {
    console.error('获取比赛提交记录失败:', error)
  }
}

// 报名比赛
const handleRegister = async () => {
  if (!contest.value?.isPublic) {
    passwordModalVisible.value = true
    return
  }

  await registerContest()
}

const registerContest = async (password?: string) => {
  if (!contest.value) return

  registering.value = true
  try {
    const response = await Service.registerContestUsingPost(contest.value.id as any, password ? { password } : {})

    if (response.code === 200) {
      Message.success('报名成功！')
      contest.value.isRegistered = true
      contest.value.participantCount = (contest.value.participantCount || 0) + 1
      passwordModalVisible.value = false
    } else {
      Message.error(response.message || '报名失败')
    }
  } catch (error) {
    console.error('报名失败:', error)
    Message.error('报名失败')
  } finally {
    registering.value = false
  }
}

// 取消报名
const handleUnregister = async () => {
  if (!contest.value) return

  unregistering.value = true
  try {
    const response = await Service.unregisterContestUsingDelete(contest.value.id as any)

    if (response.code === 200) {
      Message.success('取消报名成功！')
      contest.value.isRegistered = false
      contest.value.participantCount = Math.max((contest.value.participantCount || 1) - 1, 0)
    } else {
      Message.error(response.message || '取消报名失败')
    }
  } catch (error) {
    console.error('取消报名失败:', error)
    Message.error('取消报名失败')
  } finally {
    unregistering.value = false
  }
}

// 密码确认
const confirmPassword = async () => {
  if (!passwordForm.password.trim()) {
    Message.error('请输入比赛密码')
    return
  }

  passwordChecking.value = true
  try {
    // 先检查密码
    const checkResponse = await Service.checkContestAccessUsingPost(
      contest.value!.id as any,
      passwordForm.password
    )

    if (checkResponse.code === 200) {
      await registerContest(passwordForm.password)
    } else {
      Message.error('密码错误')
    }
  } catch (error) {
    console.error('密码验证失败:', error)
    Message.error('密码验证失败')
  } finally {
    passwordChecking.value = false
  }
}

// 开始虚拟参赛
const startVirtualParticipation = () => {
  virtualModalVisible.value = true
}

const confirmVirtualParticipation = async () => {
  if (!virtualForm.duration || virtualForm.duration <= 0) {
    Message.error('请输入有效的参赛时长')
    return
  }

  startingVirtual.value = true
  try {
    const response = await Service.startVirtualParticipationUsingPost(contest.value!.id as any)

    if (response.code === 200) {
      Message.success('虚拟参赛开始！')
      virtualModalVisible.value = false
      // 跳转到比赛页面
      enterContest()
    } else {
      Message.error(response.message || '开始虚拟参赛失败')
    }
  } catch (error) {
    console.error('开始虚拟参赛失败:', error)
    Message.error('开始虚拟参赛失败')
  } finally {
    startingVirtual.value = false
  }
}

// 进入比赛
const enterContest = () => {
  if (!contest.value) return

  if (!contest.value.questions?.length) {
    Message.error('比赛暂无题目')
    return
  }

  // 检查比赛状态
  if (contest.value.status !== 1) {
    Message.warning('比赛尚未开始或已结束')
    return
  }

  // 检查是否已报名
  if (!contest.value.isRegistered) {
    Message.warning('您尚未报名参赛，请先完成报名')
    return
  }

  // 跳转到第一题
  const firstProblem = contest.value.questions[0]
  router.push(`/contest/${contest.value.id}/problem/${firstProblem.questionId}`)
}

// 查看排名
const viewRanking = () => {
  router.push(`/contest/${contest.value?.id}/ranking`)
}

// 查看提交记录
const viewSubmissions = () => {
  router.push(`/contest/${contest.value?.id}/submissions`)
}

// 跳转到题目
const goToProblem = (problem: ContestQuestionVO) => {
  if (!contest.value) return

  // 检查比赛状态
  if (contest.value.status === 0) {
    Message.warning({
      content: '比赛尚未开始，请耐心等待',
      duration: 3000
    })
    return
  }

  if (contest.value.status === 2) {
    Message.warning({
      content: '比赛已结束，无法进入题目',
      duration: 3000
    })
    return
  }

  // 检查是否已报名
  if (!contest.value.isRegistered) {
    Message.warning({
      content: '您尚未报名参赛，请先完成报名才能进入题目',
      duration: 4000
    })
    // 自动滚动到报名按钮位置
    const registerButton = document.querySelector('.header-actions .arco-btn[type="primary"]')
    if (registerButton) {
      registerButton.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  // 进入题目页面
  router.push(`/contest/${contest.value.id}/problem/${problem.questionId}`)
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

const getContestStatusName = (status?: number) => {
  const statusMap: Record<number, string> = { 0: '未开始', 1: '进行中', 2: '已结束' }
  return statusMap[status || 0] || '未知'
}

const getContestStatusColor = (status?: number) => {
  const colorMap: Record<number, string> = { 0: 'gray', 1: 'green', 2: 'red' }
  return colorMap[status || 0] || 'gray'
}

const formatDateTime = (dateTime?: string) => {
  if (!dateTime) return '未知时间'
  return moment(dateTime).format('YYYY-MM-DD HH:mm')
}

const getProblemStatus = (problemId?: any) => {
  if (!problemId) return null

  const submissions = allSubmissions.value.filter(s => s.questionId === problemId)
  if (!submissions.length) return null

  const hasAC = submissions.some(s => s.status === 2)
  return hasAC ? 'AC' : 'WA'
}

const getProblemStatusColor = (problemId?: any) => {
  const status = getProblemStatus(problemId)
  if (status === 'AC') return 'green'
  if (status === 'WA') return 'orange'
  return 'gray'
}

const getProblemStatusText = (problemId?: any) => {
  const status = getProblemStatus(problemId)
  if (status === 'AC') return '已通过'
  if (status === 'WA') return '已尝试'
  return '未尝试'
}

// 计算比赛时长
const getContestDuration = () => {
  if (!contest.value?.startTime || !contest.value?.endTime) return 0
  const start = moment(contest.value.startTime)
  const end = moment(contest.value.endTime)
  return Math.floor(end.diff(start, 'minutes'))
}

// 页面加载
onMounted(() => {
  loadContestDetail()
})
</script>

<style scoped lang="less">
.contest-detail-view {
  background: #f5f5f5;
  min-height: 100vh;
}

.loading-container {
  min-height: 60vh;
  width: 100%;
}

.contest-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.contest-header {
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  .header-background {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    .header-content {
      padding: 48px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .contest-title-section {
        flex: 1;

        .contest-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 16px;
          color: white;
        }

        .contest-meta {
          display: flex;
          align-items: center;
          gap: 12px;

          .private-badge {
            display: flex;
            align-items: center;
            gap: 6px;
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
          }
        }
      }

      .header-actions {
        display: flex;
        gap: 12px;

        .arco-btn {
          height: 48px;
          padding: 0 24px;
          font-size: 16px;
          border-radius: 8px;
        }
      }
    }
  }
}

.status-cards {
  margin-bottom: 24px;

  .status-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    :deep(.arco-statistic-title) {
      color: #86909c;
      font-weight: 500;
    }
  }
}

.description-card,
.problems-card,
.time-card,
.info-card {
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  :deep(.arco-card-header) {
    border-bottom: 1px solid #f0f0f0;

    .arco-card-header-title {
      font-size: 18px;
      font-weight: 600;
      color: #1d2129;
    }
  }
}

.contest-description {
  line-height: 1.6;
  color: #4e5969;

  :deep(p) {
    margin-bottom: 16px;
  }
}

.problems-table {
  .problem-link {
    color: #165dff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 0;
    transition: all 0.3s;

    &:hover {
      color: #4080ff;
    }

    &.problem-accessible {
      color: #165dff;

      &:hover {
        color: #4080ff;
        .problem-title {
          text-decoration: underline;
        }
      }
    }

    &.disabled {
      color: #86909c;
      cursor: not-allowed;

      &:hover {
        color: #86909c;
      }
    }

    .problem-title {
      flex: 1;
      transition: text-decoration 0.3s;
    }

    .access-hint {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #f53f3f;
      background: #fff2f0;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #ffccc7;
    }
  }

  .no-attempt {
    color: #86909c;
  }
}

.time-info {
  .time-item {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .time-label {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #86909c;
      font-size: 14px;
      margin-bottom: 8px;

      .anticon {
        color: #165dff;
      }
    }

    .time-value {
      color: #1d2129;
      font-size: 16px;
      line-height: 1.5;
    }
  }

  .countdown-section {
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    color: white;

    .countdown-label {
      font-size: 14px;
      margin-bottom: 8px;
      opacity: 0.9;
    }

    .countdown-value {
      font-size: 20px;
      font-weight: 600;
    }

    :deep(.arco-statistic-value) {
      color: white !important;
      font-size: 20px !important;
      font-weight: 600 !important;
    }

    :deep(.arco-statistic-suffix) {
      color: white !important;
    }
  }
}

.contest-info {
  .info-item {
    display: flex;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    .info-label {
      color: #86909c;
      min-width: 80px;
    }

    .info-value {
      color: #1d2129;
      flex: 1;
    }
  }
}

.form-hint {
  margin-top: 8px;
  color: #86909c;
  font-size: 12px;
}

@media (max-width: 768px) {
  .contest-content {
    padding: 16px;
  }

  .contest-header .header-content {
    flex-direction: column;
    gap: 24px;
    padding: 32px 24px;

    .contest-title-section .contest-title {
      font-size: 24px;
    }

    .header-actions {
      flex-direction: column;
      width: 100%;

      .arco-btn {
        width: 100%;
      }
    }
  }

  .problems-table {
    :deep(.arco-table) {
      font-size: 14px;
    }
  }
}
</style>
