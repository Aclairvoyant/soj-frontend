<template>
  <div id="globalHeader" class="modern-header">
    <div class="header-container">
      <!-- Logo和标题区域 -->
      <div class="logo-section" @click="goHome">
        <div class="logo-wrapper">
          <img class="logo" src="@/assets/oj-logow.png" alt="SOJ Logo" />
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

      <!-- 消息中心区域 -->
      <div class="message-center">
        <MessageBadge />
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
              <!-- 管理员专用菜单项 -->
              <template v-if="isAdmin">
                <a-doption-divider />
                <a-doption @click="goToPermissionManagement">
                  <template #icon>
                    <icon-safe />
                  </template>
                  权限管理
                </a-doption>
                <a-doption @click="goToAdminPanel">
                  <template #icon>
                    <icon-user-group />
                  </template>
                  管理面板
                </a-doption>
              </template>
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
import { computed, ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import { usePermission } from "@/hooks/usePermission";
import message from "@arco-design/web-vue/es/message";
import { Service } from "../../generated";
import MessageBadge from "@/components/MessageBadge.vue";
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
  IconUserGroup,
  IconNotification,
  IconSafe,
  IconMore
} from '@arco-design/web-vue/es/icon';

const router = useRouter();
const route = useRoute();
const store = useStore();
const { hasRole, isAdmin, isSuperAdmin } = usePermission();
const visible = ref(false);
const unreadCount = ref(0);
const navContainer = ref(null);
const maxVisibleItems = ref(6); // 默认显示的最大导航项数量

const loginUser = store.state.user?.loginUser;

// 展示的路由数组
const visibleRoutes = computed(() => {
  // 基本路由过滤
  let filteredRoutes = routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }

    // 使用原有的权限检查保持向后兼容
    if (!checkAccess(store.state.user.loginUser, item?.meta?.access as string)) {
      return false;
    }
    return true;
  });

  // 基于新权限系统的额外过滤
  if (loginUser?.userName !== '未登录') {
    filteredRoutes = filteredRoutes.filter((item) => {
      // 对特定路由进行更精细的权限控制
      switch (item.path) {
        case '/add/question':
        case '/manage/question/':
          // 题目管理需要question_manage权限
          return isAdmin.value; // 暂时使用角色检查，后续可扩展为具体权限检查

        case '/add/contest':
        case '/manage/contest':
          // 竞赛管理需要contest_manage权限
          return isAdmin.value;

        case '/add/announcement':
        case '/manage/announcement/':
          // 公告管理需要announcement_manage权限
          return isAdmin.value;

        case '/admin/message/send':
          // 消息发送需要message_manage权限
          return isAdmin.value;

        case '/permission':
          // 权限管理需要admin或super_admin角色
          return isAdmin.value;

        default:
          return true;
      }
    });
  }

  // 动态添加基于权限的菜单项
  const dynamicMenuItems = [];

  // 添加权限管理菜单（仅管理员和超级管理员可见）
  if (isAdmin.value && loginUser?.userName !== '未登录') {
    const hasPermissionRoute = filteredRoutes.some(route => route.path === '/permission');
    if (!hasPermissionRoute) {
      dynamicMenuItems.push({
        path: '/permission',
        name: '权限管理',
        component: () => import('@/views/permission/PermissionManagement.vue'),
        meta: {
          access: 'admin'
        }
      });
    }
  }

  // 插入动态菜单项到合适的位置
  if (dynamicMenuItems.length > 0) {
    // 找到合适的插入位置（在用户相关菜单之前）
    const insertIndex = filteredRoutes.findIndex(route =>
      route.path === '/workplace' || route.path === '/user'
    );

    if (insertIndex !== -1) {
      filteredRoutes.splice(insertIndex, 0, ...dynamicMenuItems);
    } else {
      filteredRoutes.push(...dynamicMenuItems);
    }
  }

  return filteredRoutes;
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
    '/problemSets': IconBook,
    '/posts': IconMessage,
    '/workplace': IconTrophy,
    '/messages': IconNotification,
    '/user': IconUserGroup,
    '/permission': IconSafe
  };
  return iconMap[path] || IconHome;
};

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

// 跳转到消息中心
const goToMessages = () => {
  router.push('/messages');
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

// 跳转到权限管理页面
const goToPermissionManagement = () => {
  router.push('/permission');
};

// 跳转到管理面板
const goToAdminPanel = () => {
  router.push('/manage/question/');
};

/**
 * 获取消息未读数量
 */
const getUnreadMessageCount = async () => {
  try {
    // 使用新的统一消息API
    const totalCount = store.state.message?.totalUnreadCount || 0;
    unreadCount.value = totalCount;
  } catch (error) {
    console.error("获取未读消息数量失败", error);
  }
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

// 监听消息模块的未读数量变化
watch(
  () => store.state.message?.totalUnreadCount,
  (newCount) => {
    if (newCount !== undefined) {
      unreadCount.value = newCount;
    }
  },
  { immediate: true }
);

// 监听用户权限变化，确保菜单及时更新
watch(
  () => store.state.user?.loginUser,
  (newUser) => {
    // 当用户信息变化时，权限相关的计算属性会自动更新
    // 这里可以添加额外的逻辑，比如清空权限缓存等
    console.log('用户信息已更新，菜单权限将自动刷新');
  },
  { deep: true }
);

// 组件挂载时初始化消息模块
onMounted(async () => {
  const userId = store.state.user?.loginUser?.id;
  if (userId && userId !== "未登录") {
    // 初始化消息模块
    await store.dispatch('message/initialize', userId);
    // 获取初始未读数量
    getUnreadMessageCount();
  }
})
</script>

<style lang="less" scoped>
.modern-header {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-bottom: 1px solid rgba(30, 41, 59, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1001;
  backdrop-filter: blur(10px);
}

.header-container {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  gap: 24px;
  box-sizing: border-box;
  overflow: hidden;
}

// Logo区域
.logo-section {
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 160px;
  padding: 8px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo {
  height: 36px;
  width: 36px;
  flex-shrink: 0;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-width: 0;
}

.title {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1.2;
  white-space: nowrap;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 11px;
  color: #94a3b8;
  margin: 0;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  letter-spacing: 0.5px;
}

// 导航区域
.nav-section {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
  max-width: 800px;
}

.modern-menu {
  background: transparent;
  border: none;
  padding: 0;
  flex: 1;
  display: flex;
  justify-content: center;

  :deep(.arco-menu) {
    background: transparent;
    border: none;
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    width: auto;
    height: auto;
  }

}

// 导航项样式 - 重新设置
.modern-menu {
  :deep(.arco-menu-item) {
    background: transparent;
    border: none;
    color: #cbd5e1;
    margin: 0 4px;
    border-radius: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
    white-space: nowrap;
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 500;

    &:hover {
      background: rgba(59, 130, 246, 0.15);
      color: #ffffff;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);

      &::before {
        left: 100%;
      }
    }

    &.arco-menu-selected {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);

      &:hover {
        background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      }
    }
  }
}

.menu-item-content {
  display: flex;
  align-items: center;
  gap: 2px;
  min-width: 0;
  width: 100%;
  position: relative;
  z-index: 1;
}

.menu-icon {
  font-size: 16px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.menu-item-content:hover .menu-icon {
  transform: scale(1.1);
}

.menu-text {
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  letter-spacing: 0.3px;
}

// 消息中心区域
.message-center {
  display: flex;
  align-items: center;
  margin-right: 2px;

  .message-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #cbd5e1;
    padding: 10px;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: rgba(59, 130, 246, 0.15);
      border-color: rgba(59, 130, 246, 0.3);
      color: #ffffff;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
    }

    .message-icon {
      font-size: 18px;
    }
  }

  .message-badge {
    :deep(.arco-badge-number) {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      border-color: #0f172a;
      font-size: 10px;
      min-width: 16px;
      height: 16px;
      line-height: 14px;
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
  }
}

// 用户信息区域
.user-section {
  flex-shrink: 0;
  min-width: 140px;
  max-width: 220px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.user-avatar {
  border: 2px solid rgba(59, 130, 246, 0.4);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: rgba(59, 130, 246, 0.8);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    transform: scale(1.08);
  }
}

.user-dropdown {
  cursor: pointer;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }
}

.username {
  color: #f1f5f9;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  letter-spacing: 0.3px;
}

.dropdown-icon {
  color: rgba(241, 245, 249, 0.7);
  font-size: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-profile:hover .dropdown-icon {
  color: #f1f5f9;
  transform: rotate(180deg) scale(1.1);
}

// 认证按钮
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.login-btn {
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 14px;
  padding: 10px 18px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(10px);

  &:hover {
    color: #ffffff;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-color: rgba(59, 130, 246, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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


// 用户下拉菜单样式
.user-dropdown :deep(.arco-dropdown-menu) {
  border-radius: 12px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(59, 130, 246, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  background:
    linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
  backdrop-filter: blur(24px) saturate(180%);
  border: none;
  padding: 6px;
  min-width: 200px;
  animation: dropdown-appear 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top;

  .arco-dropdown-option {
    border-radius: 8px;
    margin: 1px 0;
    padding: 12px 16px;
    color: #e2e8f0;

    &:hover {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%);
      color: #ffffff;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);

      &::before {
        left: 100%;
      }
    }

    &:active {
      transform: translateY(0);
      transition-duration: 0.1s;
    }

    .arco-dropdown-option-icon {
      color: #60a5fa;
      font-size: 16px;
      transition: all 0.3s ease;
      margin-right: 0;
    }

    &:hover .arco-dropdown-option-icon {
      color: #3b82f6;
      transform: scale(1.1) rotate(5deg);
    }
  }

  .logout-option {
    color: #f87171;
    border-top: 1px solid rgba(248, 113, 113, 0.1);
    margin-top: 4px;

    &:hover {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%);
      color: #fecaca;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
    }

    .arco-dropdown-option-icon {
      color: #f87171;
    }

    &:hover .arco-dropdown-option-icon {
      color: #ef4444;
      transform: scale(1.1) rotate(-5deg);
    }
  }

  .arco-dropdown-divider {
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
    margin: 6px 0;
    height: 1px;
    border: none;
  }
}

@keyframes dropdown-appear {
  0% {
    opacity: 0;
    transform: translateY(-8px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// 响应式设计
@media (max-width: 1400px) {
  .header-container {
    padding: 0 24px;
    gap: 20px;
    max-width: none;
  }

  .logo-section {
    min-width: 140px;
    padding: 6px 12px;
  }

  .nav-section {
    max-width: 600px;
  }

  .modern-menu {
    :deep(.arco-menu-item) {
      padding: 8px 14px;
      font-size: 13px;
    }
  }

  .menu-text {
    font-size: 13px;
  }

  .menu-icon {
    font-size: 14px;
  }
}

@media (max-width: 1200px) {
  .header-container {
    padding: 0 20px;
    gap: 16px;
  }

  .logo-section {
    min-width: 120px;
    padding: 6px 10px;
  }

  .logo {
    height: 32px;
    width: 32px;
  }

  .title {
    font-size: 18px;
  }

  .nav-section {
    max-width: 500px;
  }

  .modern-menu {
    padding: 0;

    :deep(.arco-menu-item) {
      padding: 8px 12px;
      font-size: 13px;
    }
  }

  .menu-text {
    font-size: 12px;
  }

  .menu-icon {
    font-size: 13px;
  }

  .user-section {
    min-width: 120px;
    max-width: 180px;
  }

  .user-profile {
    padding: 6px 10px;
  }
}

@media (max-width: 1000px) {
  .header-container {
    padding: 0 16px;
    gap: 12px;
    height: 60px;
  }

  .logo-section {
    min-width: 100px;
    padding: 4px 8px;
  }

  .logo {
    height: 28px;
    width: 28px;
  }

  .logo-wrapper {
    gap: 10px;
  }

  .title {
    font-size: 16px;
  }

  .subtitle {
    font-size: 10px;
  }

  .nav-section {
    max-width: 400px;
  }

  .modern-menu {
    padding: 0;

    :deep(.arco-menu-item) {
      padding: 6px 10px;
      font-size: 12px;
    }
  }

  .menu-text {
    font-size: 11px;
  }

  .menu-icon {
    font-size: 12px;
  }

  .user-section {
    min-width: 100px;
    max-width: 150px;
  }

  .user-profile {
    padding: 6px 8px;
  }

  .username {
    font-size: 13px;
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
    padding: 0 16px;
    height: 56px;
    gap: 16px;
  }

  .logo-section {
    min-width: 120px;
    padding: 4px 8px;
  }

  .logo {
    height: 32px;
    width: 32px;
  }

  .title {
    font-size: 18px;
  }

  .subtitle {
    font-size: 9px;
  }

  .nav-section {
    display: none;
  }

  .message-center {
    margin-right: 12px;

    .message-btn {
      padding: 8px;

      .message-icon {
        font-size: 16px;
      }
    }
  }

  .user-profile {
    padding: 6px 10px;
    border-radius: 12px;
  }

  .username {
    font-size: 13px;
  }

  .auth-buttons {
    gap: 8px;
  }

  .login-btn {
    padding: 8px 12px;
    font-size: 13px;
    border-radius: 12px;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 12px;
    height: 52px;
    gap: 12px;
  }

  .logo-section {
    min-width: 100px;
    padding: 3px 6px;
  }

  .logo {
    height: 28px;
    width: 28px;
  }

  .logo-wrapper {
    gap: 8px;
  }

  .title {
    font-size: 16px;
  }

  .subtitle {
    font-size: 8px;
  }

  .message-center {
    margin-right: 8px;

    .message-btn {
      padding: 6px;

      .message-icon {
        font-size: 14px;
      }
    }
  }

  .user-section {
    min-width: 80px;
    max-width: 120px;
  }

  .user-profile {
    padding: 4px 8px;
    gap: 6px;
  }

  .username {
    font-size: 12px;
  }

  .auth-buttons {
    gap: 6px;
  }

  .login-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>
