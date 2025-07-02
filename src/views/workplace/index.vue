<template>
  <div class="workplace-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <a-typography-title :heading="2" class="page-title">
            <icon-dashboard class="title-icon" />
            个人数据总览
          </a-typography-title>
          <a-typography-text class="subtitle">欢迎回来！这里是你的学习数据概览</a-typography-text>
        </div>
        <div class="header-actions">
          <a-button type="primary" size="large" class="refresh-btn">
            <template #icon>
              <icon-refresh />
            </template>
            刷新数据
          </a-button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <a-grid :cols="24" :col-gap="24" :row-gap="24">
        <!-- 用户信息和数据面板 -->
        <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }">
          <div class="left-panel">
            <Banner/>
            <aboutView />
            <div class="data-panel-wrapper">
              
              <DataPanel />
            </div>
          </div>
        </a-grid-item>

        <!-- 右侧面板 -->
        <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }">
          <div class="right-panel">
            <PopularContent />
            <CategoriesPercent />
          </div>
        </a-grid-item>
      </a-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Banner from "./components/bannerWorkPlace.vue";
import DataPanel from "./components/data-panel.vue";
import PopularContent from "./components/popular-content.vue";
import CategoriesPercent from "./components/categories-percent.vue";
import AboutView from "@/views/workplace/components/aboutView.vue";
import ContentChart from "@/views/workplace/components/content-chart.vue";
</script>

<script lang="ts">
export default {
  name: "DashboardWorkPlace",
};
</script>

<style scoped>
.workplace-container {
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  background: #fff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-section {
  display: flex;
  flex-direction: column;
}

.page-title {
  margin: 0 !important;
  color: #1d2129;
  display: flex;
  align-items: center;
}

.title-icon {
  margin-right: 12px;
  color: #165dff;
  font-size: 24px;
}

.subtitle {
  margin-top: 8px;
  color: #86909c;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.refresh-btn {
  background: linear-gradient(135deg, #165dff 0%, #0e42d2 100%);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.3);
}

.refresh-btn:hover {
  background: linear-gradient(135deg, #0e42d2 0%, #0a2f9e 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.4);
}

.main-content {
  margin-bottom: 24px;
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.data-panel-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .workplace-container {
    padding: 16px;
  }
  
  .page-header {
    padding: 24px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    justify-content: center;
  }
  
  .left-panel,
  .right-panel {
    gap: 16px;
  }
}
</style>
