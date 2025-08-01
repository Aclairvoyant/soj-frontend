import AccessEnum from "@/access/accessEnum"

/**
 * 检查权限
 * @param loginUser 当前登录用户
 * @param needAccess 需要的权限
 * @returns 是否有权限
 */
const checkAccess = (loginUser: any, needAccess = AccessEnum.NOT_LOGIN) => {
    // 获取当前登录用户的权限
    const loginUserAccess = loginUser?.userRole ?? AccessEnum.NOT_LOGIN;
    
    if (needAccess === AccessEnum.NOT_LOGIN) {
        return true;
    }

    // 需要登录才能访问
    if (needAccess === AccessEnum.USER) {
        // 用户登录了就可以访问
        if (loginUserAccess === AccessEnum.NOT_LOGIN) {
            return false;
        }
    }

    // 需要管理员权限才能访问
    if (needAccess === AccessEnum.ADMIN) {
        // 支持新的四角色系统：admin 和 super_admin 都有管理员权限
        if (loginUserAccess !== AccessEnum.ADMIN && loginUserAccess !== 'super_admin') {
            return false;
        }
    }
    
    return true;
};

/**
 * 检查用户角色权限（支持新的四角色系统）
 * @param loginUser 当前登录用户
 * @param requiredRoles 需要的角色（可以是字符串或数组）
 * @param logic 逻辑关系 'AND' | 'OR'，默认为 'OR'
 * @returns 是否有权限
 */
export const checkRoleAccess = (
    loginUser: any, 
    requiredRoles: string | string[], 
    logic: 'AND' | 'OR' = 'OR'
): boolean => {
    if (!loginUser || !loginUser.userRole) {
        return false;
    }

    const userRole = loginUser.userRole as string;
    
    // 如果没有要求特定角色，则允许访问
    if (!requiredRoles) {
        return true;
    }

    // 处理单个角色
    if (typeof requiredRoles === 'string') {
        return userRole === requiredRoles;
    }

    // 处理角色数组
    if (Array.isArray(requiredRoles)) {
        if (logic === 'AND') {
            // 所有角色都必须匹配（通常不太实用，因为用户只有一个角色）
            return requiredRoles.every(role => userRole === role);
        } else {
            // 任一角色匹配即可
            return requiredRoles.includes(userRole);
        }
    }

    return false;
};

/**
 * 检查用户是否为管理员（admin 或 super_admin）
 * @param loginUser 当前登录用户
 * @returns 是否为管理员
 */
export const isAdminUser = (loginUser: any): boolean => {
    return checkRoleAccess(loginUser, ['admin', 'super_admin'], 'OR');
};

/**
 * 检查用户是否为超级管理员
 * @param loginUser 当前登录用户
 * @returns 是否为超级管理员
 */
export const isSuperAdminUser = (loginUser: any): boolean => {
    return checkRoleAccess(loginUser, 'super_admin');
};

/**
 * 检查用户是否被封禁
 * @param loginUser 当前登录用户
 * @returns 是否被封禁
 */
export const isBannedUser = (loginUser: any): boolean => {
    return checkRoleAccess(loginUser, 'ban');
};

export default checkAccess;
