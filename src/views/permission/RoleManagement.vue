<template>
  <div class="role-management">
    <a-card>
      <template #title>
        <div class="page-header">
          <h2>角色权限管理</h2>
          <p>管理系统角色和权限配置</p>
        </div>
      </template>

      <template #extra>
        <a-button type="primary" @click="handleAdd">
          <template #icon>
            <IconPlus />
          </template>
          新增角色
        </a-button>
      </template>

      <!-- 角色列表 -->
      <a-table
        :columns="columns"
        :data="roleList"
        :loading="loading"
        row-key="id"
      >
        <!-- 角色信息列 -->
        <template #roleName="{ record }">
          <div class="role-info">
            <a-tag :color="getRoleColor(record.roleCode)">
              {{ record.roleName }}
            </a-tag>
            <div class="role-code">{{ record.roleCode }}</div>
          </div>
        </template>

        <!-- 角色描述列 -->
        <template #description="{ record }">
          <div class="role-description">
            {{ record.description || '暂无描述' }}
          </div>
        </template>

        <!-- 状态列 -->
        <template #status="{ record }">
          <a-tag :color="record.status === 1 ? 'green' : 'red'">
            {{ record.status === 1 ? '启用' : '禁用' }}
          </a-tag>
        </template>

        <!-- 创建时间列 -->
        <template #createTime="{ record }">
          {{ formatTime(record.createTime) }}
        </template>

        <!-- 操作列 -->
        <template #action="{ record }">
          <a-space>
            <a-button type="outline" size="small" @click="handleConfigPermissions(record)">
              配置权限
            </a-button>
            <a-button type="outline" size="small" @click="handleEdit(record)">
              编辑
            </a-button>
            <a-popconfirm
              v-if="!isSystemRole(record.roleCode)"
              content="确定要删除这个角色吗？"
              @ok="handleDelete(record.id)"
            >
              <a-button type="outline" size="small" status="danger">
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑角色模态框 -->
    <a-modal
      v-model:visible="showAddModal"
      :title="editingRole ? '编辑角色' : '新增角色'"
      @ok="handleSubmit"
      :confirm-loading="submitLoading"
    >
      <a-form :model="roleForm" layout="vertical">
        <a-form-item label="角色名称" name="roleName" required>
          <a-input :model-value="roleForm.roleName" @update:model-value="roleForm.roleName = $event" placeholder="请输入角色名称" />
        </a-form-item>

        <a-form-item label="角色代码" name="roleCode" required>
          <a-input
            :model-value="roleForm.roleCode"
            @update:model-value="roleForm.roleCode = $event"
            placeholder="请输入角色代码"
            :disabled="!!editingRole"
          />
          <template v-if="!!editingRole">
            <div style="color: #999; font-size: 12px; margin-top: 4px;">
              * 编辑模式下角色代码不可修改，以确保系统稳定性
            </div>
          </template>
        </a-form-item>

        <a-form-item label="角色级别" name="roleLevel" required>
          <a-input-number
            :model-value="roleForm.roleLevel"
            @update:model-value="roleForm.roleLevel = $event"
            :min="1"
            :max="10"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="角色描述">
          <a-textarea :model-value="roleForm.description" @update:model-value="roleForm.description = $event" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 权限配置模态框 -->
    <a-modal
      v-model:visible="showPermissionModal"
      title="配置角色权限"
      width="800px"
      @ok="handlePermissionSubmit"
      :confirm-loading="permissionSubmitLoading"
    >
      <div v-if="selectedRole">
        <a-descriptions :column="2" bordered style="margin-bottom: 16px">
          <a-descriptions-item label="角色名称">
            {{ selectedRole.roleName }}
          </a-descriptions-item>
          <a-descriptions-item label="角色代码">
            {{ selectedRole.roleCode }}
          </a-descriptions-item>
        </a-descriptions>

        <a-divider>权限配置</a-divider>

        <!-- 权限配置操作栏 -->
        <div class="permission-actions-bar">
          <div class="stats-info">
            <a-statistic
              title="可用模块"
              :value="permissionTree.length"
              :value-style="{ color: '#1890ff', fontSize: '18px' }"
            />
            <a-statistic
              title="总权限数"
              :value="getTotalActionsCount()"
              :value-style="{ color: '#52c41a', fontSize: '18px' }"
            />
            <a-statistic
              title="已选权限"
              :value="checkedPermissions.length"
              :value-style="{ color: checkedPermissions.length > 0 ? '#fa8c16' : '#8c8c8c', fontSize: '18px' }"
            />
          </div>
          <div class="action-buttons">
            <a-button-group>
              <a-button type="outline" @click="selectAllPermissions">
                <template #icon><icon-check-circle /></template>
                全选
              </a-button>
              <a-button type="outline" @click="checkedPermissions = []">
                <template #icon><icon-close-circle /></template>
                清空
              </a-button>
            </a-button-group>
          </div>
        </div>

        <!-- 权限配置主区域 -->
        <div v-if="permissionTree.length > 0" class="permission-main-container">
          <div class="permission-modules-grid">
            <div v-for="module in permissionTree" :key="module.key" class="module-card">
              <!-- 模块头部 -->
              <div class="module-header">
                <div class="module-header-content">
                  <a-checkbox
                    :model-value="isModuleAllChecked(module)"
                    :indeterminate="isModuleIndeterminate(module)"
                    @change="handleModuleCheckAll($event, module)"
                    class="module-checkbox"
                  >
                    <div class="module-title-section">
                      <span class="module-name">{{ module.title }}</span>
                      <a-tag color="arcoblue" size="small">{{ module.children?.length || 0 }}个权限</a-tag>
                    </div>
                  </a-checkbox>
                </div>
                <div v-if="module.description" class="module-description">
                  {{ module.description }}
                </div>
              </div>

              <!-- 模块权限列表 -->
              <div class="module-content">
                <a-checkbox-group v-model="checkedPermissions" class="permission-grid">
                  <div
                    v-for="action in module.children"
                    :key="action.key"
                    class="permission-item"
                    :class="{ 'permission-checked': checkedPermissions.includes(action.key) }"
                  >
                    <a-checkbox :value="action.key" class="permission-checkbox">
                      <div class="permission-info">
                        <div class="permission-name">{{ action.title }}</div>
                        <div v-if="action.description" class="permission-desc">
                          {{ action.description }}
                        </div>
                      </div>
                    </a-checkbox>
                  </div>
                </a-checkbox-group>
              </div>
            </div>
          </div>
        </div>

        <!-- 已选权限摘要 -->
        <div v-if="checkedPermissions.length > 0" class="selected-permissions-summary">
          <div class="summary-header">
            <span class="summary-title">
              <icon-check-circle style="color: #52c41a; margin-right: 8px;" />
              已选择 {{ checkedPermissions.length }} 个权限
            </span>
            <a-button type="text" size="small" @click="toggleSummaryExpanded">
              {{ summaryExpanded ? '收起' : '展开' }}
              <icon-down :class="{ 'rotate-180': summaryExpanded }" />
            </a-button>
          </div>

          <div v-if="summaryExpanded" class="summary-content">
            <div class="permission-tags">
              <a-tag
                v-for="key in checkedPermissions"
                :key="key"
                color="green"
                closable
                size="small"
                @close="removePermission(key)"
                class="permission-tag"
              >
                {{ getPermissionDisplayName(key) }}
              </a-tag>
            </div>
          </div>
        </div>

        <a-empty v-else description="暂无权限数据" />
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconPlus, IconCheckCircle, IconCloseCircle, IconDown } from '@arco-design/web-vue/es/icon'
import dayjs from 'dayjs'
import { Service } from '../../../generated/services/Service'
import type { RoleManagementVO } from '../../../generated/models/RoleManagementVO'
import type { RoleAddRequest } from '../../../generated/models/RoleAddRequest'
import type { RoleUpdateRequest } from '../../../generated/models/RoleUpdateRequest'
import type { RolePermissionConfigRequest } from '../../../generated/models/RolePermissionConfigRequest'
import type { PermissionModuleVO } from '../../../generated/models/PermissionModuleVO'
import type { PermissionActionVO } from '../../../generated/models/PermissionActionVO'

// 数据定义
type RoleData = RoleManagementVO

interface PermissionTreeNode {
  key: string
  title: string
  description?: string
  children?: PermissionTreeNode[]
}

const loading = ref(false)
const roleList = ref<RoleData[]>([])
const showAddModal = ref(false)
const showPermissionModal = ref(false)
const editingRole = ref<RoleData | null>(null)
const selectedRole = ref<RoleData | null>(null)
const submitLoading = ref(false)
const permissionSubmitLoading = ref(false)
const permissionTree = ref<PermissionTreeNode[]>([])
const checkedPermissions = ref<string[]>([])
const summaryExpanded = ref(false)

// 存储权限映射数据，用于显示友好的权限名称
const permissionMapping = ref<Map<string, { name: string; moduleCode: string; moduleName: string }>>(new Map())

// 工具方法
const getPermissionDisplayName = (key: string) => {
  if (key.startsWith('module_')) {
    const mapping = permissionMapping.value.get(key)
    return mapping?.name || key.replace('module_', '模块 ')
  } else if (key.startsWith('action_')) {
    const mapping = permissionMapping.value.get(key)
    return mapping ? `${mapping.moduleName} - ${mapping.name}` : key.replace('action_', '操作 ')
  }
  return key
}

const getTotalActionsCount = () => {
  return permissionTree.value.reduce((total, module) => {
    return total + (module.children?.length || 0)
  }, 0)
}

// 多选框相关辅助函数
const isModuleAllChecked = (module: PermissionTreeNode): boolean => {
  if (!module.children || module.children.length === 0) return false
  return module.children.every(action => checkedPermissions.value.includes(action.key))
}

const isModuleIndeterminate = (module: PermissionTreeNode): boolean => {
  if (!module.children || module.children.length === 0) return false
  const checkedCount = module.children.filter(action => checkedPermissions.value.includes(action.key)).length
  return checkedCount > 0 && checkedCount < module.children.length
}

const handleModuleCheckAll = (checked: boolean, module: PermissionTreeNode) => {
  if (!module.children) return

  const actionKeys = module.children.map(action => action.key)

  if (checked) {
    // 选中该模块的所有操作
    const newChecked = [...checkedPermissions.value]
    actionKeys.forEach(key => {
      if (!newChecked.includes(key)) {
        newChecked.push(key)
      }
    })
    checkedPermissions.value = newChecked
  } else {
    // 取消选中该模块的所有操作
    checkedPermissions.value = checkedPermissions.value.filter(key => !actionKeys.includes(key))
  }
}

const removePermission = (key: string) => {
  checkedPermissions.value = checkedPermissions.value.filter(k => k !== key)
}

const selectAllPermissions = () => {
  const allActionKeys: string[] = []
  permissionTree.value.forEach(module => {
    if (module.children) {
      module.children.forEach(action => {
        allActionKeys.push(action.key)
      })
    }
  })
  checkedPermissions.value = allActionKeys
}

const toggleSummaryExpanded = () => {
  summaryExpanded.value = !summaryExpanded.value
}

// 角色表单
const roleForm = reactive({
  roleName: '',
  description: '',
  roleCode: '',
  roleLevel: 1,
})

// 表格列配置
const columns = [
  {
    title: '角色信息',
    slotName: 'roleName',
    width: 150,
  },
  {
    title: '角色描述',
    slotName: 'description',
    width: 300,
  },
  {
    title: '角色级别',
    dataIndex: 'roleLevel',
    width: 100,
  },
  {
    title: '用户数量',
    dataIndex: 'userCount',
    width: 100,
  },
  {
    title: '权限数量',
    dataIndex: 'permissionCount',
    width: 100,
  },
  {
    title: '状态',
    slotName: 'status',
    width: 80,
  },
  {
    title: '创建时间',
    slotName: 'createTime',
    width: 150,
  },
  {
    title: '操作',
    slotName: 'action',
    width: 200,
    fixed: 'right',
  },
]

// 工具方法
const getRoleColor = (roleCode: string) => {
  const colorMap: Record<string, string> = {
    super_admin: 'red',
    admin: 'orange',
    user: 'blue',
    ban: 'purple',
  }
  return colorMap[roleCode] || 'grey'
}

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const isSystemRole = (roleCode: string) => {
  return ['super_admin', 'admin', 'user', 'ban'].includes(roleCode)
}

// 事件处理方法
const handleAdd = () => {
  editingRole.value = null

  // 重置表单为默认值
  roleForm.roleName = ''
  roleForm.roleCode = ''
  roleForm.roleLevel = 1
  roleForm.description = ''

  showAddModal.value = true
}

const handleEdit = (role: RoleData) => {
  console.log('编辑角色数据:', role)
  editingRole.value = role
  showAddModal.value = true
}

const handleSubmit = async () => {
  if (!roleForm.roleName || !roleForm.roleCode) {
    Message.error('请填写必要信息')
    return
  }

  submitLoading.value = true

  try {
    let response
    if (editingRole.value) {
      // 编辑角色
      const request: RoleUpdateRequest = {
        roleName: roleForm.roleName,
        description: roleForm.description,
        roleLevel: roleForm.roleLevel
      }
      response = await Service.updateRoleUsingPut(editingRole.value.id!, request)
    } else {
      // 新增角色
      const request: RoleAddRequest = {
        roleName: roleForm.roleName,
        roleCode: roleForm.roleCode,
        roleLevel: roleForm.roleLevel,
        description: roleForm.description
      }
      response = await Service.createRoleUsingPost(request)
    }

    if (response.code === 200) {
      Message.success(editingRole.value ? '角色编辑成功' : '角色创建成功')
      showAddModal.value = false
      editingRole.value = null

      // 重置表单
      roleForm.roleName = ''
      roleForm.roleCode = ''
      roleForm.roleLevel = 1
      roleForm.description = ''

      fetchRoleList()
    } else {
      Message.error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('操作失败:', error)
    Message.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

const handleConfigPermissions = async (role: RoleData) => {
  selectedRole.value = role
  showPermissionModal.value = true

  try {
    // 加载权限模块、操作数据和角色已有权限
    const [modules, actions, roleActions] = await Promise.all([
      Service.getModuleListUsingGet(),
      Service.getActionListUsingGet(),
      Service.getRoleActionsUsingGet(role.id!)
    ])

    // 验证API响应
    if (modules.code !== 200 || !modules.data) {
      Message.error(modules.message || '获取权限模块失败')
      return
    }

    if (actions.code !== 200 || !actions.data) {
      Message.error(actions.message || '获取权限操作失败')
      return
    }

    if (roleActions.code !== 200) {
      Message.error(roleActions.message || '获取角色权限失败')
      return
    }

    // 构建权限树 - 按模块分组操作
    const moduleMap = new Map<string, PermissionTreeNode>()

    // 清空权限映射
    permissionMapping.value.clear()

    // 先创建模块节点
    modules.data.forEach((module: PermissionModuleVO) => {
      const moduleKey = `module_${module.id}`
      const moduleNode: PermissionTreeNode = {
        key: moduleKey,
        title: module.moduleName!,
        description: module.description,
        children: []
      }

      moduleMap.set(module.moduleCode!, moduleNode)

      // 存储模块映射信息
      permissionMapping.value.set(moduleKey, {
        name: module.moduleName!,
        moduleCode: module.moduleCode!,
        moduleName: module.moduleName!
      })
    })

    // 然后将操作添加到对应模块下
    actions.data.forEach((action: PermissionActionVO) => {
      if (action.moduleCode) {
        const moduleNode = moduleMap.get(action.moduleCode)
        if (moduleNode) {
          const actionKey = `action_${action.id}`
          moduleNode.children!.push({
            key: actionKey,
            title: action.actionName!,
            description: action.description
          })

          // 存储操作映射信息
          permissionMapping.value.set(actionKey, {
            name: action.actionName!,
            moduleCode: action.moduleCode!,
            moduleName: action.moduleName || action.moduleCode!
          })
        }
      }
    })

    // 过滤掉没有子节点的模块
    const validModules = Array.from(moduleMap.values()).filter(module =>
      module.children && module.children.length > 0
    )

    permissionTree.value = validModules

    // 设置角色已有权限为选中状态 - 使用action ID作为key
    const existingPermissions = roleActions.data || []
    checkedPermissions.value = existingPermissions.map((action: PermissionActionVO) => `action_${action.id}`)

    const permissionCount = existingPermissions.length
    console.log('权限树构建完成:', {
      modules: validModules.length,
      totalActions: actions.data.length,
      existingPermissions: existingPermissions.length,
      checkedKeys: checkedPermissions.value
    })

    if (permissionCount > 0) {
      Message.success(`权限树已加载，角色「${role.roleName}」当前拥有 ${permissionCount} 个权限`)
    } else {
      Message.info(`权限树已加载，角色「${role.roleName}」当前暂无权限配置`)
    }

  } catch (error) {
    console.error('加载权限数据失败:', error)
    Message.error('加载权限数据失败: ' + (error as Error).message)
  }
}

const handlePermissionSubmit = async () => {
  if (!selectedRole.value) return

  // 允许清空所有权限
  permissionSubmitLoading.value = true

  try {
    // 从checked keys中提取action IDs（去掉action_前缀）
    const actionIds: number[] = checkedPermissions.value
      .filter(key => key.startsWith('action_'))
      .map(key => parseInt(key.replace('action_', '')))
      .filter(id => !isNaN(id))

    console.log('提交权限配置:', {
      roleId: selectedRole.value.id,
      roleName: selectedRole.value.roleName,
      totalCheckedKeys: checkedPermissions.value.length,
      checkedKeys: checkedPermissions.value,
      extractedActionIds: actionIds,
      permissionDetails: checkedPermissions.value.map(key => ({
        key,
        displayName: getPermissionDisplayName(key),
        isAction: key.startsWith('action_')
      }))
    })

    const request: RolePermissionConfigRequest = {
      actionIds: actionIds
    }

    const response = await Service.configureRolePermissionsUsingPost(selectedRole.value.id!, request)

    if (response.code === 200) {
      const permissionCount = actionIds.length
      Message.success(`权限配置成功，已配置 ${permissionCount} 个权限`)
      showPermissionModal.value = false
      fetchRoleList()
    } else {
      Message.error(response.message || '权限配置失败')
    }
  } catch (error) {
    console.error('权限配置失败:', error)
    Message.error('权限配置失败: ' + (error as Error).message)
  } finally {
    permissionSubmitLoading.value = false
  }
}

const handleDelete = async (roleId: number) => {
  try {
    const response = await Service.deleteRoleUsingDelete(roleId)
    if (response.code === 200) {
      Message.success('角色删除成功')
      fetchRoleList()
    } else {
      Message.error(response.message || '删除角色失败')
    }
  } catch (error) {
    console.error('删除角色失败:', error)
    Message.error('删除角色失败')
  }
}

// 数据获取方法
const fetchRoleList = async () => {
  loading.value = true

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
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchRoleList()
})

// 监听模态框显示状态，确保表单数据正确设置
watch(showAddModal, (visible) => {
  if (visible && editingRole.value) {
    // 编辑模式：设置表单数据
    nextTick(() => {
      roleForm.roleName = editingRole.value!.roleName || ''
      roleForm.roleCode = editingRole.value!.roleCode || ''
      roleForm.roleLevel = editingRole.value!.roleLevel || 1
      roleForm.description = editingRole.value!.description || ''

      console.log('监听器设置表单数据:', {
        roleName: roleForm.roleName,
        roleCode: roleForm.roleCode,
        roleLevel: roleForm.roleLevel,
        description: roleForm.description
      })
    })
  }
})
</script>

<style scoped lang="less">
.role-management {
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

  .role-info {
    .role-code {
      color: #666;
      font-size: 12px;
      margin-top: 4px;
    }
  }

  .role-description {
    color: #333;
    font-size: 14px;
    line-height: 1.4;
    max-width: 250px;
    word-break: break-word;

    &:empty::before {
      content: '暂无描述';
      color: #999;
      font-style: italic;
    }
  }

  .permission-node {
    display: flex;
    flex-direction: column;
    padding: 4px 0;

    .node-title {
      font-weight: 500;
      display: flex;
      align-items: center;
    }

    .node-desc {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
      line-height: 1.4;
    }
  }

  // 权限配置样式优化
  .permission-actions-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 16px 20px;
    background: linear-gradient(135deg, #f5f7ff 0%, #fff 100%);
    border: 1px solid #e5e6eb;
    border-radius: 8px;

    .stats-info {
      display: flex;
      gap: 32px;

      :deep(.arco-statistic) {
        .arco-statistic-title {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }
      }
    }

    .action-buttons {
      :deep(.arco-btn-group) {
        .arco-btn {
          border-color: #4c7cf0;
          color: #4c7cf0;

          &:hover {
            background: #4c7cf0;
            color: white;
          }
        }
      }
    }
  }

  .permission-main-container {
    .permission-modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      max-height: 600px;
      overflow-y: auto;
      padding: 8px;

      .module-card {
        background: white;
        border: 1px solid #e5e6eb;
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

        &:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          border-color: #4c7cf0;
        }

        .module-header {
          background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
          border-bottom: 1px solid #e5e6eb;
          padding: 16px 20px;

          .module-header-content {
            .module-checkbox {
              :deep(.arco-checkbox) {
                .arco-checkbox-icon {
                  border-color: #4c7cf0;

                  &.arco-checkbox-checked {
                    background: #4c7cf0;
                    border-color: #4c7cf0;
                  }
                }
              }

              .module-title-section {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-left: 8px;

                .module-name {
                  font-size: 16px;
                  font-weight: 600;
                  color: #1d2129;
                }
              }
            }
          }

          .module-description {
            margin-top: 8px;
            margin-left: 32px;
            font-size: 13px;
            color: #86909c;
            line-height: 1.4;
          }
        }

        .module-content {
          padding: 16px 20px;

          .permission-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 8px;

            .permission-item {
              border: 1px solid #f2f3f5;
              border-radius: 6px;
              padding: 12px;
              transition: all 0.2s ease;
              background: #fafbfc;

              &:hover {
                border-color: #4c7cf0;
                background: #f8faff;
              }

              &.permission-checked {
                border-color: #00d084;
                background: #f0fff4;

                .permission-name {
                  color: #00a870;
                  font-weight: 500;
                }
              }

              .permission-checkbox {
                width: 100%;

                :deep(.arco-checkbox) {
                  .arco-checkbox-icon {
                    border-color: #4c7cf0;

                    &.arco-checkbox-checked {
                      background: #00d084;
                      border-color: #00d084;
                    }
                  }
                }

                .permission-info {
                  margin-left: 8px;

                  .permission-name {
                    font-size: 14px;
                    font-weight: 500;
                    color: #1d2129;
                    line-height: 1.4;
                  }

                  .permission-desc {
                    font-size: 12px;
                    color: #86909c;
                    margin-top: 4px;
                    line-height: 1.3;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .selected-permissions-summary {
    margin-top: 20px;
    border: 1px solid #e5e6eb;
    border-radius: 8px;
    background: white;

    .summary-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f8faff;
      border-bottom: 1px solid #e5e6eb;

      .summary-title {
        font-size: 14px;
        font-weight: 500;
        color: #1d2129;
        display: flex;
        align-items: center;
      }

      :deep(.arco-btn-text) {
        color: #4c7cf0;

        .arco-icon {
          transition: transform 0.3s ease;

          &.rotate-180 {
            transform: rotate(180deg);
          }
        }
      }
    }

    .summary-content {
      padding: 16px;

      .permission-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .permission-tag {
          margin: 0;
          font-size: 12px;
          padding: 4px 8px;

          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }

  :deep(.arco-tree-node-title) {
    flex: 1;
  }

  :deep(.arco-tree-node-indent-block) + .arco-tree-node-drag-icon + .arco-tree-node-switcher + .arco-tree-node-checkbox + .arco-tree-node-title {
    display: flex;
    align-items: center;
  }
}
</style>
