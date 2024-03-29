import {RouteRecordRaw} from "vue-router";
import HomeView from "@/views/home/HomeView.vue";
import AdminView from "@/views/AdminView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import AccessEnum from "@/access/accessEnum";
import UserLoginIndex from "@/views/user/UserLoginIndex.vue";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import accessEnum from "@/access/accessEnum";
import DoQuestionView from "@/views/question/DoQuestionView.vue";
import AboutView from "@/views/AboutView.vue";
import Workplace from "@/views/workplace/index.vue";
import QuestionSubmitView from "@/views/question/QuestionSubmitView.vue";

export const routes: Array<RouteRecordRaw> = [
    {
        path: "/user",
        name: "用户",
        meta: {
            hideInMenu: true
        },
        children: [
            {
                path: "/user/login",
                name: "登录注册",
                component: UserLoginIndex
            },
        ],
    },
    {
        path: "/",
        name: "首页",
        component: HomeView,
    },
    {
        path: "/questions",
        name: "题目列表",
        component: QuestionsView,
    },
    {
        path: "/add/question",
        name: "创建题目",
        component: AddQuestionView,
        meta: {
            access: AccessEnum.ADMIN
        }
    },
    {
        path: "/update/question",
        name: "更新题目",
        component: AddQuestionView,
        meta: {
            access: accessEnum.ADMIN,
            hideInMenu: true
        },
    },
    {
        path: "/manage/question/",
        name: "管理题目",
        component: ManageQuestionView,
        meta: {
            access: AccessEnum.ADMIN,
        },
    },
    {
        path: "/view/question/:id",
        name: "在线做题",
        component: DoQuestionView,
        props: true,
        meta: {
            access: accessEnum.USER,
            hideInMenu: true
        }
    },
    {
        path: "/question_submit",
        name: "浏览题目提交",
        component: QuestionSubmitView,
    },
    {
        path: "/workplace",
        name: "个人数据总览",
        component: Workplace,
        meta: {
            access: accessEnum.USER,
        }
    },
];
