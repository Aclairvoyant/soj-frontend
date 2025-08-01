/**
 *  权限定义（支持四角色系统）
 */
const AccessEnum = {
    NOT_LOGIN: "notLogin", //未登录
    USER: "user", //普通用户
    ADMIN: "admin", //管理员
    SUPER_ADMIN: "super_admin", //超级管理员
    BAN: "ban", //封禁用户
};

/**
 * 角色级别定义（数字越大权限越高）
 */
export const RoleLevel = {
    [AccessEnum.BAN]: 0,        // 封禁用户
    [AccessEnum.NOT_LOGIN]: 1,  // 未登录
    [AccessEnum.USER]: 2,       // 普通用户
    [AccessEnum.ADMIN]: 3,      // 管理员
    [AccessEnum.SUPER_ADMIN]: 4, // 超级管理员
};

/**
 * 检查角色等级
 * @param userRole 用户角色
 * @param requiredRole 需要的角色
 * @returns 是否满足权限要求
 */
export const hasRoleLevel = (userRole: string, requiredRole: string): boolean => {
    const userLevel = RoleLevel[userRole] || 0;
    const requiredLevel = RoleLevel[requiredRole] || 0;
    return userLevel >= requiredLevel;
};

export default AccessEnum;
