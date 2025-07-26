<template>
  <div class="admin-message-send-optimized">
    <div class="page-header">
      <div class="header-content">
        <h2>
          <SendOutlined />
          发送管理消息
        </h2>
        <p>基于新消息系统的统一管理平台</p>
      </div>
    </div>

    <div class="send-form-container">
      <a-card title="消息发送" :bordered="false">
        <a-form
          ref="formRef"
          :model="form"
          :rules="rules"
          layout="vertical"
          @submit="handleSubmit"
        >
          <!-- 消息类型 -->
          <a-form-item label="消息类型" field="messageType">
            <a-select
              v-model="form.messageType"
              placeholder="请选择消息类型"
              @change="handleTypeChange"
            >
              <a-optgroup label="系统消息">
                <a-option value="SYSTEM_ANNOUNCEMENT">系统公告</a-option>
                <a-option value="EMERGENCY_NOTICE">紧急通知</a-option>
                <a-option value="MAINTENANCE_NOTICE">维护通知</a-option>
              </a-optgroup>
              <a-optgroup label="比赛消息">
                <a-option value="CONTEST_ANNOUNCEMENT">比赛公告</a-option>
              </a-optgroup>
              <a-optgroup label="学术消息">
                <a-option value="PROBLEM_UPDATE_NOTICE">题目更新通知</a-option>
              </a-optgroup>
              <a-optgroup label="管理消息">
                <a-option value="ADMIN_ANNOUNCEMENT">管理员公告</a-option>
              </a-optgroup>
            </a-select>
            <div class="message-type-help">
              <a-typography-text type="secondary" style="font-size: 12px;">
                注意：帖子点赞、评论、比赛提醒、排名更新等消息由系统自动发送，无需手动操作
              </a-typography-text>
            </div>
          </a-form-item>

          <!-- 消息标题 -->
          <a-form-item label="消息标题" field="title">
            <a-input
              v-model="form.title"
              placeholder="请输入消息标题"
              :max-length="100"
              show-word-limit
            />
          </a-form-item>

          <!-- 消息内容 -->
          <a-form-item label="消息内容" field="content">
            <a-textarea
              v-model="form.content"
              placeholder="请输入消息内容"
              :rows="6"
              :max-length="1000"
              show-word-limit
            />
          </a-form-item>

          <!-- 优先级 -->
          <a-form-item label="消息优先级" field="priority">
            <a-select v-model="form.priority" placeholder="请选择优先级">
              <a-option value="1">
                <a-tag color="gray">低优先级</a-tag>
                <span style="margin-left: 8px;">普通消息</span>
              </a-option>
              <a-option value="2">
                <a-tag color="blue">中优先级</a-tag>
                <span style="margin-left: 8px;">重要消息</span>
              </a-option>
              <a-option value="3">
                <a-tag color="orange">高优先级</a-tag>
                <span style="margin-left: 8px;">建议立即查看</span>
              </a-option>
              <a-option value="4">
                <a-tag color="red">紧急</a-tag>
                <span style="margin-left: 8px;">必须立即处理</span>
              </a-option>
            </a-select>
          </a-form-item>

          <!-- 发送目标 -->
          <a-form-item label="发送目标" field="sendTarget">
            <a-radio-group v-model="form.sendTarget" @change="handleTargetChange">
              <a-radio value="broadcast">全站广播</a-radio>
              <a-radio value="specific">指定用户</a-radio>
              <a-radio value="contest">比赛参与者</a-radio>
            </a-radio-group>
          </a-form-item>

          <!-- 指定用户ID -->
          <a-form-item
            v-if="form.sendTarget === 'specific'"
            label="目标用户ID"
            field="recipientIds"
          >
            <a-textarea
              v-model="userIdsInput"
              placeholder="请输入用户ID，多个用逗号分隔，如：1,2,3"
              :rows="3"
              @blur="parseUserIds"
            />
            <div v-if="form.recipientIds.length > 0" class="user-preview">
              <span>将发送给 {{ form.recipientIds.length }} 个用户</span>
              <a-tag
                v-for="userId in form.recipientIds.slice(0, 10)"
                :key="userId"
                size="small"
                style="margin: 2px;"
              >
                {{ userId }}
              </a-tag>
              <span v-if="form.recipientIds.length > 10">
                ... 等 {{ form.recipientIds.length }} 个用户
              </span>
            </div>
          </a-form-item>

          <!-- 比赛选择 -->
          <a-form-item
            v-if="form.sendTarget === 'contest'"
            label="选择比赛"
            field="contestId"
          >
            <a-select
              v-model="form.contestId"
              placeholder="请选择比赛"
              :loading="contestsLoading"
              show-search
              :filter-option="filterContest"
            >
              <a-option
                v-for="contest in contests"
                :key="contest.id"
                :value="contest.id"
              >
                {{ contest.title }} (ID: {{ contest.id }})
              </a-option>
            </a-select>
          </a-form-item>

          <!-- 额外数据 -->
<!--          <a-form-item label="额外数据" field="extraData">-->
<!--            <a-textarea-->
<!--              v-model="form.extraData"-->
<!--              placeholder="JSON格式的额外数据，如：{&quot;key&quot;: &quot;value&quot;}"-->
<!--              :rows="3"-->
<!--            />-->
<!--            <div class="extra-data-help">-->
<!--              <a-typography-text type="secondary" style="font-size: 12px;">-->
<!--                可选，用于传递额外的结构化数据，如维护时间、比赛开始时间等-->
<!--              </a-typography-text>-->
<!--            </div>-->
<!--          </a-form-item>-->
          <a-form-item label="额外数据 (JSON格式)" field="extraData">
            <a-textarea
                v-model="form.extraData"
                :placeholder="getExtraDataPlaceholder()"
                :rows="4"
                :max-length="500"
                show-word-limit
            />

          </a-form-item>
          <div class="extra-data-hint">
            <a-alert
                type="info"
                show-icon
            >{{ getExtraDataHint() }}
            </a-alert>
          </div>

          <!-- 操作按钮 -->
          <a-form-item>
            <a-space>
              <a-button
                type="primary"
                html-type="submit"
                :loading="sending"
                size="large"
              >
                <SendOutlined />
                发送消息
              </a-button>
              <a-button @click="handleReset" size="large">重置</a-button>
              <a-button @click="handlePreview" size="large">预览</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-card>
    </div>

    <!-- 发送统计 -->
    <a-card title="发送统计" class="stats-card">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-statistic title="今日已发送" :value="stats.todaySent" />
        </a-col>
        <a-col :span="6">
          <a-statistic title="本周已发送" :value="stats.weekSent" />
        </a-col>
        <a-col :span="6">
          <a-statistic title="总发送量" :value="stats.totalSent" />
        </a-col>
        <a-col :span="6">
          <a-button @click="refreshStats">
            <ReloadOutlined />
            刷新统计
          </a-button>
        </a-col>
      </a-row>
    </a-card>

    <!-- 预览弹窗 -->
    <a-modal
      v-model:visible="previewVisible"
      title="消息预览"
      width="600px"
      :footer="null"
    >
      <div class="message-preview">
        <div class="preview-header">
          <h3>{{ form.title || '消息标题' }}</h3>
          <div class="preview-meta">
            <a-tag :color="getPriorityColor(form.priority)">
              {{ getPriorityText(form.priority) }}
            </a-tag>
            <a-tag color="blue">{{ getTypeText(form.messageType) }}</a-tag>
          </div>
        </div>
        <div class="preview-content">
          <p>{{ form.content || '消息内容' }}</p>
        </div>
        <div class="preview-target">
          <strong>发送目标：</strong>{{ getTargetText() }}
        </div>
        <div v-if="form.extraData" class="preview-extra">
          <strong>额外数据：</strong>
          <pre>{{ formatExtraData() }}</pre>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Message } from '@arco-design/web-vue';
import { SendOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { MessageAPI } from '@/services/api/MessageAPI';
import { MessageType, MessagePriority, MANUAL_MESSAGE_TYPES } from '@/types/message';
import {ContestQueryRequest, Service} from "../../../generated";

// 表单引用
const formRef = ref();

// 表单数据
const form = reactive({
  messageType: '',
  title: '',
  content: '',
  priority: '2',
  sendTarget: 'broadcast',
  recipientIds: [] as number[],
  contestId: undefined as number | undefined,
  extraData: ''
});

// 状态
const sending = ref(false);
const previewVisible = ref(false);
const contestsLoading = ref(false);
const userIdsInput = ref('');

// 比赛列表和统计
const contests = ref<Array<{ id: number; title: string }>>([]);
const stats = reactive({
  todaySent: 0,
  weekSent: 0,
  totalSent: 0
});

// 表单验证规则
const rules = {
  messageType: [
    { required: true, message: '请选择消息类型' }
  ],
  title: [
    { required: true, message: '请输入消息标题' },
    { min: 1, max: 100, message: '标题长度应在1-100字符之间' }
  ],
  content: [
    { required: true, message: '请输入消息内容' },
    { min: 1, max: 1000, message: '内容长度应在1-1000字符之间' }
  ],
  priority: [
    { required: true, message: '请选择优先级' }
  ],
  recipientIds: [
    {
      validator: (_rule: any, value: number[]) => {
        if (form.sendTarget === 'specific' && (!value || value.length === 0)) {
          return Promise.reject('请输入目标用户ID');
        }
        return Promise.resolve();
      }
    }
  ],
  contestId: [
    {
      validator: (_rule: any, value: number) => {
        if (form.sendTarget === 'contest' && !value) {
          return Promise.reject('请选择目标比赛');
        }
        return Promise.resolve();
      }
    }
  ]
};

// 获取额外数据占位符
const getExtraDataPlaceholder = (): string => {
  switch (form.messageType) {
    case 'EMERGENCY_NOTICE':
      return '{"urgencyLevel": "high", "affectedService": "判题系统", "estimatedRepairTime": "30分钟"}';
    case 'MAINTENANCE_NOTICE':
      return '{"maintenanceStartTime": "2024-12-25 22:00:00", "maintenanceEndTime": "2024-12-26 02:00:00", "affectedServices": ["网站", "判题系统"]}';
    case 'SYSTEM_ANNOUNCEMENT':
      return '{"announcementType": "feature", "version": "v2.0", "changeLog": "新增消息系统功能"}';
    case 'CONTEST_ANNOUNCEMENT':
      return '{"contestStartTime": "2024-12-25 19:00:00", "registrationDeadline": "2024-12-25 18:00:00"}';
    case 'PROBLEM_UPDATE_NOTICE':
      return '{"updateType": "题目修正", "changeDescription": "修复了样例输出格式", "previousVersion": "1.0"}';
    case 'ADMIN_ANNOUNCEMENT':
      return '{"adminLevel": "system", "category": "policy", "effectiveDate": "2024-12-25"}';
    default:
      return '{"key": "value", "description": "请输入有效的JSON格式数据"}';
  }
};

// 获取额外数据提示信息
const getExtraDataHint = (): string => {
  switch (form.messageType) {
    case 'EMERGENCY_NOTICE':
      return '紧急通知可包含：紧急程度(urgencyLevel)、受影响服务(affectedService)、预计修复时间(estimatedRepairTime)等信息';
    case 'MAINTENANCE_NOTICE':
      return '维护通知可包含：维护开始时间(maintenanceStartTime)、结束时间(maintenanceEndTime)、受影响服务(affectedServices)等信息';
    case 'SYSTEM_ANNOUNCEMENT':
      return '系统公告可包含：公告类型(announcementType)、版本号(version)、更新日志(changeLog)等信息';
    case 'CONTEST_ANNOUNCEMENT':
      return '比赛公告可包含：比赛开始时间(contestStartTime)、报名截止时间(registrationDeadline)等信息';
    case 'PROBLEM_UPDATE_NOTICE':
      return '题目更新可包含：更新类型(updateType)、变更描述(changeDescription)、之前版本(previousVersion)等信息';
    case 'ADMIN_ANNOUNCEMENT':
      return '管理员公告可包含：管理员级别(adminLevel)、分类(category)、生效日期(effectiveDate)等信息';
    default:
      return '请输入有效的JSON格式数据，可用于存储消息相关的结构化信息';
  }
};

// 加载比赛列表
const loadContests = async () => {
  try {
    contestsLoading.value = true;

    // 构建查询参数
    const queryRequest: ContestQueryRequest = {
      current: 1,
      pageSize: 20, // 获取更多比赛供选择
      sortField: 'createTime',
      sortOrder: 'desc'
    };

    const response = await Service.listContestByPageUsingPost(queryRequest);

    if (response.code === 200 && response.data) {
      // 处理不同的响应格式
      let contestList = [];
      if (response.data.records && Array.isArray(response.data.records)) {
        contestList = response.data.records;
      } else if (Array.isArray(response.data)) {
        contestList = response.data;
      }

      contests.value = contestList
          .filter((contest: any) => contest && contest.id && contest.title)
          .map((contest: any) => ({
            id: contest.id,
            title: contest.title || `比赛 #${contest.id}`,
            status: contest.status || 'unknown'
          }));

      console.log(`Loaded ${contests.value.length} contests`);
    } else {
      console.warn('No contests found or invalid response:', response);
      contests.value = [];
    }
  } catch (error: any) {
    console.error('Failed to load contests:', error);
    const errorMessage = error.message || '加载比赛列表失败';
    Message.error(errorMessage);
    contests.value = [];
  } finally {
    contestsLoading.value = false;
  }
};

// 消息类型变化处理
const handleTypeChange = (type: string) => {
  // 根据类型设置默认优先级和发送目标
  switch (type) {
    case 'EMERGENCY_NOTICE':
      form.priority = '4';
      form.sendTarget = 'broadcast'; // 紧急通知默认全站广播
      break;
    case 'SYSTEM_ANNOUNCEMENT':
    case 'MAINTENANCE_NOTICE':
      form.priority = '3';
      form.sendTarget = 'broadcast'; // 系统消息默认全站广播
      break;
    case 'CONTEST_ANNOUNCEMENT':
      form.priority = '2';
      form.sendTarget = 'contest'; // 比赛公告默认发送给比赛参与者
      break;
    case 'PROBLEM_UPDATE_NOTICE':
      form.priority = '2';
      form.sendTarget = 'broadcast'; // 题目更新通知默认全站广播
      break;
    case 'ADMIN_ANNOUNCEMENT':
      form.priority = '2';
      form.sendTarget = 'broadcast'; // 管理员公告默认全站广播
      break;
    default:
      form.priority = '2';
      form.sendTarget = 'broadcast';
  }

  // 清除额外数据，让用户根据新类型重新填写
  form.extraData = '';
};

// 发送目标变化处理
const handleTargetChange = () => {
  // 清空相关字段
  form.recipientIds = [];
  form.contestId = undefined;
  userIdsInput.value = '';
};

// 解析用户ID
const parseUserIds = () => {
  if (!userIdsInput.value.trim()) {
    form.recipientIds = [];
    return;
  }

  const ids = userIdsInput.value
    .split(',')
    .map(id => parseInt(id.trim()))
    .filter(id => !isNaN(id) && id > 0);

  form.recipientIds = [...new Set(ids)]; // 去重
};

// 比赛筛选
const filterContest = (input: string, option: any) => {
  return option.children.toLowerCase().includes(input.toLowerCase());
};

// 获取优先级文本
const getPriorityText = (priority: string): string => {
  const texts: Record<string, string> = {
    '1': '低优先级',
    '2': '中优先级',
    '3': '高优先级',
    '4': '紧急'
  };
  return texts[priority] || '中优先级';
};

// 获取优先级颜色
const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    '1': 'gray',
    '2': 'blue',
    '3': 'orange',
    '4': 'red'
  };
  return colors[priority] || 'blue';
};

// 获取消息类型文本
const getTypeText = (type: string): string => {
  const types: Record<string, string> = {
    'SYSTEM_ANNOUNCEMENT': '系统公告',
    'EMERGENCY_NOTICE': '紧急通知',
    'MAINTENANCE_NOTICE': '维护通知',
    'CONTEST_ANNOUNCEMENT': '比赛公告',
    'PROBLEM_UPDATE_NOTICE': '题目更新通知',
    'ADMIN_ANNOUNCEMENT': '管理员公告'
  };
  return types[type] || '未知类型';
};

// 获取目标文本
const getTargetText = (): string => {
  switch (form.sendTarget) {
    case 'broadcast':
      return '全站用户';
    case 'specific':
      return `${form.recipientIds.length} 个指定用户`;
    case 'contest': {
      const contest = contests.value.find(c => c.id === form.contestId);
      return contest ? `比赛: ${contest.title}` : '未选择比赛';
    }
    default:
      return '未知';
  }
};

// 格式化额外数据
const formatExtraData = (): string => {
  try {
    return JSON.stringify(JSON.parse(form.extraData), null, 2);
  } catch {
    return form.extraData;
  }
};

// 提交表单
const handleSubmit = async (values: any) => {
  console.log('提交表单:', values, form);

  try {
    sending.value = true;

    // 验证额外数据格式（如果有填写）
    if (form.extraData && form.extraData.trim()) {
      try {
        JSON.parse(form.extraData);
      } catch (e) {
        Message.error('额外数据格式不正确，请输入有效的JSON格式');
        return;
      }
    }

    let response;

    // 根据发送目标选择API
    switch (form.sendTarget) {
      case 'broadcast':
        response = await MessageAPI.sendBroadcastMessage({
          title: form.title,
          content: form.content,
          messageType: form.messageType,
          priority: form.priority,
          extraData: form.extraData || undefined
        });
        break;

      case 'specific':
        response = await MessageAPI.sendPrivateMessage({
          title: form.title,
          content: form.content,
          messageType: form.messageType,
          priority: form.priority,
          recipientIds: form.recipientIds,
          extraData: form.extraData || undefined
        });
        break;

      case 'contest':
        response = await MessageAPI.sendContestMessage({
          title: form.title,
          content: form.content,
          messageType: form.messageType,
          priority: form.priority,
          contestId: form.contestId!,
          extraData: form.extraData || undefined
        });
        break;

      default:
        throw new Error('未知的发送目标');
    }

    if (response && (response.code === 0 || response.code === 200)) {
      Message.success('消息发送成功！');
      handleReset();
      await refreshStats();
    } else {
      throw new Error(response?.message || '发送失败');
    }

  } catch (error: any) {
    console.error('发送消息失败:', error);
    Message.error(error.message || '发送失败，请重试');
  } finally {
    sending.value = false;
  }
};

// 重置表单
const handleReset = () => {
  formRef.value?.resetFields();
  Object.assign(form, {
    messageType: '',
    title: '',
    content: '',
    priority: '2',
    sendTarget: 'broadcast',
    recipientIds: [],
    contestId: undefined,
    extraData: ''
  });
  userIdsInput.value = '';
};

// 预览消息
const handlePreview = () => {
  if (!form.title.trim() || !form.content.trim()) {
    Message.warning('请先填写标题和内容');
    return;
  }
  previewVisible.value = true;
};

// 刷新统计
const refreshStats = async () => {
  try {
    const response = await MessageAPI.getAdminStatistics(30);
    console.log('获取统计:', response);
    if (response && (response.code === 0 || response.code === 200)) {
      Object.assign(stats, response.data || {});
    }
  } catch (error) {
    console.error('获取统计失败:', error);
  }
};

// 组件挂载
onMounted(async () => {
  await refreshStats();
  // 可以在这里加载比赛列表
  await loadContests();
});
</script>

<style scoped lang="less">
.admin-message-send-optimized {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;

  .page-header {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;

    .header-content {
      padding: 32px;
      text-align: center;

      h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
        color: #1d2129;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
      }

      p {
        color: #86909c;
        margin: 0;
        font-size: 14px;
      }
    }
  }

  .send-form-container,
  .stats-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
  }

  .user-preview {
    margin-top: 8px;
    padding: 12px;
    background: #f7f8fa;
    border-radius: 4px;
    font-size: 12px;
    color: #86909c;
  }

  .extra-data-help,
  .message-type-help {
    margin-top: 8px;
    padding: 8px 12px;
    background: #f7f8fa;
    border-radius: 4px;
    border-left: 3px solid #1890ff;
  }

  .extra-data-hint {
    :deep(.arco-alert) {
      border-radius: 8px;
      border: 1px solid #e6f4ff;
      background: linear-gradient(135deg, #f0f9ff 0%, #e6f4ff 100%);

      .arco-alert-icon {
        color: #1890ff;
      }

      .arco-alert-message {
        color: #1d39c4;
        font-size: 13px;
        line-height: 1.5;
      }
    }
  }

  .message-preview {
    .preview-header {
      margin-bottom: 16px;

      h3 {
        margin: 0 0 8px 0;
        color: #1d2129;
      }

      .preview-meta {
        .arco-tag {
          margin-right: 8px;
        }
      }
    }

    .preview-content {
      margin-bottom: 16px;
      padding: 12px;
      background: #f7f8fa;
      border-radius: 4px;

      p {
        margin: 0;
        line-height: 1.6;
      }
    }

    .preview-target {
      margin-bottom: 12px;
      font-size: 14px;
    }

    .preview-extra {
      pre {
        background: #f7f8fa;
        padding: 8px;
        border-radius: 4px;
        font-size: 12px;
        margin: 4px 0 0 0;
      }
    }
  }
}
</style>
