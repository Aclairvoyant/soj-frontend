<template>
  <div class="permission-management">
    <a-layout>
      <a-layout-sider
        :width="240"
        :collapsed="collapsed"
        :collapsible="false"
        class="permission-sider"
      >
        <div class="sider-header">
          <h3 v-if="!collapsed">权限管理</h3>
          <a-button
            type="text"
            @click="collapsed = !collapsed"
            class="collapse-btn"
          >
            <template #icon>
              <IconMenuUnfold v-if="collapsed" />
              <IconMenuFold v-else />
            </template>
          </a-button>
        </div>

        <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="inline"
          :theme="theme"
          @menu-item-click="handleMenuSelect"
        >
          <a-menu-item key="overview">
            <template #icon>
              <IconDashboard />
            </template>
            <span>概览仪表板</span>
          </a-menu-item>

          <a-menu-item key="users">
            <template #icon>
              <IconUser />
            </template>
            <span>用户管理</span>
          </a-menu-item>

          <a-menu-item key="roles">
            <template #icon>
              <IconUserGroup />
            </template>
            <span>角色管理</span>
          </a-menu-item>

          <a-menu-item key="config">
            <template #icon>
              <IconSettings />
            </template>
            <span>权限配置</span>
          </a-menu-item>

          <a-menu-item key="logs">
            <template #icon>
              <IconFile />
            </template>
            <span>操作日志</span>
          </a-menu-item>

          <a-menu-item key="checker">
            <template #icon>
              <IconBug />
            </template>
            <span>权限检查</span>
          </a-menu-item>

          <a-menu-item key="cache">
            <template #icon>
              <IconStorage />
            </template>
            <span>缓存管理</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <a-layout-content class="permission-content">
        <div class="content-header">
          <a-breadcrumb>
            <a-breadcrumb-item>
              <router-link to="/">首页</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>权限管理</a-breadcrumb-item>
            <a-breadcrumb-item>{{ currentPageTitle }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <div class="content-body">
          <!-- 概览仪表板 -->
          <div v-if="selectedKeys[0] === 'overview'" class="overview-dashboard">
            <div class="dashboard-header">
              <h2>权限管理概览</h2>
              <p>系统权限管理总览与快速操作</p>
            </div>

            <!-- 统计卡片 -->
            <a-row :gutter="16" class="stats-row">
              <a-col :span="6">
                <a-card :bordered="false" class="stat-card">
                  <a-statistic
                    title="系统用户总数"
                    :value="Number(overviewStats.totalUsers)"
                    :loading="statsLoading"
                  >
                    <template #prefix>
                      <IconUser style="color: #1890ff" />
                    </template>
                  </a-statistic>
                </a-card>
              </a-col>

              <a-col :span="6">
                <a-card :bordered="false" class="stat-card">
                  <a-statistic
                    title="系统角色数量"
                    :value="overviewStats.totalRoles"
                    :loading="statsLoading"
                  >
                    <template #prefix>
                      <IconUserGroup style="color: #52c41a" />
                    </template>
                  </a-statistic>
                </a-card>
              </a-col>

              <a-col :span="6">
                <a-card :bordered="false" class="stat-card">
                  <a-statistic
                    title="权限模块数量"
                    :value="overviewStats.totalModules"
                    :loading="statsLoading"
                  >
                    <template #prefix>
                      <IconSettings style="color: #fa8c16" />
                    </template>
                  </a-statistic>
                </a-card>
              </a-col>

              <a-col :span="6">
                <a-card :bordered="false" class="stat-card">
                  <a-statistic
                    title="今日操作记录"
                    :value="overviewStats.todayOperations"
                    :loading="statsLoading"
                  >
                    <template #prefix>
                      <IconFile style="color: #722ed1" />
                    </template>
                  </a-statistic>
                </a-card>
              </a-col>
            </a-row>

            <!-- 快速操作 -->
            <a-row :gutter="16" class="quick-actions">
              <a-col :span="8">
                <a-card title="用户权限管理" size="small" :bordered="false">
                  <p>管理系统用户权限和角色分配</p>
                  <a-space>
                    <a-button type="primary" @click="navigateTo('users')">
                      <template #icon>
                        <IconUser />
                      </template>
                      用户管理
                    </a-button>
                    <a-button @click="navigateTo('roles')">
                      <template #icon>
                        <IconUserGroup />
                      </template>
                      角色管理
                    </a-button>
                  </a-space>
                </a-card>
              </a-col>

              <a-col :span="8">
                <a-card title="权限配置与监控" size="small" :bordered="false">
                  <p>配置权限模块和监控系统状态</p>
                  <a-space>
                    <a-button type="primary" @click="navigateTo('config')">
                      <template #icon>
                        <IconSettings />
                      </template>
                      权限配置
                    </a-button>
                    <a-button @click="navigateTo('cache')">
                      <template #icon>
                        <IconStorage />
                      </template>
                      缓存管理
                    </a-button>
                  </a-space>
                </a-card>
              </a-col>

              <a-col :span="8">
                <a-card title="日志与检查工具" size="small" :bordered="false">
                  <p>查看操作日志和测试权限配置</p>
                  <a-space>
                    <a-button type="primary" @click="navigateTo('logs')">
                      <template #icon>
                        <IconFile />
                      </template>
                      操作日志
                    </a-button>
                    <a-button @click="navigateTo('checker')">
                      <template #icon>
                        <IconBug />
                      </template>
                      权限检查
                    </a-button>
                  </a-space>
                </a-card>
              </a-col>
            </a-row>

            <!-- 最近操作 -->
            <a-card title="最近操作记录" size="small" :bordered="false" class="recent-operations">
              <div v-if="recentOperations.length > 0">
                <div
                  v-for="(item, index) in recentOperations"
                  :key="index"
                  class="operation-item"
                >
                  <div class="operation-header">
                    <a-avatar :style="{ backgroundColor: item.color }" size="small">
                      {{ item.operator.charAt(0) }}
                    </a-avatar>
                    <div class="operation-content">
                      <div class="operation-title">{{ item.title }}</div>
                      <div class="operation-description">{{ item.description }}</div>
                    </div>
                    <div class="operation-time">{{ item.time }}</div>
                  </div>
                  <a-divider v-if="index < recentOperations.length - 1" />
                </div>
              </div>
              <a-empty v-else description="暂无最近操作记录" />
            </a-card>
          </div>

          <!-- 其他页面内容 -->
          <router-view v-else />
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IconMenuUnfold,
  IconMenuFold,
  IconDashboard,
  IconUser,
  IconUserGroup,
  IconSettings,
  IconFile,
  IconBug,
  IconStorage,
} from '@arco-design/web-vue/es/icon'
import { Service } from '../../../generated'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()

const collapsed = ref(false)
const theme = ref<'light' | 'dark'>('light')
const selectedKeys = ref<string[]>(['overview'])
const statsLoading = ref(false)
const recentLoading = ref(false)

// 概览统计数据
const overviewStats = ref({
  totalUsers: 0,
  totalRoles: 0,
  totalModules: 0,
  todayOperations: 0,
})

// 最近操作记录
const recentOperations = ref([])

// 获取最近操作记录
const fetchRecentOperations = async () => {
  recentLoading.value = true

  try {
    // 调用后端API获取最近的操作记录，限制为5条
    const response = await Service.getOperationLogListUsingGet(
      1, // current
      undefined, // endTime
      undefined, // operationResult
      undefined, // operationType
      undefined, // operatorId
      undefined, // operatorName
      5, // pageSize - 只获取最近5条
      'operationTime', // sortField
      'desc', // sortOrder - 按时间倒序
      undefined, // startTime
      undefined // targetType
    )

    if (response.data?.records) {
      // 转换后端数据格式为前端需要的格式
      recentOperations.value = response.data.records.map((record: any) => ({
        title: getOperationTypeText(record.operationType),
        description: record.operationDescription || '无描述',
        operator: record.operatorName || '未知操作者',
        time: dayjs(record.operationTime).format('HH:mm:ss'),
        color: getOperationTypeColor(record.operationType)
      }))
    } else {
      recentOperations.value = []
    }
  } catch (error) {
    console.error('获取最近操作记录失败:', error)
    // 如果接口调用失败，使用空数组
    recentOperations.value = []
  } finally {
    recentLoading.value = false
  }
}

// 根据操作类型获取颜色
const getOperationTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    'ROLE_CHANGE': '#1890ff',
    'PERMISSION_CONFIG': '#52c41a',
    'BATCH_OPERATION': '#fa8c16',
    'CACHE_OPERATION': '#722ed1',
    'USER_PERMISSION_CHANGE': '#13c2c2',
    'SYSTEM_CONFIG': '#eb2f96'
  }
  return colorMap[type] || '#1890ff'
}

// 根据操作类型获取文本
const getOperationTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    'ROLE_CHANGE': '角色变更',
    'PERMISSION_CONFIG': '权限配置',
    'BATCH_OPERATION': '批量操作',
    'CACHE_OPERATION': '缓存操作',
    'USER_PERMISSION_CHANGE': '用户权限变更',
    'SYSTEM_CONFIG': '系统配置'
  }
  return textMap[type] || type
}

// 页面标题映射
const pageTitleMap = {
  overview: '概览仪表板',
  users: '用户管理',
  roles: '角色管理',
  config: '权限配置',
  logs: '操作日志',
  checker: '权限检查',
  cache: '缓存管理',
}

const currentPageTitle = computed(() => {
  const key = selectedKeys.value[0] || 'overview'
  return pageTitleMap[key as keyof typeof pageTitleMap] || '概览仪表板'
})

// 获取概览统计数据
const fetchOverviewStats = async () => {
  statsLoading.value = true

  try {
    // 并行获取各种统计数据
    const [usersResponse, rolesResponse, modulesResponse] = await Promise.all([
      Service.getUserPermissionListUsingGet(1, 1).catch(() => ({ data: { total: 0 } })),
      Service.getRoleListUsingGet().catch(() => ({ data: [] })),
      Service.getModuleListUsingGet().catch(() => ({ data: [] })),
    ])

    overviewStats.value = {
      totalUsers: usersResponse.data?.total || 0,
      totalRoles: rolesResponse.data?.length || 0,
      totalModules: modulesResponse.data?.length || 0,
      todayOperations: 99
    }
  } catch (error) {
    console.error('获取概览统计失败:', error)
    // 使用默认值
    overviewStats.value = {
      totalUsers: 0,
      totalRoles: 0,
      totalModules: 0,
      todayOperations: 0,
    }
  } finally {
    statsLoading.value = false
  }
}

// 导航到指定页面
const navigateTo = (key: string) => {
 // console.log('NavigateTo called with key:', key)
  selectedKeys.value = [key]

  // 根据菜单键映射到正确的路由路径
  const routeMap = {
    overview: '/permission',
    users: '/permission/users',
    roles: '/permission/roles',
    config: '/permission/config',
    logs: '/permission/logs',
    checker: '/permission/checker',
    cache: '/permission/cache',
  }

  const targetRoute = routeMap[key as keyof typeof routeMap]
  // console.log('Target route:', targetRoute)
  if (targetRoute) {
    router.push(targetRoute)
  } else {
    console.warn(`未找到对应的路由: ${key}`)
  }
}

// 根据当前路由设置选中的菜单项
watch(
  () => route.path,
  (newPath) => {
    const pathMap = {
      '/permission': 'overview',
      '/permission/users': 'users',
      '/permission/roles': 'roles',
      '/permission/config': 'config',
      '/permission/logs': 'logs',
      '/permission/checker': 'checker',
      '/permission/cache': 'cache',
    }

    const key = pathMap[newPath as keyof typeof pathMap]
    if (key) {
      selectedKeys.value = [key]
    }
  },
  { immediate: true }
)

const handleMenuSelect = (key: string) => {
  // console.log('Menu selected key:', key)
  if (key) {
    navigateTo(key)
  } else {
    console.error('No key found in menu select event')
  }
}


// 组件挂载时获取数据
onMounted(() => {
  fetchOverviewStats()
  fetchRecentOperations()
})
</script>

<style scoped lang="less">
.permission-management {
  height: 100%;
  background: #f0f2f5;

  .permission-sider {
    background: #fff;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    height: calc(100vh - 56px); // 减去头部导航栏高度，保持固定高度

    .sider-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #262626;
      }

      .collapse-btn {
        border: none;
        color: #8c8c8c;

        &:hover {
          background: #f5f5f5;
          color: #1890ff;
        }
      }
    }
  }

  .permission-content {
    display: flex;
    flex-direction: column;

    .content-header {
      background: #fff;
      padding: 16px 24px;
      border-bottom: 1px solid #f0f0f0;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    }

    .content-body {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }
  }

  // 概览仪表板样式
  .overview-dashboard {
    .dashboard-header {
      margin-bottom: 24px;
      text-align: center;

      h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
        font-weight: 600;
        color: #262626;
      }

      p {
        margin: 0;
        color: #8c8c8c;
        font-size: 14px;
      }
    }

    .stats-row {
      margin-bottom: 24px;

      .stat-card {
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;

        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
      }
    }

    .quick-actions {
      margin-bottom: 24px;

      .ant-card {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;

        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }

        p {
          color: #666;
          margin-bottom: 16px;
        }
      }
    }

    .recent-operations {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;

      .operation-item {
        .operation-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 0;
        }

        .operation-content {
          flex: 1;
          min-width: 0;

          .operation-title {
            font-weight: 500;
            font-size: 14px;
            color: #262626;
            margin-bottom: 4px;
          }

          .operation-description {
            color: #666;
            font-size: 12px;
            line-height: 1.4;
          }
        }

        .operation-time {
          color: #8c8c8c;
          font-size: 12px;
          white-space: nowrap;
        }
      }

      .ant-list-item {
        padding: 16px 24px;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .operation-time {
          color: #8c8c8c;
          font-size: 12px;
        }
      }
    }
  }
}

:deep(.ant-layout-sider-collapsed) {
  .sider-header h3 {
    display: none;
  }
}
</style>
