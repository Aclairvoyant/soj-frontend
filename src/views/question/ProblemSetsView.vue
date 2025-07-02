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
          </div>
          <a-list :data="selectedSet.questionVOList" :bordered="false" class="questions-list">
            <template #item="{ item }">
              <a-list-item class="question-list-item">
                <div class="question-info">
                  <div class="question-title">{{ item.title }}</div>
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
                      :style="{ margin: '10px 0', float: 'right', marginLeft: 'auto' }"
                    >
                    <template #icon>
                      <icon-play-arrow />
                    </template>
                    开始训练
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
const problemSets = ref<ProblemSet[]>([]);
const showDetail = ref(false);
const selectedSet = ref<ProblemSet | null>(null);
const loading = ref(false);

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
      isPublic: 1, // 只显示公开题单
    });
    if (res.code === 200 && res.data) {
      problemSets.value = res.data.records || [];
    }
    console.log(problemSets.value);
    console.log(res.data.records);
    console.log("================================================");
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

onMounted(() => {
  fetchProblemSets();
});
</script>

<style scoped>
.problem-sets-view {
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
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

.header-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-top: 24px;
}

.stat-item {
  text-align: center;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.stat-label {
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
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
}

.start-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 180, 42, 0.3);
}

.empty-state {
  text-align: center;
  padding: 48px 0;
  color: #86909c;
}

.detail-modal {
  border-radius: 16px;
}

.modal-content {
  padding: 0;
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
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  background: #fafbfc;
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
  
  .header-stats {
    flex-direction: column;
    gap: 16px;
  }
  
  .sets-grid {
    padding: 16px;
  }
  
  .set-card {
    margin-bottom: 16px;
  }
}
</style> 