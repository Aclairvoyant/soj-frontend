<template>
  <div class="manage-problem-sets-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <a-typography-title :heading="2" class="page-title">
            <icon-book class="title-icon" />
            题单管理
          </a-typography-title>
          <a-typography-text class="subtitle">创建和管理你的题单集合</a-typography-text>
        </div>
        <a-button type="primary" size="large" @click="openEdit()" class="create-btn">
          <template #icon>
            <icon-plus />
          </template>
          新建题单
        </a-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card class="stat-card" :class="{ active: filterType === 'all' }" @click="filterByType('all')">
            <div class="stat-content">
              <div class="stat-icon total-icon">
                <icon-folder />
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ problemSets.length }}</div>
                <div class="stat-label">总题单数</div>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card" :class="{ active: filterType === 'public' }" @click="filterByType('public')">
            <div class="stat-content">
              <div class="stat-icon public-icon">
                <icon-unlock />
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ problemSets.filter(p => p.isPublic === 1).length }}</div>
                <div class="stat-label">公开题单</div>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card" :class="{ active: filterType === 'private' }" @click="filterByType('private')">
            <div class="stat-content">
              <div class="stat-icon private-icon">
                <icon-lock />
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ problemSets.filter(p => p.isPublic === 0).length }}</div>
                <div class="stat-label">私有题单</div>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card" :class="{ active: filterType === 'questions' }" @click="filterByType('questions')">
            <div class="stat-content">
              <div class="stat-icon question-icon">
                <icon-file />
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ problemSets.reduce((sum, p) => sum + (p.questionVOList?.length || 0), 0) }}</div>
                <div class="stat-label">总题目数</div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 筛选状态显示 -->
    <div v-if="filterType !== 'all'" class="filter-status">
      <a-tag :color="getFilterTagColor(filterType)" closable @close="clearFilter">
        <template #icon>
          <icon-filter />
        </template>
        当前筛选: {{ getFilterText(filterType) }}
      </a-tag>
    </div>

    <!-- 题单列表 -->
    <div class="table-section">
      <a-card class="table-card" :bordered="false">
        <template #title>
          <div class="card-title">
            <icon-list class="card-icon" />
            <span>题单列表</span>
            <span v-if="filterType !== 'all'" class="filter-count">
              ({{ filteredProblemSets.length }} 个)
            </span>
          </div>
        </template>
        <a-table 
          :columns="columns" 
          :data="filteredProblemSets" 
          row-key="id" 
          :pagination="false" 
          class="problem-set-table" 
          :loading="loading"
          :row-class="getRowClass"
        >
        <template #operations="{ record }">
            <a-space>
              <a-button type="text" size="small" @click="openEdit(record)" class="edit-btn">
                <template #icon>
                  <icon-edit />
                </template>
                编辑
              </a-button>
              <a-popconfirm
                content="确定要删除这个题单吗？"
                @ok="removeSet(record.id)"
                position="left"
              >
                <a-button type="text" status="danger" size="small" class="delete-btn">
                  <template #icon>
                    <icon-delete />
                  </template>
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
        </template>
      </a-table>
      </a-card>
    </div>

    <!-- 编辑题单弹窗 -->
    <a-modal 
      v-model:visible="showEdit" 
      :title="editSet.id ? '编辑题单' : '新建题单'" 
      @cancel="closeEdit" 
      ok-text="保存" 
      cancel-text="取消" 
      @ok="saveSet" 
      width="600px"
      class="edit-modal"
    >
      <a-form :model="editSet" layout="vertical" class="edit-form">
        <a-form-item label="题单名称" field="name" required>
          <a-input v-model="editSet.name" placeholder="请输入题单名称" size="large" />
        </a-form-item>
        <a-form-item label="简介" field="description">
          <a-textarea v-model="editSet.description" placeholder="请输入简介" :rows="3" />
        </a-form-item>
        <a-form-item label="是否公开">
          <a-radio-group v-model="editSet.isPublic" class="radio-group">
            <a-radio :value="1" class="public-radio">
              <div class="custom-radio">
                <icon-unlock />
                <span>公开</span>
              </div>
            </a-radio>
            <a-radio :value="0" class="private-radio">
              <div class="custom-radio">
                <icon-lock />
                <span>私有</span>
              </div>
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="题目列表">
          <div class="question-list-container">
            <a-list :data="editSet.questionVOList" size="small" class="question-list">
            <template #item="{ item }">
              <a-list-item class="edit-question-item">
                  <div class="question-info">
                    <div class="question-title">{{ item.title }}</div>
                    <div class="question-meta">
                      <a-tag :color="getDifficultyColor(item.tags)" size="small">
                        {{ getDifficultyText(item.tags) }}
                      </a-tag>
                      <span class="question-id">#{{ item.id }}</span>
                    </div>
                  </div>
                  <a-button 
                    type="text" 
                    status="danger" 
                    size="small" 
                    @click="removeQuestion(item.id)"
                    class="remove-btn"
                  >
                    <template #icon>
                      <icon-delete />
                    </template>
                    移除
                  </a-button>
              </a-list-item>
            </template>
          </a-list>
            <a-button 
              type="outline" 
              size="medium" 
              @click="showQuestionSelector = true"
              class="add-question-btn"
            >
              <template #icon>
                <icon-plus />
              </template>
              添加题目
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 题目选择器弹窗 -->
    <a-modal 
      v-model:visible="showQuestionSelector" 
      :title="editSet.id ? '选择题目' : '选择题目 (新建模式)'" 
      @cancel="closeQuestionSelector" 
      ok-text="添加" 
      cancel-text="关闭" 
      @ok="addSelectedQuestions" 
      width="500px"
      class="selector-modal"
    >
      <div v-if="!editSet.id" class="new-mode-tip">
        <a-alert type="info" show-icon>
          <template #message>
            新建模式下，选择的题目将在保存题单时一起提交到数据库
          </template>
        </a-alert>
      </div>
      <div class="question-selector-container">
        <a-checkbox-group v-model="selectedQuestionIds" class="checkbox-group">
          <a-list :data="allQuestions" size="small" class="selector-list">
            <template #item="{ item }">
              <a-list-item class="selector-item">
                <a-checkbox 
                  :value="item.id" 
                  :disabled="editSet.questionVOList.some(q => q.id === item.id)"
                  class="question-checkbox"
                >
                  <div class="checkbox-content">
                    <div class="question-title">{{ item.title }}</div>
                    <div class="question-meta">
                      <a-tag :color="getDifficultyColor(item.tags)" size="small">
                        {{ getDifficultyText(item.tags) }}
                      </a-tag>
                      <span class="question-id">#{{ item.id }}</span>
                    </div>
                  </div>
                </a-checkbox>
              </a-list-item>
            </template>
          </a-list>
        </a-checkbox-group>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue';
import { Service } from '../../../generated';
import store from '@/store';
import moment from 'moment';

interface QuestionVO {
  id: number;
  title: string;
  content: string;
  tags: string[];
  submitNum: number;
  acceptedNum: number;
  thumbNum: number;
  favourNum: number;
  userId: number;
  createTime: string;
  updateTime: string;
  userVO: {
    id: number;
    userName: string;
    userAvatar: string;
    userProfile: string;
    userRole: string;
    createTime: string;
  };
}

interface ProblemSet {
  id?: number;
  name: string;
  description: string;
  isPublic: number;
  isOfficial?: number;
  questionVOList: QuestionVO[];
}

const allQuestions = ref<QuestionVO[]>([]);
const problemSets = ref<ProblemSet[]>([]);
const showEdit = ref(false);
const editSet = ref<ProblemSet>({ id: undefined, name: '', description: '', isPublic: 1, questionVOList: [] });
const showQuestionSelector = ref(false);
const selectedQuestionIds = ref<number[]>([]);
const loading = ref(false);
const filterType = ref<'all' | 'public' | 'private' | 'questions'>('all');

const columns = [
  { title: '题单名称', dataIndex: 'name' },
  { title: '简介', dataIndex: 'description' },
  { title: '题目数量', dataIndex: 'questionVOList', render: ({ record }: any) => record.questionVOList?.length || 0 },
  { title: '是否公开', dataIndex: 'isPublic', render: ({ record }: any) => record.isPublic === 1 ? '公开' : '私有' },
  { title: '是否官方', dataIndex: 'isOfficial', render: ({ record }: any) => record.isOfficial === 1 ? '官方' : '用户' },
  { title: '创建时间', dataIndex: 'createTime', render: ({ record }: any) => record.createTime ? moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") : '' },
  { title: '更新时间', dataIndex: 'updateTime', render: ({ record }: any) => record.updateTime ? moment(record.updateTime).format('YYYY-MM-DD HH:mm:ss') : '' },
  { title: '创建者', dataIndex: 'userVO', render: ({ record }: any) => record.userVO?.userName },
  { title: '操作', slotName: 'operations' },
];

const user = computed(() => store.state.user?.loginUser);
const userId = computed(() => user.value?.id); // 响应式获取用户ID

// 筛选后的题单列表
const filteredProblemSets = computed(() => {
  switch (filterType.value) {
    case 'public':
      return problemSets.value.filter(p => p.isPublic === 1);
    case 'private':
      return problemSets.value.filter(p => p.isPublic === 0);
    case 'questions':
      // 按题目数量排序，显示有题目的题单
      return problemSets.value
        .filter(p => (p.questionVOList?.length || 0) > 0)
        .sort((a, b) => (b.questionVOList?.length || 0) - (a.questionVOList?.length || 0));
    default:
      return problemSets.value;
  }
});

// 筛选功能
function filterByType(type: 'all' | 'public' | 'private' | 'questions') {
  filterType.value = type;
}

// 清除筛选
function clearFilter() {
  filterType.value = 'all';
}

// 获取筛选标签颜色
function getFilterTagColor(type: string): string {
  switch (type) {
    case 'public': return 'green';
    case 'private': return 'orange';
    case 'questions': return 'blue';
    default: return 'default';
  }
}

// 获取筛选文本
function getFilterText(type: string): string {
  switch (type) {
    case 'public': return '公开题单';
    case 'private': return '私有题单';
    case 'questions': return '有题目的题单';
    default: return '全部题单';
  }
}

// 获取题单列表
const fetchProblemSets = async () => {
  // 添加用户状态检查
  if (!userId.value) {
    console.error('用户未登录');
    return;
  }
  
  loading.value = true;
  try {
    const res = await Service.listProblemSetVoByPageUsingPost({
      current: 1,
      pageSize: 20,
      userId: userId.value // 使用 userId.value
    });
    if (res.code === 200 && res.data) {
      problemSets.value = res.data.records || [];
    }
    //console.log(res.data.records);
    
  } catch (error) {
    console.error('获取题单列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 获取所有题目
const fetchAllQuestions = async () => {
  try {
    const res = await Service.listQuestionVoByPageUsingPost({
      current: 1,
      pageSize: 10,
    });
    if (res.code === 200 && res.data) {
      allQuestions.value = res.data.records || [];
    }
      // console.log(res.data.records);
      // console.log("==================");
  } catch (error) {
    console.error('获取题目列表失败:', error);
  }
};

// 监听用户ID变化
watch(userId, (newVal) => {
  if (newVal) {
    fetchProblemSets();
    fetchAllQuestions();
  }
}, { immediate: true }); // 立即执行一次

function openEdit(set?: ProblemSet) {
  if (set) {
    editSet.value = { ...set, questionVOList: [...set.questionVOList] };
  } else {
    editSet.value = { id: undefined, name: '', description: '', isPublic: 1, questionVOList: [] };
  }
  showEdit.value = true;
}

function closeEdit() {
  showEdit.value = false;
  editSet.value = { id: undefined, name: '', description: '', isPublic: 1, questionVOList: [] };
  selectedQuestionIds.value = [];
}

function closeQuestionSelector() {
  showQuestionSelector.value = false;
  selectedQuestionIds.value = [];
}

async function saveSet() {
  if (!editSet.value.name) {
    alert('题单名称不能为空');
    return;
  }
  
  try {
    if (editSet.value.id) {
      // 编辑题单
      const res = await Service.updateProblemSetUsingPost({
        id: editSet.value.id,
        name: editSet.value.name,
        description: editSet.value.description,
        isPublic: editSet.value.isPublic,
        questionIdList: editSet.value.questionVOList.map(q => q.id),
      });
      if (res.code === 200) {
        await fetchProblemSets();
        closeEdit();
      }
    } else {
      // 新建题单
      const res = await Service.addProblemSetUsingPost({
        name: editSet.value.name,
        description: editSet.value.description,
        isPublic: editSet.value.isPublic,
        questionIdList: editSet.value.questionVOList.map(q => q.id),
      });
      if (res.code === 200) {
        await fetchProblemSets();
        closeEdit();
      }
    }
  } catch (error) {
    console.error('保存题单失败:', error);
  }
}

async function removeSet(id?: number) {
  if (!id) return;
  try {
    const res = await Service.deleteProblemSetUsingPost(id);
    if (res.code === 200) {
      await fetchProblemSets();
    }
  } catch (error) {
    console.error('删除题单失败:', error);
  }
}

async function removeQuestion(questionId: number) {
  try {
    // 如果是编辑模式，调用API从数据库移除
    if (editSet.value.id) {
      const res = await Service.removeQuestionFromSetUsingPost(questionId, editSet.value.id);
      if (res.code === 200) {
        editSet.value.questionVOList = editSet.value.questionVOList.filter(q => q.id !== questionId);
      }
    } else {
      // 如果是新建模式，直接从本地列表移除
      editSet.value.questionVOList = editSet.value.questionVOList.filter(q => q.id !== questionId);
    }
  } catch (error) {
    console.error('移除题目失败:', error);
  }
}

async function addSelectedQuestions() {
  try {
    for (const questionId of selectedQuestionIds.value) {
      if (!editSet.value.questionVOList.some(q => q.id === questionId)) {
        const question = allQuestions.value.find(q => q.id === questionId);
        if (question) {
          // 如果是新建模式，直接添加到本地列表
          if (!editSet.value.id) {
            editSet.value.questionVOList.push(question);
          } else {
            // 如果是编辑模式，调用API添加到数据库
            const res = await Service.addQuestionToSetUsingPost(questionId, editSet.value.id, editSet.value.questionVOList.length);
            if (res.code === 200) {
              editSet.value.questionVOList.push(question);
            }
          }
        }
      }
    }
    selectedQuestionIds.value = [];
    showQuestionSelector.value = false;
  } catch (error) {
    console.error('添加题目失败:', error);
  }
}

// 根据标签判断难度
function getDifficultyText(tags: string[]): string {
  if (tags.includes('困难')) return '困难';
  if (tags.includes('中等')) return '中等';
  return '简单';
}

// 根据标签判断难度颜色
function getDifficultyColor(tags: string[]): string {
  if (tags.includes('困难')) return 'error';
  if (tags.includes('中等')) return 'warning';
  return 'success';
}

// 表格行样式
function getRowClass(record: any) {
  return 'table-row';
}

onMounted(() => {
  fetchProblemSets();
  fetchAllQuestions();
});
</script>

<style scoped>
.manage-problem-sets-view {
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  background: #fff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-section {
  display: flex;
  flex-direction: column;
}

.page-title {
  margin: 0 !important;
  color: #1d2129;
  display: flex;
  align-items: center;
}

.title-icon {
  margin-right: 12px;
  color: #165dff;
  font-size: 24px;
}

.subtitle {
  margin-top: 8px;
  color: #86909c;
  font-size: 14px;
}

.create-btn {
  background: linear-gradient(135deg, #165dff 0%, #4080ff 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(22, 93, 255, 0.3);
}

.stats-section {
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.stat-card.active {
  border: 2px solid #165dff;
  box-shadow: 0 8px 32px rgba(22, 93, 255, 0.2);
  transform: translateY(-2px);
}

.stat-card.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #165dff 0%, #4080ff 100%);
}

.stat-card.active .stat-number {
  color: #165dff;
}

.stat-card.active .stat-label {
  color: #165dff;
  font-weight: 500;
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
}

.total-icon {
  background: linear-gradient(135deg, #e8f4fd 0%, #d1e9fb 100%);
  color: #165dff;
}

.public-icon {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  color: #00b42a;
}

.private-icon {
  background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
  color: #ff7d00;
}

.question-icon {
  background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
  color: #52c41a;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #1d2129;
  line-height: 1;
}

.stat-label {
  margin-top: 4px;
  color: #86909c;
  font-size: 14px;
}

.table-section {
  margin-bottom: 24px;
}

.table-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: none;
  overflow: hidden;
}

.card-title {
  display: flex;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #f2f3f5;
  background: linear-gradient(135deg, #fafbfc 0%, #f5f6f7 100%);
}

.card-icon {
  color: #165dff;
  margin-right: 12px;
  font-size: 18px;
}

.problem-set-table {
  border-radius: 0;
}

.table-row {
  transition: all 0.3s ease;
}

.table-row:hover {
  background: #f7f8fa !important;
}

.edit-btn {
  color: #165dff;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: rgba(22, 93, 255, 0.1);
  color: #165dff;
}

.delete-btn {
  color: #f53f3f;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: rgba(245, 63, 63, 0.1);
  color: #f53f3f;
}

.edit-modal {
  border-radius: 16px;
}

.edit-form {
  margin-top: 16px;
}

.radio-group {
  display: flex;
  gap: 16px;
}

.custom-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  font-weight: 500;
}

.public-radio .custom-radio {
  background: rgba(0, 180, 42, 0.1);
  color: #00b42a;
  border-color: rgba(0, 180, 42, 0.2);
}

.public-radio .arco-radio-checked .custom-radio {
  background: rgba(0, 180, 42, 0.2);
  border-color: #00b42a;
  box-shadow: 0 2px 8px rgba(0, 180, 42, 0.2);
}

.private-radio .custom-radio {
  background: rgba(255, 125, 0, 0.1);
  color: #ff7d00;
  border-color: rgba(255, 125, 0, 0.2);
}

.private-radio .arco-radio-checked .custom-radio {
  background: rgba(255, 125, 0, 0.2);
  border-color: #ff7d00;
  box-shadow: 0 2px 8px rgba(255, 125, 0, 0.2);
}

.question-list-container {
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  padding: 16px;
  background: #fafbfc;
}

.question-list {
  margin-bottom: 16px;
}

.edit-question-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  margin-bottom: 8px;
  border: 1px solid #e5e6eb;
  transition: all 0.3s ease;
}

.edit-question-item:hover {
  border-color: #165dff;
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.1);
}

.question-info {
  flex: 1;
}

.question-title {
  font-weight: 500;
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
}

.remove-btn {
  background: rgba(245, 63, 63, 0.1);
  color: #f53f3f;
  border: 1px solid rgba(245, 63, 63, 0.2);
  border-radius: 6px;
  padding: 6px 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  opacity: 1;
}

.remove-btn:hover {
  background: rgba(245, 63, 63, 0.2);
  border-color: #f53f3f;
  color: #f53f3f;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(245, 63, 63, 0.2);
}

.add-question-btn {
  width: 100%;
  border: 2px dashed #d9d9d9;
  background: #fff;
  color: #86909c;
  border-radius: 8px;
  padding: 12px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 14px;
}

.add-question-btn:hover {
  border-color: #165dff;
  color: #165dff;
  background: rgba(22, 93, 255, 0.05);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.1);
}

.selector-modal {
  border-radius: 16px;
}

.question-selector-container {
  max-height: 400px;
  overflow-y: auto;
}

.selector-list {
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  background: #fff;
}

.selector-item {
  padding: 12px;
  border-bottom: 1px solid #f2f3f5;
  transition: all 0.3s ease;
}

.selector-item:hover {
  background: #f7f8fa;
}

.selector-item:last-child {
  border-bottom: none;
}

.question-checkbox {
  width: 100%;
}

.checkbox-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 滚动条样式 */
.question-selector-container::-webkit-scrollbar {
  width: 6px;
}

.question-selector-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.question-selector-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.question-selector-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .manage-problem-sets-view {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .create-btn {
    width: 100%;
  }
  
  .stat-card {
    margin-bottom: 16px;
  }
}

/* 筛选状态样式 */
.filter-status {
  margin-bottom: 16px;
  padding: 12px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #165dff;
}

.filter-status .arco-tag {
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
}

.filter-count {
  margin-left: 8px;
  color: #165dff;
  font-weight: 500;
  font-size: 14px;
}

.new-mode-tip {
  margin-bottom: 16px;
}

.new-mode-tip .arco-alert {
  border-radius: 8px;
  border: 1px solid #e5e6eb;
}

.new-mode-tip .arco-alert-info {
  background: #f0f9ff;
  border-color: #165dff;
  border-width: 2px;
}

.new-mode-tip .arco-alert-info .arco-alert-message {
  color: #165dff !important;
  font-weight: 600;
  font-size: 14px;
}

.new-mode-tip .arco-alert-info .arco-alert-icon {
  color: #165dff !important;
  font-size: 16px;
}
</style> 