<template>
  <div class="send-message-container">
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <icon-send class="header-icon" />
          <h2>发送消息</h2>
        </div>
        <div class="header-actions">
          <a-space>
            <a-button @click="saveDraft">
              <template #icon>
                <icon-save />
              </template>
              保存草稿
            </a-button>
            <a-button type="primary" @click="handleSendMessage" :loading="sending">
              <template #icon>
                <icon-send />
              </template>
              发送消息
            </a-button>
          </a-space>
        </div>
      </div>
    </div>

    <div class="form-container">
      <a-card class="form-card" :bordered="false">
        <a-form :model="messageForm" layout="vertical" ref="formRef">
          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item 
                label="消息标题" 
                field="title" 
                required
                :rules="[{ required: true, message: '请输入消息标题' }]"
              >
                <a-input 
                  v-model="messageForm.title" 
                  placeholder="请输入消息标题"
                  size="large"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item 
                label="消息类型" 
                field="type" 
                required
                :rules="[{ required: true, message: '请选择消息类型' }]"
              >
                <a-select 
                  v-model="messageForm.type" 
                  placeholder="请选择消息类型"
                  size="large"
                >
                  <a-option value="SYSTEM">
                    <div class="option-item">
                      <icon-notification />
                      <span>系统通知</span>
                    </div>
                  </a-option>
                  <a-option value="ANNOUNCEMENT">
                    <div class="option-item">
                      <icon-sound />
                      <span>公告</span>
                    </div>
                  </a-option>
                  <a-option value="MAINTENANCE">
                    <div class="option-item">
                      <icon-tool />
                      <span>维护通知</span>
                    </div>
                  </a-option>
                  <a-option value="ACTIVITY">
                    <div class="option-item">
                      <icon-gift />
                      <span>活动通知</span>
                    </div>
                  </a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item 
                label="发送方式" 
                field="sendType" 
                required
                :rules="[{ required: true, message: '请选择发送方式' }]"
              >
                <a-select 
                  v-model="sendType" 
                  placeholder="请选择发送方式"
                  size="large"
                  @change="handleSendTypeChange"
                >
                  <a-option value="single">
                    <div class="option-item">
                      <icon-user />
                      <span>单个用户</span>
                    </div>
                  </a-option>
                  <a-option value="multiple">
                    <div class="option-item">
                      <icon-user-group />
                      <span>多个用户</span>
                    </div>
                  </a-option>
                  <a-option value="problemSet">
                    <div class="option-item">
                      <icon-file />
                      <span>题单用户</span>
                    </div>
                  </a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <!-- 单个用户 -->
          <a-row v-if="sendType === 'single'" :gutter="24">
            <a-col :span="24">
              <a-form-item 
                label="接收用户ID" 
                field="recipientId" 
                required
                :rules="[{ required: true, message: '请输入用户ID' }]"
              >
                <a-input-number 
                  v-model="messageForm.recipientId" 
                  placeholder="请输入用户ID" 
                  style="width: 100%"
                  size="large"
                  :min="1"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <!-- 多个用户 -->
          <a-row v-if="sendType === 'multiple'" :gutter="24">
            <a-col :span="24">
              <a-form-item 
                label="接收用户ID列表" 
                field="recipientIds" 
                required
                :rules="[{ required: true, message: '请输入用户ID列表' }]"
              >
                <a-textarea 
                  v-model="recipientIds" 
                  placeholder="请输入用户ID，用逗号分隔，例如：1,2,3"
                  :rows="3"
                  size="large"
                />
                <div class="input-tip">
                  <icon-info-circle />
                  <span>支持批量输入，用逗号分隔多个用户ID</span>
                </div>
              </a-form-item>
            </a-col>
          </a-row>

          <!-- 题单用户 -->
          <a-row v-if="sendType === 'problemSet'" :gutter="24">
            <a-col :span="24">
              <a-form-item 
                label="题单ID" 
                field="problemSetId" 
                required
                :rules="[{ required: true, message: '请输入题单ID' }]"
              >
                <a-input-number 
                  v-model="messageForm.problemSetId" 
                  placeholder="请输入题单ID" 
                  style="width: 100%"
                  size="large"
                  :min="1"
                />
                <div class="input-tip">
                  <icon-info-circle />
                  <span>将向题单内所有用户发送消息</span>
                </div>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :span="24">
              <a-form-item 
                label="消息内容" 
                field="content" 
                required
                :rules="[{ required: true, message: '请输入消息内容' }]"
              >
                <div class="editor-container">
                  <div class="editor-toolbar">
                    <a-space>
                      <a-button type="text" @click="insertTemplate('greeting')">
                        <icon-message />
                        问候模板
                      </a-button>
                      <a-button type="text" @click="insertTemplate('notice')">
                        <icon-notification />
                        通知模板
                      </a-button>
                      <a-button type="text" @click="insertTemplate('maintenance')">
                        <icon-tool />
                        维护模板
                      </a-button>
                      <a-divider type="vertical" />
                      <a-button type="text" @click="toggleEditorMode" :class="{ 'active': isMarkdownMode }">
                        <icon-code />
                        {{ isMarkdownMode ? '预览模式' : 'Markdown' }}
                      </a-button>
                    </a-space>
                  </div>
                  <div v-if="isMarkdownMode" class="markdown-editor">
                    <MdEditorV3 v-model="messageForm.content" />
                  </div>
                  <a-textarea 
                    v-else
                    v-model="messageForm.content" 
                    placeholder="请输入消息内容..."
                    :rows="10"
                    size="large"
                    class="content-editor"
                  />
                  <div class="editor-footer">
                    <div class="word-count">
                      字数: {{ messageForm.content?.length || 0 }} / 1000
                    </div>
                  </div>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </div>

    <!-- 预览窗口 -->
    <div class="preview-section">
      <a-card class="preview-card" :bordered="false">
        <template #title>
          <div class="preview-title">
            <icon-eye />
            <span>消息预览</span>
          </div>
        </template>
        <div class="message-preview">
          <div class="preview-header">
            <div class="preview-message-title">{{ messageForm.title || '消息标题' }}</div>
            <div class="preview-meta">
              <a-tag :color="getTypeColor(messageForm.type || 'SYSTEM')">
                {{ getTypeText(messageForm.type || 'SYSTEM') }}
              </a-tag>
              <span class="preview-time">{{ currentTime }}</span>
            </div>
          </div>
          <div class="preview-content">
            <div class="content-text">
              <div v-if="isMarkdownMode && messageForm.content" class="markdown-preview">
                <MdViewerV3 :value="messageForm.content" />
              </div>
              <div v-else-if="messageForm.content" class="plain-text-preview">{{ messageForm.content }}</div>
              <div v-else class="placeholder-text">消息内容将在这里显示...</div>
            </div>
          </div>
          <div class="preview-recipients">
            <div class="recipients-label">接收对象:</div>
            <div class="recipients-info">
              <span v-if="sendType === 'single' && messageForm.recipientId">
                用户ID: {{ messageForm.recipientId }}
              </span>
              <span v-else-if="sendType === 'multiple' && recipientIds">
                {{ getRecipientCount() }} 个用户
              </span>
              <span v-else-if="sendType === 'problemSet' && messageForm.problemSetId">
                题单ID: {{ messageForm.problemSetId }} 的所有用户
              </span>
              <span v-else class="no-recipients">未设置接收对象</span>
            </div>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import {
  IconSend,
  IconSave,
  IconNotification,
  IconSound,
  IconTool,
  IconGift,
  IconUser,
  IconUserGroup,
  IconFile,
  IconInfoCircle,
  IconMessage,
  IconEye,
  IconCode
} from '@arco-design/web-vue/es/icon'
import moment from 'moment'
import { AdminSysNoticeControllerService } from '../../../generated'
import type { AdminSysNoticeAddRequest } from '../../../generated'
import MdEditorV3 from '@/components/MdEditorV3.vue'
import MdViewerV3 from '@/components/MdViewerV3.vue'

const formRef = ref()
const sending = ref(false)
const sendType = ref('single')
const recipientIds = ref('')
const isMarkdownMode = ref(true)

const messageForm = reactive<AdminSysNoticeAddRequest>({
  title: '',
  content: '',
  type: 'SYSTEM',
  recipientId: undefined,
  recipientIdList: [],
  problemSetId: undefined
})

const currentTime = computed(() => {
  return moment().format('YYYY-MM-DD HH:mm:ss')
})

const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'SYSTEM': '系统通知',
    'ANNOUNCEMENT': '公告',
    'MAINTENANCE': '维护通知',
    'ACTIVITY': '活动通知'
  }
  return typeMap[type] || type
}

const getTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    'SYSTEM': 'blue',
    'ANNOUNCEMENT': 'green',
    'MAINTENANCE': 'orange',
    'ACTIVITY': 'purple'
  }
  return colorMap[type] || 'blue'
}

const getRecipientCount = () => {
  if (!recipientIds.value) return 0
  return recipientIds.value.split(',').filter(id => id.trim() !== '').length
}

const handleSendTypeChange = () => {
  // 清空之前的接收者设置
  messageForm.recipientId = undefined
  messageForm.recipientIdList = []
  messageForm.problemSetId = undefined
  recipientIds.value = ''
}

const toggleEditorMode = () => {
  isMarkdownMode.value = !isMarkdownMode.value
}

const insertTemplate = (templateType: string) => {
  const templates = {
    greeting: '# 亲爱的用户，您好！\n\n感谢您使用我们的**在线判题系统**。\n\n*祝您学习愉快！*',
    notice: '# 系统通知\n\n## 重要信息\n\n尊敬的用户，我们有重要信息需要通知您：\n\n- 在此处填写具体通知内容\n- 可以使用列表格式\n\n> 如有疑问，请联系管理员。',
    maintenance: '# 系统维护通知\n\n## 维护信息\n\n尊敬的用户：\n\n我们将于 **[维护时间]** 进行系统维护，届时系统将暂时不可用。\n\n### 维护详情\n\n- **维护内容**：[维护内容]\n- **预计耗时**：[预计时间]\n\n---\n\n*给您带来的不便，敬请谅解。*'
  }
  
  if (templates[templateType as keyof typeof templates]) {
    messageForm.content = templates[templateType as keyof typeof templates]
  }
}

const validateForm = () => {
  if (!messageForm.title) {
    Message.warning('请输入消息标题')
    return false
  }
  
  if (!messageForm.content) {
    Message.warning('请输入消息内容')
    return false
  }
  
  if (sendType.value === 'single' && !messageForm.recipientId) {
    Message.warning('请输入接收用户ID')
    return false
  }
  
  if (sendType.value === 'multiple' && !recipientIds.value.trim()) {
    Message.warning('请输入用户ID列表')
    return false
  }
  
  if (sendType.value === 'problemSet' && !messageForm.problemSetId) {
    Message.warning('请输入题单ID')
    return false
  }
  
  return true
}

const handleSendMessage = async () => {
  if (!validateForm()) return
  
  // 根据发送类型设置接收者
  if (sendType.value === 'multiple') {
    const ids = recipientIds.value.split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id) && id > 0)
    
    if (ids.length === 0) {
      Message.warning('请输入有效的用户ID列表')
      return
    }
    messageForm.recipientIdList = ids
    messageForm.recipientId = undefined
  } else if (sendType.value === 'single') {
    messageForm.recipientIdList = []
  } else if (sendType.value === 'problemSet') {
    messageForm.recipientId = undefined
    messageForm.recipientIdList = []
  }

  sending.value = true
  try {
    const response = await AdminSysNoticeControllerService.sendNoticeUsingPost(messageForm)
    if (response.code === 200) {
      Message.success('消息发送成功')
      resetForm()
    }
  } catch (error) {
    console.error('发送消息失败:', error)
    Message.error('发送消息失败')
  } finally {
    sending.value = false
  }
}

const saveDraft = () => {
  const draft = {
    ...messageForm,
    sendType: sendType.value,
    recipientIds: recipientIds.value,
    timestamp: Date.now()
  }
  
  localStorage.setItem('messageDraft', JSON.stringify(draft))
  Message.success('草稿保存成功')
}

const loadDraft = () => {
  const draft = localStorage.getItem('messageDraft')
  if (draft) {
    try {
      const draftData = JSON.parse(draft)
      Object.assign(messageForm, draftData)
      sendType.value = draftData.sendType || 'single'
      recipientIds.value = draftData.recipientIds || ''
      Message.info('已加载草稿')
    } catch (error) {
      console.error('加载草稿失败:', error)
    }
  }
}

const resetForm = () => {
  messageForm.title = ''
  messageForm.content = ''
  messageForm.type = 'SYSTEM'
  messageForm.recipientId = undefined
  messageForm.recipientIdList = []
  messageForm.problemSetId = undefined
  recipientIds.value = ''
  sendType.value = 'single'
  
  // 清除草稿
  localStorage.removeItem('messageDraft')
}

onMounted(() => {
  loadDraft()
})
</script>

<style lang="less" scoped>
.send-message-container {
  padding: 24px;
  min-height: calc(100vh - 120px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  grid-template-rows: auto 1fr;
  grid-template-areas: 
    "header header"
    "form preview";
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
        
        &.arco-btn-primary {
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

.form-container {
  grid-area: form;
  
  .form-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    height: fit-content;
    
    .option-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .input-tip {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      font-size: 12px;
      color: #666;
      
      .arco-icon {
        color: #1890ff;
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
          
          &.active {
            background: #1890ff;
            color: white;
            
            &:hover {
              background: #40a9ff;
            }
          }
        }
      }
      
      .markdown-editor {
        border: none;
        border-radius: 0;
        min-height: 300px;
        
        :deep(.md-editor) {
          border: none;
          border-radius: 0;
        }
        
        :deep(.md-editor-toolbar) {
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
        }
        
        :deep(.md-editor-input-wrapper) {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
        
        :deep(.md-editor-preview-wrapper) {
          padding: 16px;
        }
      }
      
      .content-editor {
        border: none;
        border-radius: 0;
        
        &:focus {
          box-shadow: none;
        }
      }
      
      .editor-footer {
        background: #f8fafc;
        padding: 8px 16px;
        border-top: 1px solid #e5e7eb;
        text-align: right;
        
        .word-count {
          font-size: 12px;
          color: #666;
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
    
    .preview-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1890ff;
      font-weight: 600;
    }
    
    .message-preview {
      .preview-header {
        padding-bottom: 16px;
        border-bottom: 2px solid #f0f0f0;
        margin-bottom: 16px;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #1890ff, #40a9ff);
          border-radius: 1px;
        }
        
        .preview-message-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
          word-break: break-word;
        }
        
        .preview-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          
          .arco-tag {
            font-weight: 500;
            border-radius: 12px;
            padding: 4px 8px;
            font-size: 11px;
          }
          
          .preview-time {
            font-size: 12px;
            color: #999;
            background: rgba(153, 153, 153, 0.1);
            padding: 2px 8px;
            border-radius: 8px;
          }
        }
      }
      
      .preview-content {
        margin-bottom: 16px;
        
        .content-text {
          padding: 16px;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 12px;
          line-height: 1.6;
          border: 1px solid rgba(0, 0, 0, 0.05);
          position: relative;
          min-height: 80px;
          
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(180deg, #1890ff, #40a9ff);
            border-radius: 2px 0 0 2px;
          }
          
          .markdown-preview {
            word-break: break-word;
            
            :deep(.md-editor-preview) {
              padding: 0;
            }
            
            :deep(h1) {
              font-size: 24px;
              font-weight: 600;
              margin: 0 0 16px 0;
              color: #1a1a1a;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 8px;
            }
            
            :deep(h2) {
              font-size: 20px;
              font-weight: 600;
              margin: 16px 0 12px 0;
              color: #1a1a1a;
            }
            
            :deep(h3) {
              font-size: 16px;
              font-weight: 600;
              margin: 12px 0 8px 0;
              color: #1a1a1a;
            }
            
            :deep(p) {
              margin: 8px 0;
              line-height: 1.6;
            }
            
            :deep(strong) {
              font-weight: 600;
              color: #1a1a1a;
            }
            
            :deep(em) {
              font-style: italic;
              color: #666;
            }
            
            :deep(ul) {
              margin: 8px 0;
              padding-left: 20px;
            }
            
            :deep(ol) {
              margin: 8px 0;
              padding-left: 20px;
            }
            
            :deep(li) {
              margin: 4px 0;
            }
            
            :deep(blockquote) {
              margin: 12px 0;
              padding: 8px 16px;
              background: rgba(24, 144, 255, 0.05);
              border-left: 4px solid #1890ff;
              border-radius: 4px;
            }
            
            :deep(code) {
              background: rgba(24, 144, 255, 0.1);
              padding: 2px 4px;
              border-radius: 3px;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              font-size: 0.9em;
            }
            
            :deep(pre) {
              background: #f8fafc;
              padding: 12px;
              border-radius: 6px;
              overflow-x: auto;
              margin: 12px 0;
              border: 1px solid #e5e7eb;
              
              code {
                background: none;
                padding: 0;
              }
            }
            
            :deep(table) {
              width: 100%;
              border-collapse: collapse;
              margin: 12px 0;
              border: 1px solid #e5e7eb;
            }
            
            :deep(th), :deep(td) {
              padding: 8px 12px;
              border: 1px solid #e5e7eb;
              text-align: left;
            }
            
            :deep(th) {
              background: #f8fafc;
              font-weight: 600;
            }
          }
          
          .plain-text-preview {
            white-space: pre-wrap;
            word-break: break-word;
          }
          
          .placeholder-text {
            color: #999;
            font-style: italic;
          }
        }
      }
      
      .preview-recipients {
        padding: 12px 16px;
        background: rgba(24, 144, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(24, 144, 255, 0.1);
        
        .recipients-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
          font-weight: 500;
        }
        
        .recipients-info {
          font-size: 14px;
          color: #1a1a1a;
          font-weight: 500;
          
          .no-recipients {
            color: #999;
            font-style: italic;
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .send-message-container {
    grid-template-columns: 1fr;
    grid-template-areas: 
      "header"
      "form"
      "preview";
    
    .preview-section .preview-card {
      position: static;
    }
  }
}

@media (max-width: 768px) {
  .send-message-container {
    padding: 16px;
    gap: 16px;
    
    .page-header .header-content {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }
    
    .form-container .form-card {
      .arco-row {
        .arco-col {
          width: 100%;
        }
      }
    }
  }
}
</style>