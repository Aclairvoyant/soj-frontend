<template>
  <div id="addQuestionView">
    <h2>{{ updatePage ? "修改题目" : "创建题目" }}</h2>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="标题">
        <a-input v-model="form.title" @update:modelValue="onFieldUpdate" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag v-model="form.tags" placeholder="请选择标签" allow-clear />
      </a-form-item>
<!--      <a-form-item field="content" label="题目内容">-->
<!--        <MdEditor :value="form.content" :handle-change="onContentChange" />-->
<!--      </a-form-item>-->
      <a-form-item field="content" label="题目内容">
        <MdEditorV3 v-model="form.content" :handle-change="onContentChange" />
      </a-form-item>
<!--      <a-form-item field="answer" label="答案">-->
<!--        <MdEditor :value="form.answer" :handle-change="onAnswerChange" />-->
<!--      </a-form-item>-->
      <a-form-item field="answer" label="答案">
        <MdEditorV3 v-model="form.answer" :handle-change="onAnswerChange" />
      </a-form-item>
      <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制"
              mode="button"
              :min="0"
              size="large"
              :step="10"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制"
              mode="button"
              :min="0"
              size="large"
              :step="10"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="堆栈限制">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制"
              mode="button"
              :min="0"
              size="large"
              :step="10"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item
        label="测试用例配置"
        :content-flex="false"
        :merge-props="false"
      >
        <div>
          <!-- 切换全部测试用例的折叠状态 -->
          <a-button @click="toggleAllCases">
            {{ allCasesCollapsed ? "展开全部测试用例" : "收起全部测试用例" }}
          </a-button>

          <a-button @click="handleDeleteAllCases" status="danger">
            删除全部测试用例
          </a-button>
          <!-- 遍历并显示所有测试用例 -->
          <div v-for="(judgeCaseItem, index) in form.judgeCase" :key="index">
            <a-space
              direction="vertical"
              v-show="!allCasesCollapsed"
              style="width: 100%"
            >
              <a-form-item :label="`输入用例-${index + 1}`">
                <a-textarea
                  v-model="judgeCaseItem.input"
                  placeholder="请输入测试输入用例"
                />
              </a-form-item>
              <a-form-item :label="`输出用例-${index + 1}`">
                <a-textarea
                  v-model="judgeCaseItem.output"
                  placeholder="请输入测试输出用例"
                />
              </a-form-item>
              <a-button status="danger" @click="() => handleDelete(index)"
                >删除</a-button
              >
            </a-space>
          </div>
        </div>

        <div style="margin-top: 32px">
          <a-button @click="handleAdd" type="outline" status="success"
            >新增测试用例
          </a-button>
        </div>
      </a-form-item>
      <a-form-item>
        <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" />
      </a-form-item>

      <a-form-item>
        <a-button status="danger" style="min-width: 200px" @click="doCleanDraft"
          >清除草稿
        </a-button>
      </a-form-item>
      <div style="margin-top: 16px" />
      <a-form-item>
        <a-button type="primary" style="min-width: 200px" @click="doSubmit"
          >提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import message from "@arco-design/web-vue/es/message";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { QuestionControllerService } from "../../../generated";
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
  if (!updatePage) { // 仅在“创建题目”状态下保存草稿
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
  const res = await QuestionControllerService.getQuestionByIdUsingGet(id as any);

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
    const res = await QuestionControllerService.updateQuestionUsingPost(
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
    const res = await QuestionControllerService.addQuestionUsingPost(
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
  if (!updatePage) { // 仅在“创建题目”状态下尝试加载草稿
    const draft = localStorage.getItem('formDraft');
    if (draft) {
      form.value = JSON.parse(draft);
    }
  } else {
    // “修改题目”状态下，调用loadData加载特定题目的数据
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
#addQuestionView {
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 24px;
}

.a-form-item {
  margin-bottom: 16px;
}

.a-input,
.a-input-number,
.a-input-tag {
  width: 100%;
}

.a-button {
  width: 100%;
}

.a-space > .a-form-item {
  margin-bottom: 0;
}

.a-space {
  width: 100%;
}

/* 测试用例配置部分样式 */
.a-space.direction-vertical {
  margin-bottom: 16px; /* 增加垂直方向的空间 */
}

/* 最后的提交按钮特别样式 */
.a-form-item:last-child .a-button {
  min-width: 200px; /* 确保按钮有足够的点击区域 */
  margin: auto; /* 按钮居中显示 */
  display: block; /* 使margin:auto生效 */
}
</style>
