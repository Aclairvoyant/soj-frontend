<template>
  <a-card class="data-panel-card" :bordered="false">
    <template #title>
      <div class="card-title">
        <icon-bar-chart class="card-icon" />
        <span>数据概览</span>
      </div>
    </template>
    
    <a-grid :cols="24" :row-gap="16" class="panel">
      <a-grid-item
        class="panel-col"
        :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 12 }"
      >
        <div class="stat-card">
          <div class="stat-icon submit-icon">
            <icon-code />
          </div>
          <div class="stat-content">
            <a-statistic
              title="提交总数"
              :value="commitCount"
              animation
              show-group-separator
              class="statistic"
            >
              <template #suffix><span class="unit">道</span></template>
            </a-statistic>
          </div>
        </div>
      </a-grid-item>
      
      <a-grid-item
        class="panel-col"
        :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 12 }"
      >
        <div class="stat-card">
          <div class="stat-icon solve-icon">
            <icon-check-circle />
          </div>
          <div class="stat-content">
            <a-statistic
              title="已解决题目数"
              :value="questionSolveCount"
              animation
              show-group-separator
              class="statistic"
            >
              <template #suffix>
                <span class="unit">道</span>
              </template>
            </a-statistic>
          </div>
        </div>
      </a-grid-item>
      
      <a-grid-item
        class="panel-col"
        :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 12 }"
      >
        <div class="stat-card">
          <div class="stat-icon comment-icon">
            <icon-message />
          </div>
          <div class="stat-content">
            <a-statistic
              title="日新增评论"
              :value="8874"
              :value-from="0"
              animation
              show-group-separator
              class="statistic"
            >
              <template #suffix>
                <span class="unit">个</span>
              </template>
            </a-statistic>
          </div>
        </div>
      </a-grid-item>
      
      <a-grid-item
        class="panel-col"
        :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 12 }"
      >
        <div class="stat-card">
          <div class="stat-icon growth-icon">
            <icon-up />
          </div>
          <div class="stat-content">
            <a-statistic
              title="较昨日新增"
              :value="2.8"
              :precision="1"
              :value-from="0"
              animation
              class="statistic"
            >
              <template #suffix>
                %
                <icon-caret-up class="up-icon" />
              </template>
            </a-statistic>
          </div>
        </div>
      </a-grid-item>
    </a-grid>
  </a-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import message from "@arco-design/web-vue/es/message";
import {
   Service
} from "../../../../generated";

const commitCount = ref(0);
const questionSolveCount = ref(0);

onMounted(async () => {
  try {
    //初始化个人数据
    const personalData = await Service.getPersonalDataUsingGet()
    commitCount.value = parseInt(personalData.data?.commitCount as unknown as string) ?? 0;
    questionSolveCount.value = parseInt(personalData.data?.questionSolveCount as unknown as string) ?? 0;
  } catch (e) {
    message.error("个人数据请求失败");
  }
});
</script>

<style scoped>
.data-panel-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  overflow: hidden;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1d2129;
}

.card-icon {
  color: #165dff;
  font-size: 18px;
}

.panel {
  margin: 0;
  padding: 0;
}

.panel-col {
  padding: 0;
  border: none;
}

.stat-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #165dff, #4080ff);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #165dff;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  flex-shrink: 0;
}

.submit-icon {
  background: linear-gradient(135deg, #165dff 0%, #4080ff 100%);
}

.solve-icon {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.comment-icon {
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
}

.growth-icon {
  background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.statistic {
  width: 100%;
}

.statistic :deep(.arco-statistic-title) {
  color: #4e5969;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.statistic :deep(.arco-statistic-value) {
  color: #1d2129;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

.unit {
  margin-left: 4px;
  color: #86909c;
  font-size: 14px;
  font-weight: 500;
}

.up-icon {
  color: #52c41a;
  margin-left: 4px;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stat-card {
    padding: 16px;
    gap: 12px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .statistic :deep(.arco-statistic-value) {
    font-size: 20px;
  }
  
  .statistic :deep(.arco-statistic-title) {
    font-size: 12px;
  }
}
</style>
