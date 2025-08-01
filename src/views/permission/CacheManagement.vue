<template>
  <div class="cache-management">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-card>
          <template #title>
            <div class="page-header">
              <h2>权限缓存管理</h2>
              <p>监控和管理权限系统的缓存状态</p>
            </div>
          </template>

          <template #extra>
            <a-space>
              <a-button @click="fetchCacheStats">
                <template #icon>
                  <IconRefresh />
                </template>
                刷新数据
              </a-button>

              <a-button type="primary" @click="handleWarmup" :loading="warmupLoading">
                <template #icon>
                  <IconFire />
                </template>
                缓存预热
              </a-button>
            </a-space>
          </template>

          <!-- 缓存统计概览 -->
          <div class="cache-overview">

            <a-row :gutter="16">
              <a-col :span="6">
                <a-statistic
                  title="用户权限缓存"
                  :value="cacheStats.userCacheCount || 0"
                  :loading="statsLoading"
                >
                  <template #suffix>
                    <span class="cache-suffix">个</span>
                  </template>
                </a-statistic>
                <div class="cache-detail">
                  命中率: {{ (cacheStats.userCacheHitRate || 0).toFixed(2) }}%
                </div>
              </a-col>

              <a-col :span="6">
                <a-statistic
                  title="角色权限缓存"
                  :value="cacheStats.roleCacheCount || 0"
                  :loading="statsLoading"
                >
                  <template #suffix>
                    <span class="cache-suffix">个</span>
                  </template>
                </a-statistic>
                <div class="cache-detail">
                  命中率: {{ (cacheStats.roleCacheHitRate || 0).toFixed(2) }}%
                </div>
              </a-col>

              <a-col :span="6">
                <a-statistic
                  title="资源权限缓存"
                  :value="cacheStats.resourceCacheCount || 0"
                  :loading="statsLoading"
                >
                  <template #suffix>
                    <span class="cache-suffix">个</span>
                  </template>
                </a-statistic>
                <div class="cache-detail">
                  命中率: {{ (cacheStats.resourceCacheHitRate || 0).toFixed(2) }}%
                </div>
              </a-col>

              <a-col :span="6">
                <a-statistic
                  title="总体缓存命中率"
                  :value="Number(cacheStats.totalHitRate || 0)"
                  :precision="2"
                  :loading="statsLoading"
                >
                  <template #suffix>
                    <span class="cache-suffix">%</span>
                  </template>
                </a-statistic>
                <div class="cache-detail">
                  内存使用: {{ formatBytes(cacheStats.memoryUsage || 0) }}
                </div>
              </a-col>
            </a-row>
          </div>

          <a-divider />

          <!-- 缓存操作工具 -->
          <a-row :gutter="16">
            <a-col :span="12">
              <a-card title="缓存清理" size="small">
                <a-space direction="horizontal" style="width: 100%">
                  <div class="operation-item">
                    <h4>清理用户权限缓存</h4>
                    <p>清理所有用户的权限缓存数据</p>
                    <a-button
                      danger
                      @click="handleClearCache('user')"
                      :loading="clearLoading.user"
                    >
                      清理用户缓存
                    </a-button>
                  </div>

                  <a-divider />

                  <div class="operation-item">
                    <h4>清理角色权限缓存</h4>
                    <p>清理所有角色的权限缓存数据</p>
                    <a-button
                      danger
                      @click="handleClearCache('role')"
                      :loading="clearLoading.role"
                    >
                      清理角色缓存
                    </a-button>
                  </div>

                  <a-divider />

                  <div class="operation-item">
                    <h4>清理资源权限缓存</h4>
                    <p>清理所有资源级权限缓存数据</p>
                    <a-button
                      danger
                      @click="handleClearCache('resource')"
                      :loading="clearLoading.resource"
                    >
                      清理资源缓存
                    </a-button>
                  </div>

                  <a-divider />

                  <div class="operation-item">
                    <h4>清理全部缓存</h4>
                    <p>清理所有权限相关的缓存数据</p>
                    <a-button
                      danger
                      type="primary"
                      @click="handleClearCache('all')"
                      :loading="clearLoading.all"
                    >
                      清理全部缓存
                    </a-button>
                  </div>
                </a-space>
              </a-card>
            </a-col>

            <a-col :span="12">
              <a-card title="单个缓存管理" size="small">
                <a-form layout="vertical">
                  <a-form-item label="缓存类型">
                    <a-select v-model="singleCacheForm.type" placeholder="选择缓存类型">
                      <a-option value="user">用户权限缓存</a-option>
                      <a-option value="role">角色权限缓存</a-option>
                      <a-option value="resource">资源权限缓存</a-option>
                    </a-select>
                  </a-form-item>

                  <a-form-item
                    v-if="singleCacheForm.type === 'user'"
                    label="用户ID"
                  >
                    <a-input-number
                      v-model="singleCacheForm.userId"
                      placeholder="请输入用户ID"
                      style="width: 100%"
                    />
                  </a-form-item>

                  <a-form-item
                    v-if="singleCacheForm.type === 'role'"
                    label="角色代码"
                  >
                    <a-input
                      v-model="singleCacheForm.roleCode"
                      placeholder="例如: admin"
                    />
                  </a-form-item>

                  <div v-if="singleCacheForm.type === 'resource'">
                    <a-form-item label="资源类型">
                      <a-input
                        v-model="singleCacheForm.resourceType"
                        placeholder="例如: question"
                      />
                    </a-form-item>

                    <a-form-item label="资源ID">
                      <a-input-number
                        v-model="singleCacheForm.resourceId"
                        placeholder="请输入资源ID"
                        style="width: 100%"
                      />
                    </a-form-item>

                    <a-form-item label="目标用户ID">
                      <a-input-number
                        v-model="singleCacheForm.targetUserId"
                        placeholder="请输入目标用户ID"
                        style="width: 100%"
                      />
                    </a-form-item>
                  </div>

                  <a-form-item>
                    <a-space>
                      <a-button
                        type="primary"
                        @click="handleViewCache"
                        :loading="viewCacheLoading"
                      >
                        查看缓存
                      </a-button>

                      <a-button
                        danger
                        @click="handleClearSingleCache"
                        :loading="clearSingleLoading"
                      >
                        清理此缓存
                      </a-button>
                    </a-space>
                  </a-form-item>
                </a-form>
              </a-card>
            </a-col>
          </a-row>

          <!-- 缓存详情展示 - 移到更显眼的位置 -->
          <div v-if="cacheDetail" style="margin-top: 20px;">
            <a-alert
              type="success"
              show-icon
              style="margin-bottom: 16px"
              closable
            >
            成功获取缓存键 {{ cacheDetail.key }} 的详情信息
            </a-alert>

            <a-card title="缓存详情" size="small" class="cache-detail-card">
              <template #extra>
                <a-button size="small" @click="cacheDetail = null">
                  <template #icon>
                    <icon-close />
                  </template>
                  关闭
                </a-button>
              </template>

              <a-descriptions :column="2" bordered>
                <a-descriptions-item label="缓存键">
                  <a-typography-text copyable>{{ cacheDetail.key }}</a-typography-text>
                </a-descriptions-item>

                <a-descriptions-item label="缓存类型">
                  <a-tag :color="getCacheTypeColor(cacheDetail.type)">{{ getCacheTypeLabel(cacheDetail.type) }}</a-tag>
                </a-descriptions-item>

                <a-descriptions-item label="数据类型">
                  {{ cacheDetail.type === 'role' ? 'JSON数组' : '字符串' }}
                </a-descriptions-item>

                <a-descriptions-item label="过期时间">
                  {{ cacheDetail.expireTime ? formatTime(cacheDetail.expireTime) : '永不过期' }}
                </a-descriptions-item>

                <a-descriptions-item label="数据大小">
                  {{ formatBytes(cacheDetail.size) }}
                </a-descriptions-item>

                <a-descriptions-item label="缓存状态">
                  <a-tag color="green">有效</a-tag>
                </a-descriptions-item>
              </a-descriptions>

              <a-divider />

              <div class="cache-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <h4 style="margin: 0;">缓存内容</h4>
                  <a-button size="small" @click="copyToClipboard(cacheDetail.content)">
                    <template #icon>
                      <icon-copy />
                    </template>
                    复制内容
                  </a-button>
                </div>
                <pre class="json-content">{{ formatJSON(cacheDetail.content) }}</pre>
              </div>
            </a-card>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconRefresh, IconFire, IconClose, IconCopy } from '@arco-design/web-vue/es/icon'
import dayjs from 'dayjs'
import { Service } from '../../../generated'

// 数据定义
interface CacheStats {
  userCacheCount: number
  userCacheHitRate: number
  roleCacheCount: number
  roleCacheHitRate: number
  resourceCacheCount: number
  resourceCacheHitRate: number
  totalHitRate: number
  memoryUsage: number
}

interface CacheDetail {
  key: string
  type: string
  content: string
  createTime: string
  expireTime?: string
  size: number
  accessCount: number
}

const statsLoading = ref(false)
const warmupLoading = ref(false)
const viewCacheLoading = ref(false)
const clearSingleLoading = ref(false)
const cacheStats = ref<CacheStats>({
  userCacheCount: 0,
  userCacheHitRate: 0,
  roleCacheCount: 0,
  roleCacheHitRate: 0,
  resourceCacheCount: 0,
  resourceCacheHitRate: 0,
  totalHitRate: 0,
  memoryUsage: 0,
})

const clearLoading = reactive({
  user: false,
  role: false,
  resource: false,
  all: false,
})

const cacheDetail = ref<CacheDetail | null>(null)

// 单个缓存操作表单
const singleCacheForm = reactive({
  type: '',
  userId: undefined as string | undefined,
  roleCode: '',
  resourceType: '',
  resourceId: undefined as string | undefined,
  targetUserId: undefined as string | undefined,
})

// 工具方法
const calculateTotalHitRate = (data: Record<string, any>) => {
  try {
    const userHitCount = parseInt(data.userCache?.hitCount || '0') || 0
    const userTotalCount = parseInt(data.userCache?.totalCount || '0') || 0
    const roleHitCount = parseInt(data.roleCache?.hitCount || '0') || 0
    const roleTotalCount = parseInt(data.roleCache?.totalCount || '0') || 0
    const resourceHitCount = parseInt(data.resourceCache?.hitCount || '0') || 0
    const resourceTotalCount = parseInt(data.resourceCache?.totalCount || '0') || 0

    const totalHitCount = userHitCount + roleHitCount + resourceHitCount
    const totalCount = userTotalCount + roleTotalCount + resourceTotalCount

    console.log('计算总体命中率:', { totalHitCount, totalCount })

    return totalCount > 0 ? (totalHitCount / totalCount) * 100 : 0
  } catch (error) {
    console.error('计算总体命中率失败:', error)
    return 0
  }
}

const calculateMemoryUsage = (data: Record<string, any>) => {
  try {
    const userCacheSize = parseInt(data.userPermissionCacheSize || '0') || 0
    const roleCacheSize = parseInt(data.rolePermissionCacheSize || '0') || 0
    const resourceCacheSize = parseInt(data.resourcePermissionCacheSize || '0') || 0

    console.log('计算内存使用:', { userCacheSize, roleCacheSize, resourceCacheSize })

    return userCacheSize + roleCacheSize + resourceCacheSize
  } catch (error) {
    console.error('计算内存使用失败:', error)
    return 0
  }
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const formatJSON = (jsonStr: string) => {
  try {
    return JSON.stringify(JSON.parse(jsonStr), null, 2)
  } catch {
    return jsonStr
  }
}

// 缓存类型颜色映射
const getCacheTypeColor = (type: string) => {
  switch (type) {
    case 'user': return 'blue'
    case 'role': return 'green'
    case 'resource': return 'orange'
    default: return 'gray'
  }
}

// 缓存类型标签映射
const getCacheTypeLabel = (type: string) => {
  switch (type) {
    case 'user': return '用户权限缓存'
    case 'role': return '角色权限缓存'
    case 'resource': return '资源权限缓存'
    default: return '其他缓存'
  }
}

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    Message.success('内容已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
    // 降级方案：使用传统的复制方法
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      Message.success('内容已复制到剪贴板')
    } catch (fallbackErr) {
      Message.error('复制失败')
    }
    document.body.removeChild(textArea)
  }
}

// 事件处理方法
const handleWarmup = async () => {
  warmupLoading.value = true

  try {
    console.log('开始权限缓存预热...')
    const response = await Service.warmUpCacheUsingPost()
    console.log('缓存预热API响应:', response)

    if (response.code === 200) {
      Message.success('权限缓存预热成功')
      await fetchCacheStats()
    } else {
      console.warn('缓存预热API返回异常:', response)
      Message.warning(response.message || '缓存预热可能未完全成功')
      // 仍然尝试刷新统计信息
      await fetchCacheStats()
    }
  } catch (error) {
    console.error('缓存预热失败:', error)
    Message.error('缓存预热失败: ' + (error as Error).message)
  } finally {
    warmupLoading.value = false
  }
}

const handleClearCache = async (type: 'user' | 'role' | 'resource' | 'all') => {
  clearLoading[type] = true

  try {
    console.log(`开始清理${type}缓存...`)
    const response = await Service.clearPermissionCacheUsingPost(type)
    console.log('清理缓存API响应:', response)

    const typeMap = {
      user: '用户权限缓存',
      role: '角色权限缓存',
      resource: '资源权限缓存',
      all: '全部权限缓存',
    }

    if (response.code === 200) {
      Message.success(`${typeMap[type]}清理成功`)
    } else {
      Message.warning(response.message || `${typeMap[type]}清理可能未完全成功`)
    }

    // 刷新缓存统计
    await fetchCacheStats()
  } catch (error) {
    console.error('清理缓存失败:', error)
    const typeMap = {
      user: '用户权限缓存',
      role: '角色权限缓存',
      resource: '资源权限缓存',
      all: '全部权限缓存',
    }
    Message.error(`清理${typeMap[type]}失败: ` + (error as Error).message)
  } finally {
    clearLoading[type] = false
  }
}

const handleViewCache = async () => {
  if (!singleCacheForm.type) {
    Message.error('请选择缓存类型')
    return
  }

  let cacheKey = ''

  switch (singleCacheForm.type) {
    case 'user':
      if (!singleCacheForm.userId) {
        Message.error('请输入用户ID')
        return
      }
      cacheKey = `permission:user:${singleCacheForm.userId}`
      break

    case 'role':
      if (!singleCacheForm.roleCode) {
        Message.error('请输入角色代码')
        return
      }
      cacheKey = `permission:role:${singleCacheForm.roleCode}`
      break

    case 'resource':
      if (!singleCacheForm.resourceType || !singleCacheForm.resourceId || !singleCacheForm.targetUserId) {
        Message.error('请填写完整的资源权限信息')
        return
      }
      cacheKey = `permission:resource:${singleCacheForm.resourceType}:${singleCacheForm.resourceId}:${singleCacheForm.targetUserId}`
      break
  }

  viewCacheLoading.value = true

  try {
    console.log('开始获取缓存详情，cacheKey:', cacheKey)
    const response = await Service.getCacheDetailUsingGet(cacheKey)
    console.log('获取缓存详情API响应:', response)

    if (response.code === 200 && response.data) {
      const data = response.data as Record<string, any>

      // 根据后端返回的数据结构解析缓存详情
      const detail: CacheDetail = {
        key: data.cacheKey || cacheKey,
        type: singleCacheForm.type,
        content: data.value || JSON.stringify({ message: '缓存内容为空' }),
        createTime: new Date().toISOString(), // 后端没有提供创建时间，使用当前时间
        expireTime: data.expireTime && data.expireTime !== '-1'
          ? new Date(Date.now() + parseInt(data.expireTime) * 1000).toISOString()
          : undefined,
        size: parseInt(data.size) || 0,
        accessCount: 0, // 后端没有提供访问次数信息
      }

      // 如果后端提供了缓存类型信息，使用后端的信息
      if (data.cacheType) {
        // 将后端的中文缓存类型转换为英文type用于颜色映射
        if (data.cacheType.includes('用户')) {
          detail.type = 'user'
        } else if (data.cacheType.includes('角色')) {
          detail.type = 'role'
        } else if (data.cacheType.includes('资源')) {
          detail.type = 'resource'
        }
      }

      cacheDetail.value = detail
      Message.success('获取缓存详情成功')
    } else {
      console.warn('获取缓存详情失败:', response)
      Message.error(response.message || '缓存不存在或获取失败')
      cacheDetail.value = null
    }

  } catch (error) {
    console.error('获取缓存详情失败:', error)
    Message.error('获取缓存详情失败: ' + (error as Error).message)
    cacheDetail.value = null
  } finally {
    viewCacheLoading.value = false
  }
}

const handleClearSingleCache = async () => {
  if (!cacheDetail.value) {
    Message.error('请先查看缓存')
    return
  }

  clearSingleLoading.value = true

  try {
    console.log('开始清理单个缓存，cacheKey:', cacheDetail.value.key)
    const response = await Service.clearSingleCacheUsingDelete(cacheDetail.value.key)
    console.log('清理单个缓存API响应:', response)

    if (response.code === 200) {
      Message.success('缓存清理成功')
      cacheDetail.value = null
      await fetchCacheStats()
    } else {
      Message.warning(response.message || '缓存清理可能未完全成功')
    }
  } catch (error) {
    console.error('清理缓存失败:', error)
    Message.error('清理缓存失败: ' + (error as Error).message)
  } finally {
    clearSingleLoading.value = false
  }
}

// 数据获取方法
const fetchCacheStats = async () => {
  statsLoading.value = true

  try {
    console.log('开始获取缓存统计信息...')
    const response = await Service.getCacheStatsUsingGet()
    console.log('缓存统计API响应:', response)

    if (response.code === 200 && response.data) {
      // 将后端返回的Map结构转换为前端需要的结构
      const data = response.data as Record<string, any>
      console.log('解析缓存统计数据:', data)

      cacheStats.value = {
        userCacheCount: parseInt(data.userCache?.totalCount) || 0,
        userCacheHitRate: parseFloat(data.userCache?.hitRate?.replace('%', '')) || 0,
        roleCacheCount: parseInt(data.roleCache?.totalCount) || 0,
        roleCacheHitRate: parseFloat(data.roleCache?.hitRate?.replace('%', '')) || 0,
        resourceCacheCount: parseInt(data.resourceCache?.totalCount) || 0,
        resourceCacheHitRate: parseFloat(data.resourceCache?.hitRate?.replace('%', '')) || 0,
        totalHitRate: calculateTotalHitRate(data) || 0,
        memoryUsage: calculateMemoryUsage(data) || 0,
      }

      console.log('转换后的缓存统计:', cacheStats.value)
      Message.success('获取缓存统计成功')
    } else {
      console.warn('缓存统计API返回异常:', response)
      Message.warning(response.message || '获取缓存统计失败，使用默认数据')
      // 如果没有数据，使用模拟数据结构
      const mockData = {
        userCache: { hitCount: '133', totalCount: '156', hitRate: '85.26%', missCount: '23' },
        userPermissionCacheSize: '512000',
        roleCache: { hitCount: '11', totalCount: '12', hitRate: '91.67%', missCount: '1' },
        rolePermissionCacheSize: '256000',
        resourceCache: { hitCount: '70', totalCount: '89', hitRate: '78.65%', missCount: '19' },
        resourcePermissionCacheSize: '1024000'
      }

      cacheStats.value = {
        userCacheCount: parseInt(mockData.userCache.totalCount) || 0,
        userCacheHitRate: parseFloat(mockData.userCache.hitRate.replace('%', '')) || 0,
        roleCacheCount: parseInt(mockData.roleCache.totalCount) || 0,
        roleCacheHitRate: parseFloat(mockData.roleCache.hitRate.replace('%', '')) || 0,
        resourceCacheCount: parseInt(mockData.resourceCache.totalCount) || 0,
        resourceCacheHitRate: parseFloat(mockData.resourceCache.hitRate.replace('%', '')) || 0,
        totalHitRate: calculateTotalHitRate(mockData) || 0,
        memoryUsage: calculateMemoryUsage(mockData) || 0,
      }
    }

  } catch (error) {
    console.error('获取缓存统计失败:', error)
    Message.error('获取缓存统计失败: ' + (error as Error).message)
    // 在错误情况下使用模拟数据结构
    const mockData = {
      userCache: { hitCount: '133', totalCount: '156', hitRate: '85.26%', missCount: '23' },
      userPermissionCacheSize: '512000',
      roleCache: { hitCount: '11', totalCount: '12', hitRate: '91.67%', missCount: '1' },
      rolePermissionCacheSize: '256000',
      resourceCache: { hitCount: '70', totalCount: '89', hitRate: '78.65%', missCount: '19' },
      resourcePermissionCacheSize: '1024000'
    }

    cacheStats.value = {
      userCacheCount: parseInt(mockData.userCache.totalCount) || 0,
      userCacheHitRate: parseFloat(mockData.userCache.hitRate.replace('%', '')) || 0,
      roleCacheCount: parseInt(mockData.roleCache.totalCount) || 0,
      roleCacheHitRate: parseFloat(mockData.roleCache.hitRate.replace('%', '')) || 0,
      resourceCacheCount: parseInt(mockData.resourceCache.totalCount) || 0,
      resourceCacheHitRate: parseFloat(mockData.resourceCache.hitRate.replace('%', '')) || 0,
      totalHitRate: calculateTotalHitRate(mockData) || 0,
      memoryUsage: calculateMemoryUsage(mockData) || 0,
    }
  } finally {
    statsLoading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchCacheStats()
})
</script>

<style scoped lang="less">
.cache-management {
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

  .cache-overview {
    margin-bottom: 24px;

    .cache-suffix {
      color: #666;
      font-size: 14px;
      font-weight: normal;
    }

    .cache-detail {
      margin-top: 8px;
      color: #666;
      font-size: 12px;
    }
  }

  .operation-item {
    h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
    }

    p {
      margin: 0 0 12px 0;
      color: #666;
      font-size: 12px;
    }
  }

  .cache-content {
    .json-content {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      font-size: 12px;
      line-height: 1.4;
      max-height: 300px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
}
</style>
