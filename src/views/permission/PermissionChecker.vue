<template>
  <div class="permission-checker">
    <a-card>
      <template #title>
        <div class="page-header">
          <h2>权限检查工具</h2>
          <p>测试和验证用户权限配置</p>
        </div>
      </template>

      <a-row :gutter="24">
        <a-col :span="12">
          <a-card title="权限检查" size="small">
            <a-form :model="checkForm" layout="vertical">
              <a-form-item label="目标用户" name="userId" required>
                <a-select
                  v-model="checkForm.userId"
                  placeholder="请选择要检查的用户"
                  show-search
                  :filter-option="filterUserOption"
                  @change="handleUserChange"
                >
                  <a-option
                    v-for="user in userList"
                    :key="user.id"
                    :value="user.id"
                  >
                    {{ user.userName }} ({{ user.userAccount }})
                  </a-option>
                </a-select>
              </a-form-item>

              <a-form-item label="检查类型" name="checkType" required>
                <a-radio-group v-model="checkForm.checkType">
                  <a-radio value="module">模块级权限</a-radio>
                  <a-radio value="resource">资源级权限</a-radio>
                </a-radio-group>
              </a-form-item>

              <a-form-item label="权限操作" name="action" required>
                <a-input
                  v-model="checkForm.action"
                  :placeholder="actionPlaceholder"
                />
                <div class="helper-text" style="margin-top: 4px; font-size: 12px; color: #999;">
                  {{ actionExample }}
                </div>
              </a-form-item>

              <div v-if="checkForm.checkType === 'resource'" class="resource-section">
                <a-form-item label="资源类型" name="resourceType">
                  <a-select
                    v-model="checkForm.resourceType"
                    placeholder="请选择资源类型"
                  >
                    <a-option value="question">题目</a-option>
                    <a-option value="contest">竞赛</a-option>
                    <a-option value="post">帖子</a-option>
                    <a-option value="user">用户</a-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="资源ID" name="resourceId">
                  <a-input-number
                    v-model="checkForm.resourceId"
                    placeholder="请输入资源ID"
                    style="width: 100%"
                  />
                </a-form-item>
              </div>

              <a-form-item>
                <a-space>
                  <a-button
                    type="primary"
                    @click="handleCheck"
                    :loading="checkLoading"
                  >
                    <template #icon>
                      <IconBug />
                    </template>
                    执行检查
                  </a-button>

                  <a-button @click="handleReset">
                    重置
                  </a-button>
                </a-space>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>

        <a-col :span="12">
          <a-card title="检查结果" size="small">
            <div v-if="checkResult" class="check-result">
              <a-result
                :status="checkResult.hasPermission ? 'success' : 'error'"
                :title="checkResult.hasPermission ? '权限检查通过' : '权限检查失败'"
                :sub-title="checkResult.reason"
              >
                <template #extra>
                  <a-descriptions :column="1" size="small">
                    <a-descriptions-item label="用户角色">
                      <a-tag :color="getRoleColor(checkResult.userRole)">
                        {{ checkResult.userRole }}
                      </a-tag>
                    </a-descriptions-item>

                    <a-descriptions-item label="角色级别">
                      {{ checkResult.roleLevel }}
                    </a-descriptions-item>

                    <a-descriptions-item label="检查时间">
                      {{ formatTime(checkResult.checkTime) }}
                    </a-descriptions-item>

                    <a-descriptions-item label="权限路径">
                      <a-tag color="blue">{{ checkResult.requiredPermission }}</a-tag>
                    </a-descriptions-item>
                  </a-descriptions>
                </template>
              </a-result>
            </div>

            <a-empty v-else description="请执行权限检查" />
          </a-card>
        </a-col>
      </a-row>

      <a-divider />

      <!-- 批量检查功能 -->
      <a-card title="批量权限检查" size="small">
        <a-form layout="vertical">
          <a-form-item label="权限列表">
            <a-textarea
              v-model="batchCheckText"
              placeholder="请输入权限列表，每行一个，格式: userId:action 或 userId:action:resourceType:resourceId"
              :rows="6"
            />
            <div class="helper-text">
              <p>示例:</p>
              <p>1:question_manage:create</p>
              <p>2:question_manage:view:question:123</p>
              <p>3:user_manage:edit_role</p>
            </div>
          </a-form-item>

          <a-form-item>
            <a-space>
              <a-button
                type="primary"
                @click="handleBatchCheck"
                :loading="batchCheckLoading"
              >
                <template #icon>
                  <IconBug />
                </template>
                批量检查
              </a-button>

              <a-button @click="handleBatchReset">
                清空
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>

        <!-- 批量检查结果 -->
        <div v-if="batchResults.length > 0" class="batch-results">
          <a-divider />

          <div class="result-summary">
            <a-statistic-group>
              <a-statistic
                title="总检查数"
                :value="batchResults.length"
                style="margin-right: 32px"
              />
              <a-statistic
                title="通过数"
                :value="batchResults.filter(r => r.hasPermission).length"
                style="margin-right: 32px"
              />
              <a-statistic
                title="失败数"
                :value="batchResults.filter(r => !r.hasPermission).length"
                style="margin-right: 32px"
              />
              <a-statistic
                title="通过率"
                :value="Math.round((batchResults.filter(r => r.hasPermission).length / batchResults.length) * 100)"
                suffix="%"
              />
            </a-statistic-group>
          </div>

          <a-table
            :columns="batchColumns"
            :data="batchResults"
            :pagination="false"
            size="small"
            row-key="index"
          >
            <!-- 检查结果列 -->
            <template #hasPermission="{ record }">
              <a-tag :color="record.hasPermission ? 'green' : 'red'">
                {{ record.hasPermission ? '通过' : '失败' }}
              </a-tag>
            </template>

            <!-- 用户角色列 -->
            <template #userRole="{ record }">
              <a-tag :color="getRoleColor(record.userRole)">
                {{ record.userRole }}
              </a-tag>
            </template>
          </a-table>
        </div>
      </a-card>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconBug } from '@arco-design/web-vue/es/icon'
import dayjs from 'dayjs'
import { Service } from '../../../generated'
import type { PermissionCheckRequest } from '../../../generated'


// 数据定义
interface UserOption {
  id: string
  userName: string
  userAccount: string
  roleCode: string
  roleName: string
}

interface CheckResult {
  hasPermission: boolean
  reason: string
  userRole: string
  roleLevel: number
  requiredPermission: string
  checkTime: string
}

interface BatchCheckResult extends CheckResult {
  index: number
  userId: string
  userName: string
  input: string
}

const checkLoading = ref(false)
const batchCheckLoading = ref(false)
const userList = ref<UserOption[]>([])
const checkResult = ref<CheckResult | null>(null)
const batchResults = ref<BatchCheckResult[]>([])
const batchCheckText = ref('')

// 检查表单
const checkForm = reactive({
  userId: undefined as any | undefined,
  checkType: 'module' as 'module' | 'resource',
  action: '',
  resourceType: '',
  resourceId: undefined as any | undefined,
})

// 批量检查表格列
const batchColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 60,
  },
  {
    title: '用户',
    dataIndex: 'userName',
    width: 100,
  },
  {
    title: '用户角色',
    slotName: 'userRole',
    width: 100,
  },
  {
    title: '检查权限',
    dataIndex: 'requiredPermission',
    width: 200,
  },
  {
    title: '检查结果',
    slotName: 'hasPermission',
    width: 80,
  },
  {
    title: '结果说明',
    dataIndex: 'reason',
    ellipsis: true,
  },
]

// 计算属性
const actionPlaceholder = computed(() => {
  if (checkForm.checkType === 'module') {
    return '例如: question_manage:create'
  } else {
    return '例如: create (资源级权限通常只需要操作名)'
  }
})

const actionExample = computed(() => {
  if (checkForm.checkType === 'module') {
    return '模块级权限示例: question_manage:create, user_manage:edit_role, contest:view'
  } else {
    return '资源级权限示例: create, view, edit, delete'
  }
})

// 监听检查类型变化，清空相关字段
watch(() => checkForm.checkType, (newType, oldType) => {
  if (newType !== oldType) {
    // 清空权限操作字段
    checkForm.action = ''
    
    // 如果切换到模块级权限，清空资源相关字段
    if (newType === 'module') {
      checkForm.resourceType = ''
      checkForm.resourceId = undefined
    }
    
    // 清空之前的检查结果
    checkResult.value = null
  }
})

// 工具方法
const getRoleColor = (roleCode: string) => {
  const colorMap: Record<string, string> = {
    super_admin: 'red',
    admin: 'orange',
    user: 'blue',
    ban: 'default',
  }
  return colorMap[roleCode] || 'default'
}

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const filterUserOption = (input: string, option: any) => {
  const user = userList.value.find(u => u.id === option.value)
  if (!user) return false

  return (
    user.userName.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
    user.userAccount.toLowerCase().indexOf(input.toLowerCase()) >= 0
  )
}

// 事件处理方法
const handleUserChange = (userId: number) => {
  const user = userList.value.find(u => u.id === userId)
  if (user) {
    console.log('选中用户:', user)
  }
}

const handleCheck = async () => {
  if (!checkForm.userId || !checkForm.action) {
    Message.error('请填写必要信息')
    return
  }

  if (checkForm.checkType === 'resource' && (!checkForm.resourceType || !checkForm.resourceId)) {
    Message.error('资源级权限检查需要填写资源类型和资源ID')
    return
  }

  checkLoading.value = true

  try {
    const request: PermissionCheckRequest = {
      userId: checkForm.userId as any,
      action: checkForm.action,
      resourceType: checkForm.checkType === 'resource' ? checkForm.resourceType : undefined,
      resourceId: checkForm.checkType === 'resource' ? checkForm.resourceId : undefined,
    }

    const response = await Service.checkUserPermissionUsingPost(request)

    if (response.code === 200 && response.data) {
      const result = response.data
      console.log('权限检查 API 响应:', result)
      console.log('hasPermission 值:', result.hasPermission, '类型:', typeof result.hasPermission)

      checkResult.value = {
        hasPermission: result.hasPermission === true,
        reason: result.reason || '检查完成',
        userRole: result.userRole || 'unknown',
        roleLevel: result.roleLevel || 0,
        requiredPermission: checkForm.action,
        checkTime: result.checkTime || dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }

      console.log('设置的 checkResult:', checkResult.value)
    } else {
      Message.error(response.message || '权限检查响应异常')
    }

  } catch (error) {
    console.error('权限检查失败:', error)
    Message.error('权限检查失败')
  } finally {
    checkLoading.value = false
  }
}

const handleReset = () => {
  Object.assign(checkForm, {
    userId: undefined,
    checkType: 'module',
    action: '',
    resourceType: '',
    resourceId: undefined,
  })
  checkResult.value = null
}

const handleBatchCheck = async () => {
  if (!batchCheckText.value.trim()) {
    Message.error('请输入权限检查列表')
    return
  }

  const lines = batchCheckText.value.trim().split('\n').filter(line => line.trim())
  if (lines.length === 0) {
    Message.error('请输入有效的权限检查列表')
    return
  }

  batchCheckLoading.value = true

  try {
    const results: BatchCheckResult[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      const parts = line.split(':')

      if (parts.length < 2) {
        results.push({
          index: i + 1,
          userId: 0,
          userName: '未知',
          input: line,
          hasPermission: false,
          reason: '格式错误：请使用 userId:action 格式',
          userRole: 'unknown',
          roleLevel: 0,
          requiredPermission: line,
          checkTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        })
        continue
      }

      const userId = (parts[0])
      const action = parts[1]
      const resourceType = parts[2]
      const resourceId = parts[3] ? (parts[3]) : undefined

      if (isNaN(userId)) {
        results.push({
          index: i + 1,
          userId: 0,
          userName: '未知',
          input: line,
          hasPermission: false,
          reason: '格式错误：用户ID必须为数字',
          userRole: 'unknown',
          roleLevel: 0,
          requiredPermission: action,
          checkTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        })
        continue
      }

      const user = userList.value.find(u => (u.id as string) === userId)
      if (!user) {
        results.push({
          index: i + 1,
          userId,
          userName: '用户不存在',
          input: line,
          hasPermission: false,
          reason: '用户不存在',
          userRole: 'unknown',
          roleLevel: 0,
          requiredPermission: action,
          checkTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        })
        continue
      }

      try {
        const request: PermissionCheckRequest = {
          userId,
          action,
          resourceType: resourceType || undefined,
          resourceId: resourceId || undefined,
        }

        const response = await Service.checkUserPermissionUsingPost(request)

        if (response.code === 200 && response.data) {
          const result = response.data
          results.push({
            index: i + 1,
            userId,
            userName: user.userName,
            input: line,
            hasPermission: result.hasPermission === true,
            reason: result.reason || '检查完成',
            userRole: result.userRole || user.roleCode,
            roleLevel: result.roleLevel || 0,
            requiredPermission: action,
            checkTime: result.checkTime || dayjs().format('YYYY-MM-DD HH:mm:ss'),
          })
        } else {
          results.push({
            index: i + 1,
            userId,
            userName: user.userName,
            input: line,
            hasPermission: false,
            reason: '权限检查响应异常',
            userRole: user.roleCode,
            roleLevel: 0,
            requiredPermission: action,
            checkTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          })
        }
      } catch (error) {
        console.error(`检查用户 ${userId} 权限失败:`, error)
        results.push({
          index: i + 1,
          userId,
          userName: user.userName,
          input: line,
          hasPermission: false,
          reason: '权限检查失败',
          userRole: user.roleCode,
          roleLevel: 0,
          requiredPermission: action,
          checkTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        })
      }
    }

    batchResults.value = results
    Message.success(`批量检查完成，共检查 ${results.length} 项`)

  } catch (error) {
    console.error('批量权限检查失败:', error)
    Message.error('批量权限检查失败')
  } finally {
    batchCheckLoading.value = false
  }
}

const handleBatchReset = () => {
  batchCheckText.value = ''
  batchResults.value = []
}

// 数据获取方法
const fetchUserList = async () => {
  try {
    const response = await Service.getUserPermissionListUsingGet(
      1, // page
      50, // pageSize - 获取更多用户供选择
      undefined, // roleCode
      undefined, // sortField
      undefined, // sortOrder
      undefined, // userAccount
      undefined  // userName
    )
    console.log(response.data)

    if (response.code === 200 && response.data?.list) {
      userList.value = response.data.list.map(user => ({
        id: user.userId! as any,
        userName: user.userName!,
        userAccount: user.userAccount!,
        roleCode: user.roleCode!,
        roleName: user.roleName!,
      }))
    } else {
      Message.error(response.message || '获取用户列表失败')
      userList.value = []
    }

  } catch (error) {
    console.error('获取用户列表失败:', error)
    Message.error('获取用户列表失败')
    userList.value = []
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchUserList()
})
</script>

<style scoped lang="less">
.permission-checker {
  .page-header {
    h2 {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 600;
    }

    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }

  .resource-section {
    border-left: 3px solid #1890ff;
    padding-left: 16px;
    margin-left: 8px;
  }

  .check-result {
    text-align: center;
  }

  .helper-text {
    margin-top: 8px;
    padding: 8px;
    background: #f6f8fa;
    border-radius: 4px;
    font-size: 12px;
    color: #666;

    p {
      margin: 2px 0;
      font-family: monospace;
    }
  }

  .batch-results {
    .result-summary {
      margin-bottom: 16px;
      padding: 16px;
      background: #fafafa;
      border-radius: 6px;
    }
  }
}
</style>
