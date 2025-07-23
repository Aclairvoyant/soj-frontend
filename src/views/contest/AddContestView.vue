<template>
  <div class="add-contest-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <a-typography-title :heading="2" class="page-title">
            <icon-plus class="title-icon" />
            {{ isEdit ? '编辑比赛' : '创建比赛' }}
          </a-typography-title>
          <a-typography-text class="subtitle">{{ isEdit ? '修改比赛配置和设置' : '创建一个新的编程比赛' }}</a-typography-text>
        </div>
        <div class="header-actions">
          <a-button @click="handlePreview" size="large">
            <template #icon>
              <icon-eye />
            </template>
            预览
          </a-button>
          <a-button @click="handleSaveDraft" size="large">
            <template #icon>
              <icon-save />
            </template>
            保存草稿
          </a-button>
          <a-button type="primary" @click="handleSubmit" :loading="submitting" size="large">
            <template #icon>
              <icon-check />
            </template>
            {{ isEdit ? '更新比赛' : '发布比赛' }}
          </a-button>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="content-container">
      <a-row :gutter="[24, 24]">
        <!-- 左侧表单 -->
        <a-col :lg="16" :xs="24">
          <a-card title="基本信息" class="form-card" :bordered="false">
            <a-form :model="form" :rules="rules" ref="formRef" layout="vertical" class="contest-form">
              <a-row :gutter="[16, 16]">
                <a-col :span="24">
                  <a-form-item field="title" label="比赛标题" :rules="[{ required: true, message: '请输入比赛标题' }]">
                    <a-input
                      v-model="form.title"
                      placeholder="请输入比赛标题"
                      :max-length="100"
                      show-word-limit
                    />
                  </a-form-item>
                </a-col>

                <a-col :span="24">
                  <a-form-item field="description" label="比赛描述">
                    <a-textarea
                      v-model="form.description"
                      placeholder="请输入比赛描述，支持Markdown格式"
                      :rows="4"
                      :max-length="1000"
                      show-word-limit
                    />
                  </a-form-item>
                </a-col>

                <a-col :md="12" :xs="24">
                  <a-form-item field="type" label="比赛类型" :rules="[{ required: true, message: '请选择比赛类型' }]">
                    <a-select v-model="form.type" placeholder="选择比赛类型">
                      <a-option :value="1">
                        <div class="contest-type-option">
                          <div class="type-name">ACM/ICPC</div>
                          <div class="type-desc">通过题数优先，时间次之</div>
                        </div>
                      </a-option>
                      <a-option :value="2">
                        <div class="contest-type-option">
                          <div class="type-name">OI</div>
                          <div class="type-desc">总分优先，提交时间次之</div>
                        </div>
                      </a-option>
                      <a-option :value="3">
                        <div class="contest-type-option">
                          <div class="type-name">IOI</div>
                          <div class="type-desc">总分优先，可多次提交</div>
                        </div>
                      </a-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col :md="12" :xs="24">
                  <a-form-item field="duration" label="比赛时长(分钟)" :rules="[{ required: true, message: '请输入比赛时长' }]">
                    <a-input-number
                      v-model="form.duration"
                      :min="1"
                      :max="1440"
                      placeholder="比赛时长"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>

                <a-col :md="12" :xs="24">
                  <a-form-item field="startTime" label="开始时间" :rules="[{ required: true, message: '请选择开始时间' }]">
                    <a-date-picker
                      v-model="form.startTime"
                      format="YYYY-MM-DD HH:mm"
                      show-time
                      style="width: 100%"
                      placeholder="选择开始时间"
                    />
                  </a-form-item>
                </a-col>

                <a-col :md="12" :xs="24">
                  <a-form-item field="endTime" label="结束时间">
                    <a-input
                      :value="computedEndTime"
                      readonly
                      placeholder="将根据开始时间和时长自动计算"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-card>

          <!-- 报名设置 -->
          <a-card title="报名设置" class="form-card" :bordered="false">
            <a-form :model="form" layout="vertical">
              <a-row :gutter="[16, 16]">
                <a-col :md="12" :xs="24">
                  <a-form-item field="registerStartTime" label="报名开始时间">
                    <a-date-picker
                      v-model="form.registerStartTime"
                      format="YYYY-MM-DD HH:mm"
                      show-time
                      style="width: 100%"
                      placeholder="选择报名开始时间"
                    />
                  </a-form-item>
                </a-col>

                <a-col :md="12" :xs="24">
                  <a-form-item field="registerEndTime" label="报名结束时间">
                    <a-date-picker
                      v-model="form.registerEndTime"
                      format="YYYY-MM-DD HH:mm"
                      show-time
                      style="width: 100%"
                      placeholder="选择报名结束时间"
                    />
                  </a-form-item>
                </a-col>

                <a-col :md="12" :xs="24">
                  <a-form-item field="maxParticipants" label="最大参赛人数">
                    <a-input-number
                      v-model="form.maxParticipants"
                      :min="1"
                      placeholder="不限制则留空"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>

                <a-col :md="12" :xs="24">
                  <a-form-item field="isPublic" label="可见性">
                    <a-radio-group v-model="form.isPublic">
                      <a-radio :value="1">公开比赛</a-radio>
                      <a-radio :value="0">私有比赛</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>

                <a-col :span="24" v-if="form.isPublic === 0">
                  <a-form-item field="password" label="比赛密码">
                    <a-input-password
                      v-model="form.password"
                      placeholder="设置比赛密码"
                      :max-length="20"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-card>

          <!-- 比赛规则 -->
          <a-card title="比赛规则" class="form-card" :bordered="false">
            <a-form :model="form" layout="vertical">
              <a-row :gutter="[16, 16]">
                <a-col :md="12" :xs="24">
                  <a-form-item field="penaltyTime" label="罚时(分钟)">
                    <a-input-number
                      v-model="form.penaltyTime"
                      :min="0"
                      placeholder="每次错误提交的罚时"
                      style="width: 100%"
                    />
                    <div class="form-hint">ACM赛制下，每次错误提交会增加罚时</div>
                  </a-form-item>
                </a-col>

                <a-col :md="12" :xs="24">
                  <a-form-item field="allowVirtual" label="虚拟参赛">
                    <a-switch
                      v-model="form.allowVirtual"
                      :checked-value="1"
                      :unchecked-value="0"
                    />
                    <div class="form-hint">允许用户在比赛结束后进行虚拟参赛</div>
                  </a-form-item>
                </a-col>

                <a-col :md="12" :xs="24" v-if="form.allowVirtual === 1">
                  <a-form-item field="virtualStartTime" label="虚拟参赛开始时间">
                    <a-date-picker
                      v-model="form.virtualStartTime"
                      format="YYYY-MM-DD HH:mm"
                      show-time
                      style="width: 100%"
                      placeholder="选择虚拟参赛开始时间"
                    />
                  </a-form-item>
                </a-col>

                <a-col :md="12" :xs="24" v-if="form.allowVirtual === 1">
                  <a-form-item field="virtualEndTime" label="虚拟参赛结束时间">
                    <a-date-picker
                      v-model="form.virtualEndTime"
                      format="YYYY-MM-DD HH:mm"
                      show-time
                      style="width: 100%"
                      placeholder="选择虚拟参赛结束时间"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-card>

          <!-- 题目设置 -->
          <a-card title="题目设置" class="form-card" :bordered="false">
            <template #extra>
              <a-button @click="showQuestionSelector" type="primary" size="small">
                <template #icon>
                  <icon-plus />
                </template>
                添加题目
              </a-button>
            </template>

            <div class="question-list">
              <a-empty v-if="!form.questions?.length" description="暂未添加题目">
                <a-button @click="showQuestionSelector" type="primary">添加题目</a-button>
              </a-empty>

              <div v-else class="question-items">
                <div
                  v-for="(question, index) in form.questions"
                  :key="question.questionId"
                  class="question-item"
                >
                  <div class="question-drag-handle">
                    <icon-drag-dot-vertical />
                  </div>

                  <div class="question-info">
                    <div class="question-title">
                      {{ question.title || getQuestionTitle(question.questionId || 0) }}
                    </div>
                    <div class="question-meta">
                      <span>ID: {{ question.questionId }}</span>
                      <span v-if="question.difficulty" class="difficulty">难度: {{ question.difficulty }}</span>
                      <span>序号: {{ question.sortOrder }}</span>
                    </div>
                  </div>

                  <div class="question-score">
                    <a-input-number
                      v-model="question.score"
                      :min="1"
                      :max="1000"
                      size="small"
                      placeholder="分值"
                      style="width: 80px"
                    />
                  </div>

                  <div class="question-actions">
                    <a-button @click="moveQuestionUp(index)" size="mini" :disabled="index === 0">
                      <icon-up />
                    </a-button>
                    <a-button @click="moveQuestionDown(index)" size="mini" :disabled="index === (form.questions?.length || 0) - 1">
                      <icon-down />
                    </a-button>
                    <a-button @click="removeQuestion(index)" size="mini" status="danger">
                      <icon-delete />
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>

        <!-- 右侧预览和帮助 -->
        <a-col :lg="8" :xs="24">
          <!-- 预览卡片 -->
          <a-card title="预览" class="preview-card" :bordered="false">
            <div class="contest-preview">
              <div class="preview-title">{{ form.title || '比赛标题' }}</div>
              <div class="preview-meta">
                <a-tag :color="getContestTypeColor(form.type)">
                  {{ getContestTypeName(form.type) }}
                </a-tag>
                <a-tag color="gray">
                  {{ form.isPublic ? '公开' : '私有' }}
                </a-tag>
              </div>
              <div class="preview-description">
                {{ form.description || '暂无描述' }}
              </div>
              <div class="preview-details">
                <div class="detail-item">
                  <icon-clock-circle />
                  <span>时长: {{ form.duration || 0 }}分钟</span>
                </div>
                <div class="detail-item" v-if="form.startTime">
                  <icon-calendar />
                  <span>开始: {{ formatDateTime(form.startTime) }}</span>
                </div>
                <div class="detail-item">
                  <icon-file />
                  <span>题目: {{ form.questions?.length || 0 }}道</span>
                </div>
                <div class="detail-item" v-if="form.maxParticipants">
                  <icon-user />
                  <span>限制: {{ form.maxParticipants }}人</span>
                </div>
              </div>
            </div>
          </a-card>

          <!-- 帮助信息 -->
          <a-card title="创建帮助" class="help-card" :bordered="false">
            <div class="help-content">
              <div class="help-section">
                <h4>比赛类型说明</h4>
                <ul>
                  <li><strong>ACM/ICPC:</strong> 按通过题数排名，时间为辅助条件</li>
                  <li><strong>OI:</strong> 按总分排名，提交时间为辅助条件</li>
                  <li><strong>IOI:</strong> 按总分排名，允许多次提交取最高分</li>
                </ul>
              </div>

              <div class="help-section">
                <h4>时间设置建议</h4>
                <ul>
                  <li>报名时间应早于比赛开始时间</li>
                  <li>比赛时长通常为2-5小时</li>
                  <li>虚拟参赛时间应晚于比赛结束时间</li>
                </ul>
              </div>

              <div class="help-section">
                <h4>题目设置</h4>
                <ul>
                  <li>建议3-8道题目</li>
                  <li>按难度递增排列</li>
                  <li>合理设置分值分配</li>
                </ul>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 题目选择弹窗 -->
    <a-modal
      v-model:visible="questionSelectorVisible"
      title="选择题目"
      width="80%"
      :footer="false"
    >
      <QuestionSelector
        v-if="questionSelectorVisible"
        :selected-questions="form.questions?.map((q: any) => q.questionId) || []"
        @confirm="handleQuestionSelect"
        @cancel="questionSelectorVisible = false"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { Service } from '../../../generated'
import type { ContestAddRequest, ContestUpdateRequest, ContestQuestionVO, QuestionVO } from '../../../generated'
import moment from 'moment'
import QuestionSelector from './components/QuestionSelector.vue'

// Extended type for questions with sort order
type ContestQuestionWithOrder = ContestQuestionVO & {
  sortOrder?: number
  title?: string
  difficulty?: string
}

const route = useRoute()
const router = useRouter()

// 基础状态
const isEdit = computed(() => !!route.query.id)
const submitting = ref(false)
const questionSelectorVisible = ref(false)
// 存储选中题目的完整信息
const selectedQuestionsMap = ref<Map<number, QuestionVO>>(new Map())
const formRef = ref()

// 表单数据
const form = reactive<ContestAddRequest & { questions: ContestQuestionWithOrder[] }>({
  title: '',
  description: '',
  type: 1,
  startTime: '',
  endTime: '',
  registerStartTime: '',
  registerEndTime: '',
  duration: 180,
  isPublic: 1,
  maxParticipants: undefined,
  password: '',
  penaltyTime: 20,
  allowVirtual: 0,
  virtualStartTime: '',
  virtualEndTime: '',
  questions: []
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入比赛标题' },
    { max: 100, message: '标题长度不能超过100字符' }
  ],
  type: [
    { required: true, message: '请选择比赛类型' }
  ],
  startTime: [
    { required: true, message: '请选择开始时间' }
  ],
  duration: [
    { required: true, message: '请输入比赛时长' },
    { type: 'number', min: 1, max: 1440, message: '比赛时长应在1-1440分钟之间' }
  ]
}

// 加载比赛数据（编辑模式）
const loadContestData = async () => {
  if (!isEdit.value) return

  try {
    const contestId = route.query.id as string
    const response = await Service.getContestByIdUsingGet(contestId as any)

    if (response.code === 200 && response.data) {
      const contest = response.data
      Object.assign(form, {
        title: contest.title,
        description: contest.description,
        type: contest.contestType,
        startTime: contest.startTime,
        endTime: contest.endTime,
        registerStartTime: contest.registerStartTime,
        registerEndTime: contest.registerEndTime,
        duration: contest.endTime && contest.startTime
          ? moment(contest.endTime).diff(moment(contest.startTime), 'minutes')
          : 180,
        isPublic: contest.isPublic,
        maxParticipants: contest.maxParticipants,
        password: '', // 不回填密码
        penaltyTime: contest.penaltyTime,
        allowVirtual: contest.allowVirtual,
        virtualStartTime: contest.virtualStartTime,
        virtualEndTime: contest.virtualEndTime,
        questions: contest.questions?.map((q: ContestQuestionVO, index: number) => ({
          questionId: q.questionId || 0,
          score: q.score || 100,
          sortOrder: q.sortOrder || index + 1
        } as ContestQuestionWithOrder)) || []
      })
    }
  } catch (error) {
    console.error('加载比赛数据失败:', error)
    Message.error('加载比赛数据失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    console.log("==============");

    // 手动验证必填字段
    if (!form.title?.trim()) {
      Message.error('请输入比赛标题')
      return
    }

    if (!form.type) {
      Message.error('请选择比赛类型')
      return
    }

    if (!form.startTime) {
      Message.error('请选择开始时间')
      return
    }

    if (!form.duration || form.duration <= 0) {
      Message.error('请输入比赛时长')
      return
    }

    // 验证时间设置
    if (!validateTimes()) {
      Message.error('请检查时间设置')
      return
    }

    // 验证题目设置
    if (!form.questions || form.questions.length === 0) {
      Message.error('请至少添加一道题目')
      return
    }

    submitting.value = true

    // 计算结束时间
    const startTime = moment(form.startTime)
    const endTime = startTime.clone().add(form.duration, 'minutes')

    const requestData = {
      ...form,
      startTime: formatDateTime(form.startTime || ''),
      endTime: formatDateTime(endTime.toDate()),
      registerStartTime: form.registerStartTime ? formatDateTime(form.registerStartTime) : undefined,
      registerEndTime: form.registerEndTime ? formatDateTime(form.registerEndTime) : undefined,
      virtualStartTime: form.virtualStartTime ? formatDateTime(form.virtualStartTime) : undefined,
      virtualEndTime: form.virtualEndTime ? formatDateTime(form.virtualEndTime) : undefined
    }

    let response
    if (isEdit.value) {
      response = await Service.updateContestUsingPost({
        id: route.query.id as any,
        ...requestData
      })
    } else {
      response = await Service.addContestUsingPost(requestData)
    }

    console.log('提交结果:', response);

    if (response.code === 200) {
      Message.success(isEdit.value ? '比赛更新成功！' : '比赛创建成功！')
      router.push('/manage/contest')
    } else {
      Message.error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
    Message.error('提交失败')
  } finally {
    submitting.value = false
  }
}

// 计算结束时间
const computedEndTime = computed(() => {
  if (!form.startTime || !form.duration) return ''
  const startTime = moment(form.startTime)
  const endTime = startTime.add(form.duration, 'minutes')
  return endTime.format('YYYY-MM-DD HH:mm')
})

// 验证时间设置
const validateTimes = () => {
  if (!form.startTime) {
    Message.error('请选择开始时间')
    return false
  }

  if (!form.duration || form.duration <= 0) {
    Message.error('请输入有效的比赛时长')
    return false
  }

  const startTime = moment(form.startTime)
  const now = moment()

  if (startTime.isBefore(now)) {
    Message.error('开始时间不能早于当前时间')
    return false
  }

  if (form.registerStartTime && form.registerEndTime) {
    const regStart = moment(form.registerStartTime)
    const regEnd = moment(form.registerEndTime)

    if (regEnd.isBefore(regStart)) {
      Message.error('报名结束时间不能早于报名开始时间')
      return false
    }

    if (regEnd.isAfter(startTime)) {
      Message.error('报名结束时间不能晚于比赛开始时间')
      return false
    }
  }

  return true
}

// 保存草稿
const handleSaveDraft = () => {
  // TODO: 实现草稿保存功能
  Message.info('草稿保存功能开发中')
}

// 预览
const handlePreview = () => {
  // TODO: 实现预览功能
  Message.info('预览功能开发中')
}

// 题目选择
const showQuestionSelector = () => {
  questionSelectorVisible.value = true
}

const handleQuestionSelect = (questions: QuestionVO[]) => {
  console.log('📦 AddContestView.handleQuestionSelect 被调用')
  console.log('接收到的questions数量:', questions.length)
  console.log('接收到的questions详情:', questions.map(q => ({ id: q.id, title: q.title })))
  
  if (questions.length === 0) {
    console.log('⚠️ 接收到的questions数组为空！')
    Message.warning('未选中任何题目')
    return
  }
  
  console.log('🔄 开始处理选中的题目...')
  const newQuestions: ContestQuestionWithOrder[] = questions.map((q: QuestionVO, index: number) => {
    console.log(`处理题目 ${index + 1}:`, { id: q.id, title: q.title })
    
    // 存储完整题目信息
    if (q.id) {
      console.log(`存储题目到selectedQuestionsMap:`, { id: q.id, title: q.title })
      selectedQuestionsMap.value.set(q.id as any, q)
    }

    return {
      questionId: q.id || 0,
      score: 100, // 默认分值
      sortOrder: (form.questions?.length || 0) + index + 1,
      title: q.title
    }
  })
  
  console.log('处理后的newQuestions:', newQuestions.map(q => ({ questionId: q.questionId, title: q.title, sortOrder: q.sortOrder })))
  
  if (form.questions) {
    console.log('添加前的form.questions数量:', form.questions.length)
    form.questions.push(...newQuestions)
    console.log('添加后的form.questions数量:', form.questions.length)
  }
  
  questionSelectorVisible.value = false
  
  const successMessage = `已成功添加 ${questions.length} 道题目`
  console.log('✅ 成功消息:', successMessage)
  Message.success(successMessage)
}

// 题目操作
const removeQuestion = (index: number) => {
  if (!form.questions) return
  form.questions.splice(index, 1)
  // 重新排序
  form.questions.forEach((q: ContestQuestionWithOrder, i: number) => {
    q.sortOrder = i + 1
  })
}

const moveQuestionUp = (index: number) => {
  if (index === 0 || !form.questions) return
  const temp = form.questions[index]
  form.questions[index] = form.questions[index - 1]
  form.questions[index - 1] = temp

  // 更新排序
  form.questions.forEach((q: ContestQuestionWithOrder, i: number) => {
    q.sortOrder = i + 1
  })
}

const moveQuestionDown = (index: number) => {
  if (!form.questions || index === form.questions.length - 1) return
  const temp = form.questions[index]
  form.questions[index] = form.questions[index + 1]
  form.questions[index + 1] = temp

  // 更新排序
  form.questions.forEach((q: ContestQuestionWithOrder, i: number) => {
    q.sortOrder = i + 1
  })
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

const getQuestionTitle = (questionId: number) => {
  const question = selectedQuestionsMap.value.get(questionId)
  return question?.title || `题目 ${questionId}`
}

const formatDateTime = (dateTime: string | Date) => {
  if (!dateTime) return ''
  return moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
}

// 页面加载
onMounted(() => {
  if (isEdit.value) {
    loadContestData()
  }
})
</script>

<style scoped lang="less">
.add-contest-view {
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
      display: flex;
      gap: 12px;

      .arco-btn {
        height: 44px;
        padding: 0 20px;
        font-size: 15px;
        border-radius: 6px;
      }
    }
  }
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
}

.form-card,
.preview-card,
.help-card {
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

.contest-form {
  .contest-type-option {
    .type-name {
      font-weight: 600;
      color: #1d2129;
      margin-bottom: 4px;
    }

    .type-desc {
      font-size: 12px;
      color: #86909c;
    }
  }

  .form-hint {
    margin-top: 4px;
    font-size: 12px;
    color: #86909c;
  }
}

.question-list {
  .question-items {
    .question-item {
      display: flex;
      align-items: center;
      padding: 16px;
      border: 1px solid #e5e6eb;
      border-radius: 6px;
      margin-bottom: 12px;
      background: #fafbfc;

      &:hover {
        border-color: #165dff;
        background: #f7f9ff;
      }

      .question-drag-handle {
        color: #86909c;
        margin-right: 12px;
        cursor: grab;

        &:active {
          cursor: grabbing;
        }
      }

      .question-info {
        flex: 1;

        .question-title {
          font-weight: 500;
          color: #1d2129;
          margin-bottom: 4px;
        }

        .question-meta {
          font-size: 12px;
          color: #86909c;
          display: flex;
          gap: 12px;

          .difficulty {
            color: #165dff;
          }
        }
      }

      .question-score {
        margin-right: 12px;
      }

      .question-actions {
        display: flex;
        gap: 4px;
      }
    }
  }
}

.contest-preview {
  .preview-title {
    font-size: 18px;
    font-weight: 600;
    color: #1d2129;
    margin-bottom: 12px;
  }

  .preview-meta {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  .preview-description {
    color: #4e5969;
    line-height: 1.5;
    margin-bottom: 20px;
  }

  .preview-details {
    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: #86909c;
      font-size: 14px;

      .anticon {
        color: #165dff;
      }
    }
  }
}

.help-content {
  .help-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    h4 {
      color: #1d2129;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    ul {
      margin: 0;
      padding-left: 16px;

      li {
        color: #4e5969;
        font-size: 13px;
        line-height: 1.5;
        margin-bottom: 4px;

        strong {
          color: #1d2129;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .add-contest-view {
    padding: 16px;
  }

  .page-header .header-content {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;

    .header-actions {
      width: 100%;
      justify-content: space-between;
    }
  }

  .question-item {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;

    .question-actions {
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style>
