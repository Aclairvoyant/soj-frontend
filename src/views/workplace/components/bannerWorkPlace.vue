<template>
  <a-card class="welcome-banner" :bordered="false">
    <div class="banner-content">
      <div class="welcome-section">
        <div class="welcome-icon">
          <icon-sun />
        </div>
        <div class="welcome-text">
          <a-typography-title :heading="4" class="welcome-title">
            欢迎回来！{{ store.state.user.loginUser.userName }}
          </a-typography-title>
          <a-typography-text class="welcome-subtitle">
              {{ dailyQuote }}
            <a-spin v-if="loading" size="mini" class="quote-loading" />
            <a-button 
              v-show="!loading" 
              type="text" 
              size="mini" 
              class="refresh-quote-btn"
              @click="fetchDailyQuote"
              title="换一句"
            >
              <template #icon>
                <icon-refresh />
              </template>
            </a-button>
          </a-typography-text>
        </div>
      </div>
      
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import axios from "axios";
import store from "../../../store";
import { ref, onMounted } from "vue";

const dailyQuote = ref("今天也要加油哦！");
const loading = ref(false);

// 获取每日一言
const fetchDailyQuote = async () => {
  loading.value = true;
  try {
    // 尝试使用fetch API
    const response = await fetch('https://v1.hitokoto.cn/?c=i&encode=json', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.hitokoto) {
        dailyQuote.value = data.hitokoto;
      }
    } else {
      throw new Error('API请求失败');
    }
  } catch (error) {
    console.log('获取每日一言失败，尝试JSONP方式');
    // 如果fetch失败，尝试JSONP方式
    try {
      const script = document.createElement('script');
      const callbackName = 'hitokotoCallback_' + Date.now();
      
      // 创建全局回调函数
      (window as any)[callbackName] = (data: any) => {
        if (data && data.hitokoto) {
          dailyQuote.value = data.hitokoto;
        }
        loading.value = false;
        // 清理
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        delete (window as any)[callbackName];
      };
      
      script.src = `https://v1.hitokoto.cn/?c=i&encode=json&callback=${callbackName}`;
      script.onerror = () => {
        console.log('JSONP也失败了，使用默认文案');
        dailyQuote.value = "今天也要加油哦！";
        loading.value = false;
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        delete (window as any)[callbackName];
      };
      
      // 添加超时机制
      const timeout = setTimeout(() => {
        console.log('获取每日一言超时，使用默认文案');
        dailyQuote.value = "今天也要加油哦！";
        loading.value = false;
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        delete (window as any)[callbackName];
      }, 5000);
      
      // 修改回调函数，清除超时
      const originalCallback = (window as any)[callbackName];
      (window as any)[callbackName] = (data: any) => {
        clearTimeout(timeout);
        originalCallback(data);
      };
      
      document.head.appendChild(script);
      return; // 如果是JSONP方式，不执行finally块
    } catch (jsonpError) {
      console.log('所有方法都失败了，使用默认文案');
      dailyQuote.value = "今天也要加油哦！";
    }
  }
  
  // 只有在非JSONP方式时才执行到这里
  loading.value = false;
};

onMounted(() => {
  fetchDailyQuote();
});
</script>

<style scoped>
.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  border: none;
  overflow: hidden;
  position: relative;
}

.welcome-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  position: relative;
  z-index: 1;
}

.welcome-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.welcome-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.welcome-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.welcome-title {
  margin: 0 !important;
  color: #fff !important;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-subtitle {
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.quote-loading {
  color: rgba(255, 255, 255, 0.7);
}

.refresh-quote-btn {
  color: rgba(255, 255, 255, 0.7);
  padding: 2px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.refresh-quote-btn:hover {
  color: rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.1);
}

.banner-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .welcome-section {
    flex-direction: column;
    gap: 12px;
  }
  
  .banner-actions {
    width: 100%;
    justify-content: center;
  }
  
  .welcome-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
</style>
