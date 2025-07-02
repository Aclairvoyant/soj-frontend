<template>
  <div class="do-question-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <a-typography-title :heading="2" class="page-title">
            <icon-code class="title-icon" />
            {{ question?.title || '题目详情' }}
          </a-typography-title>
          <a-typography-text class="subtitle">编写代码解决这道编程题目</a-typography-text>
        </div>
        <div class="header-actions">
          <a-button size="large" @click="runSelfTest" class="test-btn" :loading="testing">
            <template #icon>
              <icon-play-circle />
            </template>
            运行自测
          </a-button>
          <a-button type="primary" size="large" @click="doSubmit" class="submit-btn" :loading="submitting">
            <template #icon>
              <icon-send />
            </template>
            提交代码
          </a-button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-container">
      <a-row :gutter="[24, 24]">
        <!-- 左侧题目信息 -->
        <a-col :md="12" :xs="24">
          <div class="question-section">
            <a-card class="question-card" :bordered="false">
              <template #title>
                <div class="card-title">
                  <icon-file class="card-icon" />
                  <span>题目信息</span>
                </div>
              </template>

              <a-tabs v-model:active-key="activeTab" class="question-tabs" @change="tabChanges">
                <a-tab-pane key="question" title="题目描述">
                  <div class="tab-content">
                    <div v-if="question" class="question-info">
                      <!-- 判题条件 -->
                      <div class="judge-conditions">
                        <div class="condition-item">
                          <icon-clock-circle class="condition-icon" />
                          <span class="condition-label">时间限制:</span>
                          <span class="condition-value">{{ question.judgeConfig?.timeLimit ?? 0 }}ms</span>
                        </div>
                        <div class="condition-item">
                          <icon-storage class="condition-icon" />
                          <span class="condition-label">内存限制:</span>
                          <span class="condition-value">{{ question.judgeConfig?.memoryLimit ?? 0 }}MB</span>
                        </div>
                        <div class="condition-item">
                          <icon-layers class="condition-icon" />
                          <span class="condition-label">堆栈限制:</span>
                          <span class="condition-value">{{ question.judgeConfig?.stackLimit ?? 0 }}MB</span>
                        </div>
                      </div>

                      <!-- 题目标签 -->
                      <div class="question-tags">
                        <a-tag
                          v-for="(tag, index) of question.tags"
                          :key="index"
                          color="blue"
                          class="tag-item"
                        >
                          {{ tag }}
                        </a-tag>
                      </div>

                      <!-- 题目内容 -->
                      <div class="question-content">
                        <MdViewerV3 :modelValue="question.content || ''" />
                      </div>
                    </div>
                  </div>
                </a-tab-pane>

                <!-- 评论 -->
                <a-tab-pane key="comment" title="评论">
                  <div class="tab-content">
                    <QuestionComment v-if="question && question.id" :questionId="question.id" />
                  </div>
                </a-tab-pane>

                <!-- 答案 -->
                <a-tab-pane key="answer" title="参考答案">
                  <div class="answer-section">
                    <div class="answer-header">
                      <icon-eye class="answer-icon" />
                      <span>参考答案</span>
                    </div>
                    <div class="answer-content">
                      <MdViewerV3 :value="answer || ''" />
                    </div>
                  </div>
                </a-tab-pane>
                <a-tab-pane key="record" title="提交记录">
                  <div class="record-section">
                    <div class="record-header">
                      <icon-history class="record-icon" />
                      <span>提交历史</span>
                    </div>
                    <div class="record-table">
                      <a-table
                        :data="record"
                        :pagination="false"
                        :loading="loading"
                        class="record-table"
                      >
                        <template #columns>
                          <a-table-column title="提交时间" data-index="createTime" align="center">
                            <template #cell="{ record }">
                              <span class="submit-time">
                                {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
                              </span>
                            </template>
                          </a-table-column>
                          <a-table-column title="编程语言" data-index="language" align="center">
                            <template #cell="{ record }">
                              <a-tag :color="getLanguageColor(record.language)" class="language-tag">
                                {{ record.language }}
                              </a-tag>
                            </template>
                          </a-table-column>
                          <a-table-column title="执行结果" data-index="judgeInfo" align="center">
                            <template #cell="{ record }">
                              <a-tag
                                :color="getMessageStyleColor(record.judgeInfo?.message)"
                                class="result-tag"
                              >
                                {{ getMessageText(record.judgeInfo?.message) }}
                              </a-tag>
                            </template>
                          </a-table-column>
                          <a-table-column title="操作" align="center">
                            <template #cell="{ record }">
                              <a-button size="small" @click="showDetails(record)" class="detail-btn">
                                <template #icon>
                                  <icon-eye />
                                </template>
                                查看详情
                              </a-button>
                            </template>
                          </a-table-column>
                        </template>
                      </a-table>
                    </div>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </a-card>
          </div>
        </a-col>

        <!-- 右侧代码编辑区域 -->
        <a-col :md="12" :xs="24" v-if="isShowDetails">
          <div class="code-section">
            <a-card class="code-card" :bordered="false">
              <template #title>
                <div class="card-title">
                  <icon-code class="card-icon" />
                  <span>代码编辑</span>
                </div>
              </template>

              <!-- 语言选择 -->
              <div class="language-selector">
                <a-form :model="form" layout="inline">
                  <a-form-item field="language" label="编程语言" class="language-item">
                    <a-select
                      v-model="form.language"
                      placeholder="选择编程语言"
                      size="large"
                      class="language-select"
                      @change="changeLanguage"
                    >
                      <a-option value="java">Java</a-option>
                      <a-option value="c">C</a-option>
                      <a-option value="cpp">C++</a-option>
                      <a-option value="go">Go</a-option>
                      <a-option value="python">Python</a-option>
                    </a-select>
                  </a-form-item>
                </a-form>
              </div>

              <!-- 代码编辑器 -->
              <div class="editor-container">
                <CodeEditor
                  :value="form.code"
                  :language="form.language"
                  :handle-change="changeCode"
                  class="code-editor"
                />
              </div>

              <!-- 自测区域 -->
              <div class="self-test-section">
                <a-collapse expand-icon-position="right" bordered="false" class="test-collapse">
                  <a-collapse-item header="自测功能" key="self-test">
                    <div class="test-form">
                      <a-form :model="selfTestForm" layout="vertical">
                        <a-row :gutter="16">
                          <a-col :span="12">
                            <a-form-item label="测试输入" class="test-item">
                              <a-textarea 
                                v-model="selfTestForm.input" 
                                placeholder="请输入测试用例的输入" 
                                :rows="4"
                                class="test-textarea"
                              />
                            </a-form-item>
                          </a-col>
                          <a-col :span="12">
                            <a-form-item label="预期输出" class="test-item">
                              <a-textarea 
                                v-model="selfTestForm.expectedOutput" 
                                placeholder="请输入测试用例的预期输出" 
                                :rows="4"
                                class="test-textarea"
                              />
                            </a-form-item>
                          </a-col>
                        </a-row>
                        <a-form-item label="测试结果" class="test-item">
                          <a-textarea 
                            v-model="testResult" 
                            placeholder="测试结果会显示在这里" 
                            readonly 
                            :rows="3"
                            class="result-textarea"
                          />
                        </a-form-item>
                      </a-form>
                    </div>
                  </a-collapse-item>
                </a-collapse>
              </div>

              <!-- 操作按钮 -->
              <div class="action-buttons">
                <a-space>
                  <a-button type="primary" size="large" @click="runSelfTest" class="test-btn" :loading="testing">
                    <template #icon>
                      <icon-play-circle />
                    </template>
                    运行自测
                  </a-button>
                  <a-button type="primary" size="large" @click="doSubmit" class="submit-btn" :loading="submitting">
                    <template #icon>
                      <icon-send />
                    </template>
                    提交代码
                  </a-button>
                </a-space>
              </div>
            </a-card>
          </div>
        </a-col>

        <!-- 提交记录详情 -->
        <a-col :md="12" :xs="24" v-if="!isShowDetails">
          <div class="record-detail-section">
            <RecordDetail
              v-if="recordDataCode"
              :close-record="closeRecord"
              :record-content="recordDataCode"
            />
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, withDefaults, defineProps, computed, watch } from "vue";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import moment from "moment";
import { TableData } from "@arco-design/web-vue/es/table/interface";
import store from "@/store";
import CodeViewer from "@/components/CodeViewer.vue";
import RecordDetail from "@/components/RecordDetail.vue";
import {
  QuestionSubmitAddRequest,
  QuestionSubmitVO,
  QuestionVO, Service,
} from "../../../generated";
import MdViewerV3 from "@/components/MdViewerV3.vue";
import QuestionComment from "@/components/QuestionComment.vue";

const question = ref<QuestionVO>();
const record = ref<TableData[]>();
const answer = ref<string>();
const isShowDetails = ref<boolean>(true);
const recordDataCode = ref<QuestionSubmitVO>();

// 新增状态管理
const loading = ref(false);
const submitting = ref(false);
const testing = ref(false);
const activeTab = ref('question');

interface Props {
  id: string;
}

const closeRecord = () => {
  isShowDetails.value = !isShowDetails.value;
};

// 代码模板
const codeTemplates = {
  java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // 在这里编写你的代码
        
    }
}`,
  c: `#include <stdio.h>

int main() {
    // 在这里编写你的代码
    
    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

int main() {
    // 在这里编写你的代码
    
    return 0;
}`,
  go: `package main

import (
    "fmt"
)

func main() {
    // 在这里编写你的代码
    
}`,
  python: `# 在这里编写你的代码

`
};

// 计算属性
const currentTemplate = computed(() => {
  return codeTemplates[form.value.language as keyof typeof codeTemplates] || '';
});

const canSubmit = computed(() => {
  return form.value.code?.trim() && !submitting.value;
});

const canTest = computed(() => {
  return form.value.code?.trim() && !testing.value;
});

type Style = {
  text: string;
  color: string;
};

const messageList: { [key: string]: Style } = {
  // 执行结果
  "Accepted": {text: "成功", color: "#4CAF50"}, // 绿色
  "Wrong Answer": {text: "答案错误", color: "#f44336"}, // 红色
  "Runtime Error": {text: "运行时错误", color: "#FF9800"}, // 橙色
  "Time Limit Exceeded": {text: "超时", color: "#3F51B5"}, // 深蓝色
  "Memory Limit Exceeded": {text: "超内存", color: "#9C27B0"}, // 紫色
  "Output Limit Exceeded": {text: "输出超限", color: "#00BCD4"}, // 青色
  "Compile Error": {text: "编译错误", color: "#E91E63"}, // 粉红色
  "System Error": {text: "系统错误", color: "#9E9E9E"}, // 灰色
  "Unknown Error": {text: "未知错误", color: "#607D8B"}, // 蓝灰色
  "Pending": {text: "等待中", color: "#FFEB3B"}, // 黄色
  "Dangerous Operation": {text: "危险操作", color: "#673AB7"} // 深紫色
}

const getMessageStyleColor = (message: string): string => {
  // 检查 message 是否存在于 messageList 中
  if (message in messageList) {
    return messageList[message].color;
  } else {
    return "#9E9E9E";
  }
};

const getMessageText = (message: string): string => {
  // 检查 message 是否存在于 messageList 中
  if (message in messageList) {
    return messageList[message].text;
  } else {
    return message || "未知";
  }
};

const getLanguageColor = (language: string): string => {
  const languageColors: { [key: string]: string } = {
    java: "blue",
    c: "green",
    cpp: "purple",
    go: "cyan",
    python: "orange"
  };
  return languageColors[language] || "default";
};

const selfTestForm = ref({
  input: '',
  expectedOutput: '',
});

const testResult = ref(''); // 用于存储测试结果

// 自动保存代码
const autoSaveCode = () => {
  if (question.value?.id) {
    localStorage.setItem(`code_${question.value.id}`, form.value?.code || '');
  }
};

// 加载保存的代码
const loadSavedCode = () => {
  if (question.value?.id) {
    const savedCode = localStorage.getItem(`code_${question.value.id}`);
    if (savedCode && savedCode.trim()) {
      form.value.code = savedCode;
    } else {
      // 如果没有保存的代码，使用当前语言的模板
      form.value.code = codeTemplates[form.value.language as keyof typeof codeTemplates] || '';
    }
  }
};

const runSelfTest = async () => {
  if (!form.value.code?.trim()) {
    message.warning('请先编写代码');
    return;
  }

  if (selfTestForm.value.input === '' && selfTestForm.value.expectedOutput === '') {
    message.warning('请输入测试用例');
    return;
  }

  testing.value = true;
  try {
    const res = await Service.runQuestionSubmitUsingPost({
      code: form.value.code || '',
      input: selfTestForm.value.input,
      language: form.value.language,
    });
    
    if (res.code === 200) {
      const output = res.data?.output;
      const expectedOutput = selfTestForm.value.expectedOutput;

      if (output === expectedOutput) {
        message.success("测试通过！输出结果与预期一致");
      } else {
        message.info(`测试结果: ${output}`);
      }

      testResult.value = output || '无输出';
    } else {
      message.error("测试失败，" + res.message);
      testResult.value = '测试失败';
    }
  } catch (error) {
    message.error("测试失败，请稍后重试");
    testResult.value = '测试失败';
  } finally {
    testing.value = false;
  }
};

// 切换编程语言时自动更新代码模板
const changeLanguage = (language: string) => {
  const oldLanguage = form.value.language;
  form.value.language = language;
  
  // 获取新语言的模板
  const newTemplate = codeTemplates[language as keyof typeof codeTemplates] || '';
  const oldTemplate = codeTemplates[oldLanguage as keyof typeof codeTemplates] || '';
  
  // 如果当前代码是旧语言的模板代码，或者是空的，则应用新语言的模板
  if (form.value.code === oldTemplate || !form.value?.code?.trim()) {
    form.value.code = newTemplate;
  }
};

/**
 * 当tabs标签变化时
 * @param key
 */
const tabChanges = async (key: string) => {
  activeTab.value = key;
  
  if (key === "record") {
    loading.value = true;
    try {
      const res = await Service.listQuestionSubmitByPageUsingPost({
        userId: store.state.user?.loginUser?.id,
        questionId: question.value?.id,
        sortField: "createTime",
        sortOrder: "descend",
      });
      if (res.code === 200) {
        record.value = res.data.records;
      } else {
        message.error("加载失败，" + res.message);
      }
    } catch (error) {
      message.error("加载失败，请稍后重试");
    } finally {
      loading.value = false;
    }
  } else if (key === "answer") {
    loading.value = true;
    try {
      //请求答案
      const res = await Service.getQuestionAnswerUsingGet(
        question.value?.id as any
      );
      if (res.code === 200) {
        answer.value = res.data;
      } else {
        message.error("加载失败，" + res.message);
      }
    } catch (error) {
      message.error("加载失败，请稍后重试");
    } finally {
      loading.value = false;
    }
  }
};

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const loadData = async () => {
  loading.value = true;
  try {
    const res = await Service.getQuestionVoByIdUsingGet(
      props.id as any
    );
    if (res.code === 200) {
      question.value = res.data;
      // 加载保存的代码
      loadSavedCode();
    } else {
      message.error("加载失败，" + res.message);
    }
  } catch (error) {
    message.error("加载失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};

const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
});

const showDetails = (record: any) => {
  recordDataCode.value = record;
  isShowDetails.value = false;
};

/**
 * 提交代码
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    message.warning('题目信息加载中，请稍后重试');
    return;
  }

  if (!form.value.code?.trim()) {
    message.warning('请先编写代码');
    return;
  }

  submitting.value = true;
  try {
    const res = await Service.doQuestionSubmitUsingPost({
      ...form.value,
      questionId: question.value.id,
    });
    if (res.code === 200) {
      message.success("提交成功！");
      // 提交成功后切换到提交记录tab
      activeTab.value = 'record';
      // 重新加载提交记录
      await tabChanges('record');
    } else {
      message.error("提交失败," + res.message);
    }
  } catch (error) {
    message.error("提交失败，请稍后重试");
  } finally {
    submitting.value = false;
  }
};

// 监听代码变化，自动保存
watch(() => form.value.code, () => {
  if (question.value?.id && form.value.code) {
    localStorage.setItem(`code_${question.value.id}`, form.value.code);
  }
}, { deep: true });

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
  // 确保初始代码模板
  if (!form.value.code) {
    form.value.code = codeTemplates[form.value.language as keyof typeof codeTemplates] || '';
  }
});

const changeCode = (value: string) => {
  form.value.code = value || '';
};
</script>

<style scoped>
.do-question-view {
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
}

.page-header {
  background: #fff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  flex-shrink: 0;
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.question-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.question-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.question-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.question-tabs :deep(.arco-tabs-content) {
  flex: 1;
  overflow: hidden;
}

.question-tabs :deep(.arco-tabs-tabpane) {
  height: 100%;
  overflow: auto;
}

.question-description {
  padding: 24px;
  line-height: 1.8;
  color: #1d2129;
  flex: 1;
  overflow-y: auto;
  min-height: 400px;
}

.question-description :deep(.markdown-body) {
  background: transparent;
  color: inherit;
}

.question-description :deep(.markdown-body h1),
.question-description :deep(.markdown-body h2),
.question-description :deep(.markdown-body h3),
.question-description :deep(.markdown-body h4),
.question-description :deep(.markdown-body h5),
.question-description :deep(.markdown-body h6) {
  color: #1d2129;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  border-bottom: none;
}

.question-description :deep(.markdown-body p) {
  margin-bottom: 16px;
  color: #4e5969;
}

.question-description :deep(.markdown-body code) {
  background: #f2f3f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: #165dff;
  border: none;
}

.question-description :deep(.markdown-body pre) {
  background: #f7f8fa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e6eb;
  overflow-x: auto;
  margin: 16px 0;
}

.question-description :deep(.markdown-body pre code) {
  background: transparent;
  padding: 0;
  color: #1d2129;
}

.question-description :deep(.markdown-body blockquote) {
  border-left: 4px solid #165dff;
  padding-left: 16px;
  margin: 16px 0;
  color: #4e5969;
  background: #f0f9ff;
  padding: 12px 16px;
  border-radius: 0 8px 8px 0;
}

.question-description :deep(.markdown-body ul),
.question-description :deep(.markdown-body ol) {
  padding-left: 24px;
  margin: 16px 0;
}

.question-description :deep(.markdown-body li) {
  margin-bottom: 8px;
  color: #4e5969;
}

.question-description :deep(.markdown-body table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.question-description :deep(.markdown-body th),
.question-description :deep(.markdown-body td) {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e6eb;
}

.question-description :deep(.markdown-body th) {
  background: #f7f8fa;
  font-weight: 600;
  color: #1d2129;
}

.question-description :deep(.markdown-body tr:hover) {
  background: #f0f9ff;
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

.test-btn {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  border: none;
  color: #fff;
  font-weight: 600;
  border-radius: 8px;
  padding: 8px 24px;
  height: 40px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);
}

.test-btn:hover {
  background: linear-gradient(135deg, #389e0d 0%, #237804 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.4);
  color: #fff;
}

.test-btn:active {
  transform: translateY(0);
}

.submit-btn {
  background: linear-gradient(135deg, #165dff 0%, #0e42d2 100%);
  border: none;
  color: #fff;
  font-weight: 600;
  border-radius: 8px;
  padding: 8px 24px;
  height: 40px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.3);
}

.submit-btn:hover {
  background: linear-gradient(135deg, #0e42d2 0%, #0a2f9e 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.4);
  color: #fff;
}

.submit-btn:active {
  transform: translateY(0);
}

.main-content {
  margin-bottom: 24px;
}

.question-section {
  height: 100%;
}

.question-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  height: 100%;
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
  font-size: 16px;
}

.question-tabs {
  height: 100%;
}

.question-tabs :deep(.arco-tabs-content) {
  height: calc(100% - 48px);
  overflow-y: auto;
}

.tab-content {
  padding: 16px 0;
}

.question-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.judge-conditions {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: #f7f8fa;
  border-radius: 12px;
  border: 1px solid #e5e6eb;
}

.condition-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.condition-icon {
  color: #165dff;
  font-size: 16px;
}

.condition-label {
  color: #86909c;
  font-weight: 500;
}

.condition-value {
  color: #1d2129;
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.question-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 12px;
}

.question-content {
  background: #fafbfc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e5e6eb;
}

.answer-section {
  background: #f0f9ff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e0f2fe;
}

.answer-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #165dff;
  margin-bottom: 16px;
}

.answer-icon {
  font-size: 18px;
}

.record-section {
  background: #f7f8fa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e5e6eb;
}

.record-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 16px;
}

.record-icon {
  font-size: 18px;
  color: #165dff;
}

.record-table {
  border-radius: 8px;
  overflow: hidden;
}

.record-table :deep(.arco-table-th) {
  background: #f7f8fa;
  font-weight: 600;
  color: #1d2129;
  border-bottom: 1px solid #e5e6eb;
}

.record-table :deep(.arco-table-td) {
  border-bottom: 1px solid #f2f3f5;
  padding: 12px;
}

.language-tag {
  font-weight: 500;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
}

.result-tag {
  font-weight: 500;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
}

.submit-time {
  font-size: 14px;
  color: #1d2129;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.detail-btn {
  border-radius: 6px;
  font-size: 12px;
  padding: 2px 8px;
  transition: all 0.3s ease;
}

.detail-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.2);
}

.code-section {
  height: 100%;
}

.code-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.language-selector {
  padding: 16px 0;
  border-bottom: 1px solid #f2f3f5;
  margin-bottom: 16px;
}

.language-item {
  margin-bottom: 0;
}

.language-select {
  width: 160px;
  border-radius: 8px;
}

.editor-container {
  flex: 1;
  min-height: 400px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.code-editor {
  height: 100%;
  border-radius: 8px;
  border: 1px solid #e5e6eb;
  flex: 1;
  min-height: 350px;
}

.self-test-section {
  margin-bottom: 16px;
}

.test-collapse {
  border-radius: 8px;
  border: 1px solid #e5e6eb;
}

.test-collapse :deep(.arco-collapse-item-header) {
  background: #f7f8fa;
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  color: #165dff;
}

.test-form {
  padding: 16px;
}

.test-item {
  margin-bottom: 16px;
}

.test-textarea {
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
}

.result-textarea {
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  background: #f0f9ff;
  border-color: #e0f2fe;
}

.action-buttons {
  padding: 16px 0;
  border-top: 1px solid #f2f3f5;
  display: flex;
  justify-content: center;
}

.record-detail-section {
  height: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .do-question-view {
    padding: 16px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .judge-conditions {
    flex-direction: column;
    gap: 12px;
  }
  
  .editor-container {
    min-height: 300px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
