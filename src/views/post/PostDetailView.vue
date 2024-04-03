
<template>
  <div id="postDetailView">
    <a-row gutter="24">
      <a-col :span="6">
        <div>
          <a-card title="用户基本信息" hoverable :style="{ width: '100%' }">
            <div style="text-align: center">
              <a-avatar :size="90" shape="circle">
                <img alt="头像" :src="userAvatarImg" />
              </a-avatar>
            </div>

            <a-descriptions
                style="margin-top: 20px"
                :data="userData"
                size="large"
                column="1"
                bordered
            >
            </a-descriptions>

          </a-card>
        </div>
      </a-col>

      <a-col :span="18">
        <h1> {{ postDetail?.title }}</h1>
        <MdViewerV3 :modelValue="postDetail?.content"/>

        <a-divider orientation="left" size="large">评论区</a-divider>

        <a-comment
            v-for="comment in commentList"
            :key="comment.id"
            :author="comment.userName"
            :avatar="comment.userAvatar"
            :content="comment.content"
            :datetime="moment(comment.createTime).format('YYYY-MM-DD HH:mm:ss')"
        >
        </a-comment>
        <a-comment
            align="right"
        >
          <template #actions>
            <a-button key="0" type="secondary"> Cancel </a-button>
            <a-button key="1" type="primary"> Reply </a-button>
          </template>
          <template #content>
            <a-input placeholder="Here is you content." />
          </template>
        </a-comment>
      </a-col>
    </a-row>
  </div>

</template>


<script setup lang="ts">

import MdViewerV3 from "@/components/MdViewerV3.vue";
import {computed, defineProps, onMounted, ref} from "vue";
import { PostCommentVO, PostVO, QuestionCommentVO, Service} from "../../../generated";
import moment from "moment";
import {Message} from "@arco-design/web-vue";

const postDetail = ref<PostVO>();
const commentList = ref<PostCommentVO[]>([]);

const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
});

onMounted(async () => {
  const res = await Service.getPostVoByIdUsingGet(props.postId);
  if (res.code === 200) {
    postDetail.value = res.data;
  } else {
    Message.error("获取详情失败");
    return;
  }
  const commentRes = await Service.getCommentUsingGet(props.postId);
  if (commentRes.code === 200) {
    commentList.value = commentRes.data || [];
  } else {
    Message.error("获取评论失败");
  }
});

const userData = computed(() => {
  if (!postDetail.value?.user) {
    return [];
  }
  return [
    {
      label: "用户名称",
      value: postDetail.value.user.userName,
    },
    {
      label: "用户角色",
      value: postDetail.value.user.userRole === "admin" ? "管理员" : "普通用户",
    },
    {
      label: "用户简介",
      value: postDetail.value.user.userProfile || "暂无简介",
    },
    {
      label: "创建时间",
      value: moment(postDetail.value.user.createTime).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];
});

const userAvatarImg = computed(() => postDetail.value?.user?.userAvatar);



</script>

<style scoped>

</style>
