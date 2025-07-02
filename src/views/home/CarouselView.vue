<template>
  <div class="carousel-container">
    <a-carousel
      :style="{
        width: '100%',
        height: '400px',
      }"
      :default-current="0"
      :autoplay="true"
      :autoplay-speed="5000"
      :show-arrow="true"
      :show-dots="true"
      dot-position="bottom"
      class="modern-carousel"
    >
      <a-carousel-item v-for="(slide, index) in slides" :key="index">
        <div class="carousel-slide" :style="{ backgroundImage: `url(${slide.image})` }">
          <div class="slide-overlay">
            <div class="slide-content">
              <h2 class="slide-title">{{ slide.title }}</h2>
              <p class="slide-description">{{ slide.description }}</p>
              <div class="slide-actions">
                <a-button type="primary" size="large" @click="handleSlideAction(slide)">
                  {{ slide.buttonText }}
                </a-button>
                <a-button size="large" @click="handleSlideSecondary(slide)">
                  {{ slide.secondaryButtonText }}
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </a-carousel-item>
    </a-carousel>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

// 轮播图数据
const slides = [
  {
    title: "提升编程技能",
    description: "通过在线判题系统，系统性地提升你的算法和编程能力",
    image: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp",
    buttonText: "开始练习",
    secondaryButtonText: "了解更多",
    action: () => router.push('/questions'),
    secondaryAction: () => router.push('/about')
  },
  {
    title: "丰富的题目资源",
    description: "涵盖数据结构、算法、动态规划等多个领域的精选题目",
    image: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp",
    buttonText: "浏览题目",
    secondaryButtonText: "查看题单",
    action: () => router.push('/questions'),
    secondaryAction: () => router.push('/problemsets')
  },
  {
    title: "社区交流学习",
    description: "加入编程社区，与其他学习者分享经验和心得",
    image: "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp",
    buttonText: "加入讨论",
    secondaryButtonText: "查看帖子",
    action: () => router.push('/posts'),
    secondaryAction: () => router.push('/posts')
  }
];

// 处理轮播图主按钮点击
const handleSlideAction = (slide: any) => {
  if (slide.action) {
    slide.action();
  }
};

// 处理轮播图次要按钮点击
const handleSlideSecondary = (slide: any) => {
  if (slide.secondaryAction) {
    slide.secondaryAction();
  }
};
</script>

<style lang="less" scoped>
.carousel-container {
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.modern-carousel {
  :deep(.arco-carousel-indicator) {
    bottom: 20px;
    
    .arco-carousel-indicator-dot {
      width: 12px;
      height: 12px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.4);
      border: 2px solid transparent;
      transition: all 0.3s ease;
      
      &.arco-carousel-indicator-dot-active {
        background: #fff;
        border-color: #165dff;
        transform: scale(1.2);
      }
      
      &:hover {
        background: rgba(255, 255, 255, 0.8);
      }
    }
  }
  
  :deep(.arco-carousel-arrow) {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    color: #1d2129;
    font-size: 18px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    
    &:hover {
      background: #fff;
      transform: scale(1.1);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
  }
}

.carousel-slide {
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-content {
  text-align: center;
  color: white;
  max-width: 600px;
  padding: 0 40px;
  animation: slideIn 0.8s ease-out;
}

.slide-title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 16px 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.slide-description {
  font-size: 18px;
  margin: 0 0 32px 0;
  opacity: 0.9;
  line-height: 1.6;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.slide-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  
  .arco-btn {
    height: 48px;
    padding: 0 32px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.3s ease;
    
    &.arco-btn-primary {
      background: linear-gradient(135deg, #165dff 0%, #4080ff 100%);
      border: none;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(22, 93, 255, 0.3);
      }
    }
    
    &:not(.arco-btn-primary) {
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: white;
      backdrop-filter: blur(10px);
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
      }
    }
  }
}

// 动画效果
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .slide-title {
    font-size: 36px;
  }
  
  .slide-description {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .carousel-slide {
    height: 300px;
  }
  
  .slide-content {
    padding: 0 20px;
  }
  
  .slide-title {
    font-size: 28px;
    margin-bottom: 12px;
  }
  
  .slide-description {
    font-size: 14px;
    margin-bottom: 24px;
  }
  
  .slide-actions {
    flex-direction: column;
    align-items: center;
    
    .arco-btn {
      width: 200px;
      height: 44px;
      font-size: 14px;
    }
  }
  
  .modern-carousel {
    :deep(.arco-carousel-arrow) {
      width: 40px;
      height: 40px;
      font-size: 16px;
    }
  }
}

@media (max-width: 480px) {
  .carousel-slide {
    height: 250px;
  }
  
  .slide-title {
    font-size: 24px;
  }
  
  .slide-description {
    font-size: 12px;
  }
  
  .slide-actions .arco-btn {
    width: 160px;
    height: 40px;
    font-size: 12px;
  }
}
</style>
