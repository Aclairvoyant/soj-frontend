import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { useStore } from 'vuex'
import { Service } from '../../generated'
import type {
  PermissionCheckRequest,
  PermissionCheckResultVO,
  UserPermissionVO,
  BaseResponse_PermissionCheckResultVO_,
  BaseResponse_UserPermissionVO_
} from '../../generated'

/**
 * 权限检查钩子函数
 * 提供hasPermission和hasRole方法用于前端权限控制
 */

// 定义角色类型
export type UserRole = 'super_admin' | 'admin' | 'user' | 'ban'

// 定义逻辑关系类型
export type LogicType = 'AND' | 'OR'

// 定义权限检查请求类型
export interface PermissionRequest {
  action: string
  resourceType?: string
  resourceId?: string
}

// 定义资源上下文类型
export interface ResourceContext {
  resourceType: string
  resourceId: string
}

// 定义权限检查返回类型
export interface UsePermissionReturn {
  // 状态
  loading: Ref<boolean>
  error: Ref<string | null>
  currentUser: ComputedRef<any>
  userPermissions: Ref<UserPermissionVO | null>

  // 方法
  hasRole: (roles: UserRole | UserRole[], logic?: LogicType) => boolean
  hasPermission: (permissions: string | string[], logic?: LogicType, resourceContext?: ResourceContext | null) => Promise<boolean>
  hasModulePermission: (moduleCode: string, actions: string | string[], logic?: LogicType) => Promise<boolean>
  hasResourcePermission: (moduleCode: string, action: string, resourceType: string, resourceId: string) => Promise<boolean>
  batchCheckPermissions: (permissionRequests: PermissionRequest[]) => Promise<boolean[]>
  getUserPermissions: (forceRefresh?: boolean) => Promise<UserPermissionVO | null>
  clearPermissionCache: () => void

  // 便捷计算属性
  isAdmin: ComputedRef<boolean>
  isSuperAdmin: ComputedRef<boolean>
  isUser: ComputedRef<boolean>
  isBanned: ComputedRef<boolean>
}

export function usePermission(): UsePermissionReturn {
  const store = useStore()
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // 获取当前登录用户信息
  const currentUser = computed(() => store.state.user.loginUser)

  // 获取用户权限信息（缓存版本）
  const userPermissions = ref<UserPermissionVO | null>(null)

  /**
   * 检查用户是否具有指定角色
   * @param roles - 角色代码或角色代码数组
   * @param logic - 逻辑关系 'AND' | 'OR'，默认为 'OR'
   * @returns 是否具有角色
   */
  const hasRole = (roles: UserRole | UserRole[], logic: LogicType = 'OR'): boolean => {
    if (!currentUser.value || !currentUser.value.userRole) {
      return false
    }

    const userRole = currentUser.value.userRole as UserRole
    if (!roles) {
      return true
    }

    // 处理单个角色
    if (typeof roles === 'string') {
      return userRole === roles
    }

    // 处理角色数组
    if (Array.isArray(roles)) {
      if (logic === 'AND') {
        // 所有角色都必须匹配（通常不太实用，因为用户只有一个角色）
        return roles.every(role => userRole === role)
      } else {
        // 任一角色匹配即可
        return roles.includes(userRole)
      }
    }

    return false
  }

  /**
   * 检查用户是否具有指定权限
   * @param permissions - 权限代码或权限代码数组（格式：moduleCode:actionCode）
   * @param logic - 逻辑关系 'AND' | 'OR'，默认为 'AND'
   * @param resourceContext - 资源上下文，包含resourceType和resourceId
   * @returns 是否具有权限
   */
  const hasPermission = async (
    permissions: string | string[],
    logic: LogicType = 'AND',
    resourceContext: ResourceContext | null = null
  ): Promise<boolean> => {
    if (!currentUser.value || !currentUser.value.id) {
      return false
    }

    if (!permissions) {
      return true
    }

    try {
      loading.value = true
      error.value = null

      // 处理单个权限
      if (typeof permissions === 'string') {
        const result = await checkSinglePermission(permissions, resourceContext)
        return result
      }

      // 处理权限数组
      if (Array.isArray(permissions)) {
        const results = await Promise.all(
          permissions.map(permission => checkSinglePermission(permission, resourceContext))
        )

        if (logic === 'AND') {
          return results.every(result => result)
        } else {
          return results.some(result => result)
        }
      }

      return false
    } catch (err: any) {
      console.error('权限检查失败:', err)
      error.value = err.message || '权限检查失败'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 检查单个权限
   * @param permission - 权限代码（格式：moduleCode:actionCode）
   * @param resourceContext - 资源上下文
   * @returns 是否具有权限
   */
  const checkSinglePermission = async (
    permission: string,
    resourceContext: ResourceContext | null = null
  ): Promise<boolean> => {
    const request: PermissionCheckRequest = {
      userId: currentUser.value.id,
      action: permission,
      resourceType: resourceContext?.resourceType || undefined,
      resourceId: resourceContext?.resourceId as any || undefined
    }

    const response: BaseResponse_PermissionCheckResultVO_ = await Service.checkUserPermissionUsingPost(request)

    if (response.code === 200 && response.data) {
      return response.data.hasPermission || false
    }

    return false
  }

  /**
   * 批量检查权限
   * @param permissionRequests - 权限检查请求数组
   * @returns 权限检查结果数组
   */
  const batchCheckPermissions = async (permissionRequests: PermissionRequest[]): Promise<boolean[]> => {
    if (!currentUser.value || !currentUser.value.id) {
      return permissionRequests.map(() => false)
    }

    try {
      loading.value = true
      error.value = null

      const results = await Promise.all(
        permissionRequests.map(async (request) => {
          const fullRequest: PermissionCheckRequest = {
            userId: currentUser.value.id,
            action: request.action,
            resourceType: request.resourceType || undefined,
            resourceId: request.resourceId as any|| undefined
          }

          const response: BaseResponse_PermissionCheckResultVO_ = await Service.checkUserPermissionUsingPost(fullRequest)
          return response.code === 200 && response.data ? (response.data.hasPermission || false) : false
        })
      )

      return results
    } catch (err: any) {
      console.error('批量权限检查失败:', err)
      error.value = err.message || '批量权限检查失败'
      return permissionRequests.map(() => false)
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取用户完整权限信息
   * @param forceRefresh - 是否强制刷新
   * @returns 用户权限信息
   */
  const getUserPermissions = async (forceRefresh = false): Promise<UserPermissionVO | null> => {
    if (!currentUser.value || !currentUser.value.id) {
      return null
    }

    // 如果已有缓存且不强制刷新，直接返回
    if (userPermissions.value && !forceRefresh) {
      return userPermissions.value
    }

    try {
      loading.value = true
      error.value = null

      const response: BaseResponse_UserPermissionVO_ = await Service.getUserPermissionsUsingGet(currentUser.value.id)

      if (response.code === 200 && response.data) {
        userPermissions.value = response.data
        return response.data
      }

      return null
    } catch (err: any) {
      console.error('获取用户权限信息失败:', err)
      error.value = err.message || '获取用户权限信息失败'
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 检查用户是否具有模块权限
   * @param moduleCode - 模块代码
   * @param actions - 动作代码或动作代码数组
   * @param logic - 逻辑关系 'AND' | 'OR'，默认为 'OR'
   * @returns 是否具有模块权限
   */
  const hasModulePermission = async (
    moduleCode: string,
    actions: string | string[],
    logic: LogicType = 'OR'
  ): Promise<boolean> => {
    if (!moduleCode || !actions) {
      return false
    }

    const actionList = Array.isArray(actions) ? actions : [actions]
    const permissions = actionList.map(action => `${moduleCode}:${action}`)

    return hasPermission(permissions, logic)
  }

  /**
   * 检查用户是否具有资源权限
   * @param moduleCode - 模块代码
   * @param action - 动作代码
   * @param resourceType - 资源类型
   * @param resourceId - 资源ID
   * @returns 是否具有资源权限
   */
  const hasResourcePermission = async (
    moduleCode: string,
    action: string,
    resourceType: string,
    resourceId: string
  ): Promise<boolean> => {
    const permission = `${moduleCode}:${action}`
    const resourceContext: ResourceContext = {
      resourceType,
      resourceId
    }

    return hasPermission(permission, 'AND', resourceContext)
  }

  /**
   * 检查是否为管理员（admin或super_admin）
   * @returns 是否为管理员
   */
  const isAdmin = computed((): boolean => {
    return hasRole(['admin', 'super_admin'], 'OR')
  })

  /**
   * 检查是否为超级管理员
   * @returns 是否为超级管理员
   */
  const isSuperAdmin = computed((): boolean => {
    return hasRole('super_admin')
  })

  /**
   * 检查是否为普通用户
   * @returns 是否为普通用户
   */
  const isUser = computed((): boolean => {
    return hasRole('user')
  })

  /**
   * 检查是否被封禁
   * @returns 是否被封禁
   */
  const isBanned = computed((): boolean => {
    return hasRole('ban')
  })

  /**
   * 清空权限缓存
   */
  const clearPermissionCache = (): void => {
    userPermissions.value = null
  }

  return {
    // 状态
    loading,
    error,
    currentUser,
    userPermissions,

    // 方法
    hasRole,
    hasPermission,
    hasModulePermission,
    hasResourcePermission,
    batchCheckPermissions,
    getUserPermissions,
    clearPermissionCache,

    // 便捷计算属性
    isAdmin,
    isSuperAdmin,
    isUser,
    isBanned
  }
}

export default usePermission
