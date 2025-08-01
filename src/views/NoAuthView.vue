<template>
  <div class="no-auth-container">
    <div class="background-animation">
      <div class="floating-elements">
        <div class="element element-1"></div>
        <div class="element element-2"></div>
        <div class="element element-3"></div>
        <div class="element element-4"></div>
        <div class="element element-5"></div>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="error-card">
        <!-- 错误图标 -->
        <div class="error-icon-wrapper">
          <div class="error-icon">
            <icon-lock class="lock-icon" />
            <div class="lock-glow"></div>
          </div>
        </div>

        <!-- 错误信息 -->
        <div class="error-content">
          <h1 class="error-title">访问受限</h1>
          <p class="error-subtitle">抱歉，您没有权限访问该页面</p>
          <p class="error-description">
            这可能是因为：您的账户权限不足，或该页面需要特定的访问权限。
            <br>如果您认为这是一个错误，请联系管理员。
          </p>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <a-button
            type="primary"
            size="large"
            @click="goBack"
            class="back-button"
          >
            <template #icon>
              <icon-arrow-left />
            </template>
            返回上页
          </a-button>

          <a-button
            size="large"
            @click="goHome"
            class="home-button"
          >
            <template #icon>
              <icon-home />
            </template>
            回到首页
          </a-button>
        </div>

        <!-- 帮助信息 -->
        <div class="help-section">
          <a-alert
            type="info"
            show-icon
            class="help-alert"
          >
            <template #icon>
              <icon-info-circle />
            </template>
            <template #title>需要帮助？</template>
            如果您需要访问此页面，请联系系统管理员申请相应权限，或检查您的账户状态。
          </a-alert>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import {
  IconLock,
  IconArrowLeft,
  IconHome,
  IconInfoCircle
} from '@arco-design/web-vue/es/icon';

const router = useRouter();

/**
 * 跳转回上一级页面
 */
const goBack = () => {
  router.go(-1);
};

/**
 * 跳转到首页
 */
const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.no-auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

/* 背景动画 */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.floating-elements {
  position: relative;
  width: 100%;
  height: 100%;
}

.element {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.element-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
  animation-duration: 6s;
}

.element-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  left: 80%;
  animation-delay: 1s;
  animation-duration: 8s;
}

.element-3 {
  width: 60px;
  height: 60px;
  top: 80%;
  left: 20%;
  animation-delay: 2s;
  animation-duration: 7s;
}

.element-4 {
  width: 100px;
  height: 100px;
  top: 30%;
  left: 70%;
  animation-delay: 3s;
  animation-duration: 9s;
}

.element-5 {
  width: 40px;
  height: 40px;
  top: 10%;
  left: 60%;
  animation-delay: 4s;
  animation-duration: 5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.7;
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-10px) rotate(180deg);
    opacity: 0.8;
  }
  75% {
    transform: translateY(-30px) rotate(270deg);
    opacity: 1;
  }
}

/* 内容包装器 */
.content-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 600px;
  padding: 0 20px;
}

/* 错误卡片 */
.error-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  animation: slideUp 0.8s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 错误图标 */
.error-icon-wrapper {
  margin-bottom: 32px;
}

.error-icon {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

.lock-icon {
  font-size: 48px;
  color: white;
  z-index: 2;
}

.lock-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  border-radius: 50%;
  opacity: 0.3;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes glow {
  from {
    transform: scale(1);
    opacity: 0.3;
  }
  to {
    transform: scale(1.2);
    opacity: 0.1;
  }
}

/* 错误内容 */
.error-content {
  margin-bottom: 40px;
}

.error-title {
  font-size: 32px;
  font-weight: 700;
  color: #1d2129;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-subtitle {
  font-size: 20px;
  color: #4e5969;
  margin: 0 0 20px 0;
  font-weight: 500;
}

.error-description {
  font-size: 16px;
  color: #86909c;
  line-height: 1.8;
  margin: 0;
  max-width: 480px;
  margin: 0 auto;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.back-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  padding: 12px 32px;
  height: auto;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.home-button {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  font-weight: 600;
  padding: 12px 32px;
  height: auto;
  color: #667eea;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.home-button:hover {
  transform: translateY(-2px);
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
}

/* 帮助部分 */
.help-section {
  margin-top: 24px;
}

.help-alert {
  border-radius: 12px;
  background: rgba(22, 93, 255, 0.05);
  border: 1px solid rgba(22, 93, 255, 0.1);
  text-align: left;
}

.help-alert :deep(.arco-alert-title) {
  color: #165dff;
  font-weight: 600;
}

.help-alert :deep(.arco-alert-content) {
  color: #4e5969;
  line-height: 1.6;
}

.help-alert :deep(.arco-alert-icon) {
  color: #165dff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-card {
    padding: 32px 24px;
    margin: 20px;
    border-radius: 20px;
  }

  .error-icon {
    width: 100px;
    height: 100px;
  }

  .lock-icon {
    font-size: 40px;
  }

  .error-title {
    font-size: 28px;
  }

  .error-subtitle {
    font-size: 18px;
  }

  .error-description {
    font-size: 14px;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .back-button,
  .home-button {
    width: 100%;
    max-width: 280px;
  }
}

@media (max-width: 480px) {
  .error-card {
    padding: 24px 20px;
  }

  .error-icon {
    width: 80px;
    height: 80px;
  }

  .lock-icon {
    font-size: 32px;
  }

  .error-title {
    font-size: 24px;
  }

  .error-subtitle {
    font-size: 16px;
  }

  .back-button,
  .home-button {
    padding: 10px 24px;
    font-size: 14px;
  }
}
</style>
