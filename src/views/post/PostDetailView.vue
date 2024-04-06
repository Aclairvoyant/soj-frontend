<template>
  <div id="postDetailView">
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
        <MdEditorV3 v-model="commentContent" />
        <a-button key="1" type="primary" @click="submitComment"> 发布评论 </a-button>
        <a-divider orientation="left" size="large"></a-divider>
        <div>
          <PostCommentItem
              v-for="comment in processedComments"
              :key="comment.id"
              :comment="comment"
          >
            <template v-slot:default>
              <div v-if="comment.children && comment.children.length > 0" class="nested-comments">
                <PostCommentItem
                    v-for="childComment in comment.children"
                    :key="childComment.id"
                    :comment="childComment"
                />
              </div>
            </template>
          </PostCommentItem>
        </div>

      </a-col>
    </a-row>
  </div>

</template>


<script setup lang="ts">

import MdViewerV3 from "@/components/MdViewerV3.vue";
import {computed, defineProps, onMounted, ref} from "vue";
import {PostCommentVO, PostVO, Service} from "../../../generated";
import moment from "moment";
import {Message} from "@arco-design/web-vue";
import PostCommentItem from "@/components/PostCommentItem.vue";
import MdEditorV3 from "@/components/MdEditorV3.vue";

const postDetail = ref<PostVO>();
const commentList = ref<PostComment[]>([]);

const commentContent = ref('');
// 定义 PostComment 接口
interface PostComment {
  content?: string;
  createTime?: string;
  id?: number;
  parentId?: number | null; // 注意 parentId 可能为 null
  postId?: number;
  updateTime?: string;
  userAvatar?: string;
  userName?: string;
};


interface Props {
  postId: number;
}

const props = defineProps<Props>();

interface PostCommentWithChildren extends PostComment {
  children: PostCommentWithChildren[];
}


const processedComments = computed((): PostCommentWithChildren[] => {
  const commentsMap = new Map<number, PostCommentWithChildren>();
  commentList.value?.forEach((comment) => {
    commentsMap.set(comment.id!, {...comment, children: []});
  });
  // console.log(commentsMap)
  const rootComments: PostCommentWithChildren[] = [];
  commentList.value?.forEach((comment) => {
    if (comment.parentId) {
      const parent = commentsMap.get(comment.parentId);
      if (parent) {
        parent.children.push(commentsMap.get(comment.id!)!);
      }
    } else {
      rootComments.push(commentsMap.get(comment.id!)!);
    }
  });
  console.log("root", rootComments)
  return rootComments;
});


const submitComment = async () => {
  const res = await Service.addCommentUsingPost({
    content: commentContent.value,
    postId: props.postId,
  });
  if (res.code === 200) {
    Message.success('评论成功');
    commentContent.value = '';
    const commentRes = await Service.getCommentUsingGet(props.postId);
    if (commentRes.code === 200) {
      commentList.value = commentRes.data || [];
    } else {
      Message.error("获取评论失败");
    }
  } else {
    Message.error('评论失败');
  }
};


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
    console.log(commentList.value);
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
#postDetailView {
  max-width: 1680px;
  margin: 0 auto;
}
</style>
