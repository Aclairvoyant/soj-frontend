<template>
  <div class="add-question-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <a-typography-title :heading="2" class="page-title">
            <icon-plus-circle class="title-icon" />
            {{ updatePage ? "修改题目" : "创建题目" }}
          </a-typography-title>
          <a-typography-text class="subtitle">
            {{ updatePage ? "修改现有题目的内容和配置" : "创建新的编程题目，设置判题规则和测试用例" }}
          </a-typography-text>
        </div>
        <div class="header-actions">
          <a-button size="large" @click="doCleanDraft" class="clear-btn">
            <template #icon>
              <icon-delete />
            </template>
            清除草稿
          </a-button>
          <a-button type="primary" size="large" @click="doSubmit" class="submit-btn">
            <template #icon>
              <icon-check />
            </template>
            {{ updatePage ? "更新题目" : "创建题目" }}
          </a-button>
        </div>
      </div>
    </div>

    <!-- 表单内容 -->
    <div class="form-section">
      <a-card class="form-card" :bordered="false">
        <template #title>
          <div class="card-title">
            <icon-file class="card-icon" />
            <span>题目信息</span>
          </div>
        </template>

        <a-form :model="form" label-align="left" class="question-form">
          <!-- 基本信息 -->
          <div class="form-section-title">
            <icon-info-circle class="section-icon" />
            <span>基本信息</span>
          </div>
          
          <a-form-item field="title" label="题目标题" class="form-item">
            <a-input 
              v-model="form.title" 
              @update:modelValue="onFieldUpdate" 
              placeholder="请输入题目标题..." 
              size="large"
              class="title-input"
            >
              <template #prefix>
                <icon-tag />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item field="tags" label="题目标签" class="form-item">
            <a-input-tag 
              v-model="form.tags" 
              placeholder="添加标签（按回车确认）" 
              allow-clear
              class="tags-input"
            />
          </a-form-item>

          <!-- 题目内容 -->
          <div class="form-section-title">
            <icon-book class="section-icon" />
            <span>题目内容</span>
          </div>

          <a-form-item field="content" label="题目描述" class="form-item">
            <div class="editor-container">
              <MdEditorV3 
                v-model="form.content" 
                :handle-change="onContentChange"
                class="markdown-editor"
              />
            </div>
          </a-form-item>

          <a-form-item field="answer" label="参考答案" class="form-item">
            <div class="editor-container">
              <MdEditorV3 
                v-model="form.answer" 
                :handle-change="onAnswerChange"
                class="markdown-editor"
              />
            </div>
          </a-form-item>

          <!-- 判题配置 -->
          <div class="form-section-title">
            <icon-settings class="section-icon" />
            <span>判题配置</span>
          </div>

          <div class="judge-config">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="judgeConfig.timeLimit" label="时间限制 (ms)" class="config-item">
                  <a-input-number
                    v-model="form.judgeConfig.timeLimit"
                    placeholder="请输入时间限制"
                    mode="button"
                    :min="0"
                    size="large"
                    :step="100"
                    class="config-input"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="judgeConfig.memoryLimit" label="内存限制 (MB)" class="config-item">
                  <a-input-number
                    v-model="form.judgeConfig.memoryLimit"
                    placeholder="请输入内存限制"
                    mode="button"
                    :min="0"
                    size="large"
                    :step="10"
                    class="config-input"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="judgeConfig.stackLimit" label="堆栈限制 (MB)" class="config-item">
                  <a-input-number
                    v-model="form.judgeConfig.stackLimit"
                    placeholder="请输入堆栈限制"
                    mode="button"
                    :min="0"
                    size="large"
                    :step="10"
                    class="config-input"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <!-- 测试用例 -->
          <div class="form-section-title">
            <icon-bug class="section-icon" />
            <span>测试用例</span>
            <div class="section-actions">
              <a-button @click="toggleAllCases" class="toggle-btn">
                <template #icon>
                  <icon-down v-if="allCasesCollapsed" />
                  <icon-up v-else />
                </template>
                {{ allCasesCollapsed ? "展开全部" : "收起全部" }}
              </a-button>
              <a-button @click="handleDeleteAllCases" status="danger" class="delete-all-btn">
                <template #icon>
                  <icon-delete />
                </template>
                删除全部
              </a-button>
            </div>
          </div>

          <div class="test-cases">
            <div v-for="(judgeCaseItem, index) in form.judgeCase" :key="index" class="test-case-item">
              <a-card class="case-card" :bordered="false" v-show="!allCasesCollapsed">
                <template #title>
                  <div class="case-title">
                    <span class="case-number">测试用例 #{{ index + 1 }}</span>
                    <a-button 
                      status="danger" 
                      size="small"
                      @click="() => handleDelete(index)"
                      class="delete-case-btn"
                    >
                      <template #icon>
                        <icon-delete />
                      </template>
                      删除
                    </a-button>
                  </div>
                </template>
                
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item :label="`输入用例`" class="case-input-item">
                      <a-textarea
                        v-model="judgeCaseItem.input"
                        placeholder="请输入测试输入用例"
                        :rows="6"
                        class="case-textarea"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item :label="`输出用例`" class="case-input-item">
                      <a-textarea
                        v-model="judgeCaseItem.output"
                        placeholder="请输入测试输出用例"
                        :rows="6"
                        class="case-textarea"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-card>
            </div>

            <div class="add-case-section">
              <a-button @click="handleAdd" type="outline" status="success" size="large" class="add-case-btn">
                <template #icon>
                  <icon-plus />
                </template>
                新增测试用例
              </a-button>
            </div>
          </div>

          <!-- 文件上传 -->
          <div class="form-section-title">
            <icon-upload class="section-icon" />
            <span>批量导入</span>
          </div>

          <a-form-item class="upload-item">
            <div class="upload-container">
              <input 
                type="file" 
                @change="handleFileUpload" 
                accept=".xlsx, .xls" 
                class="file-input"
                id="file-upload"
              />
              <label for="file-upload" class="upload-label">
                <icon-upload class="upload-icon" />
                <span>选择Excel文件导入测试用例</span>
                <span class="upload-hint">支持 .xlsx, .xls 格式</span>
              </label>
            </div>
          </a-form-item>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import message from "@arco-design/web-vue/es/message";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import {Service} from "../../../generated";
import * as XLSX from "xlsx";
import { watch } from 'vue';
import {Modal} from "@arco-design/web-vue";
import MdEditorV3 from "@/components/MdEditorV3.vue";

const route = useRoute();
const router = useRouter();
// 如果页面地址包含 update，视为更新页面
const updatePage = route.path.includes("update");

let form = ref({
  title: "",
  tags: [],
  answer: "",
  content: "",
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
});

// watch(() => form.value, (newValue) => {
//   localStorage.setItem('formDraft', JSON.stringify(newValue));
// }, { deep: true });

watch(() => form.value, (newValue) => {
  if (!updatePage) { // 仅在"创建题目"状态下保存草稿
    localStorage.setItem('formDraft', JSON.stringify(newValue));
  }
}, { deep: true });


const allCasesCollapsed = ref(false); // 初始状态为false，表示测试用例默认展开

const toggleAllCases = () => {
  allCasesCollapsed.value = !allCasesCollapsed.value;
};

/**
 * 根据题目 id 获取老的数据
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await Service.getQuestionByIdUsingGet(id as any);

  if (res.code === 200) {
    form.value = res.data as any;
    // json 转 js 对象
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const doSubmit = async () => {
  // 区分更新还是创建
  if (updatePage) {
    const res = await Service.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 200) {
      message.success("更新成功");
      await router.push({
        path: "/questions",
      });
      // 清理草稿数据
      localStorage.removeItem('formDraft');
    } else {
      message.error("更新失败，" + res.message);
      localStorage.removeItem('formDraft');
    }
  } else {
    const res = await Service.addQuestionUsingPost(
      form.value
    );
    if (res.code === 200) {
      await router.push({
        path: "/questions",
      });
      message.success("创建成功");
      // 清理草稿数据
      localStorage.removeItem('formDraft');
    } else {
      message.error("创建失败，" + res.message);
    }
  }
};

interface TestCase {
  input: string;
  output: string;
}

const handleFileUpload = async (event: any) => {
  const files = event.target.files;
  if (files.length === 0) return;
  const file = files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target?.result;
    if (data instanceof ArrayBuffer) {
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet) as TestCase[];
      form.value.judgeCase = json.map((row) => ({
        input: row.input,
        output: row.output,
      }));
    } else {
      // 处理data不是ArrayBuffer的情况
      console.error("数据格式错误");
    }
  };

  reader.readAsArrayBuffer(file);
};

// 一键清空测试用例
const handleDeleteAllCases = () => {
  Modal.confirm({
    title: '确认',
    content: '确定要删除全部测试用例吗？',
    onOk() {
      // 确认删除逻辑
      form.value.judgeCase = [];
    },
  });
};


// 保存草稿
function saveDraft() {
  localStorage.setItem('formDraft', JSON.stringify(form.value));
}

// 某个表单字段更新时调用
function onFieldUpdate() {
  saveDraft();
}

// 页面加载或组件挂载时尝试恢复草稿
function loadDraft() {
  if (!updatePage) { // 仅在"创建题目"状态下尝试加载草稿
    const draft = localStorage.getItem('formDraft');
    if (draft) {
      form.value = JSON.parse(draft);
    }
  } else {
    // "修改题目"状态下，调用loadData加载特定题目的数据
    loadData();
  }
}


// 在Vue组件的mounted生命周期钩子中调用loadDraft
onMounted(() => {
  loadDraft();
});

/**
 * 清除草稿
 */
const doCleanDraft = () => {
  Modal.confirm({
    title: '确认',
    content: '确定要删除保存的草稿吗？',
    onOk() {
      // 确认删除逻辑
      localStorage.removeItem('formDraft');
      form.value = {
        title: "",
        tags: [],
        answer: "",
        content: "",
        judgeConfig: {
          memoryLimit: 1000,
          stackLimit: 1000,
          timeLimit: 1000,
        },
        judgeCase: [
          {
            input: "",
            output: "",
          },
        ],
      };
      // todo: 删除文件，修复bug

    },
  });
}

/**
 * 新增判题用例
 */
const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};

/**
 * 删除判题用例
 */
const handleDelete = (index: number) => {
  form.value.judgeCase.splice(index, 1);
};

const onContentChange = (value: string) => {
  form.value.content = value;
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};
</script>

<style scoped>
.add-question-view {
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

.clear-btn {
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  border-color: #f53f3f;
  color: #f53f3f;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 63, 63, 0.1);
}

.submit-btn {
  background: linear-gradient(135deg, #165dff 0%, #4080ff 100%);
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
}

.form-section {
  margin-bottom: 24px;
}

.form-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
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

.question-form {
  padding: 0;
}

.form-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
  margin: 32px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #f2f3f5;
}

.form-section-title:first-child {
  margin-top: 0;
}

.section-icon {
  color: #165dff;
  font-size: 18px;
}

.section-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.toggle-btn {
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 6px;
  font-size: 12px;
  padding: 4px 12px;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  border-color: #165dff;
  color: #165dff;
}

.delete-all-btn {
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 6px;
  font-size: 12px;
  padding: 4px 12px;
  transition: all 0.3s ease;
}

.delete-all-btn:hover {
  border-color: #f53f3f;
  color: #f53f3f;
}

.form-item {
  margin-bottom: 20px;
}

.title-input {
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}

.title-input :deep(.arco-input-prefix) {
  color: #165dff;
}

.tags-input {
  border-radius: 8px;
}

.editor-container {
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.markdown-editor {
  min-height: 300px;
}

.judge-config {
  background: #f7f8fa;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e6eb;
}

.config-item {
  margin-bottom: 0;
}

.config-input {
  width: 100%;
  border-radius: 8px;
}

.test-cases {
  margin-top: 16px;
}

.test-case-item {
  margin-bottom: 16px;
}

.case-card {
  background: #f7f8fa;
  border-radius: 12px;
  border: 1px solid #e5e6eb;
}

.case-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.case-number {
  font-weight: 600;
  color: #1d2129;
  font-size: 14px;
}

.delete-case-btn {
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 6px;
  font-size: 12px;
  padding: 2px 8px;
  transition: all 0.3s ease;
}

.delete-case-btn:hover {
  border-color: #f53f3f;
  color: #f53f3f;
}

.case-input-item {
  margin-bottom: 0;
}

.case-textarea {
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
}

.add-case-section {
  text-align: center;
  margin-top: 24px;
  padding: 20px;
  border: 2px dashed #e5e6eb;
  border-radius: 12px;
  background: #fafbfc;
}

.add-case-btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-case-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 180, 42, 0.2);
}

.upload-item {
  margin-bottom: 0;
}

.upload-container {
  position: relative;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  border: 2px dashed #e5e6eb;
  border-radius: 12px;
  background: #fafbfc;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-label:hover {
  border-color: #165dff;
  background: #f0f9ff;
}

.upload-icon {
  font-size: 32px;
  color: #86909c;
  margin-bottom: 12px;
}

.upload-hint {
  font-size: 12px;
  color: #86909c;
  margin-top: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .add-question-view {
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
  
  .judge-config .a-row {
    flex-direction: column;
  }
  
  .judge-config .a-col {
    width: 100%;
    margin-bottom: 16px;
  }
  
  .case-card .a-row {
    flex-direction: column;
  }
  
  .case-card .a-col {
    width: 100%;
    margin-bottom: 16px;
  }
  
  .section-actions {
    margin-top: 8px;
    margin-left: 0;
    justify-content: space-between;
  }
}
</style>
