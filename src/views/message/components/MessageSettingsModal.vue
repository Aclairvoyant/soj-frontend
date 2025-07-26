<template>
  <a-modal
    :visible="visible"
    title="消息推送设置"
    width="900px"
    @ok="handleSave"
    @cancel="handleCancel"
    @update:visible="(value: boolean) => emit('update:modelValue', value)"
  >
    <div class="settings-content horizontal-layout">
      <!-- 总开关 -->
      <div class="setting-section">
        <h4>推送总开关</h4>
        <a-switch
          v-model="settings.enablePush"
          :disabled="loading"
        />
        <span class="setting-desc">关闭后将不会收到任何消息推送</span>
      </div>

      <!-- 分类设置 -->
      <div class="setting-section">
        <h4>分类推送设置</h4>
        <div class="category-settings">
          <div
            v-for="(label, category) in categoryLabels"
            :key="category"
            class="category-item"
          >
            <a-switch
              v-model="settings.categories[category]"
              :disabled="!settings.enablePush || loading"
            />
            <span class="category-label">{{ label }}</span>
          </div>
        </div>
      </div>

      <!-- 免打扰时段 -->
      <div class="setting-section">
        <h4>免打扰时段</h4>
        <a-switch
          v-model="settings.quietHours.enabled"
          :disabled="!settings.enablePush || loading"
        />
        <span class="setting-desc">开启后，在指定时间段内不会收到推送</span>

        <div v-if="settings.quietHours.enabled && settings.enablePush" class="quiet-hours-config">
          <div class="time-range">
            <span>从</span>
            <a-time-picker
              v-model="startTime"
              :disabled="loading"
              format="HH:mm"
              placeholder="选择开始时间"
              @change="handleStartTimeChange"
              style="width: 120px; margin: 0 12px;"
            />
            <span>到</span>
            <a-time-picker
              v-model="endTime"
              :disabled="loading"
              format="HH:mm"
              placeholder="选择结束时间"
              @change="handleEndTimeChange"
              style="width: 120px; margin: 0 12px;"
            />
          </div>
        </div>
      </div>

      <!-- 测试调试区域 -->
<!--      <div class="setting-section">-->
<!--        <h4>调试测试</h4>-->
<!--        <div style="margin-bottom: 10px;">-->
<!--          <a-button size="small" @click="testSavePartialSettings">测试保存部分设置</a-button>-->
<!--        </div>-->
<!--        <div style="font-size: 12px; color: #999; line-height: 1.5;">-->
<!--          <div>当前设置状态:</div>-->
<!--          <div>• enablePush: {{ settings.enablePush }}</div>-->
<!--          <div>• INTERACTION: {{ settings.categories[MessageCategory.INTERACTION] }}</div>-->
<!--          <div>• SYSTEM: {{ settings.categories[MessageCategory.SYSTEM] }}</div>-->
<!--          <div>• CONTEST: {{ settings.categories[MessageCategory.CONTEST] }}</div>-->
<!--          <div>• RATING: {{ settings.categories[MessageCategory.RATING] }}</div>-->
<!--          <div>• JUDGE: {{ settings.categories[MessageCategory.JUDGE] }}</div>-->
<!--          <div>• quietHours.enabled: {{ settings.quietHours.enabled }}</div>-->
<!--        </div>-->
<!--      </div>-->

      <!-- 浏览器通知权限 -->
      <div class="setting-section">
        <h4>浏览器通知</h4>
        <div class="notification-status">
          <span>通知权限状态：</span>
          <a-tag :color="notificationStatusColor">{{ notificationStatusText }}</a-tag>
          <a-button
            v-if="notificationStatus === 'default'"
            type="primary"
            size="small"
            @click="requestNotificationPermission"
          >
            请求权限
          </a-button>
        </div>
      </div>
    </div>

    <template #footer>
      <a-button @click="handleCancel" :disabled="loading">取消</a-button>
      <a-button type="primary" @click="handleSave" :loading="loading">保存</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import { Message } from '@arco-design/web-vue';
import { UnifiedMessageVO } from '../../../../generated/models/UnifiedMessageVO';
import { MessageAPI } from '@/services/api/MessageAPI';

// 使用生成的类型
type MessageCategory = UnifiedMessageVO.categoryEnum;

// 定义推送设置接口
interface MessagePushSettings {
  enablePush: boolean;
  categories: Record<MessageCategory, boolean>;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const store = useStore();
const loading = ref(false);
const notificationStatus = ref<'default' | 'granted' | 'denied'>('default');

// 双向绑定visible
const visible = computed(() => props.modelValue);

// 默认设置
const defaultSettings: MessagePushSettings = {
  enablePush: true,
  categories: {
    [UnifiedMessageVO.categoryEnum.INTERACTION]: true,     // 开启互动消息
    [UnifiedMessageVO.categoryEnum.SYSTEM]: false,         // 其他全部关闭
    [UnifiedMessageVO.categoryEnum.CONTEST]: false,
    [UnifiedMessageVO.categoryEnum.RATING]: false,
    [UnifiedMessageVO.categoryEnum.JUDGE]: false
  },
  quietHours: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00'
  }
};

const settings = ref<MessagePushSettings>({ ...defaultSettings });

// 分类标签映射
const categoryLabels: Record<MessageCategory, string> = {
  [UnifiedMessageVO.categoryEnum.INTERACTION]: '互动消息',
  [UnifiedMessageVO.categoryEnum.SYSTEM]: '系统通知',
  [UnifiedMessageVO.categoryEnum.CONTEST]: '比赛相关',
  [UnifiedMessageVO.categoryEnum.RATING]: '评级相关',
  [UnifiedMessageVO.categoryEnum.JUDGE]: '判题相关'
};

// 时间选择器的值
const startTime = ref<string>('22:00');
const endTime = ref<string>('08:00');

// 通知权限状态
const notificationStatusColor = computed(() => {
  switch (notificationStatus.value) {
    case 'granted':
      return 'green';
    case 'denied':
      return 'red';
    default:
      return 'orange';
  }
});

const notificationStatusText = computed(() => {
  switch (notificationStatus.value) {
    case 'granted':
      return '已授权';
    case 'denied':
      return '已拒绝';
    default:
      return '未设置';
  }
});

// 重置为默认设置
const resetToDefaults = () => {
  settings.value = { ...defaultSettings };
  startTime.value = '22:00';
  endTime.value = '08:00';
};

// 加载设置
const loadSettings = async () => {
  if (loading.value) return; // 防止重复加载

  try {
    loading.value = true;

    let hasValidData = false;

    // 尝试从服务器加载最新设置
    try {
      const response = await store.dispatch('message/fetchPushSettings');

      // 检查 response 的结构
      if (response && typeof response === 'object') {
        await applySettings(response);
        hasValidData = true;
        // 保存到localStorage作为缓存
        localStorage.setItem('messagePushSettings', JSON.stringify(settings.value));
      }
    } catch (serverError) {
      // 静默处理服务器错误
    }

    // 如果服务器数据加载失败，尝试从localStorage加载缓存的设置
    if (!hasValidData) {
      const cachedSettings = localStorage.getItem('messagePushSettings');
      if (cachedSettings) {
        try {
          const parsed = JSON.parse(cachedSettings);
          await applySettings(parsed);
          hasValidData = true;
        } catch (parseError) {
          // 静默处理解析错误
        }
      }
    }

    // 如果没有任何有效数据，才使用默认设置
    if (!hasValidData) {
      resetToDefaults();
    }

  } catch (error) {
    resetToDefaults();
  } finally {
    loading.value = false;
  }
};

// 更新通知权限状态
const updateNotificationStatus = () => {
  if ('Notification' in window) {
    notificationStatus.value = Notification.permission;
  }
};

// 监听弹窗打开
watch(() => props.modelValue, async (newVisible) => {
  if (newVisible) {
    // 异步加载，避免阻塞UI
    try {
      await loadSettings();
      updateNotificationStatus();
    } catch (error) {
      // 初始化失败时使用默认设置
      resetToDefaults();
    }
  }
}, { immediate: true });

// 应用设置数据
const applySettings = async (data: any) => {
  if (!data || typeof data !== 'object') return;

  // 安全的布尔值转换函数
  const toBool = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return Boolean(value);
  };

  // 构建新的settings对象以确保响应式更新
  const newSettings: MessagePushSettings = {
    enablePush: data.enablePush !== undefined ? toBool(data.enablePush) : defaultSettings.enablePush,
    categories: {
      [UnifiedMessageVO.categoryEnum.INTERACTION]: data.categories?.INTERACTION !== undefined ?
        toBool(data.categories.INTERACTION) : defaultSettings.categories[UnifiedMessageVO.categoryEnum.INTERACTION],
      [UnifiedMessageVO.categoryEnum.SYSTEM]: data.categories?.SYSTEM !== undefined ?
        toBool(data.categories.SYSTEM) : defaultSettings.categories[UnifiedMessageVO.categoryEnum.SYSTEM],
      [UnifiedMessageVO.categoryEnum.CONTEST]: data.categories?.CONTEST !== undefined ?
        toBool(data.categories.CONTEST) : defaultSettings.categories[UnifiedMessageVO.categoryEnum.CONTEST],
      [UnifiedMessageVO.categoryEnum.RATING]: data.categories?.RATING !== undefined ?
        toBool(data.categories.RATING) : defaultSettings.categories[UnifiedMessageVO.categoryEnum.RATING],
      [UnifiedMessageVO.categoryEnum.JUDGE]: data.categories?.JUDGE !== undefined ?
        toBool(data.categories.JUDGE) : defaultSettings.categories[UnifiedMessageVO.categoryEnum.JUDGE]
    },
    quietHours: {
      enabled: data.quietHours?.enabled !== undefined ? toBool(data.quietHours.enabled) : defaultSettings.quietHours.enabled,
      startTime: data.quietHours?.startTime || defaultSettings.quietHours.startTime,
      endTime: data.quietHours?.endTime || defaultSettings.quietHours.endTime
    }
  };

  // 完全替换settings.value以触发响应式更新
  settings.value = newSettings;

  // 安全地设置时间选择器的值
  try {
    const start = settings.value.quietHours.startTime || '22:00';
    const end = settings.value.quietHours.endTime || '08:00';

    startTime.value = start;
    endTime.value = end;
  } catch (timeError) {
    startTime.value = '22:00';
    endTime.value = '08:00';
    settings.value.quietHours.startTime = '22:00';
    settings.value.quietHours.endTime = '08:00';
  }

  // 使用nextTick确保DOM更新
  await nextTick();
};

// 请求通知权限
const requestNotificationPermission = async () => {
  try {
    if ('Notification' in window) {
      // 添加超时处理
      const timeoutPromise = new Promise<'default' | 'granted' | 'denied'>((_, reject) => {
        setTimeout(() => reject(new Error('权限请求超时')), 5000);
      });

      const permissionPromise = Notification.requestPermission();
      const permission = await Promise.race([permissionPromise, timeoutPromise]);

      notificationStatus.value = permission;
      if (permission === 'granted') {
        Message.success('通知权限已授权');
      } else {
        Message.warning('通知权限被拒绝');
      }
    } else {
      Message.error('浏览器不支持通知功能');
    }
  } catch (error) {
    console.error('请求通知权限失败:', error);
    Message.error('请求权限失败，请手动在浏览器设置中开启');
  }
};

// 处理开始时间变化
const handleStartTimeChange = (value: string) => {
  if (value && settings.value?.quietHours) {
    startTime.value = value;
    settings.value.quietHours.startTime = value;
  }
};

// 处理结束时间变化
const handleEndTimeChange = (value: string) => {
  if (value && settings.value?.quietHours) {
    endTime.value = value;
    settings.value.quietHours.endTime = value;
  }
};

// 保存设置
const handleSave = async () => {
  if (loading.value) return; // 防止重复提交

  try {
    loading.value = true;

    // 验证设置数据
    if (!settings.value) {
      throw new Error('设置数据无效');
    }

    // 确保时间设置正确
    if (startTime.value) {
      settings.value.quietHours.startTime = startTime.value;
    }
    if (endTime.value) {
      settings.value.quietHours.endTime = endTime.value;
    }


    // 构造符合后端期望的数据格式
    const dataToSave = {
      enablePush: Boolean(settings.value.enablePush),
      categories: {
        INTERACTION: Boolean(settings.value.categories[UnifiedMessageVO.categoryEnum.INTERACTION]),
        SYSTEM: Boolean(settings.value.categories[UnifiedMessageVO.categoryEnum.SYSTEM]),
        CONTEST: Boolean(settings.value.categories[UnifiedMessageVO.categoryEnum.CONTEST]),
        RATING: Boolean(settings.value.categories[UnifiedMessageVO.categoryEnum.RATING]),
        JUDGE: Boolean(settings.value.categories[UnifiedMessageVO.categoryEnum.JUDGE])
      },
      quietHours: {
        enabled: Boolean(settings.value.quietHours.enabled),
        startTime: settings.value.quietHours.startTime,
        endTime: settings.value.quietHours.endTime
      }
    };


    // 先保存到localStorage
    localStorage.setItem('messagePushSettings', JSON.stringify(settings.value));

    // 添加超时处理
    const timeoutPromise = new Promise<any>((_, reject) => {
      setTimeout(() => reject(new Error('保存超时，请检查网络连接')), 15000); // 15秒超时
    });

    const savePromise = store.dispatch('message/updatePushSettings', dataToSave);
    const result = await Promise.race([savePromise, timeoutPromise]);


    // 检查保存结果
    if (result && result.code === 200) {
      Message.success('设置保存成功');

      // 保存成功后重新加载设置确认
      try {
        const reloadedSettings = await store.dispatch('message/fetchPushSettings');
        if (reloadedSettings) {
          localStorage.setItem('messagePushSettings', JSON.stringify(reloadedSettings));
        }
      } catch (reloadError) {
        // 静默处理重新加载错误
      }

      emit('update:modelValue', false);
    } else {
      throw new Error(result?.message || '保存失败');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '保存设置失败';
    Message.error(errorMessage);
  } finally {
    loading.value = false;
  }
};

// 测试保存部分设置
// const testSavePartialSettings = async () => {
//   try {
//     console.log('测试保存部分设置...');
//
//     // 设置测试数据：只开启总开关和互动消息
//     const testSettings = {
//       enablePush: true,
//       categories: {
//         INTERACTION: true,  // 只开启互动消息
//         SYSTEM: false,      // 其他全部关闭
//         CONTEST: false,
//         RATING: false,
//         JUDGE: false
//       },
//       quietHours: {
//         enabled: false,
//         startTime: '22:00',
//         endTime: '08:00'
//       }
//     };
//
//     console.log('测试数据:', testSettings);
//     console.log('即将调用API: /api/message/push/settings (POST)');
//     console.log('发送的JSON数据:', JSON.stringify(testSettings, null, 2));
//
//     // 直接调用API服务，绕过store
//     const directResult = await UnifiedMessageControllerService.updatePushSettingsUsingPost(testSettings);
//     console.log('直接API调用结果:', directResult);
//
//     // 也通过store调用
//     const storeResult = await store.dispatch('message/updatePushSettings', testSettings);
//     console.log('Store调用结果:', storeResult);
//
//     // 等待一秒后重新获取数据
//     setTimeout(async () => {
//       console.log('===== 1秒后重新获取数据 =====');
//       const freshData = await store.dispatch('message/fetchPushSettings');
//       console.log('重新获取的数据:', freshData);
//     }, 1000);
//
//     if (directResult && directResult.code === 200) {
//       Message.success('测试保存成功，1秒后将重新获取数据验证');
//     } else {
//       Message.error('测试保存失败');
//     }
//   } catch (error) {
//     console.error('测试保存失败:', error);
//     Message.error('测试保存出错');
//   }
// };

// 取消
const handleCancel = () => {
  if (loading.value) {
    Message.warning('正在处理中，请稍候...');
    return;
  }
  emit('update:modelValue', false);
};

// 组件挂载时更新通知状态
onMounted(() => {
  updateNotificationStatus();
  // 确保时间选择器有初始值
  if (!startTime.value) {
    startTime.value = '22:00';
  }
  if (!endTime.value) {
    endTime.value = '08:00';
  }
});
</script>

<style scoped lang="less">
.settings-content {
  &.horizontal-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      grid-gap: 16px;
    }

    .setting-section {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .setting-section {
    margin-bottom: 32px;
    padding: 24px;
    background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    h4 {
      margin: 0 0 16px 0;
      font-weight: 600;
      color: #262626;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 8px;

      &::before {
        content: '';
        width: 4px;
        height: 16px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 2px;
      }
    }

    .setting-desc {
      margin-left: 16px;
      font-size: 13px;
      color: #8c8c8c;
      line-height: 1.5;
    }

    .category-settings {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;

      .category-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px 16px;
        background: white;
        border-radius: 8px;
        border: 1px solid #f0f0f0;
        transition: all 0.3s;

        &:hover {
          border-color: #d9d9d9;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .category-label {
          color: #595959;
          font-weight: 500;
          flex: 1;
        }

        :deep(.ant-switch) {
          &.ant-switch-checked {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
        }
      }
    }

    .quiet-hours-config {
      margin-top: 16px;
      padding: 20px;
      background: white;
      border-radius: 10px;
      border: 1px solid #e8e8e8;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

      .time-range {
        display: flex;
        align-items: center;
        gap: 12px;
        justify-content: flex-start;

        @media (max-width: 768px) {
          flex-direction: column;
          align-items: stretch;
          gap: 8px;
        }

        span {
          color: #595959;
          font-weight: 500;
          white-space: nowrap;
          flex-shrink: 0;

          @media (max-width: 768px) {
            text-align: center;
            margin-bottom: 4px;
          }
        }

        :deep(.arco-picker) {
          width: 120px;
          flex-shrink: 0;
          border-radius: 8px;
          border: 1px solid #d9d9d9;
          transition: all 0.3s;

          @media (max-width: 768px) {
            width: 100%;
          }

          &:hover {
            border-color: #667eea;
          }

          &.arco-picker-focused {
            border-color: #667eea;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
          }
        }
      }
    }

    .notification-status {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: white;
      border-radius: 10px;
      border: 1px solid #e8e8e8;
      margin-top: 16px;

      span {
        color: #595959;
        font-weight: 500;
      }

      .ant-tag {
        border-radius: 6px;
        font-weight: 500;
        padding: 4px 12px;
      }

      .ant-btn {
        border-radius: 6px;
        font-weight: 500;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      }
    }

    :deep(.ant-switch) {
      &.ant-switch-checked {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
    }
  }
}

// 模态框样式覆盖
:deep(.ant-modal) {
  .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  }

  .ant-modal-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-bottom: none;
    padding: 24px 32px;

    .ant-modal-title {
      color: white;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .ant-modal-body {
    padding: 32px;
  }

  .ant-modal-footer {
    border-top: 1px solid #f0f0f0;
    padding: 20px 32px;

    .ant-btn {
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-1px);
      }

      &.ant-btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;

        &:hover {
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
      }
    }
  }
}
</style>
