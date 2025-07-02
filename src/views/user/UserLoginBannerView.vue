<template>
  <div class="banner">
    <div class="banner-inner">
      <div class="banner-header">
        <h1 class="banner-title">欢迎来到 SOJ</h1>
        <p class="banner-subtitle">在线判题系统，提升你的编程技能</p>
      </div>
      
      <div class="banner-content">
        <div class="banner-image">
          <img src="@/assets/login-banner.png" alt="banner" />
        </div>
        
        <div class="banner-features">
          <div class="feature-item">
            <icon-check-circle class="feature-icon" />
            <span>实时判题</span>
          </div>
          <div class="feature-item">
            <icon-check-circle class="feature-icon" />
            <span>多语言支持</span>
          </div>
          <div class="feature-item">
            <icon-check-circle class="feature-icon" />
            <span>社区交流</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 移除轮播相关代码，简化组件
</script>

<style lang="less" scoped>
.banner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px 0;

  &-inner {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}

.banner-header {
  margin-bottom: 40px;
  animation: fadeInUp 1s ease-out;
}

.banner-title {
  color: #fff;
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #fff 0%, #e0e7ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.banner-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  font-weight: 400;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.banner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  animation: fadeInUp 1s ease-out 0.3s both;
}

.banner-image {
  width: 320px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
    animation: float 3s ease-in-out infinite;
  }
}

.banner-features {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  justify-content: center;
  animation: fadeInUp 1s ease-out 0.6s both;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

.feature-icon {
  color: #4ade80;
  font-size: 16px;
}

// 动画效果
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .banner {
    padding: 20px 0;
  }
  
  .banner-title {
    font-size: 36px;
  }
  
  .banner-subtitle {
    font-size: 16px;
  }
  
  .banner-image {
    width: 240px;
    height: 180px;
  }
  
  .banner-features {
    gap: 16px;
  }
  
  .feature-item {
    padding: 8px 16px;
    font-size: 12px;
  }
}
</style>
