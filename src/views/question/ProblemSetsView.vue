<template>
  <div class="problem-sets-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <a-typography-title :heading="2" class="page-title">
            <icon-book class="title-icon" />
            题单训练
          </a-typography-title>
          <a-typography-text class="subtitle">选择一个你感兴趣的题单，系统化提升你的刷题能力！</a-typography-text>
        </div>
        <!-- <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ problemSets.length }}</div>
            <div class="stat-label">可用题单</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ totalQuestions }}</div>
            <div class="stat-label">总题目数</div>
          </div>
        </div> -->
      </div>
    </div>

    <!-- 题单列表 -->
    <div class="sets-section">
      <a-card class="sets-card" :bordered="false">
        <template #title>
          <div class="card-title">
            <icon-list class="card-icon" />
            <span>题单列表</span>
            <a-tag color="blue" class="count-tag">{{ problemSets.length }} 个题单</a-tag>
          </div>
        </template>

        <a-row :gutter="24" class="sets-grid">
          <a-col v-for="set in problemSets" :key="set.id" :xs="24" :sm="12" :md="8" :lg="6">
            <div class="set-card" @click="openDetail(set)">
              <div class="set-header">
                <div class="set-title">{{ set.name }}</div>
                <a-tag :color="set.isOfficial === 1 ? 'gold' : 'blue'" class="set-tag">
                  {{ set.isOfficial === 1 ? '官方' : '用户' }}
                </a-tag>
              </div>
              <div class="set-description">{{ set.description || '暂无描述' }}</div>
              <!-- 进度条 -->
              <div class="progress-section">
                <div class="progress-info">
                  <span class="progress-text">完成进度</span>
                  <span class="progress-ratio">{{ getProgressText(set) }}</span>
                </div>
                <a-progress
                  :percent="getProgressPercent(set)"
                  :show-text="false"
                  size="small"
                  :color="{
                  '0%': 'rgb(var(--primary-6))',
                  '100%': 'rgb(var(--success-6))',
                  }"
                  class="progress-bar"
                />
              </div>
              <div class="set-meta">
                <div class="meta-item">
                  <icon-file class="meta-icon" />
                  <span>{{ set.questionVOList?.length || 0 }} 题</span>
                </div>
                <div class="meta-item">
                  <icon-user class="meta-icon" />
                  <span>{{ set.userVO?.userName || '未知' }}</span>
                </div>
              </div>
              <div class="set-footer">
                <a-button type="primary" size="small" class="start-btn">
                  <template #icon>
                    <icon-play-arrow />
                  </template>
                  开始训练
                </a-button>
              </div>
            </div>
          </a-col>
        </a-row>

        <!-- 空状态 -->
        <div v-if="problemSets.length === 0 && !loading" class="empty-state">
          <a-empty description="暂无可用题单">
            <template #image>
              <icon-book style="font-size: 64px; color: #d9d9d9;" />
            </template>
          </a-empty>
        </div>
      </a-card>
    </div>

    <!-- 题单详情弹窗 -->
    <a-modal
      v-model:visible="showDetail"
      :title="selectedSet?.name"
      @cancel="closeDetail"
      ok-text="关闭"
      :cancel-button-props="{ style: { display: 'none' } }"
      width="600px"
      class="detail-modal"
    >
      <div v-if="selectedSet" class="modal-content">
        <div class="modal-header">
          <div class="modal-description">{{ selectedSet.description || '暂无描述' }}</div>
          <div class="modal-meta">
            <a-tag :color="selectedSet.isOfficial === 1 ? 'gold' : 'blue'">
              {{ selectedSet.isOfficial === 1 ? '官方题单' : '用户题单' }}
            </a-tag>
            <a-tag color="green">{{ selectedSet.questionVOList?.length || 0 }} 题</a-tag>
          </div>
        </div>

        <a-divider />

        <div class="questions-section">
          <div class="section-title">
            <icon-list class="section-icon" />
            <span>题目列表</span>
            <div class="progress-summary">
              <span class="summary-text">完成进度: {{ getProgressText(selectedSet) }}</span>
              <a-progress
                :percent="getProgressPercent(selectedSet)"
                size="small"
                :color="{
                '0%': 'rgb(var(--primary-6))',
                 '100%': 'rgb(var(--success-6))',
                }"
                class="summary-progress"
              />
            </div>
          </div>
          <a-list :data="selectedSet.questionVOList" :bordered="false" class="questions-list">
            <template #item="{ item }">
              <a-list-item class="question-list-item" :class="{ 'solved': isQuestionSolved(item.id) }">
                <div class="question-info">
                  <div class="question-header">
                    <div class="question-title">
                      <icon-check-circle v-if="isQuestionSolved(item.id)" class="solved-icon" />
                      <icon-clock-circle v-else class="unsolved-icon" />
                      {{ item.title }}
                    </div>
                    <a-tag class="status-tag" :color="isQuestionSolved(item.id) ? 'green' : 'gray'">
                      {{ isQuestionSolved(item.id) ? '已完成' : '未完成' }}
                    </a-tag>
                  </div>
                  <div class="question-meta">
                    <a-tag :color="getDifficultyColor(item.tags)" size="small">
                      {{ getDifficultyText(item.tags) }}
                    </a-tag>
                    <span class="question-id">#{{ item.id }}</span>

                    <a-button
                      type="primary"
                      size="small"
                      @click="train(item)"
                      class="train-btn"
                      :class="{ 'retry-btn': isQuestionSolved(item.id) }"
                      :style="{ margin: '10px 0', float: 'right', marginLeft: 'auto' }"
                    >
                    <template #icon>
                      <icon-play-arrow v-if="!isQuestionSolved(item.id)" />
                      <icon-redo v-else />
                    </template>
                    {{ isQuestionSolved(item.id) ? '重做' : '开始训练' }}
                    </a-button>
                  </div>
                </div>

              </a-list-item>
            </template>
          </a-list>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Service } from '../../../generated';
import { useStore } from 'vuex';

interface QuestionVO {
  id: string;
  title: string;
  content: string;
  tags: string[];
  submitNum: number;
  acceptedNum: number;
  thumbNum: number;
  favourNum: number;
  userId: string;
  createTime: string;
  updateTime: string;
  userVO: {
    id: string;
    userName: string;
    userAvatar: string;
    userProfile: string;
    userRole: string;
    createTime: string;
  };
}

interface UserVO {
  id: string;
  userName: string;
  userAvatar: string;
  userProfile: string;
  userRole: string;
  createTime: string;
}

interface ProblemSet {
  id: string;
  name: string;
  description: string;
  isPublic: number;
  isOfficial: number;
  userId: string;
  createTime: string;
  updateTime: string;
  questionVOList: QuestionVO[];
  userVO: UserVO;
}

const router = useRouter();
const store = useStore();
const problemSets = ref<ProblemSet[]>([]);
const showDetail = ref(false);
const selectedSet = ref<ProblemSet | null>(null);
const loading = ref(false);
const personalData = ref<any>(null);
const solvedQuestions = ref<Set<string>>(new Set());
const problemSetProgress = ref<Map<string, { completed: number; total: number }>>(new Map());

// 计算总题目数
const totalQuestions = computed(() => {
  return problemSets.value.reduce((sum, set) => sum + (set.questionVOList?.length || 0), 0);
});

// 获取题单列表
const fetchProblemSets = async () => {
  loading.value = true;
  try {
    const res = await Service.listProblemSetVoByPageUsingPost({
      current: 1,
      pageSize: 20,
    });
    if (res.code === 200 && res.data) {
      problemSets.value = res.data.records || [];
    }
    // console.log(problemSets.value);
    // console.log(res.data.records);
    // console.log("================================================");
  } catch (error) {
    console.error('获取题单列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 获取题单详情
const fetchProblemSetDetail = async (id: string) => {
  try {
    const res = await Service.getProblemSetVoUsingGet(id as any);
    if (res.code === 200 && res.data) {
      selectedSet.value = res.data as unknown as ProblemSet;
    }
  } catch (error) {
    console.error('获取题单详情失败:', error);
  }
};

async function openDetail(set: ProblemSet) {
  await fetchProblemSetDetail(set.id);
  // 确保获取最新的进度数据
  await fetchProblemSetProgress(set.id);
  showDetail.value = true;
}

function closeDetail() {
  showDetail.value = false;
  selectedSet.value = null;
}

function train(question: QuestionVO) {
  // 跳转到题目详情页面
  router.push(`/view/question/${question.id}`);
}

// 根据标签判断难度
function getDifficultyColor(tags: string[]): string {
  if (tags.includes('困难')) return 'red';
  if (tags.includes('中等')) return 'orange';
  return 'green';
}

function getDifficultyText(tags: string[]): string {
  if (tags.includes('困难')) return '困难';
  if (tags.includes('中等')) return '中等';
  return '简单';
}

// 检查题目是否已解决
const isQuestionSolved = (questionId: string): boolean => {
  console.log(solvedQuestions.value);
  return solvedQuestions.value.has(questionId);
};

// 获取用户题目提交数据，筛选出已通过的题目
const fetchUserSolvedQuestions = async () => {
  try {
    const currentUser = store.state.user.loginUser;
    if (!currentUser || !currentUser.id) {
      return;
    }

    // 获取用户历史提交记录
    const res = await Service.getQuestionSolveUsingGet();
    if (res.code === 200 && res.data) {
      const solvedQuestionIds = new Set<string>();
      // console.log('用户已解决题目提交记录:', res.data);
      res.data.forEach((id: any) => {
        if (id.questionId) {
          solvedQuestionIds.add(id.questionId);
        }
      });
      solvedQuestions.value = solvedQuestionIds;
    }
  } catch (error) {
    console.error('获取用户已解决题目失败:', error);
  }
};

// 获取题单进度统计
const fetchProblemSetProgress = async (setId: string) => {
  try {
    const res = await Service.getUserProgressStatUsingGet(setId as any);
    // console.log(`获取题单${setId}进度:`, res.data);
    if (res.code === 200 && res.data) {
      problemSetProgress.value.set(setId, {
        completed: res.data.completed || 0,
        total: res.data.total || 0
      });
    }
  } catch (error) {
    console.error(`获取题单${setId}进度失败:`, error);
  }
};

// 批量获取所有题单的进度
const fetchAllProblemSetProgress = async () => {
  const promises = problemSets.value.map(set =>
    fetchProblemSetProgress(set.id)
  );
  await Promise.all(promises);
};

// 获取用户已解决题目
const fetchPersonalData = async () => {
  try {
    const res = await Service.getPersonalDataUsingGet();
    if (res.code === 200 && res.data) {
      personalData.value = res.data;
    }
  } catch (error) {
    console.error('获取个人数据失败:', error);
  }
};

// 计算题单完成进度
const getProgressPercent = (set: ProblemSet): any => {
  const setId = set.id;
  const progress = problemSetProgress.value.get(setId);
  if (!progress) return 0;
  return (progress.completed / progress.total).toFixed(2);
};

// 获取进度文本
const getProgressText = (set: ProblemSet): any => {
  const setId = set.id;
  const progress = problemSetProgress.value.get(setId);

  if (progress) {
    return `${progress.completed}/${progress.total}`;
  }

  // 备用计算方式
  const totalQuestions = set.questionVOList?.length || 0;
  const solvedCount = set.questionVOList?.filter(q =>
    solvedQuestions.value.has(q.id)
  ).length || 0;

  return `${solvedCount}/${totalQuestions}`;
};


onMounted(async () => {
  await fetchProblemSets();
  await fetchPersonalData();
  await fetchUserSolvedQuestions();
  await fetchAllProblemSetProgress();
});
</script>

<style scoped>
.problem-sets-view {
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  box-sizing: border-box;
}

.page-header {
  background: linear-gradient(135deg, #165dff 0%, #4eb5ff 100%);
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(22, 93, 255, 0.2);
  margin-bottom: 24px;
  text-align: center;
}

.header-content {
  color: #fff;
}

.title-section {
  margin-bottom: 16px;
}

.page-title {
  margin: 0 !important;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-icon {
  margin-right: 12px;
  color: #fff;
  font-size: 24px;
}

.subtitle {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
}

.sets-section {
  margin-bottom: 24px;
}

.sets-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: none;
  overflow: hidden;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 32px;
  border-bottom: 1px solid #f2f3f5;
  background: linear-gradient(135deg, #fafbfc 0%, #f5f6f7 100%);
  color: #1d2129;
  font-weight: 600;
}

.card-icon {
  color: #165dff;
  font-size: 18px;
}

.count-tag {
  margin-left: auto;
  border-radius: 6px;
  font-weight: 500;
}

.sets-grid {
  padding: 24px;
}

.set-card {
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.set-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(22, 93, 255, 0.15);
  border-color: #165dff;
}

.set-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.set-title {
  font-weight: 600;
  font-size: 16px;
  color: #1d2129;
  flex: 1;
  margin-right: 12px;
}

.set-tag {
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.set-description {
  color: #86909c;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  flex: 1;
}

.set-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  color: #86909c;
  font-size: 12px;
}

.meta-icon {
  margin-right: 4px;
  font-size: 14px;
}

.set-footer {
  margin-top: auto;
  text-align: right;
}

.start-btn {
  background: linear-gradient(135deg, #00b42a 0%, #23c343 100%);
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 180, 42, 0.2);
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 180, 42, 0.4);
}

.empty-state {
  text-align: center;
  padding: 48px 0;
  color: #86909c;
}

/* 进度条样式 */
.progress-section {
  margin-bottom: 16px;
  padding: 12px;
  background: #f2f3f5;
  border-radius: 12px;
  border: 1px solid #e5e6eb;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #1d2129;
  font-size: 12px;
  font-weight: 500;
}

.progress-text {
  color: #86909c;
}

.progress-ratio {
  color: #1d2129;
  font-weight: 600;
}

.progress-bar {
  height: 6px;
}

/* 详情弹窗进度样式 */
.progress-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.summary-text {
  font-size: 12px;
  color: #86909c;
  font-weight: normal;
}

.summary-progress {
  width: 120px;
}

/* 题目列表状态样式 */
.question-list-item.solved {

}

.question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.question-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 14px;
  color: #1d2129;
  flex: 1;
}

.solved-icon {
  color: #00b42a;
  font-size: 16px;
}

.unsolved-icon {
  color: #86909c;
  font-size: 16px;
}

.status-tag {
  flex-shrink: 0;
  font-size: 11px;
  border-radius: 4px;
}

.retry-btn {
  background: linear-gradient(135deg, #ff7d00 0%, #ffb84d 100%) !important;
}

.retry-btn:hover {
  background: linear-gradient(135deg, #e6700a 0%, #ff9500 100%) !important;
  box-shadow: 0 4px 12px rgba(255, 125, 0, 0.3) !important;
}

.detail-modal {
  border-radius: 16px;
}

.modal-content {
  padding: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
}

.modal-header {
  padding: 24px 24px 16px 24px;
}

.modal-description {
  color: #86909c;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
}

.modal-meta {
  display: flex;
  gap: 8px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 24px 16px 24px;
  font-weight: 600;
  color: #1d2129;
}

.section-icon {
  color: #165dff;
  font-size: 16px;
}

.questions-section {
  padding: 0 24px 24px 24px;
}

.questions-list {
  border: 1px solid rgba(229, 230, 235, 0.5);
  border-radius: 8px;
  background: rgba(250, 251, 252, 0.8);
  backdrop-filter: blur(10px);
}

.question-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f2f3f5;
  transition: all 0.3s ease;
}

.question-list-item:hover {
  background: #fff;
  border-color: #165dff;
}

.question-list-item:last-child {
  border-bottom: none;
}

.question-info {
  flex: 1;
  margin-right: 16px;
}

.question-title {
  font-weight: 500;
  font-size: 14px;
  color: #1d2129;
  margin-bottom: 4px;
}

.question-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-id {
  color: #86909c;
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.train-btn {
  background: linear-gradient(135deg, #165dff 0%, #4080ff 100%);
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.train-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .problem-sets-view {
    padding: 16px;
  }

  .page-header {
    padding: 24px 16px;
  }

  .sets-grid {
    padding: 16px;
  }

  .set-card {
    margin-bottom: 16px;
  }

  .progress-summary {
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;
  }

  .summary-progress {
    width: 100px;
  }
}
</style>
