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

    //需要登录才能访问
    if (needAccess === AccessEnum.USER) {
        //用户登录了就可以访问
        if (loginUserAccess === AccessEnum.NOT_LOGIN) {
            return false;
        }
    }

    //需要管理员权限才能访问
    if (needAccess === AccessEnum.ADMIN) {
        //检查权限
        if (loginUserAccess !== AccessEnum.ADMIN) {
            return false;
        }
    }
    return true;
};

export default checkAccess;
