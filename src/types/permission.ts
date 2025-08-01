// 权限管理相关的TypeScript类型定义
// 扩展生成的API类型，提供更友好的前端使用接口

import type {
  UserPermissionVO,
  ModulePermissionVO,
  ActionPermissionVO,
  PermissionModuleVO,
  PermissionActionVO,
  RoleManagementVO,
  PermissionCheckRequest,
  PermissionCheckResultVO,
  UserRoleUpdateRequest,
  BatchRoleUpdateRequest,
  RoleAddRequest,
  RoleUpdateRequest,
  RolePermissionConfigRequest
} from '../../generated'

// ==================== 扩展用户权限类型 ====================

/**
 * 扩展用户权限视图对象
 */
export interface ExtendedUserPermissionVO extends UserPermissionVO {
  // 添加便捷属性
  isAdmin?: boolean
  isSuperAdmin?: boolean
  isBanned?: boolean
  permissionCodes?: string[]
  lastUpdated?: Date
}

/**
 * 用户权限查询参数
 */
export interface UserPermissionQueryParams {
  pageNum?: number
  pageSize?: number
  keyword?: string
  roleCode?: string
  status?: 'active' | 'inactive' | 'banned'
  sortField?: 'createTime' | 'updateTime' | 'userName' | 'roleLevel'
  sortOrder?: 'asc' | 'desc'
  startTime?: string
  endTime?: string
}

/**
 * 用户权限查询结果
 */
export interface UserPermissionQueryResult {
  list: ExtendedUserPermissionVO[]
  total: number
  pageNum: number
  pageSize: number
  pages: number
}

// ==================== 角色管理类型 ====================

/**
 * 扩展角色管理视图对象
 */
export interface ExtendedRoleManagementVO extends RoleManagementVO {
  // 添加扩展属性
  userCount?: number
  permissionCount?: number
  isBuiltIn?: boolean
  canEdit?: boolean
  canDelete?: boolean
}

/**
 * 角色查询参数
 */
export interface RoleQueryParams {
  keyword?: string
  status?: 'active' | 'inactive'
  sortField?: 'roleLevel' | 'createTime' | 'roleName'
  sortOrder?: 'asc' | 'desc'
  includeUserCount?: boolean
}

/**
 * 角色权限树节点
 */
export interface RolePermissionTreeNode {
  key: string
  title: string
  children?: RolePermissionTreeNode[]
  isLeaf?: boolean
  disabled?: boolean
  moduleId?: number
  actionId?: number
  moduleCode?: string
  actionCode?: string
}

// ==================== 权限配置类型 ====================

/**
 * 权限模块树节点
 */
export interface PermissionModuleTreeNode {
  id: number
  moduleName: string
  moduleCode: string
  parentId: number
  moduleLevel: number
  sortOrder: number
  children?: PermissionModuleTreeNode[]
  actions?: PermissionActionVO[]
  expanded?: boolean
  selected?: boolean
}

/**
 * 权限选择器选项
 */
export interface PermissionSelectorOption {
  label: string
  value: string
  children?: PermissionSelectorOption[]
  disabled?: boolean
  moduleId?: number
  actionId?: number
}

/**
 * 权限配置表单数据
 */
export interface PermissionConfigFormData {
  roleId: number
  permissions: string[]
  description?: string
}

// ==================== 操作日志类型 ====================

/**
 * 操作日志查询参数
 */
export interface OperationLogQueryParams {
  pageNum?: number
  pageSize?: number
  operationType?: string
  operatorName?: string
  targetType?: 'user' | 'role' | 'permission'
  targetName?: string
  result?: 0 | 1 // 0:失败, 1:成功
  startTime?: string
  endTime?: string
  sortField?: 'createTime' | 'operationType' | 'operatorName'
  sortOrder?: 'asc' | 'desc'
}

/**
 * 操作日志导出参数
 */
export interface OperationLogExportParams {
  operationType?: string
  operatorName?: string
  targetType?: string
  targetName?: string
  result?: number
  startTime?: string
  endTime?: string
  format?: 'excel' | 'csv'
  filename?: string
}

/**
 * 操作日志统计数据
 */
export interface OperationLogStatistics {
  totalCount: number
  successCount: number
  failureCount: number
  operationTypes: {
    type: string
    count: number
    successRate: number
  }[]
  timeRange: {
    start: string
    end: string
    dailyStats: {
      date: string
      count: number
      successCount: number
    }[]
  }
}

// ==================== 批量操作类型 ====================

/**
 * 批量权限操作请求
 */
export interface BatchPermissionOperationRequest {
  userIds: number[]
  operation: 'change_role' | 'grant_permission' | 'revoke_permission' | 'ban_user' | 'unban_user'
  roleCode?: string
  permissions?: string[]
  reason?: string
  expireTime?: string
}

/**
 * 批量操作结果
 */
export interface BatchOperationResult {
  taskId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  totalCount: number
  successCount: number
  failureCount: number
  errors?: {
    userId: number
    userName: string
    error: string
  }[]
  progress: number
  startTime: string
  endTime?: string
}

// ==================== 权限检查类型 ====================

/**
 * 扩展权限检查请求
 */
export interface ExtendedPermissionCheckRequest extends PermissionCheckRequest {
  // 添加便捷字段
  moduleCode?: string
  actionCode?: string
  description?: string
}

/**
 * 扩展权限检查结果
 */
export interface ExtendedPermissionCheckResultVO extends PermissionCheckResultVO {
  // 添加详细信息
  roleCode?: string
  roleLevelRequired?: number
  currentRoleLevel?: number
  missingPermissions?: string[]
  suggestedActions?: string[]
}

/**
 * 批量权限检查请求
 */
export interface BatchPermissionCheckRequest {
  userId: number
  permissions: {
    action: string
    resourceType?: string
    resourceId?: number
    description?: string
  }[]
}

/**
 * 批量权限检查结果
 */
export interface BatchPermissionCheckResult {
  userId: number
  results: {
    action: string
    hasPermission: boolean
    reason?: string
    resourceType?: string
    resourceId?: number
  }[]
  summary: {
    total: number
    granted: number
    denied: number
  }
}

// ==================== 缓存管理类型 ====================

/**
 * 权限缓存统计信息
 */
export interface PermissionCacheStatistics {
  userCacheSize: number
  roleCacheSize: number
  moduleCacheSize: number
  actionCacheSize: number
  hitRate: number
  missRate: number
  lastClearTime?: string
  cacheVersion: number
}

/**
 * 缓存配置
 */
export interface PermissionCacheConfig {
  userCacheExpire: number
  roleCacheExpire: number
  moduleCacheExpire: number
  autoRefreshInterval: number
  maxCacheSize: number
  enablePreload: boolean
}

// ==================== 表单验证类型 ====================

/**
 * 用户角色更新表单
 */
export interface UserRoleUpdateForm {
  userId: number
  roleCode: string
  reason: string
  effectiveTime?: string
  expireTime?: string
}

/**
 * 角色创建/更新表单
 */
export interface RoleForm {
  roleName: string
  roleCode: string
  roleLevel: number
  description?: string
  permissions: string[]
  status: 0 | 1
}

/**
 * 权限配置表单
 */
export interface PermissionConfigForm {
  moduleCode: string
  moduleName: string
  actions: {
    actionCode: string
    actionName: string
    selected: boolean
  }[]
}

// ==================== 工具类型 ====================

/**
 * API响应包装类型
 */
export interface ApiResponse<T = any> {
  code: number
  data?: T
  message?: string
  timestamp?: number
}

/**
 * 分页响应类型
 */
export interface PageResponse<T = any> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
  pages: number
  hasNext: boolean
  hasPrevious: boolean
}

/**
 * 排序参数类型
 */
export interface SortParams {
  field: string
  order: 'asc' | 'desc'
}

/**
 * 时间范围参数类型
 */
export interface TimeRangeParams {
  startTime?: string
  endTime?: string
}

/**
 * 权限操作常量
 */
export const PERMISSION_ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  AUDIT: 'audit',
  EXPORT: 'export',
  IMPORT: 'import'
} as const

/**
 * 角色级别常量
 */
export const ROLE_LEVELS = {
  BAN: 1,
  USER: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4
} as const

/**
 * 操作类型常量
 */
export const OPERATION_TYPES = {
  CREATE_USER: 'create_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',
  CHANGE_ROLE: 'change_role',
  GRANT_PERMISSION: 'grant_permission',
  REVOKE_PERMISSION: 'revoke_permission',
  CREATE_ROLE: 'create_role',
  UPDATE_ROLE: 'update_role',
  DELETE_ROLE: 'delete_role',
  CONFIG_PERMISSION: 'config_permission'
} as const

// 导出所有类型
export type {
  // 从生成的模型中重新导出
  UserPermissionVO,
  ModulePermissionVO,
  ActionPermissionVO,
  PermissionModuleVO,
  PermissionActionVO,
  RoleManagementVO,
  PermissionCheckRequest,
  PermissionCheckResultVO,
  UserRoleUpdateRequest,
  BatchRoleUpdateRequest,
  RoleAddRequest,
  RoleUpdateRequest,
  RolePermissionConfigRequest
}
