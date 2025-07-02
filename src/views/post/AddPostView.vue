<template>
  <div class="add-post-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <a-typography-title :heading="2" class="page-title">
            <icon-edit class="title-icon" />
            发布帖子
          </a-typography-title>
          <a-typography-text class="subtitle">分享你的想法和经验，与社区一起交流学习</a-typography-text>
        </div>
        <div class="header-actions">
          <a-button size="large" @click="saveDraft" class="draft-btn">
            <template #icon>
              <icon-save />
            </template>
            保存草稿
          </a-button>
          <a-button type="primary" size="large" @click="submitPost" class="publish-btn">
            <template #icon>
              <icon-send />
            </template>
            发布帖子
          </a-button>
        </div>
      </div>
    </div>

    <div class="content-section">
      <a-row :gutter="24">
        <!-- 用户信息侧边栏 -->
        <a-col :span="6">
          <div class="sidebar">
            <a-card class="user-card" :bordered="false">
              <template #title>
                <div class="card-title">
                  <icon-user class="card-icon" />
                  <span>用户信息</span>
                </div>
              </template>
              
              <div class="user-avatar-section">
                <a-avatar :size="80" shape="circle" class="user-avatar">
                  <img alt="头像" :src="userAvatarImg || '/default-avatar.png'"/>
                </a-avatar>
                <div class="user-name">{{ loginUser.userName }}</div>
                <div class="user-role">{{ loginUser.userRole === "admin" ? "管理员" : "普通用户" }}</div>
              </div>

              <a-descriptions
                :data="data"
                size="large"
                column="1"
                :bordered="false"
                class="user-info"
              />
            </a-card>
          </div>
        </a-col>

        <!-- 发帖内容区域 -->
        <a-col :span="18">
          <div class="post-content">
            <a-card class="content-card" :bordered="false">
              <template #title>
                <div class="card-title">
                  <icon-file class="card-icon" />
                  <span>帖子内容</span>
                </div>
              </template>

              <a-form @update:modelValue="onFieldUpdate" class="post-form">
                <!-- 标题输入 -->
                <a-form-item class="title-item">
                  <a-input 
                    v-model="postContent.title" 
                    @update:modelValue="onFieldUpdate" 
                    placeholder="请输入帖子标题..."
                    size="large"
                    class="title-input"
                  >
                    <template #prefix>
                      <icon-tag />
                    </template>
                  </a-input>
                </a-form-item>

                <!-- 标签选择 -->
                <a-form-item class="tags-item">
                  <a-input-tag 
                    v-model="postContent.tags" 
                    placeholder="添加标签（按回车确认）"
                    class="tags-input"
                  />
                </a-form-item>

                <!-- Markdown编辑器 -->
                <a-form-item class="editor-item">
                  <div class="editor-container">
                    <MdEditorV3 
                      v-model="postContent.content" 
                      @update:modelValue="onFieldUpdate"
                      class="markdown-editor"
                    />
                  </div>
                </a-form-item>

                <!-- 操作按钮 -->
                <a-form-item class="actions-item">
                  <div class="form-actions">
                    <a-space>
                      <a-button size="large" @click="saveDraft" class="draft-btn">
                        <template #icon>
                          <icon-save />
                        </template>
                        保存草稿
                      </a-button>
                      <a-button type="primary" size="large" @click="submitPost" class="publish-btn">
                        <template #icon>
                          <icon-send />
                        </template>
                        发布帖子
                      </a-button>
                    </a-space>
                  </div>
                </a-form-item>
              </a-form>
            </a-card>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>


<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import moment from "moment/moment";
import {useStore} from "vuex";
import {LoginUserVO, Post, Service} from "../../../generated";
import {DescData, Message} from "@arco-design/web-vue";
import MdEditorV3 from "@/components/MdEditorV3.vue";
import router from "@/router";

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
    // 清空草稿
    localStorage.removeItem("postContentFormDraft");
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
.add-post-view {
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

.header-actions {
  display: flex;
  gap: 12px;
}

.draft-btn {
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.draft-btn:hover {
  border-color: #165dff;
  color: #165dff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.1);
}

.publish-btn {
  background: linear-gradient(135deg, #165dff 0%, #4080ff 100%);
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.publish-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
}

.content-section {
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
}

.content-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  height: 100%;
}

.post-form {
  padding: 0;
}

.title-item {
  margin-bottom: 20px;
}

.title-input {
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  width: 85%;
}

.title-input :deep(.arco-input-prefix) {
  color: #165dff;
}

.tags-item {
  margin-bottom: 20px;
}

.tags-input {
  border-radius: 8px;
  width: 85%;
}

.editor-item {
  margin-bottom: 24px;
}

.editor-container {
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.markdown-editor {
  min-height: 400px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #f2f3f5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .add-post-view {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .content-section {
    margin-top: 16px;
  }
  
  .sidebar {
    position: static;
    margin-bottom: 16px;
  }
}
</style>
