import {RouteRecordRaw} from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AdminView from "@/views/AdminView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import AccessEnum from "@/access/accessEnum";
import UserLayout from "@/layouts/UserLayout.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";

export const routes: Array<RouteRecordRaw> = [
    {
        path: "/user",
        name: "用户",
        meta: {
            hideInMenu: true
        },
        component: UserLayout,
        children: [
            {
                path: "/user/login",
                name: "登录",
                component: UserLoginView
            },
            {
                path: "/user/register",
                name: "注册",
                component: UserRegisterView
            },
        ],
    },
    {
        path: "/",
        name: "题目列表",
        component: HomeView,
    },
    {
        path: "/noAuth",
        name: "NoAuth",
        component: NoAuthView,
    },
    {
        path: "/hide",
        name: "隐藏",
        component: HomeView,
        meta: {
            hideInMenu: true,
        }
    },
    {
        path: "/admin",
        name: "admin",
        component: AdminView,
        meta: {
            access: AccessEnum.ADMIN
        },
    },
    {
        path: "/about",
        name: "关于我的",
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
    },
];
