<template>
  <div id="addAnnouncementView">
    <h2>{{ updatePage ? "修改公告" : "发布公告" }}</h2>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="标题">
        <a-input
          v-model="form.title"
          @update:modelValue="onFieldUpdate"
          placeholder="请输入标题"
        />
      </a-form-item>

      <a-form-item field="content" label="公告内容">
        <MdEditorV3 v-model="form.content" :handle-change="onContentChange" />
      </a-form-item>

      <a-form-item field="status" label="公告显示状态">
        <a-radio-group v-model="form.status">
          <a-radio value="0">展示</a-radio>
          <a-radio value="1">隐藏</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-space size="large">
        <a-form-item>
          <a-button status="danger" style="min-width: 200px; margin-left: 380px" @click="doCleanDraft"
          >清除草稿
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" style="min-width: 200px; margin-left: 50px" @click="doSubmit"
          >发布
          </a-button>
        </a-form-item>
      </a-space>

    </a-form>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import message from "@arco-design/web-vue/es/message";
import {useRoute} from "vue-router";
import {useRouter} from "vue-router";
import {AnnouncementControllerService} from "../../../generated";
import {watch} from "vue";
import {Modal} from "@arco-design/web-vue";
import MdEditorV3 from "@/components/MdEditorV3.vue";

const route = useRoute();
const router = useRouter();

// 如果页面地址包含 update，视为更新页面
const updatePage = route.path.includes("update");

let form = ref({
  title: "",
  content: "",
  status: 0,
});

watch(
    () => form.value,
    (newValue) => {
      if (!updatePage) { // 仅在“创建题目”状态下保存草稿
        localStorage.setItem("announcementFormDraft", JSON.stringify(newValue));
      }
    },
    {deep: true}
);


const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await AnnouncementControllerService.getAnnouncementVoByIdUsingGet(id as any);

  if (res.code === 200) {
    form.value = res.data as any;
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const onContentChange = (value: string) => {
  form.value.content = value;
};

const doSubmit = async () => {

  // 区分更新还是创建
  if (updatePage) {
    const res = await AnnouncementControllerService.updateAnnouncementUsingPost(
        form.value
    );
    if (res.code === 200) {
      message.success("更新成功");
      await router.push({
        path: "/manage/announcement",
      });
      // 清理草稿数据
      localStorage.removeItem('announcementFormDraft');
    } else {
      message.error("更新失败，" + res.message);
      localStorage.removeItem('announcementFormDraft');
    }
  } else {
    const res = await AnnouncementControllerService.addAnnouncementUsingPost(
        form.value
    );
    if (res.code === 200) {
      await router.push({
        path: "/manage/announcement",
      });
      message.success("发布成功");
      // 清理草稿数据
      localStorage.removeItem('announcementFormDraft');
    } else {
      message.error("发布失败，" + res.message);
    }
  }
};

// 保存草稿
const saveDraft = () => {
  localStorage.setItem("announcementFormDraft", JSON.stringify(form.value));
}

// 某个表单字段更新时调用
const onFieldUpdate = () => {
  saveDraft();
}

// 页面加载或组件挂载时尝试恢复草稿
const loadDraft = () => {
  const draft = localStorage.getItem("announcementFormDraft");
  if (draft) {
    form.value = JSON.parse(draft);
  }
}

// 在Vue组件的mounted生命周期钩子中调用loadDraft
onMounted(() => {
  loadDraft();
});

/**
 * 清除草稿
 */
const doCleanDraft = () => {
  Modal.confirm({
    title: "确认",
    content: "确定要删除保存的草稿吗？",
    onOk() {
      // 确认删除逻辑
      localStorage.removeItem("announcementFormDraft");
      form.value = {
        title: "",
        content: "",
        status: 0,
      };
    },
  });
};

</script>

<style scoped>
#addAnnouncementView {
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 24px;
}

.a-form-item {
  margin-bottom: 16px;
}

.a-button {
  width: 100%;
}

.a-space > .a-form-item {
  margin-bottom: 0;
}

.a-space {
  width: 100%;
}

/* 最后的提交按钮特别样式 */
.a-form-item:last-child .a-button {
  min-width: 200px; /* 确保按钮有足够的点击区域 */
  margin: auto; /* 按钮居中显示 */
  display: block; /* 使margin:auto生效 */
}
</style>
