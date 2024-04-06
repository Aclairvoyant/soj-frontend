import {RouteRecordRaw} from "vue-router";
import HomeView from "@/views/home/HomeView.vue";
import AccessEnum from "@/access/accessEnum";
import UserLoginIndex from "@/views/user/UserLoginIndex.vue";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import accessEnum from "@/access/accessEnum";
import DoQuestionView from "@/views/question/DoQuestionView.vue";
import Workplace from "@/views/workplace/index.vue";
import QuestionSubmitView from "@/views/question/QuestionSubmitView.vue";
import AddAnnouncementView from "@/views/announcement/AddAnnouncementView.vue";
import ManageAnnouncementView from "@/views/announcement/ManageAnnouncementView.vue";
import PostDetailView from "@/views/post/PostDetailView.vue";
import AddPostView from "@/views/post/AddPostView.vue";

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
        path: "/add/post",
        name: "发布帖子",
        component: AddPostView,
        meta: {
            access: AccessEnum.USER
        }
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
        path: "/add/announcement",
        name: "添加公告",
        component: AddAnnouncementView,
        meta: {
            access: accessEnum.ADMIN
        }
    },
    {
        path: "/manage/announcement/",
        name: "管理公告",
        component: ManageAnnouncementView,
        meta: {
            access: accessEnum.ADMIN
        }
    },
    {
        path: "/update/announcement",
        name: "更新公告",
        component: AddAnnouncementView,
        meta: {
            access: accessEnum.ADMIN,
            hideInMenu: true
        },
    },
    {
        path: "/workplace",
        name: "个人数据总览",
        component: Workplace,
        meta: {
            access: accessEnum.USER,
        }
    },
    {
        path: "/post/:postId",
        name: "PostDetail",
        props: true,
        component: PostDetailView,
        meta: {
            hideInMenu: true
        }
    },
    {
        path: "/:pathMatch(.*)*",
        name: "404",
        redirect: {name: "首页"},
        meta: {
            hideInMenu: true
        }
    },
];
