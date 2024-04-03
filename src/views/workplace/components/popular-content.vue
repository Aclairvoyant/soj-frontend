<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
        class="general-card"
        :header-style="{ paddingBottom: '0' }"
        :body-style="{ padding: '17px 20px 21px 20px' }"
    >
      <template #title> 最近提交</template>
      <template #extra>
        <router-link to="/question_submit">
          <a-link>查看更多</a-link>
        </router-link>
      </template>
      <a-space direction="vertical" :size="10" fill>
        <a-table
            :data="renderList"
            :pagination="false"
            :bordered="false"
            :scroll="{ x: '100%', y: '300px' }"
        >
          <template #columns>
            <a-table-column
                title="题目名称"
                data-index="questionVO.title"
            ></a-table-column>
            <a-table-column title="标签" data-index="tags">
              <template #cell="{ record }">
                <a-typography-paragraph
                    :ellipsis="{
                    rows: 1,
                  }"
                >
                  <a-tag v-for="(tag, index) of record.questionVO.tags"
                         :key="index" bordered :color="getTagStyleColor(tag)">{{ tag }}
                  </a-tag>
                </a-typography-paragraph>
              </template>
            </a-table-column>
            <a-table-column title="判题结果">
              <template #cell="{ record }">
                <a-tag :color="getMessageStyleColor(record.judgeInfo.message)">
                  {{ record.judgeInfo.message }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column
                title="提交日期"
                data-index="createTime"
                :sortable="{
                sortDirections: ['ascend', 'descend'],
              }"
            >
              <template #cell="{ record }">
                <div class="increases-cell">
                  <span>{{
                      moment(record.createTime).format("YYYY-MM-DD")
                    }}</span>
                </div>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-space>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import useLoading from "@/hooks/loading";
import type {TableData} from "@arco-design/web-vue/es/table/interface";
import moment from "moment";

import store from "@/store";
import {
  QuestionControllerService,
  QuestionSubmitControllerService,
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
    // console.log(renderList.value)
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
onMounted(() => {
  fetchData();
  //console.log(store.state.user.loginUser);
});
// const typeChange = (contentType: string) => {
//   fetchData(contentType);
// };
// fetchData("text");
</script>

<style scoped lang="less">
.general-card {
  min-height: 395px;
}

:deep(.arco-table-tr) {
  height: 44px;

  .arco-typography {
    margin-bottom: 0;
  }
}

.increases-cell {
  display: flex;
  align-items: center;

  span {
    margin-right: 4px;
  }
}
</style>
