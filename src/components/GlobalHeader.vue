<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        :default-selected-keys="['1']"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/oj-logow.png" alt="" />
            <div class="title">SOJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="150px" class="user-info">
      <a-avatar v-if="store.state.user?.loginUser.userAvatar" size="small">
        <img :src=store.state.user?.loginUser.userAvatar alt="avatar" />
      </a-avatar>
      <a-dropdown trigger="hover">
        <span>
          {{ store.state.user?.loginUser.userName ?? "请登录" }}<icon-down />
        </span>
        <template #content>
          <a-doption @click="dropSubmit">
            <template #icon>
              <icon-import />
            </template>
            <template #default
            >{{
                store.state.user?.loginUser.userName === "未登录"
                    ? "立即登录"
                    : "退出登录"
              }}
            </template>
          </a-doption>
        </template>
      </a-dropdown>
    </a-col>
  </a-row>
  <a-modal
      v-model:visible="visible"
      @ok="loginOut"
      @cancel="visible = false"
      message-type="warning"
  >
    <template #title>退出登录</template>
    <div>您确定要退出登录吗？</div>
  </a-modal>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRoute, useRouter } from "vue-router";
import {computed, ref} from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import message from "@arco-design/web-vue/es/message";
import {Service} from "../../generated";

const router = useRouter();
const route = useRoute();
const store = useStore();
const visible = ref(false);

const loginUser = store.state.user?.loginUser;

//展示的路由数组
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

//默认主页
const selectedKeys = ref(["/"]);

//路由跳转
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
/**
 * 处理退出请求
 */
const loginOut = async () => {
  try {
    //console.log("退出登录");
    await Service.userLogoutUsingPost();

    //退出登录后跳转到登录页面
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

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  margin-left: 5px;
  color: #444;
}

.logo {
  height: 48px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info .arco-avatar {
  margin-right: 8px;
}

</style>
