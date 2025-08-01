import { ref, reactive, computed, watch, nextTick, readonly, type Ref, type ComputedRef } from 'vue'
import { useStore } from 'vuex'
import { Service } from '../../generated'
import type {
  UserPermissionVO,
  PermissionModuleVO,
  PermissionActionVO,
  BaseResponse_UserPermissionVO_,
  BaseResponse_List_PermissionModuleVO_,
  BaseResponse_List_PermissionActionVO_,
  BaseResponse_boolean_
} from '../../generated'

/**
 * 权限缓存管理钩子函数
 * 提供前端权限信息缓存和自动更新功能
 */

// 定义缓存项类型
interface CacheItem<T> {
  data: T
  timestamp: number
  version: number
}

// 定义缓存状态类型
interface CacheState {
  users: Map<string, CacheItem<UserPermissionVO>>
  roles: Map<string, CacheItem<any>>
  modules: CacheItem<PermissionModuleVO[]> | null
  actions: Map<string, CacheItem<PermissionActionVO[]>>
  lastUpdate: Date
  version: number
}

// 定义缓存配置类型
interface CacheConfig {
  userCacheExpire: number
  roleCacheExpire: number
  moduleCacheExpire: number
  autoRefreshInterval: number
  maxCacheSize: number
}

// 定义缓存统计类型
interface CacheStats {
  userCacheSize: number
  roleCacheSize: number
  actionCacheSize: number
  hasModuleCache: boolean
  lastUpdate: Date
  version: number
  config: CacheConfig
}

// 定义缓存类型
type CacheType = 'users' | 'roles' | 'actions' | 'modules'

// 定义权限缓存钩子返回类型
export interface UsePermissionCacheReturn {
  // 状态
  loading: Ref<boolean>
  error: Ref<string | null>
  cache: Readonly<CacheState>
  config: CacheConfig

  // 缓存操作方法
  getUserPermissions: (userId: string, forceRefresh?: boolean) => Promise<UserPermissionVO | null>
  getModuleList: (forceRefresh?: boolean) => Promise<PermissionModuleVO[]>
  getModuleActions: (moduleId: number, forceRefresh?: boolean) => Promise<PermissionActionVO[]>
  clearCache: (cacheType?: CacheType | null) => void
  clearServerCache: () => Promise<void>

  // 缓存管理方法
  preloadCache: () => Promise<void>
  refreshAllCache: () => Promise<void>
  startAutoRefresh: () => void
  stopAutoRefresh: () => void
  getCacheStats: () => CacheStats

  // 工具方法
  isCacheExpired: (cacheItem: CacheItem<any>, expireTime: number) => boolean
  cleanup: () => void
}

export function usePermissionCache(): UsePermissionCacheReturn {
  const store = useStore()

  // 缓存状态
  const cache = reactive<CacheState>({
    users: new Map(),        // 用户权限缓存 userId -> UserPermissionVO
    roles: new Map(),        // 角色权限缓存 roleCode -> RolePermissionVO
    modules: null,           // 权限模块列表缓存
    actions: new Map(),      // 权限操作缓存 moduleId -> ActionPermissionVO[]
    lastUpdate: new Date(),  // 最后更新时间
    version: 1               // 缓存版本号
  })

  // 缓存配置
  const config = reactive<CacheConfig>({
    userCacheExpire: 30 * 60 * 1000,    // 用户权限缓存过期时间：30分钟
    roleCacheExpire: 60 * 60 * 1000,    // 角色权限缓存过期时间：60分钟
    moduleCacheExpire: 24 * 60 * 60 * 1000, // 模块缓存过期时间：24小时
    autoRefreshInterval: 5 * 60 * 1000,  // 自动刷新间隔：5分钟
    maxCacheSize: 1000                   // 最大缓存数量
  })

  // 状态管理
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const autoRefreshTimer = ref<NodeJS.Timeout | null>(null)

  // 获取当前登录用户
  const currentUser = computed(() => store.state.user.loginUser)

  /**
   * 获取用户权限信息（带缓存）
   * @param userId - 用户ID
   * @param forceRefresh - 是否强制刷新
   * @returns 用户权限信息
   */
  const getUserPermissions = async (userId: string, forceRefresh: boolean = false): Promise<UserPermissionVO | null> => {
    const cacheKey = userId
    const cached = cache.users.get(cacheKey)

    // 检查缓存有效性
    if (cached && !forceRefresh && !isCacheExpired(cached, config.userCacheExpire)) {
      return cached.data
    }

    try {
      loading.value = true
      error.value = null

      const response: BaseResponse_UserPermissionVO_ = await Service.getUserPermissionsUsingGet(userId as any)

      if (response.code === 200 && response.data) {
        // 更新缓存
        cache.users.set(cacheKey, {
          data: response.data,
          timestamp: Date.now(),
          version: cache.version
        })

        // 清理过期缓存
        cleanExpiredCache('users', config.userCacheExpire)

        return response.data
      }

      throw new Error('获取用户权限失败')
    } catch (err: any) {
      console.error(`获取用户${userId}权限信息失败:`, err)
      error.value = err.message || '获取用户权限失败'

      // 返回缓存数据（如果存在）
      return cached?.data || null
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取权限模块列表（带缓存）
   * @param forceRefresh - 是否强制刷新
   * @returns 权限模块列表
   */
  const getModuleList = async (forceRefresh: boolean = false): Promise<PermissionModuleVO[]> => {
    // 检查缓存有效性
    if (cache.modules && !forceRefresh && !isCacheExpired(cache.modules, config.moduleCacheExpire)) {
      return cache.modules.data
    }

    try {
      loading.value = true
      error.value = null

      const response: BaseResponse_List_PermissionModuleVO_ = await Service.getModuleListUsingGet()

      if (response.code === 200 && response.data) {
        // 更新缓存
        cache.modules = {
          data: response.data,
          timestamp: Date.now(),
          version: cache.version
        }

        return response.data
      }

      throw new Error('获取权限模块列表失败')
    } catch (err: any) {
      console.error('获取权限模块列表失败:', err)
      error.value = err.message || '获取权限模块列表失败'

      // 返回缓存数据（如果存在）
      return cache.modules?.data || []
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取模块操作列表（带缓存）
   * @param moduleId - 模块ID
   * @param forceRefresh - 是否强制刷新
   * @returns 模块操作列表
   */
  const getModuleActions = async (moduleId: number, forceRefresh: boolean = false): Promise<PermissionActionVO[]> => {
    const cacheKey = moduleId.toString()
    const cached = cache.actions.get(cacheKey)

    // 检查缓存有效性
    if (cached && !forceRefresh && !isCacheExpired(cached, config.moduleCacheExpire)) {
      return cached.data
    }

    try {
      loading.value = true
      error.value = null

      const response: BaseResponse_List_PermissionActionVO_ = await Service.getActionListUsingGet(moduleId as any)

      if (response.code === 200 && response.data) {
        // 更新缓存
        cache.actions.set(cacheKey, {
          data: response.data,
          timestamp: Date.now(),
          version: cache.version
        })

        // 清理过期缓存
        cleanExpiredCache('actions', config.moduleCacheExpire)

        return response.data
      }

      throw new Error('获取模块操作列表失败')
    } catch (err: any) {
      console.error(`获取模块${moduleId}操作列表失败:`, err)
      error.value = err.message || '获取模块操作列表失败'

      // 返回缓存数据（如果存在）
      return cached?.data || []
    } finally {
      loading.value = false
    }
  }

  /**
   * 检查缓存是否过期
   * @param cacheItem - 缓存项
   * @param expireTime - 过期时间（毫秒）
   * @returns 是否过期
   */
  const isCacheExpired = (cacheItem: CacheItem<any>, expireTime: number): boolean => {
    if (!cacheItem || !cacheItem.timestamp) {
      return true
    }

    return Date.now() - cacheItem.timestamp > expireTime
  }

  /**
   * 清理过期缓存
   * @param cacheType - 缓存类型 ('users' | 'roles' | 'actions')
   * @param expireTime - 过期时间（毫秒）
   */
  const cleanExpiredCache = (cacheType: 'users' | 'roles' | 'actions', expireTime: number): void => {
    const cacheMap = cache[cacheType]
    if (!cacheMap || typeof cacheMap.forEach !== 'function') {
      return
    }

    const now = Date.now()
    const expiredKeys: string[] = []

    cacheMap.forEach((value: CacheItem<any>, key: string) => {
      if (isCacheExpired(value, expireTime)) {
        expiredKeys.push(key)
      }
    })

    expiredKeys.forEach(key => {
      cacheMap.delete(key)
    })

    // 如果缓存数量超过限制，删除最老的缓存
    if (cacheMap.size > config.maxCacheSize) {
      const entries = Array.from(cacheMap.entries())
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp)

      const deleteCount = cacheMap.size - config.maxCacheSize
      for (let i = 0; i < deleteCount; i++) {
        cacheMap.delete(entries[i][0])
      }
    }
  }

  /**
   * 清空指定类型的缓存
   * @param cacheType - 缓存类型，不传则清空所有缓存
   */
  const clearCache = (cacheType: CacheType | null = null): void => {
    if (cacheType) {
      if (cache[cacheType] && typeof (cache[cacheType] as any).clear === 'function') {
        (cache[cacheType] as any).clear()
      } else if (cacheType === 'modules') {
        cache.modules = null
      }
    } else {
      // 清空所有缓存
      cache.users.clear()
      cache.roles.clear()
      cache.actions.clear()
      cache.modules = null
      cache.version++
      cache.lastUpdate = new Date()
    }
  }

  /**
   * 预热缓存 - 预加载常用权限信息
   */
  const preloadCache = async (): Promise<void> => {
    try {
      loading.value = true

      // 预加载权限模块列表
      await getModuleList()

      // 预加载当前用户权限信息
      if (currentUser.value && currentUser.value.id) {
        await getUserPermissions(currentUser.value.id)
      }

      console.log('权限缓存预热完成')
    } catch (err: any) {
      console.error('权限缓存预热失败:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 强制刷新所有缓存
   */
  const refreshAllCache = async (): Promise<void> => {
    try {
      loading.value = true

      // 清空缓存
      clearCache()

      // 重新预热缓存
      await preloadCache()

      console.log('权限缓存刷新完成')
    } catch (err: any) {
      console.error('权限缓存刷新失败:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 启动自动刷新机制
   */
  const startAutoRefresh = (): void => {
    if (autoRefreshTimer.value) {
      clearInterval(autoRefreshTimer.value)
    }

    autoRefreshTimer.value = setInterval(async () => {
      try {
        // 只刷新当前用户的权限信息
        if (currentUser.value && currentUser.value.id) {
          await getUserPermissions(currentUser.value.id, true)
        }

        console.log('权限缓存自动刷新完成')
      } catch (err: any) {
        console.error('权限缓存自动刷新失败:', err)
      }
    }, config.autoRefreshInterval)
  }

  /**
   * 停止自动刷新机制
   */
  const stopAutoRefresh = (): void => {
    if (autoRefreshTimer.value) {
      clearInterval(autoRefreshTimer.value)
      autoRefreshTimer.value = null
    }
  }

  /**
   * 获取缓存统计信息
   * @returns 缓存统计
   */
  const getCacheStats = (): CacheStats => {
    return {
      userCacheSize: cache.users.size,
      roleCacheSize: cache.roles.size,
      actionCacheSize: cache.actions.size,
      hasModuleCache: !!cache.modules,
      lastUpdate: cache.lastUpdate,
      version: cache.version,
      config: { ...config }
    }
  }

  /**
   * 清理后端权限缓存
   */
  const clearServerCache = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      const response: BaseResponse_boolean_ = await Service.clearPermissionCacheUsingPost("all")

      if (response.code === 200) {
        // 同时清理前端缓存
        clearCache()
        console.log('服务端权限缓存清理完成')
      } else {
        throw new Error(response.message || '清理服务端权限缓存失败')
      }
    } catch (err: any) {
      console.error('清理服务端权限缓存失败:', err)
      error.value = err.message || '清理服务端权限缓存失败'
    } finally {
      loading.value = false
    }
  }

  // 监听用户登录状态变化
  watch(currentUser, (newUser: any, oldUser: any) => {
    if (newUser && newUser.id !== oldUser?.id) {
      // 用户变更时，预热新用户的缓存
      nextTick(() => {
        preloadCache()
      })
    } else if (!newUser) {
      // 用户退出时，清空缓存
      clearCache()
      stopAutoRefresh()
    }
  }, { immediate: true })

  // 组件销毁时清理定时器
  const cleanup = (): void => {
    stopAutoRefresh()
  }

  return {
    // 状态
    loading,
    error,
    cache: readonly(cache) as Readonly<CacheState>,
    config,

    // 缓存操作方法
    getUserPermissions,
    getModuleList,
    getModuleActions,
    clearCache,
    clearServerCache,

    // 缓存管理方法
    preloadCache,
    refreshAllCache,
    startAutoRefresh,
    stopAutoRefresh,
    getCacheStats,

    // 工具方法
    isCacheExpired,
    cleanup
  }
}

export default usePermissionCache
