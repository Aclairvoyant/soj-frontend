import store from "@/store";
import router from "@/router";
import AccessEnum from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";
import {Message} from "@arco-design/web-vue";

router.beforeEach(async (to, from, next) => {
    let loginUser = store.state.user.loginUser;

    //自动登录
    if (!loginUser || !loginUser.userRole) {
        await store.dispatch("user/getLoginUser");
        loginUser = store.state.user.loginUser;
    }

    const needAccess = (to.meta?.access as string) ?? AccessEnum.NOT_LOGIN;

    if (needAccess !== AccessEnum.NOT_LOGIN) {
        //如果没登录，跳转登录页
        if (!loginUser || !loginUser.userRole || loginUser.userRole === AccessEnum.NOT_LOGIN) {
            next(`/user/login?redirect=${to.fullPath}`);
            Message.info("请先登录");
            return;
        }
        //检查权限
        if (!checkAccess(loginUser, needAccess)) {
            next("/noAuth");
            Message.error("您没有权限访问");
            return;
        }
    }

    next();
})
