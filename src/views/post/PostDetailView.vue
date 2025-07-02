<template>
  <div class="post-detail-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <a-typography-title :heading="2" class="page-title">
            <icon-file class="title-icon" />
            {{ postDetail?.title || '帖子详情' }}
          </a-typography-title>
          <a-typography-text class="subtitle">查看帖子详细内容和用户讨论</a-typography-text>
        </div>
        <div class="post-meta">
          <div class="meta-item">
            <icon-user class="meta-icon" />
            <span class="meta-label">作者:</span>
            <span class="meta-value">{{ postDetail?.user?.userName }}</span>
          </div>
          <div class="meta-item">
            <icon-clock-circle class="meta-icon" />
            <span class="meta-label">发布时间:</span>
            <span class="meta-value">{{ moment(postDetail?.createTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <a-row :gutter="24">
        <!-- 用户信息侧边栏 -->
        <a-col :span="6">
          <div class="sidebar">
            <a-card class="user-card" :bordered="false">
              <template #title>
                <div class="card-title">
                  <icon-user class="card-icon" />
                  <span>作者信息</span>
                </div>
              </template>
              
              <div class="user-avatar-section">
                <a-avatar :size="80" shape="circle" class="user-avatar">
                  <img alt="头像" :src="userAvatarImg || '/default-avatar.png'"/>
                </a-avatar>
                <div class="user-name">{{ postDetail?.user?.userName }}</div>
                <div class="user-role">{{ postDetail?.user?.userRole === "admin" ? "管理员" : "普通用户" }}</div>
              </div>

              <a-descriptions
                :data="userData"
                size="large"
                column="1"
                :bordered="false"
                class="user-info"
              />
            </a-card>
          </div>
        </a-col>

        <!-- 帖子内容区域 -->
        <a-col :span="18">
          <div class="post-content">
            <!-- 帖子内容 -->
            <a-card class="content-card" :bordered="false">
              <template #title>
                <div class="card-title">
                  <icon-file class="card-icon" />
                  <span>帖子内容</span>
                </div>
              </template>

              <div class="post-body">
                <MdViewerV3 :modelValue="postDetail?.content || ''" />
              </div>
            </a-card>

            <!-- 评论区 -->
            <a-card class="comment-card" :bordered="false">
              <template #title>
                <div class="card-title">
                  <icon-message class="card-icon" />
                  <span>评论区</span>
                  <a-tag color="blue" class="comment-count">{{ processedComments.length }} 条评论</a-tag>
                </div>
              </template>

              <!-- 发表评论 -->
              <div class="comment-form">
                <div class="form-header">
                  <icon-edit class="form-icon" />
                  <span>发表评论</span>
                </div>
                <div class="editor-container">
                  <MdEditorV3 v-model="commentContent" class="comment-editor" />
                </div>
                <div class="form-actions">
                  <a-button type="primary" size="large" @click="submitComment" class="submit-btn" :loading="commentLoading">
                    <template #icon>
                      <icon-send />
                    </template>
                    发布评论
                  </a-button>
                </div>
              </div>

              <!-- 评论列表 -->
              <div class="comment-list">
                <div v-if="processedComments.length === 0" class="empty-comments">
                  <icon-message class="empty-icon" />
                  <span>暂无评论，快来发表第一条评论吧！</span>
                </div>
                <div v-else>
                  <PostCommentItem
                    v-for="comment in processedComments"
                    :key="comment.id"
                    :comment="comment"
                    class="comment-item"
                  >
                    <template v-slot:default>
                      <div v-if="comment.children && comment.children.length > 0" class="nested-comments">
                        <PostCommentItem
                          v-for="childComment in comment.children"
                          :key="childComment.id"
                          :comment="childComment"
                          class="nested-comment-item"
                        />
                      </div>
                    </template>
                  </PostCommentItem>
                </div>
              </div>
            </a-card>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>


<script setup lang="ts">

import MdViewerV3 from "@/components/MdViewerV3.vue";
import {computed, defineProps, onMounted, ref, nextTick} from "vue";
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

const commentLoading = ref(false);
const commentFormRef = ref();

const submitComment = async () => {
  if (!commentContent.value.trim()) {
    Message.warning('评论内容不能为空');
    return;
  }
  commentLoading.value = true;
  const res = await Service.addCommentUsingPost({
    content: commentContent.value,
    postId: props.postId,
  });
  if (res.code === 200) {
    Message.success('评论成功');
    commentContent.value = '';
    // 重新获取评论
    const commentRes = await Service.getCommentUsingGet(props.postId);
    if (commentRes.code === 200) {
      commentList.value = commentRes.data || [];
      // 自动滚动到评论区底部
      await nextTick();
      const commentListEl = document.querySelector('.comment-list');
      if (commentListEl) {
        commentListEl.scrollTop = commentListEl.scrollHeight;
      }
    } else {
      Message.error("获取评论失败");
    }
  } else {
    Message.error('评论失败');
  }
  commentLoading.value = false;
};

function formatRole(role: string | undefined): string {
  if (role === 'admin') return '管理员';
  if (role === 'user') return '普通用户';
  return role || '未知';
}

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
      value: formatRole(postDetail.value.user.userRole),
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
.post-detail-view {
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
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

.post-meta {
  display: flex;
  gap: 32px;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #86909c;
}

.meta-icon {
  color: #165dff;
  font-size: 16px;
}

.meta-label {
  font-weight: 500;
}

.meta-value {
  color: #1d2129;
  font-weight: 600;
}

.main-content {
  margin-bottom: 24px;
}

.sidebar {
  position: sticky;
  top: 24px;
}

.user-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
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
  font-size: 16px;
}

.user-avatar-section {
  text-align: center;
  padding: 24px 0;
  border-bottom: 1px solid #f2f3f5;
  margin-bottom: 20px;
}

.user-avatar {
  margin-bottom: 12px;
  border: 3px solid #f0f9ff;
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.1);
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 4px;
}

.user-role {
  font-size: 12px;
  color: #86909c;
  background: rgba(22, 93, 255, 0.1);
  color: #165dff;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}

.user-info {
  margin-top: 16px;
}

.user-info :deep(.arco-descriptions-item-label) {
  color: #86909c;
  font-size: 12px;
}

.user-info :deep(.arco-descriptions-item-value) {
  color: #1d2129;
  font-size: 13px;
}

.post-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  margin-bottom: 24px;
  flex: 1 0 auto;
  min-height: calc(100vh - 220px); /* 头部+间距+评论区预留 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.post-body {
  padding: 12px 0;
  flex: 1 1 auto;
}

.comment-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  margin-top: 0;
}

.comment-count {
  margin-left: auto;
  font-size: 12px;
}

.comment-form {
  background: #f7f8fa;
  border-radius: 12px;
  padding: 24px 16px 16px 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.04);
}

.form-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #165dff;
  margin-bottom: 12px;
}

.form-icon {
  font-size: 18px;
}

.editor-container {
  margin-bottom: 12px;
}

.comment-editor {
  border-radius: 8px;
  min-height: 120px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  background: linear-gradient(135deg, #165dff 0%, #4080ff 100%);
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.submit-btn[disabled], .submit-btn[aria-disabled="true"] {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
}

.comment-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px 0;
}

.empty-comments {
  text-align: center;
  color: #86909c;
  padding: 32px 0;
  font-size: 15px;
}

.empty-icon {
  font-size: 32px;
  color: #e5e6eb;
  margin-bottom: 8px;
}

.comment-item {
  margin-bottom: 16px;
  border-radius: 8px;
  background: #f7f8fa;
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.04);
  padding: 12px 16px;
  transition: box-shadow 0.2s;
}

.comment-item:hover {
  box-shadow: 0 4px 16px rgba(22, 93, 255, 0.08);
}

.nested-comments {
  margin-left: 32px;
  margin-top: 8px;
}

.nested-comment-item {
  background: #f0f9ff;
  border-radius: 8px;
  margin-bottom: 8px;
  padding: 10px 14px;
  box-shadow: 0 1px 4px rgba(22, 93, 255, 0.04);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .post-detail-view {
    padding: 12px;
  }
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  .main-content {
    margin-top: 16px;
  }
  .sidebar {
    position: static;
    margin-bottom: 16px;
  }
  .comment-list {
    max-height: 240px;
  }
  .content-card {
    min-height: calc(100vh - 180px);
  }
}
</style>
