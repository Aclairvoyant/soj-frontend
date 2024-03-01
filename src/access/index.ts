import store from "@/store";
import router from "@/router";
import AccessEnum from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";

router.beforeEach(async (to, from, next) => {
    const loginUser = store.state.user.loginUser;

    //自动登录
    if (!loginUser || !loginUser.userRole) {
        await store.dispatch("user/getLoginUser");
    }

    const needAccess = (to.meta?.access as string) ?? AccessEnum.NOT_LOGIN;

    if (needAccess !== AccessEnum.NOT_LOGIN) {
        //如果没登录，跳转登录页
        if (!loginUser || !loginUser.userRole) {
            next(`/user/login?redirect=${to.fullPath}`);
            return;
        }
        //检查权限
        if (!checkAccess(loginUser, needAccess)) {
            next("/noAuth");
            return;
        }
    }

    next();
})
