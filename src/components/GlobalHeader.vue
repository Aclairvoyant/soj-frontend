<template>
  <div id="globalHeader" class="modern-header">
    <div class="header-container">
      <!-- Logo和标题区域 -->
      <div class="logo-section" @click="goHome">
        <div class="logo-wrapper">
          <img class="logo" src="../assets/oj-logow.png" alt="SOJ Logo" />
          <div class="title-container">
            <div class="title">SOJ</div>
            <div class="subtitle">在线判题系统</div>
          </div>
        </div>
      </div>

      <!-- 导航菜单区域 -->
      <div class="nav-section">
        <a-menu
          mode="horizontal"
          :selected-keys="selectedKeys"
          :default-selected-keys="['1']"
          @menu-item-click="doMenuClick"
          class="modern-menu"
        >
          <a-menu-item 
            v-for="item in visibleRoutes" 
            :key="item.path"
            class="nav-item"
          >
            <div class="menu-item-content">
              <component :is="getMenuIcon(item.path)" class="menu-icon" />
              <span class="menu-text">{{ item.name }}</span>
            </div>
          </a-menu-item>
        </a-menu>
      </div>

      <!-- 用户信息区域 -->
      <div class="user-section">
        <div class="user-info" v-if="store.state.user?.loginUser.userName !== '未登录'">
          <a-avatar 
            v-if="store.state.user?.loginUser.userAvatar" 
            size="medium"
            class="user-avatar"
          >
            <img :src="store.state.user?.loginUser.userAvatar" alt="avatar" />
          </a-avatar>
          <a-dropdown trigger="hover" class="user-dropdown">
            <div class="user-profile">
              <span class="username">{{ store.state.user?.loginUser.userName }}</span>
              <icon-down class="dropdown-icon" />
            </div>
            <template #content>
              <a-doption @click="goToProfile">
                <template #icon>
                  <icon-user />
                </template>
                个人中心
              </a-doption>
              <a-doption @click="goToSettings">
                <template #icon>
                  <icon-settings />
                </template>
                设置
              </a-doption>
              <a-doption-divider />
              <a-doption @click="dropSubmit" class="logout-option">
                <template #icon>
                  <icon-export />
                </template>
                退出登录
              </a-doption>
            </template>
          </a-dropdown>
        </div>
        
        <!-- 未登录状态 -->
        <div class="auth-buttons" v-else>
          <a-button type="text" @click="goToLogin" class="login-btn">
            <template #icon>
              <icon-user />
            </template>
            登录/注册
          </a-button>
        </div>
      </div>
    </div>

    <!-- 退出登录确认模态框 -->
    <a-modal
      v-model:visible="visible"
      @ok="loginOut"
      @cancel="visible = false"
      message-type="warning"
      class="logout-modal"
    >
      <template #title>
        <div class="modal-title">
          退出登录
        </div>
      </template>
      <div class="modal-content">
        您确定要退出登录吗？退出后需要重新登录才能使用完整功能。
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import message from "@arco-design/web-vue/es/message";
import { Service } from "../../generated";
import { 
  IconDown, 
  IconImport, 
  IconUser, 
  IconSettings, 
  IconExport, 
  IconUserAdd,
  IconExclamationCircleFill,
  IconHome,
  IconCode,
  IconBook,
  IconMessage,
  IconTrophy,
  IconUserGroup
} from '@arco-design/web-vue/es/icon';

const router = useRouter();
const route = useRoute();
const store = useStore();
const visible = ref(false);

const loginUser = store.state.user?.loginUser;

// 展示的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }

    if (!checkAccess(store.state.user.loginUser, item?.meta?.access as string)) {
      return false;
    }
    return true;
  });
});

// 默认主页
const selectedKeys = ref(["/"]);

// 路由跳转
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

// 获取菜单图标
const getMenuIcon = (path: string) => {
  const iconMap: { [key: string]: any } = {
    '/': IconHome,
    '/questions': IconCode,
    '/problemsets': IconBook,
    '/posts': IconMessage,
    '/workplace': IconTrophy,
    '/user': IconUserGroup
  };
  return iconMap[path] || IconHome;
};

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

// 跳转到首页
const goHome = () => {
  router.push('/');
};

// 跳转到登录页
const goToLogin = () => {
  router.push('/user/login');
};

// 跳转到注册页
const goToRegister = () => {
  router.push('/user/register');
};

// 跳转到个人中心
const goToProfile = () => {
  router.push('/workplace');
};

// 跳转到设置页
const goToSettings = () => {
  router.push('/settings');
};

/**
 * 处理退出请求
 */
const loginOut = async () => {
  try {
    await Service.userLogoutUsingPost();

    // 退出登录后跳转到登录页面
    await router.push({
      path: "/",
      replace: true,
    });
    message.success("退出成功！");
    // 刷新页面
    location.reload();
  } catch (e) {
    console.log("退出操作异常");
  }
};

/**
 * 处理头像下拉框操作
 */
const dropSubmit = () => {
  if (store.state.user?.loginUser?.userName !== "未登录") {
    visible.value = true;
  } else {
    router.push({
      path: "/user/login",
      replace: true,
    });
  }
};
</script>

<style lang="less" scoped>
.modern-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  width: 100%;
  margin: 0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  gap: 16px;
  box-sizing: border-box;
}

// Logo区域
.logo-section {
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  
  &:hover {
    transform: scale(1.05);
  }
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  height: 48px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  flex-shrink: 0;
}

.title-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-width: 0;
}

.title {
  font-size: 28px;
  font-weight: 800;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1;
  white-space: nowrap;
}

.subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin: 2px 0 0 0;
  font-weight: 400;
  line-height: 1;
  white-space: nowrap;
}

// 导航区域
.nav-section {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
  max-width: 1800px;
}

.modern-menu {
  background: transparent;
  border: none;
  width: 80%;
  display: flex;
  justify-content: center;
  
  :deep(.arco-menu) {
    background: transparent;
    border: none;
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    width: 100%;
  }
  
  :deep(.arco-menu-item) {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 2px;
    border-radius: 12px;
    transition: all 0.3s ease;
    flex-shrink: 0;
    white-space: nowrap;
    min-width: 0;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      transform: translateY(-2px);
    }
    
    &.arco-menu-selected {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
}

.menu-item-content {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  min-width: 0;
  width: 100%;
}

.menu-icon {
  font-size: 12px;
  flex-shrink: 0;
}

.menu-text {
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

// 用户信息区域
.user-section {
  flex-shrink: 0;
  min-width: 120px;
  max-width: 200px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  border: 3px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.6);
    transform: scale(1.1);
  }
}

.user-dropdown {
  cursor: pointer;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
}

.username {
  color: white;
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
}

.dropdown-icon {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  transition: all 0.3s ease;
}

.user-profile:hover .dropdown-icon {
  color: white;
  transform: rotate(180deg);
}

// 认证按钮
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-btn {
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 6px 12px;
  transition: all 0.3s ease;
  font-size: 14px;
  
  &:hover {
    color: white;
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.1);
  }
}

.register-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 6px 12px;
  color: white;
  transition: all 0.3s ease;
  font-size: 14px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

// 模态框样式
.logout-modal {
  :deep(.arco-modal-header) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: white;
  }
  
  :deep(.arco-modal-body) {
    padding: 24px;
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: #e2e8f0;
  }
  
  :deep(.arco-modal-footer) {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  }
  
  :deep(.arco-modal-title) {
    color: white;
  }
  
  :deep(.arco-btn) {
    border-radius: 8px;
  }
  
  :deep(.arco-btn-primary) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    
    &:hover {
      background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    }
  }
  
  :deep(.arco-btn-secondary) {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #e2e8f0;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
  }
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: rgb(0, 0, 0);
}

.warning-icon {
  color: #fa8c16;
  font-size: 18px;
}

.modal-content {
  color: rgb(0, 0, 0);
  line-height: 1.6;
}

// 下拉菜单样式
:deep(.arco-dropdown-menu) {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  .arco-dropdown-option {
    border-radius: 8px;
    margin: 4px 8px;
    color: #e2e8f0;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
    
    .arco-dropdown-option-icon {
      color: #667eea;
    }
  }
  
  .logout-option {
    color: #f53f3f;
    
    &:hover {
      background: rgba(245, 63, 63, 0.1);
      color: #ff6b6b;
    }
    
    .arco-dropdown-option-icon {
      color: #f53f3f;
    }
  }
  
  .arco-dropdown-divider {
    background: rgba(255, 255, 255, 0.1);
    margin: 8px 0;
  }
}

// 响应式设计
@media (max-width: 1400px) {
  .header-container {
    padding: 0 20px;
    gap: 16px;
  }
  
  .logo-section {
    min-width: 100px;
  }
  
  .nav-section {
    max-width: 700px;
  }
  
  .menu-item-content {
    padding: 4px 6px;
  }
  
  .menu-text {
    font-size: 11px;
  }
  
  .menu-icon {
    font-size: 11px;
  }
}

@media (max-width: 1200px) {
  .header-container {
    padding: 0 16px;
    gap: 12px;
  }
  
  .logo-section {
    min-width: 90px;
  }
  
  .nav-section {
    display: flex;
    min-width: 0;
    max-width: 600px;
  }
  
  .modern-menu {
    :deep(.arco-menu-item) {
      margin: 0 1px;
    }
  }
  
  .menu-item-content {
    padding: 3px 5px;
    gap: 3px;
  }
  
  .menu-text {
    font-size: 10px;
  }
  
  .menu-icon {
    font-size: 10px;
  }
  
  .user-section {
    min-width: 100px;
    max-width: 180px;
  }
}

@media (max-width: 1000px) {
  .header-container {
    padding: 0 12px;
    gap: 10px;
  }
  
  .logo-section {
    min-width: 80px;
  }
  
  .logo-wrapper {
    gap: 10px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .subtitle {
    font-size: 11px;
  }
  
  .nav-section {
    max-width: 500px;
  }
  
  .menu-item-content {
    padding: 2px 4px;
    gap: 2px;
  }
  
  .menu-text {
    font-size: 9px;
  }
  
  .menu-icon {
    font-size: 9px;
  }
  
  .user-section {
    min-width: 90px;
    max-width: 160px;
  }
}

@media (max-width: 850px) {
  .header-container {
    padding: 0 10px;
    gap: 8px;
  }
  
  .logo-section {
    min-width: 70px;
  }
  
  .logo-wrapper {
    gap: 8px;
  }
  
  .title {
    font-size: 22px;
  }
  
  .subtitle {
    font-size: 10px;
  }
  
  .nav-section {
    max-width: 400px;
  }
  
  .menu-item-content {
    padding: 2px 3px;
    gap: 1px;
  }
  
  .menu-text {
    font-size: 8px;
  }
  
  .menu-icon {
    font-size: 8px;
  }
  
  .user-section {
    min-width: 80px;
    max-width: 140px;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 12px;
    height: 60px;
    gap: 12px;
  }
  
  .nav-section {
    display: none;
  }
  
  .logo {
    height: 40px;
  }
  
  .title {
    font-size: 22px;
  }
  
  .subtitle {
    font-size: 10px;
  }
  
  .user-profile {
    padding: 4px 8px;
  }
  
  .username {
    font-size: 12px;
  }
  
  .auth-buttons {
    gap: 6px;
  }
  
  .login-btn,
  .register-btn {
    padding: 4px 8px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 8px;
  }
  
  .logo-wrapper {
    gap: 8px;
  }
  
  .logo {
    height: 36px;
  }
  
  .title {
    font-size: 20px;
  }
  
  .subtitle {
    font-size: 9px;
  }
  
  .auth-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .login-btn,
  .register-btn {
    padding: 3px 6px;
    font-size: 11px;
  }
}
</style>
