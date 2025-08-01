<template>
  <div class="user-management">
    <a-card>
      <template #title>
        <div class="page-header">
          <h2>用户权限管理</h2>
          <p>管理系统用户的权限和角色分配</p>
        </div>
      </template>

      <!-- 搜索和筛选区域 -->
      <div class="search-section">
        <a-row :gutter="16" align="middle">
          <a-col :span="6">
            <a-input
              v-model:value="searchForm.userName"
              placeholder="搜索用户名"
              allow-clear
              @press-enter="handleSearch"
            >
              <template #prefix>
                <IconSearch />
              </template>
            </a-input>
          </a-col>

          <a-col :span="6">
            <a-input
              v-model:value="searchForm.userAccount"
              placeholder="搜索用户账号"
              allow-clear
              @press-enter="handleSearch"
            >
              <template #prefix>
                <IconUser />
              </template>
            </a-input>
          </a-col>

          <a-col :span="4">
            <a-select
              v-model="searchForm.roleCode"
              placeholder="选择角色"
              allow-clear
              style="width: 100%"
            >
              <a-option value="">全部角色</a-option>
              <a-option 
                v-for="role in roleList" 
                :key="role.roleCode" 
                :value="role.roleCode"
              >
                {{ role.roleName }}
              </a-option>
            </a-select>
          </a-col>

          <a-col :span="8">
            <a-space>
              <a-button type="primary" @click="handleSearch">
                <template #icon>
                  <IconSearch />
                </template>
                搜索
              </a-button>

              <a-button @click="handleReset">
                <template #icon>
                  <IconRefresh />
                </template>
                重置
              </a-button>

              <a-button
                type="primary"
                ghost
                :disabled="selectedRowKeys.length === 0"
                @click="showBatchModal = true"
              >
                <template #icon>
                  <IconEdit />
                </template>
                批量操作
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </div>

      <!-- 用户权限管理表格 -->
        <a-table
          :columns="columns"
          :data="userList"
          :loading="loading"
          :pagination="pagination"
          row-selection="rowSelection"
          row-key="userId"
          @change="handleTableChange"
          @selection-change="handleSelectionChange"
        >
          <!-- 用户信息列 -->
          <template #userInfo="{ record }">
            <div class="user-info">
              <a-avatar :src="record.userAvatar" :size="32">
                {{ record.userName?.charAt(0) }}
              </a-avatar>
              <div class="user-details">
                <div class="name">{{ record.userName }}</div>
                <div class="account">{{ record.userAccount }}</div>
              </div>
            </div>
          </template>

          <!-- 角色信息列 -->
          <template #roleInfo="{ record }">
            <div class="role-info">
              <a-tag :color="getRoleColor(record.roleCode)">
                {{ record.roleName }}
              </a-tag>
              <div class="role-level">等级: {{ record.roleLevel }}</div>
            </div>
          </template>

          <!-- 最后登录时间列 -->
          <template #lastLoginTime="{ record }">
            <div v-if="record.lastLoginTime">
              {{ formatTime(record.lastLoginTime) }}
            </div>
            <span v-else class="text-secondary">从未登录</span>
          </template>

          <!-- 操作列 -->
          <template #action="{ record }">
            <a-space>
              <a-button
                type="outline"
                size="small"
                @click="() => handleViewPermissions(record)"
              >
                查看权限
              </a-button>

              <a-button
                type="outline"
                size="small"
                @click="() => handleEditRole(record)"
              >
                修改角色
              </a-button>

              <a-popconfirm
                v-if="record.roleCode !== 'super_admin'"
                content="确定要重置该用户的权限缓存吗？"
                @ok="() => handleResetCache(record.userId)"
              >
                <a-button type="outline" size="small" status="danger">
                  重置缓存
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table>
    </a-card>

    <!-- 权限详情模态框 -->
    <a-modal
      v-model:visible="permissionModalVisible"
      title="用户权限详情"
      width="1000px"
      :footer="null"
      class="permission-modal"
    >
      <div v-if="selectedUser" class="permission-detail">
        <!-- 用户基本信息卡片 -->
        <a-card class="user-info-card" :bordered="false">
          <div class="user-header">
            <div class="user-avatar-section">
              <a-avatar :src="selectedUser.userAvatar" :size="64" class="user-avatar">
                {{ selectedUser.userName?.charAt(0) }}
              </a-avatar>
            </div>
            <div class="user-info-section">
              <h3 class="user-name">{{ selectedUser.userName }}</h3>
              <p class="user-account">{{ selectedUser.userAccount }}</p>
              <div class="user-meta">
                <a-tag :color="getRoleColor(selectedUser.roleCode)" size="large" class="role-tag">
                  <template #icon>
                    <IconUser />
                  </template>
                  {{ selectedUser.roleName }}
                </a-tag>
                <span class="permission-version">权限版本: {{ selectedUser.permissionVersion || 'N/A' }}</span>
                <span class="last-login">
                  最后登录: {{ selectedUser.lastLoginTime ? formatTime(selectedUser.lastLoginTime) : '从未登录' }}
                </span>
              </div>
            </div>
          </div>
        </a-card>

        <!-- 权限列表 -->
        <a-card title="权限详情" class="permissions-card" :bordered="false">
          <template #extra>
            <a-tag color="arcoblue">
              共 {{ selectedUser.permissions?.reduce((sum, mod) => sum + (mod.actions?.length || 0), 0) || 0 }} 个权限
            </a-tag>
          </template>

          <div v-if="selectedUser.permissions && selectedUser.permissions.length > 0" class="permissions-container">
            <div v-for="module in selectedUser.permissions" :key="module.moduleCode" class="permission-module">
              <div class="module-header">
                <h4 class="module-title">
                  <IconSettings class="module-icon" />
                  {{ module.moduleName }}
                  <a-tag color="green" size="small">{{ module.actions?.length || 0 }}个权限</a-tag>
                </h4>
              </div>
              
              <div class="permissions-grid">
                <div 
                  v-for="action in module.actions" 
                  :key="action.actionCode" 
                  class="permission-card"
                >
                  <div class="permission-header">
                    <a-tag color="blue" class="permission-tag">
                      {{ action.actionName }}
                    </a-tag>
                  </div>
                  <p class="permission-description" v-if="action.description">
                    {{ action.description }}
                  </p>
                  <div class="permission-code">
                    <span class="code-label">权限代码:</span>
                    <code>{{ action.actionCode }}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a-empty v-else description="该用户暂无权限配置" class="no-permissions">
            <template #image>
              <IconLock style="font-size: 64px; color: #c9cdd4;" />
            </template>
          </a-empty>
        </a-card>
      </div>
    </a-modal>

    <!-- 角色编辑模态框 -->
    <a-modal
      v-model:visible="roleModalVisible"
      title="修改用户角色"
      @ok="handleRoleSubmit"
      :confirm-loading="roleSubmitLoading"
    >
      <div v-if="selectedUser">
        <a-form :model="roleForm" layout="vertical">
          <a-form-item label="用户信息">
            <div class="user-info">
              <a-avatar :src="selectedUser.userAvatar" :size="32">
                {{ selectedUser.userName?.charAt(0) }}
              </a-avatar>
              <div class="user-details">
                <div class="name">{{ selectedUser.userName }}</div>
                <div class="account">{{ selectedUser.userAccount }}</div>
              </div>
            </div>
          </a-form-item>

          <a-form-item label="当前角色">
            <a-tag :color="getRoleColor(selectedUser.roleCode)">
              {{ selectedUser.roleName }}
            </a-tag>
          </a-form-item>

          <a-form-item label="新角色" name="roleCode" required>
            <a-select
              v-model="roleForm.roleCode"
              placeholder="请选择新角色"
              style="width: 100%"
            >
              <a-option 
                v-for="role in roleList" 
                :key="role.roleCode" 
                :value="role.roleCode"
              >
                {{ role.roleName }}
              </a-option>
            </a-select>
          </a-form-item>

          <a-form-item label="变更原因">
            <a-textarea
              v-model="roleForm.reason"
              placeholder="请输入角色变更原因（可选）"
              :rows="3"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- 批量操作模态框 -->
    <a-modal
      v-model:visible="showBatchModal"
      title="批量修改用户角色"
      @ok="handleBatchSubmit"
      :confirm-loading="batchSubmitLoading"
    >
      <a-form :model="batchForm" layout="vertical">
        <a-form-item label="选中用户">
          <div class="selected-users">
            <a-tag v-for="user in selectedUsers" :key="user.userId" color="blue">
              {{ user.userName }}
            </a-tag>
            <div class="count">共选中 {{ selectedUsers.length }} 个用户</div>
          </div>
        </a-form-item>

        <a-form-item label="目标角色" name="targetRoleCode" required>
          <a-select
            v-model="batchForm.targetRoleCode"
            placeholder="请选择目标角色"
            style="width: 100%"
          >
            <a-option 
              v-for="role in roleList" 
              :key="role.roleCode" 
              :value="role.roleCode"
            >
              {{ role.roleName }}
            </a-option>
          </a-select>
        </a-form-item>

        <a-form-item label="变更原因">
          <a-textarea
            v-model="batchForm.reason"
            placeholder="请输入批量变更原因"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import {
  IconSearch,
  IconUser,
  IconRefresh,
  IconEdit,
  IconSettings,
  IconLock,
} from '@arco-design/web-vue/es/icon'
import dayjs from 'dayjs'
import { Service } from '../../../generated/services/Service'
import type { UserPermissionVO } from '../../../generated/models/UserPermissionVO'
import type { UserRoleUpdateRequest } from '../../../generated/models/UserRoleUpdateRequest'
import type { BatchRoleUpdateRequest } from '../../../generated/models/BatchRoleUpdateRequest'

// 数据定义
type UserPermissionData = UserPermissionVO

const loading = ref(false)
const userList = ref<UserPermissionData[]>([])
const roleList = ref<any[]>([])  // 添加角色列表
const selectedRowKeys = ref<string[]>([])
const permissionModalVisible = ref(false)
const roleModalVisible = ref(false)
const showBatchModal = ref(false)
const selectedUser = ref<UserPermissionData | null>(null)
const roleSubmitLoading = ref(false)
const batchSubmitLoading = ref(false)

// 搜索表单
const searchForm = reactive({
  userName: '',
  userAccount: '',
  roleCode: '',
})

// 角色修改表单
const roleForm = reactive({
  roleCode: '',
  reason: '',
})

// 批量操作表单
const batchForm = reactive({
  targetRoleCode: '',
  reason: '',
})

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
})

// 表格列配置
const columns = [
  {
    title: '用户信息',
    slotName: 'userInfo',
    width: 200,
  },
  {
    title: '角色信息',
    slotName: 'roleInfo',
    width: 150,
  },
  {
    title: '权限版本',
    dataIndex: 'permissionVersion',
    width: 100,
  },
  {
    title: '最后登录',
    slotName: 'lastLoginTime',
    width: 150,
  },
  {
    title: '操作',
    slotName: 'action',
    width: 200,
    fixed: 'right',
  },
]

// 行选择配置 - 按照官方文档
const rowSelection = {
  type: 'checkbox',
  selectedRowKeys: selectedRowKeys,
  showCheckedAll: true,
}

// 计算属性
const selectedUsers = computed(() => {
  return userList.value.filter(user => selectedRowKeys.value.includes(user.userId as any))
})

// 工具方法
const getRoleColor = (roleCode: string) => {
  const colorMap: Record<string, string> = {
    super_admin: 'red',
    admin: 'orange',
    user: 'blue',
    ban: 'purple',
  }
  return colorMap[roleCode] || 'default'
}

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

// 事件处理方法
const handleSearch = () => {

  pagination.current = 1
  fetchUserList()
}

const handleReset = () => {

  const oldForm = { ...searchForm }
  Object.assign(searchForm, {
    userName: '',
    userAccount: '',
    roleCode: '',
  })

  pagination.current = 1
  fetchUserList()
}

const handleTableChange = (pag: any) => {
  if (pag) {
    pagination.current = pag.current!
    pagination.pageSize = pag.pageSize!
  }
  fetchUserList()
}

const handleSelectionChange = (selectedKeys: string[]) => {
  selectedRowKeys.value = selectedKeys
}

const handleViewPermissions = async (user: UserPermissionData) => {
  try {
    loading.value = true
    const response = await Service.getUserPermissionsUsingGet(user.userId!)

    if (response.code === 200) {
      selectedUser.value = {
        ...user,
        permissions: response.data?.permissions
      }
      permissionModalVisible.value = true
    } else {
      Message.error(response.message || '获取用户权限失败')
    }
  } catch (error) {
    Message.error('获取用户权限失败')
  } finally {
    loading.value = false
  }
}

const handleEditRole = (user: UserPermissionData) => {
  console.log('[DEBUG] 修改角色按钮被点击:', user)
  selectedUser.value = user
  roleForm.roleCode = user.roleCode as any
  roleForm.reason = ''
  roleModalVisible.value = true
}

const handleRoleSubmit = async () => {
  if (!selectedUser.value || !roleForm.roleCode) {
    Message.error('请选择新角色')
    return
  }

  if (roleForm.roleCode === selectedUser.value.roleCode) {
    Message.error('新角色与当前角色相同')
    return
  }

  roleSubmitLoading.value = true

  try {
    const request: UserRoleUpdateRequest = {
      roleCode: roleForm.roleCode,
      reason: roleForm.reason
    }

    const response = await Service.updateUserRoleUsingPut(selectedUser.value.userId!, request)

    if (response.code === 200) {
      Message.success('用户角色修改成功')
      roleModalVisible.value = false
      fetchUserList()
    } else {
      Message.error(response.message || '修改用户角色失败')
    }
  } catch (error) {
    Message.error('修改用户角色失败')
  } finally {
    roleSubmitLoading.value = false
  }
}

const handleBatchSubmit = async () => {
  if (!batchForm.targetRoleCode) {
    Message.error('请选择目标角色')
    return
  }

  if (selectedRowKeys.value.length === 0) {
    Message.error('请选择要操作的用户')
    return
  }

  batchSubmitLoading.value = true

  try {
    const request: BatchRoleUpdateRequest = {
      userIds: selectedRowKeys.value as any,
      targetRoleCode: batchForm.targetRoleCode,
      reason: batchForm.reason
    }

    const response = await Service.batchUpdateUserRolesUsingPost(request)

    if (response.code === 200) {
      Message.success(`成功提交批量操作任务，涉及 ${selectedRowKeys.value.length} 个用户`)
      showBatchModal.value = false
      selectedRowKeys.value = []
      fetchUserList()
    } else {
      Message.error(response.message || '批量修改用户角色失败')
    }
  } catch (error) {
    Message.error('批量修改用户角色失败')
  } finally {
    batchSubmitLoading.value = false
  }
}

const handleResetCache = async (userId: any) => {
  try {
    const response = await Service.warmUpCacheUsingPost()

    if (response.code === 200) {
      Message.success('权限缓存重置成功')
    } else {
      Message.error(response.message || '重置权限缓存失败')
    }
  } catch (error) {
    Message.error('重置权限缓存失败')
  }
}

// 数据获取方法
const fetchUserList = async () => {
  loading.value = true

  try {
    const response = await Service.getUserPermissionListUsingGet(
      pagination.current,
      pagination.pageSize,
      searchForm.roleCode || undefined,
      undefined, // sortField
      undefined, // sortOrder
      searchForm.userAccount || undefined,
      searchForm.userName || undefined
    )

    console.log('[DEBUG] API响应:', {
      code: response?.code,
      hasData: !!response?.data,
      hasList: !!response?.data?.list,
      listLength: response?.data?.list?.length,
      firstRecord: response?.data?.list?.[0]
    })

    // 数据处理逻辑
    if (response && response.data && Array.isArray(response.data.list)) {

      userList.value = response.data.list
      pagination.total = Number(response.data.total) || 0

    } else {
      console.log('[DEBUG] API响应无有效数据')
      userList.value = []
      pagination.total = 0

      // 如果是认证错误，显示相应提示
      if (response?.code === 40100) {
        Message.error('请先登录系统')
      }
    }

  } catch (error: any) {
    console.error('[DEBUG] API调用失败:', error.message)

    // 检查是否是认证错误
    if (error.response?.data?.code === 40100 || error.message?.includes('未登录')) {
      Message.error('请先登录系统')
    } else {
      Message.error('获取用户列表失败')
    }

    userList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 获取角色列表
const fetchRoleList = async () => {
  try {
    const response = await Service.getRoleListUsingGet()
    
    if (response.code === 200 && response.data) {
      roleList.value = response.data
    } else {
      Message.error(response.message || '获取角色列表失败')
      roleList.value = []
    }
  } catch (error) {
    console.error('获取角色列表失败:', error)
    Message.error('获取角色列表失败')
    roleList.value = []
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchUserList()
  fetchRoleList()  // 添加角色数据获取
})
</script>

<style scoped lang="less">
.user-management {
  .page-header {
    h2 {
      margin: 0 0 1px 0;
      font-size: 20px;
      font-weight: 600;
    }

    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  }

  .search-section {
    margin-bottom: 16px;
    padding: 16px;
    background: #fafafa;
    border-radius: 6px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .user-details {
      flex: 1;

      .name {
        font-weight: 500;
        font-size: 14px;
        line-height: 1.4;
      }

      .account {
        color: #666;
        font-size: 12px;
        line-height: 1.4;
      }
    }
  }

  .role-info {
    .role-level {
      margin-top: 4px;
      color: #666;
      font-size: 12px;
    }
  }

  .text-secondary {
    color: #999;
  }

  .permission-detail {
    .user-info-card {
      margin-bottom: 16px;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 12px;
      
      .user-header {
        display: flex;
        align-items: center;
        gap: 20px;
        
        .user-avatar-section {
          .user-avatar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
            font-size: 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        }
        
        .user-info-section {
          flex: 1;
          
          .user-name {
            margin: 0 0 4px 0;
            font-size: 24px;
            font-weight: 600;
            color: #1d2129;
          }
          
          .user-account {
            margin: 0 0 12px 0;
            color: #86909c;
            font-size: 14px;
          }
          
          .user-meta {
            display: flex;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
            
            .role-tag {
              font-weight: 500;
            }
            
            .permission-version,
            .last-login {
              font-size: 13px;
              color: #4e5969;
              background: rgba(255, 255, 255, 0.8);
              padding: 4px 8px;
              border-radius: 4px;
            }
          }
        }
      }
    }
    
    .permissions-card {
      .permissions-container {
        .permission-module {
          margin-bottom: 24px;
          border: 1px solid #e5e6eb;
          border-radius: 8px;
          overflow: hidden;
          
          .module-header {
            background: #f7f8fa;
            padding: 12px 16px;
            border-bottom: 1px solid #e5e6eb;
            
            .module-title {
              margin: 0;
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 16px;
              font-weight: 600;
              color: #1d2129;
              
              .module-icon {
                color: #165dff;
              }
            }
          }
          
          .permissions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 12px;
            padding: 16px;
            
            .permission-card {
              background: white;
              border: 1px solid #e5e6eb;
              border-radius: 6px;
              padding: 12px;
              transition: all 0.2s ease;
              
              &:hover {
                border-color: #165dff;
                box-shadow: 0 2px 8px rgba(22, 93, 255, 0.1);
                transform: translateY(-1px);
              }
              
              .permission-header {
                margin-bottom: 8px;
                
                .permission-tag {
                  font-weight: 500;
                }
              }
              
              .permission-description {
                margin: 0 0 8px 0;
                font-size: 13px;
                color: #4e5969;
                line-height: 1.4;
              }
              
              .permission-code {
                font-size: 12px;
                
                .code-label {
                  color: #86909c;
                  margin-right: 4px;
                }
                
                code {
                  background: #f2f3f5;
                  padding: 2px 6px;
                  border-radius: 3px;
                  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                  color: #e74c3c;
                }
              }
            }
          }
        }
      }
      
      .no-permissions {
        padding: 40px 0;
      }
    }
  }

  .selected-users {
    .count {
      margin-top: 8px;
      color: #666;
      font-size: 12px;
    }
  }
}
</style>
