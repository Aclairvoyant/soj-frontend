<template>
  <div class="question-submit-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <a-typography-title :heading="2" class="page-title">
            <icon-history class="title-icon" />
            提交记录
          </a-typography-title>
          <a-typography-text class="subtitle">查看和管理你的题目提交历史</a-typography-text>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ total }}</div>
            <div class="stat-label">总提交数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ acceptedCount }}</div>
            <div class="stat-label">通过数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ successRate }}%</div>
            <div class="stat-label">通过率</div>
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
          <a-form-item field="language" label="编程语言" class="search-item">
            <a-select
              v-model="searchParams.language"
              placeholder="选择编程语言"
              size="large"
              class="language-select"
              allow-clear
            >
              <a-option value="java">Java</a-option>
              <a-option value="c">C</a-option>
              <a-option value="cpp">C++</a-option>
              <a-option value="go">Go</a-option>
              <a-option value="python">Python</a-option>
            </a-select>
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

    <!-- 提交记录表格 -->
    <div class="table-section">
      <a-card class="table-card" :bordered="false">
        <template #title>
          <div class="card-title">
            <icon-list class="card-icon" />
            <span>提交记录</span>
            <a-tag color="blue" class="count-tag">{{ dataList.length }} 条记录</a-tag>
          </div>
        </template>
        
        <a-table
          :ref="tableRef"
          :columns="columns"
          :data="dataList"
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
          class="submit-table"
          :row-class="getRowClass"
          :loading="loading"
        >
          <!-- 提交号 -->
          <template #id="{ record }">
            <div class="submit-id">
              <span class="id-number">#{{ record.id }}</span>
            </div>
          </template>

          <!-- 编程语言 -->
          <template #language="{ record }">
            <div class="language-info">
              <a-tag :color="getLanguageColor(record.language)" class="language-tag">
                {{ record.language }}
              </a-tag>
            </div>
          </template>

          <!-- 判题信息 -->
          <template #judgeInfo="{ record }">
            <a-tag 
              :color="getMessageStyleColor(record.judgeInfo.message)"
              class="judge-tag"
            >
              {{ getJudgeMessage(record.judgeInfo.message) }}
            </a-tag>
          </template>

          <!-- 判题状态 -->
          <template #status="{ record }">
            <div class="status-info">
              <a-tag 
                v-if="record.status === 1" 
                loading
                class="status-tag loading"
              >
                判题中
              </a-tag>
              <a-tag
                v-else
                :color="record.status === 2 ? '#00b42a' : '#f53f3f'"
                class="status-tag"
              >
                {{ record.status === 2 ? "判题成功" : "判题失败" }}
              </a-tag>
            </div>
          </template>

          <!-- 题目名称 -->
          <template #questionTitle="{ record }">
            <a
              @click="toQuestionPage(record.questionVO)"
              class="question-link"
            >
              {{ record.questionVO.title }}
            </a>
          </template>

          <!-- 提交者 -->
          <template #user="{ record }">
            <div class="user-info">
              <a-avatar :size="24" class="user-avatar">
                <icon-user />
              </a-avatar>
              <span class="user-name">{{ record.userId }}</span>
            </div>
          </template>

          <!-- 提交时间 -->
          <template #createTime="{ record }">
            <div class="create-time">
              {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
            </div>
          </template>
        </a-table>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref, watchEffect, computed} from "vue";

import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import {
  Question, Service
} from "../../../generated";

const tableRef = ref();

const dataList = ref<any[]>([]);
const total = ref(0);
const refreshInterval = 10000; // 10秒
let intervalId: number;

const searchParams = ref({
  title: "",
  language: "",
  pageSize: 20 ,
  current: 1,
});

type Style = {
  text: string;
  color: string;
};

const messageList: { [key: string]: Style } = {
  // 执行结果
  "Accepted": {text: "成功", color: "#4CAF50"}, // 绿色
  "Wrong Answer": {text: "答案错误", color: "#f44336"}, // 红色
  "Runtime Error": {text: "运行时错误", color: "#FF9800"}, // 橙色
  "Time Limit Exceeded": {text: "超时", color: "#3F51B5"}, // 深蓝色
  "Memory Limit Exceeded": {text: "超内存", color: "#9C27B0"}, // 紫色
  "Output Limit Exceeded": {text: "输出超限", color: "#00BCD4"}, // 青色
  "Compile Error": {text: "编译错误", color: "#E91E63"}, // 粉红色
  "System Error": {text: "系统错误", color: "#9E9E9E"}, // 灰色
  "Unknown Error": {text: "未知错误", color: "#607D8B"}, // 蓝灰色
  "Pending": {text: "等待中", color: "#FFEB3B"}, // 黄色
  "Dangerous Operation": {text: "危险操作", color: "#673AB7"} // 深紫色
}

const getMessageStyleColor = (message: string): string => {
  // 检查 message 是否存在于 messageList 中
  if (message in messageList) {
    return messageList[message].color;
  } else {
    return "#9E9E9E";
  }
};

const loading = ref(false);

const loadData = async () => {
  loading.value = true;
  try {
    const res = await Service.listQuestionSubmitByPageUsingPost(
      {
        ...searchParams.value,
        sortField: "createTime",
        sortOrder: "descend",
      }
    );
    if (res.code === 200) {
      dataList.value = res.data.records;
      total.value = res.data.total;
      console.log(dataList.value)
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

onMounted(() => {
  loadData(); // 首次挂载时加载数据

  // 设置定时器，定期刷新数据
  intervalId = setInterval(() => {
    loadData();
  }, refreshInterval) as unknown as number;
});

onUnmounted(() => {
  // 组件销毁时清除定时器
  clearInterval(intervalId);
});



const columns = [
  {
    title: "提交号",
    dataIndex: "id",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "判题状态",
    slotName: "status",
  },
  {
    title: "题目名称",
    slotName: "questionTitle",
  },
  {
    title: "提交者",
    slotName: "user",
  },
  {
    title: "提交时间",
    slotName: "createTime",
  },
];

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

const router = useRouter();

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

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

// 计算通过的提交数
const acceptedCount = computed(() => {
  return dataList.value.filter(item => 
    item.judgeInfo?.message === 'Accepted'
  ).length;
});

// 计算通过率
const successRate = computed(() => {
  if (total.value === 0) return 0;
  return Math.round((acceptedCount.value / total.value) * 100);
});

// 获取编程语言颜色
const getLanguageColor = (language: string): string => {
  const languageColors: { [key: string]: string } = {
    'java': '#b07219',
    'c': '#555555',
    'cpp': '#f34b7d',
    'go': '#00add8',
    'python': '#3572a5'
  };
  return languageColors[language] || '#9E9E9E';
};

// 获取判题消息的中文显示
const getJudgeMessage = (message: string): string => {
  const messageMap: { [key: string]: string } = {
    'Accepted': '通过',
    'Wrong Answer': '答案错误',
    'Runtime Error': '运行时错误',
    'Time Limit Exceeded': '超时',
    'Memory Limit Exceeded': '超内存',
    'Output Limit Exceeded': '输出超限',
    'Compile Error': '编译错误',
    'System Error': '系统错误',
    'Unknown Error': '未知错误',
    'Pending': '等待中',
    'Dangerous Operation': '危险操作'
  };
  return messageMap[message] || message;
};

// 获取行样式类
const getRowClass = (record: any) => {
  if (record.judgeInfo?.message === 'Accepted') {
    return 'success-row';
  }
  return '';
};

const resetSearch = () => {
  searchParams.value = {
    title: '',
    language: '',
    pageSize: 20,
    current: 1,
  };
};
</script>

<style scoped>
.question-submit-view {
  width: 100%;
  margin: 0;
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  box-sizing: border-box;
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

.language-select {
  width: 160px;
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

.submit-table {
  border-radius: 8px;
  overflow: hidden;
}

.submit-table :deep(.arco-table-th) {
  background: #f7f8fa;
  font-weight: 600;
  color: #1d2129;
  border-bottom: 1px solid #e5e6eb;
}

.submit-table :deep(.arco-table-td) {
  border-bottom: 1px solid #f2f3f5;
  padding: 16px 12px;
}

.submit-table :deep(.arco-table-tr:hover) {
  background: #f0f9ff;
}

.success-row {
  background: rgba(0, 180, 42, 0.05) !important;
}

.submit-id {
  display: flex;
  align-items: center;
}

.id-number {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-weight: 600;
  color: #165dff;
  font-size: 14px;
}

.language-info {
  display: flex;
  align-items: center;
}

.language-tag {
  font-weight: 500;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
}

.judge-tag {
  font-weight: 500;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
}

.status-info {
  display: flex;
  align-items: center;
}

.status-tag {
  font-weight: 500;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
}

.status-tag.loading {
  background: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.question-link {
  color: #165dff;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.question-link:hover {
  color: #4080ff;
  text-decoration: underline;
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

.create-time {
  font-size: 14px;
  color: #1d2129;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .question-submit-view {
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
  .language-select {
    width: 100%;
  }
  
  .search-actions {
    display: flex;
    justify-content: space-between;
  }
}
</style>
