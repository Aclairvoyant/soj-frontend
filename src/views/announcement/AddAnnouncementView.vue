<template>
  <div class="add-announcement-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <icon-notification class="header-icon" />
          <h2>{{ updatePage ? "修改公告" : "发布公告" }}</h2>
        </div>
        <div class="header-actions">
          <a-space>
            <a-button @click="saveDraft">
              <template #icon>
                <icon-save />
              </template>
              保存草稿
            </a-button>
            <a-button @click="loadDraft">
              <template #icon>
                <icon-folder />
              </template>
              加载草稿
            </a-button>
          </a-space>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 表单区域 -->
      <div class="form-section">
        <a-card class="form-card" :bordered="false">
          <template #title>
            <div class="form-header">
              <div class="form-title">
                <icon-edit class="form-icon" />
                <span>公告信息</span>
              </div>
              <div class="form-tips">
                <icon-info-circle class="tip-icon" />
                <span>支持Markdown格式</span>
              </div>
            </div>
          </template>

          <a-form :model="form" layout="vertical" class="announcement-form">
            <a-form-item field="title" label="公告标题" class="form-item" required>
              <a-input
                v-model="form.title"
                @update:modelValue="onFieldUpdate"
                placeholder="请输入公告标题"
                size="large"
              >
                <template #prefix>
                  <icon-file-text class="input-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item field="content" label="公告内容" class="form-item" required>
              <div class="editor-container">
                <div class="editor-toolbar">
                  <a-space>
                    <a-button type="text" size="small" @click="insertTemplate('notice')">
                      <icon-notification />
                      通知模板
                    </a-button>
                    <a-button type="text" size="small" @click="insertTemplate('maintenance')">
                      <icon-tool />
                      维护模板
                    </a-button>
                    <a-button type="text" size="small" @click="insertTemplate('activity')">
                      <icon-gift />
                      活动模板
                    </a-button>
                  </a-space>
                </div>
                <MdEditorV3
                  v-model="form.content"
                  :handle-change="onContentChange"
                  class="md-editor"
                />
              </div>
            </a-form-item>

            <a-form-item field="status" label="公告状态" class="form-item" required>
              <a-radio-group v-model="form.status" class="status-radio-group" direction="horizontal">
                <a-radio :value="0" class="status-radio">
                  <div class="radio-content">
                    <icon-eye class="radio-icon" />
                    <div class="radio-info">
                      <div class="radio-title">公开展示</div>
                      <div class="radio-desc">所有用户都可以看到此公告</div>
                    </div>
                  </div>
                </a-radio>
                <a-radio :value="1" class="status-radio">
                  <div class="radio-content">
                    <icon-eye-invisible class="radio-icon" />
                    <div class="radio-info">
                      <div class="radio-title">暂时隐藏</div>
                      <div class="radio-desc">仅管理员可见，用户无法查看</div>
                    </div>
                  </div>
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-form>
        </a-card>
      </div>

      <!-- 预览区域 -->
      <div class="preview-section">
        <a-card class="preview-card" :bordered="false">
          <template #title>
            <div class="preview-header">
              <div class="preview-title">
                <icon-eye class="preview-icon" />
                <span>实时预览</span>
              </div>
              <div class="preview-status">
                <a-tag :color="form.status === 0 ? 'green' : 'red'">
                  {{ form.status === 0 ? '公开' : '隐藏' }}
                </a-tag>
              </div>
            </div>
          </template>

          <div class="announcement-preview">
            <div class="preview-announcement">
              <div class="announcement-badge">
                <icon-notification />
                <span>公告</span>
              </div>
              <div class="announcement-body">
                <h3 class="announcement-title">
                  {{ form.title || '请输入公告标题' }}
                </h3>
                <div class="announcement-content">
                  <MdViewerV3 v-if="form.content" :value="form.content" />
                  <div v-else class="empty-content">请输入公告内容</div>
                </div>
                <div class="announcement-meta">
                  <div class="announcement-time">
                    <icon-clock-circle />
                    <span>{{ new Date().toLocaleString() }}</span>
                  </div>
                  <div class="announcement-author">
                    <icon-user />
                    <span>管理员</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </div>
    </div>

    <!-- 操作区域 -->
    <div class="action-section">
      <a-card class="action-card" :bordered="false">
        <div class="action-buttons">
          <a-space size="large">
            <a-button
              class="clean-btn"
              @click="doCleanDraft"
              :loading="submitting"
            >
              <template #icon>
                <icon-delete />
              </template>
              清除草稿
            </a-button>
            <a-button
              type="primary"
              class="submit-btn"
              @click="doSubmit"
              :loading="submitting"
            >
              <template #icon>
                <icon-send />
              </template>
              {{ updatePage ? '更新公告' : '发布公告' }}
            </a-button>
          </a-space>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import message from "@arco-design/web-vue/es/message";
import {useRoute} from "vue-router";
import {useRouter} from "vue-router";
import {Service} from "../../../generated";
import {watch} from "vue";
import {Modal} from "@arco-design/web-vue";
import MdEditorV3 from "@/components/MdEditorV3.vue";
import MdViewerV3 from "@/components/MdViewerV3.vue";
import {
  IconNotification,
  IconSave,
  IconFolder,
  IconEdit,
  IconInfoCircle,
  IconFileText,
  IconTool,
  IconGift,
  IconEye,
  IconEyeInvisible,
  IconClockCircle,
  IconUser,
  IconDelete,
  IconSend
} from '@arco-design/web-vue/es/icon';

const route = useRoute();
const router = useRouter();
const submitting = ref(false);

// 如果页面地址包含 update，视为更新页面
const updatePage = route.path.includes("update");

let form = ref({
  title: "",
  content: "",
  status: 0,
});

watch(
    () => form.value,
    (newValue) => {
      if (!updatePage) { // 仅在"创建题目"状态下保存草稿
        localStorage.setItem("announcementFormDraft", JSON.stringify(newValue));
      }
    },
    {deep: true}
);


const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await Service.getAnnouncementVoByIdUsingGet(id as string);

  if (res.code === 200) {
    form.value = res.data as typeof form.value;
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const onContentChange = (value: string) => {
  form.value.content = value;
};

const doSubmit = async () => {
  if (!form.value.title || !form.value.content) {
    message.warning('请填写完整的公告信息');
    return;
  }

  submitting.value = true;
  try {
    // 区分更新还是创建
    if (updatePage) {
      const res = await Service.updateAnnouncementUsingPost(form.value);
      if (res.code === 200) {
        message.success("更新成功");
        await router.push({ path: "/manage/announcement" });
        localStorage.removeItem('announcementFormDraft');
      } else {
        message.error("更新失败，" + res.message);
      }
    } else {
      const res = await Service.addAnnouncementUsingPost(form.value);
      if (res.code === 200) {
        message.success("发布成功");
        await router.push({ path: "/manage/announcement" });
        localStorage.removeItem('announcementFormDraft');
      } else {
        message.error("发布失败，" + res.message);
      }
    }
  } catch (error) {
    console.error('提交失败:', error);
    message.error('操作失败');
  } finally {
    submitting.value = false;
  }
};

// 保存草稿
const saveDraft = () => {
  localStorage.setItem("announcementFormDraft", JSON.stringify(form.value));
}

// 某个表单字段更新时调用
const onFieldUpdate = () => {
  saveDraft();
}

// 页面加载或组件挂载时尝试恢复草稿
const loadDraft = () => {
  const draft = localStorage.getItem("announcementFormDraft");
  if (draft) {
    form.value = JSON.parse(draft);
  }
}

// 在Vue组件的mounted生命周期钩子中调用loadDraft
onMounted(() => {
  loadDraft();
});

const doCleanDraft = () => {
  Modal.confirm({
    title: "确认操作",
    content: "确定要删除保存的草稿吗？",
    onOk() {
      localStorage.removeItem("announcementFormDraft");
      form.value = {
        title: "",
        content: "",
        status: 0,
      };
      message.success('草稿已清除');
    },
  });
};

// 插入模板
const insertTemplate = (type: string) => {
  let template = '';
  let title = '';

  switch (type) {
    case 'notice':
      title = '系统通知';
      template = `# 系统通知

## 📢 重要提醒

亲爱的用户：

感谢您使用我们的在线判题系统！我们想通知您以下重要信息：

### 主要内容
- **通知事项1**：详细说明...
- **通知事项2**：详细说明...
- **通知事项3**：详细说明...

### 注意事项
⚠️ 请仔细阅读以下注意事项：
1. 注意事项1
2. 注意事项2
3. 注意事项3

### 联系我们
如有任何疑问，请联系管理员。

---
*发布时间：${new Date().toLocaleDateString()}*`;
      break;

    case 'maintenance':
      title = '系统维护通知';
      template = `# 🔧 系统维护通知

## 维护时间安排

**维护时间**：${new Date().toLocaleDateString()} 凌晨 2:00 - 6:00

**预计影响**：4小时

## 维护内容

本次维护将进行以下更新：

### 🚀 新功能
- [ ] 新增功能1
- [ ] 新增功能2
- [ ] 新增功能3

### 🐛 问题修复
- [ ] 修复问题1
- [ ] 修复问题2
- [ ] 修复问题3

### ⚡ 性能优化
- [ ] 优化项1
- [ ] 优化项2
- [ ] 优化项3

## 注意事项

⚠️ **重要提醒**：
- 维护期间系统将暂停服务
- 请提前保存您的工作进度
- 维护完成后系统将自动恢复

感谢您的理解与支持！

---
*系统管理团队*`;
      break;

    case 'activity':
      title = '活动公告';
      template = `# 🎉 精彩活动来袭！

## 活动概述

**活动名称**：[活动名称]
**活动时间**：${new Date().toLocaleDateString()} - [结束时间]
**参与方式**：[参与方式]

## 🏆 丰厚奖励

### 一等奖 (1名)
- 🥇 奖励内容1
- 🎁 奖励内容2

### 二等奖 (3名)
- 🥈 奖励内容1
- 🎁 奖励内容2

### 三等奖 (5名)
- 🥉 奖励内容1
- 🎁 奖励内容2

### 参与奖 (所有参与者)
- 🎫 参与纪念品

## 📋 参与规则

1. **报名条件**：所有注册用户均可参与
2. **活动流程**：
   - 步骤1：[详细说明]
   - 步骤2：[详细说明]
   - 步骤3：[详细说明]
3. **评选标准**：[评选标准说明]

## 📅 重要时间节点

- **报名截止**：[日期]
- **活动开始**：[日期]
- **结果公布**：[日期]
- **奖励发放**：[日期]

## 💡 温馨提示

- 活动最终解释权归平台所有
- 如有疑问请及时联系客服
- 祝大家在活动中取得好成绩！

---
*让我们一起享受编程的乐趣！* 🚀`;
      break;
  }

  if (form.value.title === '') {
    form.value.title = title;
  }
  form.value.content = template;
  message.success('模板已插入');
};

</script>

<style lang="less" scoped>
.add-announcement-container {
  padding: 24px;
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "form preview"
    "actions actions";
}

.page-header {
  grid-area: header;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 20px 24px;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);

    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;

      .header-icon {
        font-size: 24px;
        color: #1890ff;
      }

      h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: #1a1a1a;
      }
    }

    .header-actions {
      .arco-btn {
        border-radius: 20px;
        font-weight: 500;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}

.content-area {
  display: contents;

  .form-section {
    grid-area: form;

    .form-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      height: fit-content;

      .form-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;

        .form-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #1a1a1a;

          .form-icon {
            color: #1890ff;
          }
        }

        .form-tips {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #666;

          .tip-icon {
            color: #1890ff;
          }
        }
      }

      .announcement-form {
        .form-item {
          margin-bottom: 24px;

          .arco-form-item-label {
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
          }

          .input-icon {
            color: #9ca3af;
          }
        }

        .editor-container {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;

          .editor-toolbar {
            background: #f8fafc;
            padding: 12px 16px;
            border-bottom: 1px solid #e5e7eb;

            .arco-btn {
              border-radius: 8px;
              font-size: 12px;

              &:hover {
                background: rgba(24, 144, 255, 0.1);
                color: #1890ff;
              }
            }
          }

          .md-editor {
            border: none;

            :deep(.md-editor) {
              border: none;
              border-radius: 0;
            }
          }
        }

        .status-radio-group {
          display: flex;
          gap: 16px;

          .status-radio {
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 16px;
            transition: all 0.3s ease;

            &:hover {
              border-color: #1890ff;
              background: rgba(24, 144, 255, 0.05);
            }

            &.arco-radio-checked {
              border-color: #1890ff;
              background: rgba(24, 144, 255, 0.1);
            }

            .radio-content {
              display: flex;
              align-items: center;
              gap: 12px;

              .radio-icon {
                font-size: 20px;
                color: #1890ff;
              }

              .radio-info {
                .radio-title {
                  font-weight: 600;
                  color: #1a1a1a;
                  margin-bottom: 4px;
                }

                .radio-desc {
                  font-size: 12px;
                  color: #666;
                  line-height: 1.4;
                }
              }
            }
          }
        }
      }
    }
  }

  .preview-section {
    grid-area: preview;

    .preview-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: sticky;
      top: 24px;

      .preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;

        .preview-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #1a1a1a;

          .preview-icon {
            color: #1890ff;
          }
        }

        .preview-status {
          .arco-tag {
            font-weight: 500;
            border-radius: 12px;
            padding: 4px 12px;
          }
        }
      }

      .announcement-preview {
        .preview-announcement {
          background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
          border: 1px solid #ffd591;
          border-radius: 16px;
          padding: 20px;
          position: relative;
          overflow: hidden;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
          }

          .announcement-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(250, 140, 22, 0.1);
            color: #fa8c16;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 16px;

            .arco-icon {
              font-size: 14px;
            }
          }

          .announcement-body {
            .announcement-title {
              font-size: 18px;
              font-weight: 600;
              color: #1d2129;
              margin: 0 0 12px 0;
              line-height: 1.4;
            }

            .announcement-content {
              font-size: 14px;
              color: #4e5969;
              line-height: 1.6;
              margin: 0 0 16px 0;

              .empty-content {
                color: #999;
                font-style: italic;
              }
            }

            .announcement-meta {
              display: flex;
              align-items: center;
              gap: 16px;
              font-size: 12px;
              color: #86909c;

              .announcement-time,
              .announcement-author {
                display: flex;
                align-items: center;
                gap: 4px;

                .arco-icon {
                  font-size: 14px;
                }
              }
            }
          }
        }
      }
    }
  }
}

.action-section {
  grid-area: actions;

  .action-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);

    .action-buttons {
      display: flex;
      justify-content: center;

      .arco-btn {
        border-radius: 24px;
        font-weight: 500;
        transition: all 0.3s ease;
        min-width: 140px;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        &.clean-btn {
          color: #ff4d4f;
          border-color: #ff4d4f;

          &:hover {
            background: rgba(255, 77, 79, 0.1);
            border-color: #ff4d4f;
          }
        }

        &.save-btn {
          color: #faad14;
          border-color: #faad14;

          &:hover {
            background: rgba(250, 173, 20, 0.1);
            border-color: #faad14;
          }
        }

        &.submit-btn {
          background: linear-gradient(135deg, #1890ff, #40a9ff);
          border: none;

          &:hover {
            box-shadow: 0 4px 16px rgba(24, 144, 255, 0.3);
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .add-announcement-container {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "form"
      "preview"
      "actions";

    .preview-section .preview-card {
      position: static;
    }
  }
}

@media (max-width: 768px) {
  .add-announcement-container {
    padding: 16px;
    gap: 16px;

    .page-header .header-content {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }

    .content-area {
      .form-section .form-card {
        .form-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }

        .announcement-form {
          .status-radio-group {
            .status-radio {
              padding: 12px;

              .radio-content {
                .radio-icon {
                  font-size: 16px;
                }

                .radio-info {
                  .radio-title {
                    font-size: 14px;
                  }

                  .radio-desc {
                    font-size: 11px;
                  }
                }
              }
            }
          }
        }
      }

      .preview-section .preview-card {
        .preview-announcement {
          padding: 16px;

          .announcement-body {
            .announcement-title {
              font-size: 16px;
            }

            .announcement-content {
              font-size: 13px;
            }

            .announcement-meta {
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
            }
          }
        }
      }
    }

    .action-section .action-card {
      .action-buttons {
        .arco-btn {
          min-width: 100px;
          font-size: 13px;
        }
      }
    }
  }
}
</style>
