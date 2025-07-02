<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
      <div class="decoration-line line-1"></div>
      <div class="decoration-line line-2"></div>
    </div>
    
    <!-- Logo区域 -->
    <div class="logo-section">
      <div class="logo">
        <img
            alt="logo"
            src="@/assets/oj-logow.png"
            width="40px"
            height="40px"
        />
        <div class="logo-text">SOJ 在线判题系统</div>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="banner-section">
        <LoginBanner />
      </div>
      <div class="form-section">
        <div class="form-container">
          <LoginForm />
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <div class="footer-section">
      <Footer />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Footer from "@/components/LoginFooter.vue";
import LoginBanner from "./UserLoginBannerView.vue"
import LoginForm from "./UserLoginFormView.vue";
</script>

<style lang="less" scoped>
.login-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

// 背景装饰
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  right: -100px;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: -75px;
  animation: float 8s ease-in-out infinite reverse;
}

.circle-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  right: 10%;
  animation: float 7s ease-in-out infinite;
}

.decoration-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  height: 1px;
}

.line-1 {
  width: 300px;
  top: 20%;
  left: -150px;
  transform: rotate(45deg);
  animation: slide 10s linear infinite;
}

.line-2 {
  width: 200px;
  bottom: 30%;
  right: -100px;
  transform: rotate(-30deg);
  animation: slide 12s linear infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes slide {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100vw) rotate(45deg); }
}

// Logo区域
.logo-section {
  position: relative;
  z-index: 10;
  padding: 24px 32px;
}

.logo {
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  &-text {
    margin-left: 12px;
    color: #fff;
    font-size: 22px;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
}

// 主要内容区域
.main-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 32px;
  gap: 60px;
}

.banner-section {
  flex: 1;
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-section {
  flex: 1;
  max-width: 450px;
  display: flex;
  justify-content: center;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

// 页脚
.footer-section {
  position: relative;
  z-index: 10;
  padding: 24px 32px;
  text-align: center;
}

// 响应式设计
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
    gap: 40px;
    padding: 0 24px;
  }
  
  .banner-section {
    max-width: 450px;
  }
  
  .form-section {
    max-width: 400px;
  }
}

@media (max-width: 768px) {
  .login-container {
    padding: 16px;
  }
  
  .logo-section {
    padding: 16px;
  }
  
  .main-content {
    padding: 0 16px;
    gap: 32px;
  }
  
  .banner-section {
    max-width: 100%;
  }
  
  .form-section {
    max-width: 100%;
  }
  
  .form-container {
    max-width: 100%;
  }
  
  .footer-section {
    padding: 16px;
  }
  
  .decoration-circle {
    display: none;
  }
  
  .decoration-line {
    display: none;
  }
}
</style>
