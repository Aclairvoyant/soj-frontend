<template>
  <div class="permission-config">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card title="权限模块管理" size="small">
          <template #extra>
            <a-button size="small" @click="fetchModuleTree" :loading="moduleLoading">
              刷新
            </a-button>
          </template>

          <a-spin :loading="moduleLoading" style="width: 100%">
            <a-tree
              v-if="moduleTree.length > 0"
              :data="moduleTree"
              :selected-keys="selectedModuleKeys"
              @select="handleModuleSelect"
              show-line
            >
              <template #title="{ title, moduleCode, description }">
                <div class="module-node">
                  <span class="node-title">{{ title }}</span>
                  <a-tag size="small" color="blue">{{ moduleCode }}</a-tag>
                  <div v-if="description" class="node-desc">{{ description }}</div>
                </div>
              </template>
            </a-tree>

            <a-empty v-else description="暂无模块数据" />
          </a-spin>
        </a-card>
      </a-col>

      <a-col :span="16">
        <a-card title="权限操作管理" size="small">
          <template #extra>
            <a-space>
              <a-button type="primary" size="small" @click="showAddActionModal = true">
                新增操作
              </a-button>
              <a-button size="small" @click="fetchActions">
                刷新
              </a-button>
            </a-space>
          </template>

          <div v-if="selectedModule">
            <a-descriptions :column="2" size="small" style="margin-bottom: 16px">
              <a-descriptions-item label="模块名称">
                {{ selectedModule.title }}
              </a-descriptions-item>
              <a-descriptions-item label="模块代码">
                {{ selectedModule.moduleCode }}
              </a-descriptions-item>
              <a-descriptions-item label="模块描述" :span="2">
                {{ selectedModule.description || '暂无描述' }}
              </a-descriptions-item>
            </a-descriptions>

            <a-table
              :columns="actionColumns"
              :data="actionList"
              :loading="actionLoading"
              :pagination="false"
              size="small"
              row-key="id"
            >
              <!-- 操作信息列 -->
              <template #actionName="{ record }">
                <div class="action-info">
                  <div class="name">{{ record.actionName }}</div>
                  <div class="code">{{ record.actionCode }}</div>
                </div>
              </template>

              <!-- 创建时间列 -->
              <template #createTime="{ record }">
                {{ formatTime(record.createTime) }}
              </template>

              <!-- 操作列 -->
              <template #action="{ record }">
                <a-space>
                  <a-button type="outline" size="small" @click="handleEditAction(record)">
                    编辑
                  </a-button>
                  <a-popconfirm
                    content="确定要删除这个操作吗？"
                    @ok="handleDeleteAction(record.id)"
                  >
                    <a-button type="outline" size="small" status="danger">
                      删除
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </a-table>
          </div>

          <a-empty v-else description="请选择一个模块查看其权限操作" />
        </a-card>
      </a-col>
    </a-row>

    <!-- 新增/编辑操作模态框 -->
    <a-modal
      v-model:visible="showAddActionModal"
      :title="editingAction ? '编辑权限操作' : '新增权限操作'"
      @ok="handleActionSubmit"
      :confirm-loading="actionSubmitLoading"
    >
      <a-form :model="actionForm" layout="vertical">
        <a-form-item label="所属模块">
          <a-select
            v-model="actionForm.moduleCode"
            placeholder="请选择所属模块"
            :disabled="!!selectedModule"
          >
            <a-option
              v-for="module in flatModules"
              :key="module.moduleCode"
              :value="module.moduleCode"
            >
              {{ module.title }}
            </a-option>
          </a-select>
        </a-form-item>

        <a-form-item label="操作名称" name="actionName" required>
          <a-input v-model:value="actionForm.actionName" placeholder="请输入操作名称" />
        </a-form-item>

        <a-form-item label="操作代码" name="actionCode" required>
          <a-input
            v-model:value="actionForm.actionCode"
            placeholder="请输入操作代码"
            :disabled="!!editingAction"
          />
        </a-form-item>

        <a-form-item label="操作描述">
          <a-textarea v-model:value="actionForm.description" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import dayjs from 'dayjs'
import { Service } from '../../../generated'
import type { PermissionModuleVO } from '../../../generated'
import type { PermissionActionVO } from '../../../generated'

// 数据定义
interface ModuleTreeNode {
  key: string
  title: string
  moduleCode: string
  description?: string
  children?: ModuleTreeNode[]
}

type ActionData = PermissionActionVO

const selectedModuleKeys = ref<string[]>([])
const moduleTree = ref<ModuleTreeNode[]>([])
const moduleLoading = ref(false)
const actionList = ref<ActionData[]>([])
const actionLoading = ref(false)
const showAddActionModal = ref(false)
const editingAction = ref<ActionData | null>(null)
const actionSubmitLoading = ref(false)

// 操作表单
const actionForm = reactive({
  moduleCode: '',
  actionName: '',
  actionCode: '',
  description: '',
})

// 表格列配置
const actionColumns = [
  {
    title: '操作信息',
    slotName: 'actionName',
    width: 200,
  },
  {
    title: '操作描述',
    dataIndex: 'description',
    width: 200,
    ellipsis: true,
  },
  {
    title: '创建时间',
    slotName: 'createTime',
    width: 150,
  },
  {
    title: '操作',
    slotName: 'action',
    width: 120,
    fixed: 'right',
  },
]

// 计算属性
const selectedModule = computed(() => {
  if (selectedModuleKeys.value.length === 0) return null

  const findModule = (nodes: ModuleTreeNode[], key: string): ModuleTreeNode | null => {
    for (const node of nodes) {
      if (node.key === key) return node
      if (node.children) {
        const found = findModule(node.children, key)
        if (found) return found
      }
    }
    return null
  }

  return findModule(moduleTree.value, selectedModuleKeys.value[0])
})

const flatModules = computed(() => {
  const flatten = (nodes: ModuleTreeNode[]): ModuleTreeNode[] => {
    const result: ModuleTreeNode[] = []
    for (const node of nodes) {
      result.push(node)
      if (node.children) {
        result.push(...flatten(node.children))
      }
    }
    return result
  }

  return flatten(moduleTree.value)
})

// 工具方法
const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

// 监听选中模块变化
watch(selectedModule, (newModule) => {
  if (newModule) {
    actionForm.moduleCode = newModule.moduleCode
    fetchActions()
  }
})

// 事件处理方法
const handleModuleSelect = (selectedKeys: string[]) => {
  selectedModuleKeys.value = selectedKeys
}

const handleEditAction = (action: ActionData) => {
  editingAction.value = action
  Object.assign(actionForm, {
    moduleCode: action.moduleCode,
    actionName: action.actionName,
    actionCode: action.actionCode,
    description: action.description || '',
  })
  showAddActionModal.value = true
}

const handleActionSubmit = async () => {
  if (!actionForm.moduleCode || !actionForm.actionName || !actionForm.actionCode) {
    Message.error('请填写必要信息')
    return
  }

  actionSubmitLoading.value = true

  try {
    if (editingAction.value) {
      // TODO: 调用编辑API
      Message.success('权限操作编辑成功')
    } else {
      // TODO: 调用新增API
      Message.success('权限操作创建成功')
    }

    showAddActionModal.value = false
    editingAction.value = null
    Object.assign(actionForm, {
      moduleCode: selectedModule.value?.moduleCode || '',
      actionName: '',
      actionCode: '',
      description: '',
    })
    fetchActions()
  } catch (error) {
    console.error('操作失败:', error)
    Message.error('操作失败')
  } finally {
    actionSubmitLoading.value = false
  }
}

const handleDeleteAction = async (actionId: number) => {
  try {
    // TODO: 调用删除API
    Message.success('权限操作删除成功')
    fetchActions()
  } catch (error) {
    console.error('删除权限操作失败:', error)
    Message.error('删除权限操作失败')
  }
}

// 数据获取方法
const fetchModuleTree = async () => {
  moduleLoading.value = true

  try {
    const response = await Service.getModuleListUsingGet()

    if (response.code === 200 && response.data) {

      // 构建模块树结构
      const moduleMap = new Map<string, ModuleTreeNode>()
      const rootNodes: ModuleTreeNode[] = []

      response.data.forEach((module: PermissionModuleVO) => {
        const node: ModuleTreeNode = {
          key: module.moduleCode!,
          title: module.moduleName!,
          moduleCode: module.moduleCode!,
          description: module.description,
          children: []
        }
        moduleMap.set(String(module.id!), node)

        if (!module.parentId || module.parentId === 0 || module.parentId === '0') {
          rootNodes.push(node)
        }
      })

      // 构建父子关系
      response.data.forEach((module: PermissionModuleVO) => {
        if (module.parentId && module.parentId !== 0 && module.parentId !== '0') {
          const parentNode = moduleMap.get(String(module.parentId))
          const childNode = moduleMap.get(String(module.id!))
          if (parentNode && childNode) {
            parentNode.children!.push(childNode)
          }
        }
      })

      moduleTree.value = rootNodes

      if (rootNodes.length === 0) {
        Message.warning('未找到权限模块数据，请检查后端数据')
      }
    } else {
      Message.error(response.message || '获取权限模块失败')
      moduleTree.value = []
    }

  } catch (error) {
    console.error('获取权限模块失败:', error)
    Message.error('获取权限模块失败: ' + (error as Error).message)
    moduleTree.value = []
  } finally {
    moduleLoading.value = false
  }
}

const fetchActions = async () => {
  if (!selectedModule.value) {
    return
  }

  actionLoading.value = true

  try {
    const moduleCode = selectedModule.value.moduleCode
    const response = await Service.getActionListUsingGet(moduleCode)

    if (response.code === 200 && response.data) {
      actionList.value = response.data
    } else {
      Message.error(response.message || '获取权限操作失败')
      actionList.value = []
    }

  } catch (error) {
    console.error('获取权限操作失败:', error)
    Message.error('获取权限操作失败: ' + (error as Error).message)
    actionList.value = []
  } finally {
    actionLoading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchModuleTree()
})

</script>

<style scoped lang="less">
.permission-config {
  padding: 20px;

  :deep(.arco-card) {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border: none;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95);

    .arco-card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px 12px 0 0;
      padding: 16px 20px;

      .arco-card-header-title {
        color: white;
        font-weight: 600;
        font-size: 16px;
      }

      .arco-card-header-extra {
        .arco-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;

          &:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }

    .arco-card-body {
      padding: 20px;
    }
  }

  :deep(.arco-tree) {
    background: transparent;

    .arco-tree-node {
      margin-bottom: 4px;

      &:hover {
        background: rgba(102, 126, 234, 0.1);
        border-radius: 6px;
      }

      &.arco-tree-node-selected {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
        border-radius: 6px;

        .arco-tree-node-title {
          color: #667eea;
          font-weight: 600;
        }
      }
    }
  }

  .module-node {
    padding: 8px 0;

    .node-title {
      font-weight: 600;
      margin-right: 8px;
      color: #333;
      font-size: 14px;
    }

    .node-desc {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
      line-height: 1.4;
    }

    .arco-tag {
      margin-left: 8px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border: none;
      color: white;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 12px;
    }
  }

  :deep(.arco-descriptions) {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
    border-radius: 8px;
    padding: 16px;
    border: 1px solid rgba(102, 126, 234, 0.1);

    .arco-descriptions-item-label {
      font-weight: 600;
      color: #667eea;
    }

    .arco-descriptions-item-value {
      color: #333;
    }
  }

  :deep(.arco-table) {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .arco-table-th {
      background: linear-gradient(135deg, #f8f9ff, #f0f2ff);
      color: #667eea;
      font-weight: 600;
      border-bottom: 2px solid #667eea;
    }

    .arco-table-td {
      border-bottom: 1px solid #f0f0f0;

      &:hover {
        background: rgba(102, 126, 234, 0.02);
      }
    }

    .arco-table-tr:hover .arco-table-td {
      background: rgba(102, 126, 234, 0.05);
    }
  }

  .action-info {
    .name {
      font-weight: 600;
      font-size: 14px;
      color: #333;
      margin-bottom: 2px;
    }

    .code {
      color: #667eea;
      font-size: 12px;
      background: rgba(102, 126, 234, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Monaco', 'Consolas', monospace;
    }
  }

  :deep(.arco-btn-primary) {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    border-radius: 6px;
    font-weight: 500;

    &:hover {
      background: linear-gradient(135deg, #5a6fd8, #6a4190);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
  }

  :deep(.arco-btn-outline) {
    border: 1px solid #667eea;
    color: #667eea;
    border-radius: 6px;
    font-weight: 500;

    &:hover {
      background: #667eea;
      color: white;
      transform: translateY(-1px);
    }

    &.arco-btn-status-danger {
      border-color: #f53f3f;
      color: #f53f3f;

      &:hover {
        background: #f53f3f;
        color: white;
      }
    }
  }

  :deep(.arco-empty) {
    padding: 40px 20px;

    .arco-empty-description {
      color: #999;
      font-style: italic;
    }
  }

  :deep(.arco-modal) {
    .arco-modal-header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-radius: 8px 8px 0 0;

      .arco-modal-title {
        color: white;
        font-weight: 600;
      }
    }

    .arco-modal-body {
      padding: 24px;
    }
  }

  :deep(.arco-form-item-label) {
    font-weight: 600;
    color: #333;

    &::before {
      color: #f53f3f;
    }
  }

  :deep(.arco-input), :deep(.arco-textarea), :deep(.arco-select) {
    border-radius: 6px;
    border: 1px solid #e0e0e0;
    transition: all 0.3s ease;

    &:hover {
      border-color: #667eea;
    }

    &:focus, &.arco-input-focus, &.arco-select-focus {
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
    }
  }

  :deep(.arco-spin) {
    .arco-spin-dot {
      background: #667eea;
    }
  }
}
</style>
