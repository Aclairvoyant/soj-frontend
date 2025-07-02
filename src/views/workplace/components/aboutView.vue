<template>
  <div class="about-view">
    <a-card class="user-card" :bordered="false">
      <template #title>
        <div class="card-title">
          <icon-user class="card-icon" />
          <span>用户基本信息</span>
        </div>
      </template>
      
      <div class="user-avatar-section">
        <a-avatar :size="100" shape="circle" class="user-avatar">
          <img alt="头像" :src="userAvatarImg" />
        </a-avatar>
        <div class="user-name">{{ store.state.user?.loginUser?.userName }}</div>
        <div class="user-role">
          <a-tag :color="store.state.user?.loginUser?.userRole === 'admin' ? 'red' : 'blue'" class="role-tag">
            {{ store.state.user?.loginUser?.userRole === "admin" ? "管理员" : "普通用户" }}
          </a-tag>
        </div>
      </div>

      <a-descriptions
        :data="data"
        size="large"
        column="1"
        :bordered="false"
        class="user-descriptions"
      />
      
      <template #extra>
        <a-button type="primary" size="small" @click="openEditDrawer" class="edit-btn">
          <template #icon>
            <icon-edit />
          </template>
          修改信息
        </a-button>
      </template>
    </a-card>

    <!-- 编辑抽屉 -->
    <a-drawer
      width="40%"
      :visible="visible"
      placement="right"
      @ok="handleOk"
      @cancel="closeEditDrawer"
      unmountOnClose
      class="edit-drawer"
    >
      <template #title>
        <div class="drawer-title">
          <icon-edit class="drawer-icon" />
          <span>编辑用户信息</span>
        </div>
      </template>
      
      <div class="avatar-upload-section">
        <a-upload
          action="/"
          :fileList="file ? [file] : []"
          :show-file-list="false"
          @change="onChange"
          :custom-request="uploadAvatar"
          accept="image/*"
          class="avatar-upload"
        >
          <div class="upload-trigger">
            <a-avatar :size="80" shape="circle" class="upload-avatar">
              <img alt="头像" :src="userAvatarImg" />
            </a-avatar>
            <div class="upload-text">
              <icon-camera class="upload-icon" />
              <span>点击更换头像</span>
            </div>
          </div>
        </a-upload>
      </div>

      <a-form :model="updateForm" layout="vertical" class="edit-form">
        <a-form-item field="userName" label="用户名称" class="form-item">
          <a-input 
            v-model="updateForm.userName" 
            placeholder="请输入用户名称" 
            class="form-input"
          />
        </a-form-item>
        <a-form-item field="userProfile" label="个人简介" class="form-item">
          <a-textarea
            v-model="updateForm.userProfile"
            placeholder="请输入个人简介"
            :rows="4"
            class="form-textarea"
          />
        </a-form-item>
      </a-form>
      
      <template #footer>
        <div class="drawer-footer">
          <a-button @click="closeEditDrawer" class="cancel-btn">取消</a-button>
          <a-button type="primary" @click="handleOk" class="save-btn">保存</a-button>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
import {
  LoginUserVO, Service,
  UserUpdateMyRequest,
} from "../../../../generated";
import { computed, ref } from "vue";
import {
  DescData,
  FileItem,
  Message,
  RequestOption,
} from "@arco-design/web-vue";
import moment from "moment/moment";

const store = useStore();
const loginUser: LoginUserVO = computed(
  () => store.state.user?.loginUser
) as LoginUserVO;

const data = ref([
  {
    label: "用户名称",
    value: store.state.user?.loginUser.userName,
  },
  {
    label: "用户角色",
    value: store.state.user?.loginUser.userRole === "admin" ? "管理员" : "普通用户",
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
]);

const visible = ref(false);
const updateForm = ref<UserUpdateMyRequest>({
  ...store.state.user?.loginUser,
});
let userAvatarImg = updateForm.value.userAvatar;

const openEditDrawer = () => {
  visible.value = true;
};

const closeEditDrawer = () => {
  visible.value = false;
};

const handleOk = async () => {
  const res = await Service.updateMyUserUsingPost(updateForm.value);
  if (res.code === 200) {
    Message.success("更新成功！");
    visible.value = false;
    location.reload();
  } else {
    Message.error(res.msg);
  }
};

const file = ref<FileItem>();

const onChange = (fileList: FileItem[]) => {
  file.value = fileList[0];
};

const uploadAvatar = async (option: RequestOption) => {
  const { fileItem } = option;
  if (fileItem?.file) {
    const formData = new FormData();
    formData.append("file", fileItem.file);
    try {
      const res = await Service.uploadUsingPost(formData as unknown as Blob);
      if (res.code === 200) {
        updateForm.value.userAvatar = res.data;
        userAvatarImg = res.data;
        Message.success("头像上传成功！");
      } else {
        Message.error("头像上传失败！");
      }
    } catch (error) {
      Message.error("头像上传失败！");
    }
  }
};
</script>

<style scoped>
.about-view {
  height: 100%;
}

.user-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  font-size: 18px;
}

.user-avatar-section {
  text-align: center;
  padding: 24px 0;
  border-bottom: 1px solid #f2f3f5;
  margin-bottom: 24px;
}

.user-avatar {
  border: 4px solid #f0f9ff;
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.2);
  margin-bottom: 16px;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 8px;
}

.user-role {
  display: flex;
  justify-content: center;
}

.role-tag {
  font-weight: 500;
  border-radius: 6px;
  padding: 4px 12px;
}

.user-descriptions {
  flex: 1;
}

.user-descriptions :deep(.arco-descriptions-item-label) {
  color: #4e5969;
  font-weight: 500;
  background: #f7f8fa;
  border-radius: 6px;
  padding: 8px 12px;
}

.user-descriptions :deep(.arco-descriptions-item-value) {
  color: #1d2129;
  font-weight: 500;
  padding: 8px 12px;
}

.edit-btn {
  background: linear-gradient(135deg, #165dff 0%, #0e42d2 100%);
  border: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.3);
}

.edit-btn:hover {
  background: linear-gradient(135deg, #0e42d2 0%, #0a2f9e 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.4);
}

/* 抽屉样式 */
.edit-drawer {
  border-radius: 16px 0 0 16px;
}

.drawer-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1d2129;
}

.drawer-icon {
  color: #165dff;
  font-size: 18px;
}

.avatar-upload-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #e2e8f0;
}

.upload-trigger {
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-trigger:hover {
  transform: scale(1.05);
}

.upload-avatar {
  border: 4px solid #f0f9ff;
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.2);
  margin-bottom: 12px;
}

.upload-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #86909c;
  font-size: 14px;
}

.upload-icon {
  font-size: 16px;
  color: #165dff;
}

.edit-form {
  margin-bottom: 24px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item :deep(.arco-form-item-label) {
  color: #1d2129;
  font-weight: 500;
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  border-radius: 8px;
  border: 1px solid #e5e6eb;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #165dff;
  box-shadow: 0 0 0 2px rgba(22, 93, 255, 0.1);
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f2f3f5;
}

.cancel-btn {
  border-radius: 6px;
  font-weight: 500;
}

.save-btn {
  background: linear-gradient(135deg, #165dff 0%, #0e42d2 100%);
  border: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.3);
}

.save-btn:hover {
  background: linear-gradient(135deg, #0e42d2 0%, #0a2f9e 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-avatar {
    width: 80px !important;
    height: 80px !important;
  }
  
  .user-name {
    font-size: 18px;
  }
  
  .avatar-upload-section {
    padding: 16px;
  }
  
  .upload-avatar {
    width: 60px !important;
    height: 60px !important;
  }
}
</style>
