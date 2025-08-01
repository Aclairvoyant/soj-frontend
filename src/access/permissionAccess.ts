import AccessEnum, { RoleLevel, hasRoleLevel } from "@/access/accessEnum";
import { usePermission } from "@/hooks/usePermission";

/**
 * 基于权限系统的访问检查器
 * 支持角色检查和权限代码检查
 */

export interface PermissionAccessConfig {
  // 角色要求（兼容原有系统）
  roles?: string | string[];
  // 权限代码要求（新权限系统）
  permissions?: string | string[];
  // 逻辑关系
  logic?: 'AND' | 'OR';
  // 是否需要登录
  requireLogin?: boolean;
}

/**
 * 检查用户是否有访问权限
 * @param loginUser 当前登录用户
 * @param config 权限配置
 * @returns 是否有访问权限
 */
export const checkPermissionAccess = async (
  loginUser: any,
  config: PermissionAccessConfig
): Promise<boolean> => {
  const { roles, permissions, logic = 'OR', requireLogin = false } = config;

  // 检查是否需要登录
  if (requireLogin && (!loginUser || loginUser.userName === '未登录')) {
    return false;
  }

  // 如果没有具体要求，则允许访问
  if (!roles && !permissions) {
    return true;
  }

  // 检查角色权限
  if (roles) {
    const roleCheck = checkRolePermission(loginUser, roles, logic);
    if (permissions) {
      // 如果同时有角色和权限要求
      const permissionCheck = await checkPermissionCodes(loginUser, permissions, logic);
      return logic === 'AND' ? (roleCheck && permissionCheck) : (roleCheck || permissionCheck);
    }
    return roleCheck;
  }

  // 只检查权限代码
  if (permissions) {
    return await checkPermissionCodes(loginUser, permissions, logic);
  }

  return false;
};

/**
 * 检查角色权限
 * @param loginUser 当前登录用户
 * @param roles 需要的角色
 * @param logic 逻辑关系
 * @returns 是否有角色权限
 */
export const checkRolePermission = (
  loginUser: any,
  roles: string | string[],
  logic: 'AND' | 'OR' = 'OR'
): boolean => {
  if (!loginUser || !loginUser.userRole) {
    return false;
  }

  const userRole = loginUser.userRole as string;

  // 处理单个角色
  if (typeof roles === 'string') {
    return userRole === roles;
  }

  // 处理角色数组
  if (Array.isArray(roles)) {
    if (logic === 'AND') {
      return roles.every(role => userRole === role);
    } else {
      return roles.includes(userRole);
    }
  }

  return false;
};

/**
 * 检查权限代码（异步）
 * @param loginUser 当前登录用户
 * @param permissions 权限代码
 * @param logic 逻辑关系
 * @returns 是否有权限
 */
export const checkPermissionCodes = async (
  loginUser: any,
  permissions: string | string[],
  logic: 'AND' | 'OR' = 'OR'
): Promise<boolean> => {
  if (!loginUser || !loginUser.id) {
    return false;
  }

  try {
    // 使用权限钩子检查权限
    const { hasPermission } = usePermission();
    return await hasPermission(permissions, logic);
  } catch (error) {
    console.error('权限检查失败:', error);
    return false;
  }
};

/**
 * 检查用户是否为管理员级别（admin 或 super_admin）
 * @param loginUser 当前登录用户
 * @returns 是否为管理员级别
 */
export const isAdminLevel = (loginUser: any): boolean => {
  return checkRolePermission(loginUser, ['admin', 'super_admin'], 'OR');
};

/**
 * 检查用户是否为超级管理员
 * @param loginUser 当前登录用户
 * @returns 是否为超级管理员
 */
export const isSuperAdmin = (loginUser: any): boolean => {
  return checkRolePermission(loginUser, 'super_admin');
};

/**
 * 检查用户角色级别是否满足要求
 * @param loginUser 当前登录用户
 * @param requiredRole 需要的角色
 * @returns 是否满足角色级别要求
 */
export const checkRoleLevel = (loginUser: any, requiredRole: string): boolean => {
  if (!loginUser || !loginUser.userRole) {
    return false;
  }
  return hasRoleLevel(loginUser.userRole, requiredRole);
};

/**
 * 路由权限检查器（兼容现有系统）
 * @param loginUser 当前登录用户
 * @param routeMeta 路由元信息
 * @returns 是否有访问权限
 */
export const checkRouteAccess = async (loginUser: any, routeMeta?: any): Promise<boolean> => {
  if (!routeMeta) {
    return true;
  }

  const config: PermissionAccessConfig = {
    requireLogin: !!routeMeta.access && routeMeta.access !== AccessEnum.NOT_LOGIN,
  };

  // 转换原有的access配置
  if (routeMeta.access) {
    config.roles = routeMeta.access;
  }

  // 支持新的权限配置
  if (routeMeta.permissions) {
    config.permissions = routeMeta.permissions;
    config.logic = routeMeta.permissionLogic || 'OR';
  }

  return await checkPermissionAccess(loginUser, config);
};

export default checkPermissionAccess;