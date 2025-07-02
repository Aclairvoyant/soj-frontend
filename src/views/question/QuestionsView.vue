<template>
  <div class="questions-view">
    <!-- 页面头部 -->
    <!-- <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <a-typography-title :heading="2" class="page-title">
            <icon-code class="title-icon" />
            题目列表
          </a-typography-title>
          <a-typography-text class="subtitle">探索和挑战各种编程题目</a-typography-text>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ total }}</div>
            <div class="stat-label">总题目数</div>
          </div>
        </div>
      </div>
    </div> -->

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
          <a-form-item field="tags" label="标签筛选" class="search-item">
            <a-input-tag 
              v-model="searchParams.tags" 
              placeholder="请输入标签" 
              size="large"
              class="tag-input"
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

    <!-- 题目列表 -->
    <div class="table-section">
      <a-card class="table-card" :bordered="false">
        <template #title>
          <div class="card-title">
            <icon-list class="card-icon" />
            <span>题目列表</span>
            <a-tag color="blue" class="count-tag">{{ dataList.length }} 题</a-tag>
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
          class="questions-table"
          :row-class="getRowClass"
          :loading="loading"
        >
          <!-- 题号 -->
          <template #id="{ record }">
            <div class="question-id">
              <span class="id-number">#{{ record.id }}</span>
            </div>
          </template>

          <!-- 题目名称 -->
          <template #title="{ record }">
            <div class="question-title">
              <span class="title-text">{{ record.title }}</span>
            </div>
          </template>

          <!-- 标签 -->
          <template #tags="{ record }">
            <a-space wrap class="tags-container">
              <a-tag
                v-for="(tag, index) of record.tags"
                :key="index"
                size="medium"
                :color="getTagStyleColor(tag)"
                class="difficulty-tag"
              >
                {{ tag }}
              </a-tag>
            </a-space>
          </template>

          <!-- 通过率 -->
          <template #acceptedRate="{ record }">
            <div class="acceptance-rate">
              <a-statistic
                :value="(record.submitNum ? record.acceptedNum / record.submitNum : 0) * 100"
                :precision="1"
                :value-style="{ color: getAcceptanceColor(record) }"
                class="rate-statistic"
              >
                <template #suffix>%</template>
              </a-statistic>
              <div class="rate-detail">
                {{ `(${record.acceptedNum}/${record.submitNum})` }}
              </div>
            </div>
          </template>

          <!-- 创建时间 -->
          <template #createTime="{ record }">
            <div class="create-time">
              {{ moment(record.createTime).format("YYYY-MM-DD") }}
            </div>
          </template>

          <!-- 操作 -->
          <template #optional="{ record }">
            <a-space>
              <a-button 
                type="primary" 
                size="small"
                @click="toQuestionPage(record)"
                class="solve-btn"
              >
                <template #icon>
                  <icon-play-arrow />
                </template>
                去做题
              </a-button>
            </a-space>
          </template>
        </a-table>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import message from "@arco-design/web-vue/es/message";
import * as querystring from "querystring";
import { useRouter } from "vue-router";
import moment from "moment";
import {Question, Service} from "../../../generated";

const tableRef = ref();
const loading = ref(false);

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  title: "",
  tags: [],
  pageSize: 10,
  current: 1,
});

type TagStyle = {
  text: string;
  color: string;
};

const tagsObjList: { [key: string]: TagStyle } = {
  default: { text: "default", color: "#168cff" },
  简单: { text: "简单", color: "#0fc6c2" },
  中等: { text: "中等", color: "#ffb400" },
  困难: { text: "困难", color: "#f53f3f" },
};

const getTagStyleColor = (tag: string): string => {
  if (tag === "" || tag === undefined || tagsObjList[tag] === undefined) {
    return tagsObjList["default"].color;
  }
  return tagsObjList[tag].color;
};


const loadData = async () => {
  loading.value = true;
  try {
    const res = await Service.listQuestionVoByPageUsingPost(searchParams.value);
    if (res.code === 200) {
      dataList.value = res.data?.records ?? [];
      total.value = res.data?.total ?? 0;
    } else {
      message.error("加载失败，" + res.message);
    }
  } catch (error) {
    message.error("加载失败");
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
onMounted(() => {
  loadData();
});

// {id: "1", title: "A+ D", content: "新的题目内容", tags: "["二叉树"]", answer: "新的答案", submitNum: 0,…}

const columns = [
  {
    title: "题号",
    dataIndex: "id",
    align: "left",
  },
  {
    title: "题目名称",
    dataIndex: "title",
    align: "left",
  },
  {
    title: "标签",
    slotName: "tags",
    align: "left",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
    align: "left",
  },
  {
    title: "创建时间",
    slotName: "createTime",
    align: "left",
  },
  {
    slotName: "optional",
    align: "left",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
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

const getRowClass = (record: Question) => {
  return 'table-row';
};

const getAcceptanceColor = (record: Question) => {
  const rate = record.submitNum ? ((record.acceptedNum || 0) / record.submitNum) * 100 : 0;
  if (rate >= 80) return '#00b42a';
  if (rate >= 60) return '#ff7d00';
  if (rate >= 40) return '#ffb400';
  return '#f53f3f';
};

const resetSearch = () => {
  searchParams.value = {
    title: "",
    tags: [],
    pageSize: 10,
    current: 1,
  };
};
</script>

<style scoped>
.questions-view {
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
  gap: 24px;
}

.stat-item {
  text-align: center;
  padding: 16px 24px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  border: 1px solid rgba(22, 93, 255, 0.1);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #165dff;
  line-height: 1;
}

.stat-label {
  margin-top: 4px;
  color: #86909c;
  font-size: 12px;
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
  flex: 1;
  min-width: 200px;
}

.search-input {
  border-radius: 8px;
}

.tag-input {
  border-radius: 8px;
}

.search-actions {
  margin-bottom: 0;
}

.search-btn {
  background: linear-gradient(135deg, #165dff 0%, #4080ff 100%);
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
}

.reset-btn {
  border-radius: 8px;
  padding: 8px 20px;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.questions-table {
  border-radius: 0;
}

.table-row {
  transition: all 0.3s ease;
}

.table-row:hover {
  background: #f7f8fa !important;
}

.question-id {
  display: flex;
  align-items: center;
}

.id-number {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-weight: 600;
  color: #165dff;
  background: rgba(22, 93, 255, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.question-title {
  display: flex;
  align-items: center;
}

.title-text {
  font-weight: 500;
  color: #1d2129;
  transition: color 0.3s ease;
}

.table-row:hover .title-text {
  color: #165dff;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.difficulty-tag {
  border-radius: 6px;
  font-weight: 500;
  font-size: 12px;
}

.acceptance-rate {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.rate-statistic {
  font-weight: 600;
}

.rate-detail {
  font-size: 12px;
  color: #86909c;
}

.create-time {
  color: #86909c;
  font-size: 14px;
}

.solve-btn {
  background: linear-gradient(135deg, #00b42a 0%, #23c343 100%);
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.solve-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 180, 42, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .questions-view {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-item {
    min-width: auto;
  }
  
  .search-actions {
    display: flex;
    justify-content: center;
  }
}
</style>
