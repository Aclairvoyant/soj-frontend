<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="标题" style="min-width: 240px">
        <a-input v-model="searchParams.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 240px">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '320px' }"
          placeholder="选择编程语言"
        >
          <a-option>java</a-option>
          <a-option>c</a-option>
          <a-option>cpp</a-option>
          <a-option>go</a-option>
          <a-option>python</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
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
    >
      <template #questionTitle="{ record }">
        <a
            @click="toQuestionPage(record.questionVO)"
            style="cursor: pointer;">
          {{ record.questionVO.title }}
        </a>
      </template>

      <template #judgeInfo="{ record }">
        <a-tag :color="getMessageStyleColor(record.judgeInfo.message)">
          {{ record.judgeInfo.message }}
        </a-tag>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #status="{ record }">
        <a-tag v-if="record.status === 1" loading>判题中</a-tag>
        <a-tag
          v-if="record.status !== 1"
          :color="record.status === 2 ? '#00b42a' : '#f53f3f'"
          >{{ record.status === 2 ? "判题成功" : "判题失败" }}
        </a-tag>
      </template>
      <template #user="{ record }">
        {{ record.userVO.userName }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref, watchEffect} from "vue";

import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import {
  Question, QuestionControllerService, Service
} from "../../../generated";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const refreshInterval = 3000; // 3秒
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

const loadData = async () => {
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
  } else {
    message.error("加载失败，" + res.message);
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
</script>

<style scoped>
#questionSubmitView {
  max-width: 1440px;
  margin: 0 auto;
}
</style>
