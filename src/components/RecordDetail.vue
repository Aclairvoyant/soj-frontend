<template>
  <div class="record-detail">
    <a-card class="detail-card" :bordered="false">
      <template #title>
        <div class="card-title">
          <icon-file class="card-icon" />
          <span>提交详情</span>
          <a-button 
            type="text" 
            size="small" 
            @click="props.closeRecord" 
            class="close-btn"
          >
            <template #icon>
              <icon-close />
            </template>
          </a-button>
        </div>
      </template>
      
      <div class="detail-content">
        <a-scrollbar style="height: calc(100vh - 200px); overflow: auto">
          <!-- 判题信息 -->
          <div class="judge-section">
            <div class="section-header">
              <icon-info-circle class="section-icon" />
              <span class="section-title">判题信息</span>
            </div>
            <a-alert
              :type="props.recordContent.status === 2 ? 'success' : 'error'"
              class="judge-alert"
              :show-icon="false"
            >
              <template #message>
                <div class="alert-content">
                  <icon-check-circle v-if="props.recordContent.status === 2" class="alert-icon success" />
                  <icon-close-circle v-else class="alert-icon error" />
                  <span class="alert-text">{{ props.recordContent.judgeInfo }}</span>
                </div>
              </template>
            </a-alert>
          </div>

          <!-- 提交信息 -->
          <div class="info-section">
            <div class="section-header">
              <icon-tag class="section-icon" />
              <span class="section-title">提交信息</span>
            </div>
            <div class="info-tags">
              <div class="info-item">
                <span class="info-label">编程语言：</span>
                <a-tag color="blue" class="info-tag">
                  {{ props.recordContent.language }}
                </a-tag>
              </div>
              <div class="info-item" v-if="props.recordContent.status === 2">
                <span class="info-label">运行内存：</span>
                <a-tag color="green" class="info-tag">
                  {{ props.recordContent.judgeInfo?.memory }}KB
                </a-tag>
              </div>
              <div class="info-item" v-if="props.recordContent.status === 2">
                <span class="info-label">执行时间：</span>
                <a-tag color="orange" class="info-tag">
                  {{ props.recordContent.judgeInfo?.time }}ms
                </a-tag>
              </div>
            </div>
          </div>

          <!-- 代码内容 -->
          <div class="code-section">
            <div class="section-header">
              <icon-code class="section-icon" />
              <span class="section-title">提交代码</span>
            </div>
            <div class="code-content">
              <MdViewerV3 :modelValue="codeContent" />
            </div>
          </div>
        </a-scrollbar>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  watchEffect,
  withDefaults,
  defineProps,
  onMounted,
  watch,
} from "vue";
import { useStore } from "vuex";
import {QuestionSubmitVO} from "../../generated";
import MdViewerV3 from "@/components/MdViewerV3.vue";

interface Props {
  recordContent: QuestionSubmitVO;
  closeRecord: () => void;
}

const props = withDefaults(defineProps<Props>(), {});
const codeContent = ref();
const v1 = "```";

watchEffect(() => {
  codeContent.value = `${v1}${props.recordContent.language}\n${props.recordContent.code}`;
});

const store = useStore();
</script>

<style scoped>
.record-detail {
  height: 100%;
}

.detail-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1d2129;
  justify-content: space-between;
}

.card-icon {
  color: #165dff;
  font-size: 18px;
}

.close-btn {
  color: #86909c;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #165dff;
  background: #f0f9ff;
  border-radius: 6px;
}

.detail-content {
  flex: 1;
  overflow: hidden;
}

.judge-section,
.info-section,
.code-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f2f3f5;
}

.section-icon {
  color: #165dff;
  font-size: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
}

.judge-alert {
  border-radius: 8px;
  border: none;
}

.judge-alert :deep(.arco-alert-message) {
  padding: 0;
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.alert-icon {
  font-size: 16px;
}

.alert-icon.success {
  color: #52c41a;
}

.alert-icon.error {
  color: #f5222d;
}

.alert-text {
  font-weight: 500;
  font-size: 14px;
}

.info-tags {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.info-label {
  color: #4e5969;
  font-weight: 500;
  min-width: 80px;
}

.info-tag {
  font-weight: 500;
  border-radius: 6px;
  padding: 2px 8px;
}

.code-content {
  background: #f7f8fa;
  border-radius: 8px;
  border: 1px solid #e5e6eb;
  overflow: hidden;
}

.code-content :deep(.markdown-body) {
  background: transparent;
  padding: 16px;
}

.code-content :deep(.markdown-body pre) {
  background: #1e1e1e;
  border-radius: 6px;
  margin: 0;
}

.code-content :deep(.markdown-body code) {
  background: transparent;
  color: #d4d4d4;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-card {
    border-radius: 12px;
  }
  
  .section-header {
    margin-bottom: 12px;
  }
  
  .info-item {
    padding: 8px 12px;
  }
  
  .info-label {
    min-width: 60px;
    font-size: 12px;
  }
  
  .code-content :deep(.markdown-body) {
    padding: 12px;
  }
}
</style>
