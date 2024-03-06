<template>
  <div id="questionsView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="标题" style="min-width: 240px">
        <a-input v-model="searchParams.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 240px">
        <a-input-tag v-model="searchParams.tags" placeholder="请输入标签" />
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
      }"
        @page-change="onPageChange"
    >
      <!-- 标签 -->
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag
              v-for="(tag, index) of record.tags"
              :key="index"
              size="large"
              :color="getTagStyleColor(tag)"
          >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <!-- 通过率 -->
<!--      <template #acceptedRate="{ record }">-->
<!--        {{-->
<!--          `${-->
<!--              record.submitNum > 0-->
<!--                  ? ((record.acceptedNum / record.submitNum) * 100).toFixed(2)-->
<!--                  : "0"-->
<!--          }% (${record.acceptedNum}/${record.submitNum})`-->
<!--        }}-->
<!--      </template>-->
      <template #acceptedRate="{ record }">
        <a-statistic
            :value="
            (record.submitNum ? record.acceptedNum / record.submitNum : 0) * 100
          "
            :precision="2"
            :value-style="{ color: '#0fbf60' }"
        >
          <template #suffix>%</template>
        </a-statistic>
        {{ `(${record.acceptedNum}/${record.submitNum})` }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="toQuestionPage(record)">
            去做题
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import message from "@arco-design/web-vue/es/message";
import * as querystring from "querystring";
import { useRouter } from "vue-router";
import moment from "moment";
import {Question, QuestionControllerService} from "../../../generated";

const tableRef = ref();

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
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(searchParams.value);
  if (res.code === 200) {
    dataList.value = res.data?.records ?? [];
    total.value = res.data?.total ?? 0;
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
</script>

<style>
#questionsView {
  max-width: 1440px;
  margin: 0 auto;
}

#questionsView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0px !important;
}
</style>
