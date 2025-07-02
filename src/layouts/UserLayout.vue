<template>
  <div id="userLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <div class="header-content">
          <div class="logo-section" @click="goHome">
            <img src="../assets/oj-logow.png" class="logo" alt="SOJ Logo" />
            <div class="title-container">
              <div class="title">SOJ</div>
              <div class="subtitle">在线判题系统</div>
            </div>
          </div>
          <div class="header-actions">
            <a-button type="primary" class="header-btn" @click="goLogin">登录/注册</a-button>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <GlobalFooter />
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import GlobalFooter from "@/components/GlobalFooter.vue";

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goLogin = () => {
  router.push('/user/login');
};

</script>

<style lang="less" scoped>
#userLayout {
  background: #f8fafc;
}

#userLayout .header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  line-height: 1;
  margin-bottom: 0;
  padding: 0;
  height: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 18px 18px;
}

.header-content {
  width: 100%;
  margin: 0;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  box-sizing: border-box;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 18px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  border-radius: 12px;
  padding: 6px 12px;
  &:hover {
    background: rgba(255,255,255,0.08);
    transform: scale(1.04);
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
}

.logo {
  width: 52px;
  height: 52px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12));
  border-radius: 8px;
  background: white;
}

.title-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.title {
  font-size: 26px;
  font-weight: 900;
  color: #fff;
  margin: 0 0 4px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  letter-spacing: 2px;
}

.subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  font-weight: 400;
  letter-spacing: 1px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-btn {
  font-weight: 600;
  border-radius: 20px;
  padding: 0 22px;
  height: 38px;
  font-size: 15px;
  box-shadow: 0 2px 8px rgba(118,75,162,0.08);
  transition: all 0.2s;
  &:hover {
    filter: brightness(1.08);
    box-shadow: 0 4px 16px rgba(102,126,234,0.15);
  }
}

#userLayout .content {
  min-height: calc(100vh - 80px - 400px);
  background-color: transparent;
  padding: 0;
  margin-bottom: 0;
}

#userLayout .footer {
  padding: 0;
  background-color: transparent;
  height: auto;
}

// 响应式设计
@media (max-width: 768px) {
  .header-content {
    padding: 0 10px;
    height: 60px;
  }
  .logo {
    width: 36px;
    height: 36px;
  }
  .title {
    font-size: 18px;
  }
  .subtitle {
    font-size: 9px;
  }
  .header-btn {
    font-size: 13px;
    height: 30px;
    padding: 0 12px;
  }
  .logo-section {
    gap: 8px;
    padding: 2px 6px;
  }
  .header-actions {
    gap: 8px;
  }
}
</style>
