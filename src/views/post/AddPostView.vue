<template>
  <div id="addPostView">
    <a-row gutter="24">
      <a-col :span="6">
        <div>
          <a-card title="用户基本信息" hoverable :style="{ width: '100%' }">
            <div style="text-align: center">
              <a-avatar :size="90" shape="circle">
                <img alt="头像" :src="userAvatarImg"/>
              </a-avatar>
            </div>

            <a-descriptions
                style="margin-top: 20px"
                :data="data"
                size="large"
                column="1"
                bordered
            >
            </a-descriptions>

          </a-card>
        </div>
      </a-col>

      <a-col :span="18">
        <a-form @update:modelValue="onFieldUpdate">
          <a-input v-model="postContent.title" @update:modelValue="onFieldUpdate" placeholder="请输入标题"/>

          <MdEditorV3 v-model="postContent.content" @update:modelValue="onFieldUpdate"/>

          <a-button key="1" type="primary" @click="submitPost"> 发布帖子</a-button>
        </a-form>

      </a-col>
    </a-row>
  </div>

</template>


<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import moment from "moment/moment";
import {useStore} from "vuex";
import {LoginUserVO, Post, Service} from "../../../generated";
import {DescData, Message} from "@arco-design/web-vue";
import MdEditorV3 from "@/components/MdEditorV3.vue";

const store = useStore();
const loginUser: LoginUserVO = computed(
    () => store.state.user?.loginUser
) as LoginUserVO;

const postContent = ref({
  title: "",
  content: "",
  tags: []
});

const data = [
  {
    label: "用户名称",
    value: store.state.user?.loginUser.userName,
  },
  {
    label: "用户角色",
    value: store.state.user?.loginUser.userRole,
  },
  {
    label: "用户简介",
    value:
        store.state.user?.loginUser.userProfile &&
        store.state.user?.loginUser.userProfile !== ""
            ? store.state.user?.loginUser.userProfile
            : "暂无简介",
  },
  {
    label: "创建时间",
    value: moment(store.state.user?.loginUser.createTime).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    label: "上次修改时间",
    value: moment(store.state.user?.loginUser.updateTime).format("YYYY-MM-DD HH:mm:ss"),
  },
] as DescData[];

const userAvatarImg = store.state.user?.loginUser.userAvatar;

const submitPost = async () => {
  const res = await Service.addPostUsingPost(
      postContent.value
  );
  if (res.code === 200) {
    Message.success("发布成功");
  } else {
    Message.error("发布失败");
  }
};

// 保存草稿
const saveDraft = () => {
  localStorage.setItem("postContentFormDraft", JSON.stringify(postContent.value));
}

// 某个表单字段更新时调用
const onFieldUpdate = () => {
  saveDraft();
}

// 页面加载或组件挂载时尝试恢复草稿
const loadDraft = () => {
  const draft = localStorage.getItem("postContentFormDraft");
  if (draft) {
    postContent.value = JSON.parse(draft);
  }
}

// 在Vue组件的mounted生命周期钩子中调用loadDraft
onMounted(() => {
  loadDraft();
});
</script>

<style scoped>
#addPostView {
  max-width: 1680px;
  margin: 0 auto;
}
</style>
