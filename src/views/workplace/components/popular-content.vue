<template>
  <a-card class="recent-submissions-card" :bordered="false">
    <template #title>
      <div class="card-title">
        <icon-history class="card-icon" />
        <span>最近提交</span>
      </div>
    </template>
    <template #extra>
      <router-link to="/question_submit">
        <a-button type="text" size="small" class="view-more-btn">
          <template #icon>
            <icon-right />
          </template>
          查看更多
        </a-button>
      </router-link>
    </template>
    
    <div class="table-container">
      <a-table
        :data="renderList"
        :pagination="false"
        :bordered="false"
        :scroll="{ x: '100%', y: '300px' }"
        class="submissions-table"
        :loading="loading"
      >
        <template #columns>
          <a-table-column
            title="题目名称"
            data-index="questionVO.title"
            class="title-column"
          >
            <template #cell="{ record }">
              <div class="question-title">
                <icon-file class="question-icon" />
                <span class="title-text">{{ record.questionVO?.title }}</span>
              </div>
            </template>
          </a-table-column>
          
          <a-table-column title="标签" data-index="tags" class="tags-column">
            <template #cell="{ record }">
              <div class="tags-container">
                <a-tag 
                  v-for="(tag, index) of record.questionVO?.tags"
                  :key="index" 
                  :color="getTagStyleColor(tag)"
                  class="tag-item"
                >
                  {{ tag }}
                </a-tag>
              </div>
            </template>
          </a-table-column>
          
          <a-table-column title="判题结果" class="result-column">
            <template #cell="{ record }">
              <a-tag 
                :color="getMessageStyleColor(record.judgeInfo?.message)"
                class="result-tag"
              >
                <icon-check-circle v-if="record.judgeInfo?.message === 'Accepted'" class="result-icon" />
                <icon-close-circle v-else class="result-icon" />
                {{ record.judgeInfo?.message }}
              </a-tag>
            </template>
          </a-table-column>
          
          <a-table-column
            title="提交日期"
            data-index="createTime"
            class="date-column"
          >
            <template #cell="{ record }">
              <div class="submit-date">
                <icon-calendar class="date-icon" />
                <span class="date-text">
                  {{ moment(record.createTime).format("MM-DD HH:mm") }}
                </span>
              </div>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
    
    <!-- 空状态 -->
    <div v-if="!loading && (!renderList || renderList.length === 0)" class="empty-state">
      <icon-file-exclamation class="empty-icon" />
      <div class="empty-text">暂无提交记录</div>
      <a-button type="primary" size="small" class="empty-btn">
        <template #icon>
          <icon-plus />
        </template>
        开始刷题
      </a-button>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import useLoading from "@/hooks/loading";
import type {TableData} from "@arco-design/web-vue/es/table/interface";
import moment from "moment";
import store from "@/store";
import {
  QuestionSubmitQueryRequest, Service,
} from "../../../../generated";
import message from "@arco-design/web-vue/es/message";

const type = ref("text");
const {loading, setLoading} = useLoading();
const renderList = ref<TableData[]>();
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});

type Style = {
  text: string;
  color: string;
};

const tagsObjList: { [key: string]: Style } = {
  default: {text: "default", color: "#168cff"},
  简单: {text: "简单", color: "#0fc6c2"},
  中等: {text: "中等", color: "#ffb400"},
  困难: {text: "困难", color: "#f53f3f"},
};

const messageList: { [key: string]: Style } = {
  "Accepted": {text: "成功", color: "#52c41a"},
  "Wrong Answer": {text: "答案错误", color: "#ff4d4f"},
  "Runtime Error": {text: "运行时错误", color: "#fa8c16"},
  "Time Limit Exceeded": {text: "超时", color: "#722ed1"},
  "Memory Limit Exceeded": {text: "超内存", color: "#eb2f96"},
  "Output Limit Exceeded": {text: "输出超限", color: "#13c2c2"},
  "Compile Error": {text: "编译错误", color: "#f5222d"},
  "System Error": {text: "系统错误", color: "#8c8c8c"},
  "Unknown Error": {text: "未知错误", color: "#595959"},
  "Pending": {text: "等待中", color: "#faad14"},
  "Dangerous Operation": {text: "危险操作", color: "#531dab"}
}

const getMessageStyleColor = (message: string): string => {
  if (message in messageList) {
    return messageList[message].color;
  } else {
    return "#8c8c8c";
  }
};

const getTagStyleColor = (tag: string): string => {
  if (tag === "" || tag === undefined || tagsObjList[tag] === undefined) {
    return tagsObjList["default"].color;
  }
  return tagsObjList[tag].color;
};

const fetchData = async () => {
  try {
    setLoading(true);
    const res = await Service.listQuestionSubmitByPageUsingPost(
        {
          ...searchParams.value,
          userId: store.state.user?.loginUser?.id,
          sortField: "createTime",
          sortOrder: "descend",
        }
    );
    renderList.value = res.data.records;
  } catch (err) {
    message.error("获取提交记录失败");
  } finally {
    setLoading(false);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.recent-submissions-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  overflow: hidden;
  min-height: 400px;
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
  font-size: 18px;
}

.view-more-btn {
  color: #165dff;
  font-weight: 500;
  transition: all 0.3s ease;
}

.view-more-btn:hover {
  background: #f0f9ff;
  border-radius: 6px;
}

.table-container {
  margin-top: 16px;
}

.submissions-table {
  border-radius: 8px;
  overflow: hidden;
}

.submissions-table :deep(.arco-table-th) {
  background: #f7f8fa;
  font-weight: 600;
  color: #1d2129;
  border-bottom: 1px solid #e5e6eb;
  padding: 12px 16px;
}

.submissions-table :deep(.arco-table-td) {
  border-bottom: 1px solid #f2f3f5;
  padding: 12px 16px;
}

.submissions-table :deep(.arco-table-tr:hover) {
  background: #f0f9ff;
}

.question-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-icon {
  color: #165dff;
  font-size: 14px;
}

.title-text {
  color: #1d2129;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tag-item {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.result-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
}

.result-icon {
  font-size: 12px;
}

.submit-date {
  display: flex;
  align-items: center;
  gap: 6px;
}

.date-icon {
  color: #86909c;
  font-size: 12px;
}

.date-text {
  color: #4e5969;
  font-size: 12px;
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.empty-text {
  color: #86909c;
  font-size: 14px;
  margin-bottom: 16px;
}

.empty-btn {
  border-radius: 6px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title-text {
    max-width: 100px;
  }
  
  .tags-container {
    gap: 2px;
  }
  
  .tag-item {
    font-size: 10px;
    padding: 1px 4px;
  }
  
  .result-tag {
    padding: 2px 6px;
    font-size: 11px;
  }
  
  .date-text {
    font-size: 11px;
  }
}
</style>
