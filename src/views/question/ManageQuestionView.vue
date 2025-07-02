<template>
  <div class="manage-question-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <a-typography-title :heading="2" class="page-title">
            <icon-tool class="title-icon" />
            题目管理
          </a-typography-title>
          <a-typography-text class="subtitle">管理和维护系统中的所有编程题目</a-typography-text>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ total }}</div>
            <div class="stat-label">总题目数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ totalSubmits }}</div>
            <div class="stat-label">总提交数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ totalAccepts }}</div>
            <div class="stat-label">总通过数</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <a-card class="search-card" :bordered="false">
        <a-form :model="searchParams" layout="inline" class="search-form">
          <a-form-item field="title" label="题目名称" class="search-item">
            <a-input 
              v-model="searchParams.title" 
              placeholder="请输入题目名称" 
              size="large"
              class="search-input"
            >
              <template #prefix>
                <icon-search />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item field="tags" label="题目标签" class="search-item">
            <a-input-tag 
              v-model="searchParams.tags" 
              placeholder="请输入标签" 
              size="large"
              class="tags-input"
              allow-clear
            />
          </a-form-item>
          <a-form-item class="search-actions">
            <a-space>
              <a-button 
                type="primary" 
                size="large"
                @click="doSubmit"
                class="search-btn"
              >
                <template #icon>
                  <icon-search />
                </template>
                搜索
              </a-button>
              <a-button 
                size="large"
                @click="resetSearch"
                class="reset-btn"
              >
                <template #icon>
                  <icon-refresh />
                </template>
                重置
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-card>
    </div>

    <!-- 题目列表表格 -->
    <div class="table-section">
      <a-card class="table-card" :bordered="false">
        <template #title>
          <div class="card-title">
            <icon-list class="card-icon" />
            <span>题目列表</span>
            <a-tag color="blue" class="count-tag">{{ dataList.length }} 道题目</a-tag>
          </div>
        </template>
        
        <a-table
          :ref="tableRef"
          :columns="columns"
          :data="dataList"
          :scroll="{ y: 600 }"
          :scrollbar="true"
          :pagination="{
            showTotal: true,
            pageSize: searchParams.pageSize,
            current: searchParams.current,
            total,
            showJumper: true,
            showPageSize: true,
          }"
          @page-change="onPageChange"
          @pageSizeChange="onPageSizeChange"
          class="question-table"
          :loading="loading"
        >
          <!-- 题号 -->
          <template #id="{ record }">
            <div class="question-id">
              <span class="id-number">#{{ record.id }}</span>
            </div>
          </template>

          <!-- 标题 -->
          <template #title="{ record }">
            <div class="question-title">
              <span class="title-text">{{ record.title }}</span>
            </div>
          </template>

          <!-- 标签 -->
          <template #tags="{ record }">
            <div class="tags-info">
              <a-tag 
                v-for="tag in parseTags(record.tags)" 
                :key="tag"
                color="blue"
                class="tag-item"
              >
                {{ tag }}
              </a-tag>
            </div>
          </template>

          <!-- 答案 -->
          <template #answer="{ record }">
            <div class="answer-info">
              <span class="answer-text">{{ record.answer }}</span>
            </div>
          </template>

          <!-- 提交数 -->
          <template #submitNum="{ record }">
            <div class="submit-info">
              <span class="submit-number">{{ record.submitNum }}</span>
            </div>
          </template>

          <!-- 通过数 -->
          <template #acceptedNum="{ record }">
            <div class="accept-info">
              <span class="accept-number">{{ record.acceptedNum }}</span>
            </div>
          </template>

          <!-- 判题配置 -->
          <template #judgeConfig="{ record }">
            <div class="judge-config-info">
              <div class="config-item">
                <span class="config-label">时间:</span>
                <span class="config-value">{{ parseJudgeConfig(record.judgeConfig).timeLimit }}ms</span>
              </div>
              <div class="config-item">
                <span class="config-label">内存:</span>
                <span class="config-value">{{ parseJudgeConfig(record.judgeConfig).memoryLimit }}MB</span>
              </div>
            </div>
          </template>

          <!-- 判题用例 -->
          <template #judgeCase="{ record }">
            <div class="judge-case-info">
              <span class="case-count">{{ parseJudgeCase(record.judgeCase).length }} 个用例</span>
            </div>
          </template>

          <!-- 用户ID -->
          <template #userId="{ record }">
            <div class="user-info">
              <a-avatar :size="24" class="user-avatar">
                <icon-user />
              </a-avatar>
              <span class="user-name">{{ record.userId }}</span>
            </div>
          </template>

          <!-- 创建时间 -->
          <template #createTime="{ record }">
            <div class="create-time">
              {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
            </div>
          </template>

          <!-- 更新时间 -->
          <template #updateTime="{ record }">
            <div class="update-time">
              {{ moment(record.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
            </div>
          </template>

          <!-- 操作 -->
          <template #optional="{ record }">
            <div class="action-buttons">
              <a-space>
                <a-button 
                  type="primary" 
                  size="small"
                  @click="doUpdate(record)"
                  class="edit-btn"
                >
                  <template #icon>
                    <icon-edit />
                  </template>
                  修改
                </a-button>
                <a-popconfirm
                  content="确定要删除此题目吗?"
                  type="error"
                  okText="是"
                  cancelText="否"
                  @cancel="() => { console.log('已取消'); }"
                  @ok="doDelete(record)"
                >
                  <a-button 
                    type="primary" 
                    status="danger"
                    size="small"
                    class="delete-btn"
                  >
                    <template #icon>
                      <icon-delete />
                    </template>
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </div>
          </template>
        </a-table>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect, computed } from "vue";

import message from "@arco-design/web-vue/es/message";
import * as querystring from "querystring";
import { useRouter } from "vue-router";
import moment from "moment";
import {Modal} from "@arco-design/web-vue";
import {Question, Service} from "../../../generated";

const tableRef = ref();

const dataList = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);

const searchParams = ref({
  title: "",
  tags: [],
  pageSize: 10,
  current: 1,
});

// 计算总提交数和总通过数
const totalSubmits = computed(() => {
  return dataList.value.reduce((sum, item) => sum + (item.submitNum || 0), 0);
});

const totalAccepts = computed(() => {
  return dataList.value.reduce((sum, item) => sum + (item.acceptedNum || 0), 0);
});

// 解析标签
const parseTags = (tags: any): string[] => {
  if (!tags) return [];
  try {
    if (typeof tags === 'string') {
      return JSON.parse(tags);
    }
    return Array.isArray(tags) ? tags : [];
  } catch {
    return [];
  }
};

// 解析判题配置
const parseJudgeConfig = (judgeConfig: any): any => {
  if (!judgeConfig) return { timeLimit: 0, memoryLimit: 0, stackLimit: 0 };
  try {
    if (typeof judgeConfig === 'string') {
      return JSON.parse(judgeConfig);
    }
    return judgeConfig;
  } catch {
    return { timeLimit: 0, memoryLimit: 0, stackLimit: 0 };
  }
};

// 解析判题用例
const parseJudgeCase = (judgeCase: any): any[] => {
  if (!judgeCase) return [];
  try {
    if (typeof judgeCase === 'string') {
      return JSON.parse(judgeCase);
    }
    return Array.isArray(judgeCase) ? judgeCase : [];
  } catch {
    return [];
  }
};

// 重置搜索
const resetSearch = () => {
  searchParams.value = {
    title: '',
    tags: [],
    pageSize: 10,
    current: 1,
  };
};

const loadData = async () => {
  loading.value = true;
  try {
    const res = await Service.listQuestionByPageUsingPost(
      searchParams.value
    );
    if (res.code === 200) {
      dataList.value = res.data?.records ?? [];
      total.value = res.data?.total ?? 0;
    } else {
      message.error("加载失败，" + res.message);
    }
  } catch (error) {
    message.error("加载失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
// onMounted(() => {
//   loadData();
// });

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};

// {id: "1", title: "A+ D", content: "新的题目内容", tags: "["二叉树"]", answer: "新的答案", submitNum: 0,…}

const columns = [
  {
    title: "题号",
    dataIndex: "id",
    width: 60,
  },
  {
    title: "标题",
    dataIndex: "title",
    width: 100,
    ellipsis: true, //显示省略号
    tooltip: true, //在显示省略号时使用文本提示
  },
  //   {
  //     title: "内容",
  //     dataIndex: "content",
  //   },
  {
    title: "标签",
    dataIndex: "tags",
    width: 130,
  },
  // {
  //   title: "答案",
  //   dataIndex: "answer",
  //   width: 100,
  //   ellipsis: true, //显示省略号
  //   tooltip: true, //在显示省略号时使用文本提示
  // },
  // {
  //   title: "答案模版",
  //   dataIndex: "answerTemplate",
  //   width: 100,
  //   ellipsis: true,
  //   tooltip: true,
  // },
  {
    title: "提交数",
    dataIndex: "submitNum",
    width: 80,
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
    width: 80,
  },
  {
    title: "判题配置",
    dataIndex: "judgeConfig",
    width: 150,
  },
  {
    title: "判题用例",
    dataIndex: "judgeCase",
    width: 100,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "用户id",
    dataIndex: "userId",
    width: 70,
  },
  {
    title: "创建时间",
    slotName: "createTime",
    width: 75,
  },
  {
    title: "更新时间",
    slotName: "updateTime",
    width: 75,
  },
  {
    title: "操作",
    slotName: "optional",
    width: 100,
  },
];
/**
 * 分页
 * @param page
 */
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

/**
 * 分页大小
 * @param size
 */
const onPageSizeChange = (size: number) => {
  searchParams.value = {
    ...searchParams.value,
    pageSize: size,
  };
};

const doDelete = async (question: Question) => {
  Modal.confirm({
    title: '确认',
    content: '确定要删除该题目吗？',
    async onOk() {
      const res = await Service.deleteQuestionUsingPost({
        id: question.id,
      });
      if (res.code === 200) {
        message.success("删除成功");
        await loadData();
      } else {
        message.error("删除失败");
      }
    },
  });
};

const router = useRouter();

const doUpdate = (question: Question) => {
  router.push({
    path: "/update/question",
    query: {
      id: question.id,
    },
  });
};
</script>

<style scoped>
.manage-question-view {
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

.header-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  text-align: center;
  padding: 16px 24px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  border: 1px solid #e0f2fe;
  min-width: 100px;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #165dff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #86909c;
  font-weight: 500;
}

.search-section {
  margin-bottom: 24px;
}

.search-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-item {
  margin-bottom: 0;
}

.search-input {
  width: 240px;
  border-radius: 8px;
}

.search-input :deep(.arco-input-prefix) {
  color: #165dff;
}

.tags-input {
  width: 240px;
  border-radius: 8px;
}

.search-actions {
  margin-bottom: 0;
}

.search-btn {
  background: linear-gradient(135deg, #165dff 0%, #4080ff 100%);
  border: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
}

.reset-btn {
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  border-color: #165dff;
  color: #165dff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.1);
}

.table-section {
  margin-bottom: 24px;
}

.table-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1d2129;
}

.card-icon {
  color: #165dff;
  font-size: 16px;
}

.count-tag {
  margin-left: auto;
  font-size: 12px;
}

.question-table {
  border-radius: 8px;
  overflow: hidden;
}

.question-table :deep(.arco-table-th) {
  background: #f7f8fa;
  font-weight: 600;
  color: #1d2129;
  border-bottom: 1px solid #e5e6eb;
}

.question-table :deep(.arco-table-td) {
  border-bottom: 1px solid #f2f3f5;
  padding: 16px 12px;
}

.question-table :deep(.arco-table-tr:hover) {
  background: #f0f9ff;
}

.question-id {
  display: flex;
  align-items: center;
}

.id-number {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-weight: 600;
  color: #165dff;
  font-size: 14px;
}

.question-title {
  display: flex;
  align-items: center;
}

.title-text {
  font-weight: 500;
  color: #1d2129;
  font-size: 14px;
}

.tags-info {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag-item {
  font-size: 11px;
  border-radius: 4px;
  padding: 1px 6px;
}

.answer-info {
  display: flex;
  align-items: center;
}

.answer-text {
  font-size: 12px;
  color: #86909c;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.submit-info {
  display: flex;
  align-items: center;
}

.submit-number {
  font-weight: 600;
  color: #1d2129;
  font-size: 14px;
}

.accept-info {
  display: flex;
  align-items: center;
}

.accept-number {
  font-weight: 600;
  color: #00b42a;
  font-size: 14px;
}

.judge-config-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.config-label {
  font-size: 11px;
  color: #86909c;
}

.config-value {
  font-size: 11px;
  color: #1d2129;
  font-weight: 500;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.judge-case-info {
  display: flex;
  align-items: center;
}

.case-count {
  font-size: 12px;
  color: #86909c;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  background: #f0f9ff;
  color: #165dff;
}

.user-name {
  font-size: 13px;
  color: #1d2129;
  font-weight: 500;
}

.create-time,
.update-time {
  font-size: 14px;
  color: #1d2129;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.action-buttons {
  display: flex;
  align-items: center;
}

.edit-btn {
  border-radius: 6px;
  font-size: 12px;
  padding: 2px 8px;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.2);
}

.delete-btn {
  border-radius: 6px;
  font-size: 12px;
  padding: 2px 8px;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(245, 63, 63, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .manage-question-view {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .header-stats {
    width: 100%;
    justify-content: space-between;
    gap: 16px;
  }
  
  .stat-item {
    flex: 1;
    min-width: auto;
    padding: 12px 16px;
  }
  
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input,
  .tags-input {
    width: 100%;
  }
  
  .search-actions {
    display: flex;
    justify-content: space-between;
  }
}
</style>
