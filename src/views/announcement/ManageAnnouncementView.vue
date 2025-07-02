<template>
  <div id="manageAnnouncementView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="标题" style="min-width: 240px">
        <a-input v-model="searchParams.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="content" label="内容" style="min-width: 240px">
        <a-input v-model="searchParams.content" placeholder="请输入内容" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :scroll="{ y: 800 }"
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
    >
      <template #status="{ record }">
        <a-tag
          :key="record.status"
        >
          {{ record.status === 0 ? "已展示" : "已隐藏" }}
        </a-tag>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #updateTime="{ record }">
        {{ moment(record.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="doUpdate(record)"> 修改</a-button>
          <a-popconfirm
            content="确定要删除此公告吗?"
            type="error"
            okText="是"
            cancelText="否"
            @ok="doDelete(record)"
          >
            <a-button type="primary" status="danger">删除</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";

import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import {Announcement, Service} from "../../../generated";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);

const searchParams = ref({
  title: "",
  content: "",
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res =
    await Service.listAnnouncementVoByPageUsingPost(
      searchParams.value
    );
  if (res.code === 200) {
    console.log(res.data);
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
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};

const columns = [
  {
    title: "标题",
    dataIndex: "title",
    width: 100,
    ellipsis: true, //显示省略号
    tooltip: true, //在显示省略号时使用文本提示
  },
  {
    title: "内容",
    dataIndex: "content",
    width: 100,
    ellipsis: true, //显示省略号
    tooltip: true, //在显示省略号时使用文本提示
  },
  {
    title: "状态",
    slotName: "status",
    width: 70,
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

const doDelete = async (announcement: Announcement) => {
  const res = await Service.deleteAnnouncementUsingPost({
    id: announcement.id,
  });
  if (res.code === 200) {
    message.success("删除成功");
    await loadData();
  } else {
    message.error("删除失败");
  }
};

const router = useRouter();

const doUpdate = (announcement: Announcement) => {
  router.push({
    path: "/update/announcement",
    query: {
      id: announcement.id,
    },
  });
};
</script>

<style>
#manageAnnouncementView {
  max-width: 100%;
  margin: 0;
  padding: 24px;
  box-sizing: border-box;
}
</style>
