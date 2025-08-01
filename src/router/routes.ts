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
import ProblemSetsView from "@/views/question/ProblemSetsView.vue";
import ManageProblemSetsView from "@/views/question/ManageProblemSetsView.vue";
import MessageCenterView from "@/views/message/MessageCenterView.vue";
import AdminMessageSendView from "@/views/message/AdminMessageSendView.vue";
import AnnouncementListView from "@/views/announcement/AnnouncementListView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import ContestListView from "@/views/contest/ContestListView.vue";
import ContestDetailView from "@/views/contest/ContestDetailView.vue";
import ContestProblemView from "@/views/contest/ContestProblemView.vue";
import ContestRankingView from "@/views/contest/ContestRankingView.vue";
import ContestManageView from "@/views/contest/ContestManageView.vue";
import AddContestView from "@/views/contest/AddContestView.vue";
import ContestSubmissionView from "@/views/contest/ContestSubmissionView.vue";
import AdminMessageSendViewOptimized from "@/views/message/AdminMessageSendViewOptimized.vue";
import AdminMessageSendViewNew from "@/views/message/AdminMessageSendViewNew.vue";
import PermissionManagement from "@/views/permission/PermissionManagement.vue";
import UserManagement from "@/views/permission/UserManagement.vue";
import RoleManagement from "@/views/permission/RoleManagement.vue";
import PermissionConfig from "@/views/permission/PermissionConfig.vue";
import OperationLog from "@/views/permission/OperationLog.vue";
import PermissionChecker from "@/views/permission/PermissionChecker.vue";
import CacheManagement from "@/views/permission/CacheManagement.vue";

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
        path: "/problemSets",
        name: "题单训练",
        component: ProblemSetsView,
    },
    {
        path: "/contests",
        name: "比赛列表",
        component: ContestListView,
    },
    {
        path: "/contest/:id",
        name: "比赛详情",
        component: ContestDetailView,
        props: true,
        meta: {
            hideInMenu: true
        }
    },
    {
        path: "/contest/:contestId/problem/:problemId",
        name: "比赛做题",
        component: ContestProblemView,
        props: true,
        meta: {
            access: AccessEnum.USER,
            hideInMenu: true
        }
    },
    {
        path: "/contest/:id/ranking",
        name: "比赛排名",
        component: ContestRankingView,
        props: true,
        meta: {
            hideInMenu: true
        }
    },
    {
        path: "/contest/:id/submissions",
        name: "比赛提交记录",
        component: ContestSubmissionView,
        props: true,
        meta: {
            hideInMenu: true
        }
    },
    {
        path: "/add/contest",
        name: "创建比赛",
        component: AddContestView,
        meta: {
            access: AccessEnum.ADMIN
        }
    },
    {
        path: "/update/contest",
        name: "更新比赛",
        component: AddContestView,
        meta: {
            access: AccessEnum.ADMIN,
            hideInMenu: true
        }
    },
    {
        path: "/manage/contest",
        name: "管理比赛",
        component: ContestManageView,
        meta: {
            access: AccessEnum.ADMIN
        }
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
        path: "/announcements",
        name: "公告列表",
        component: AnnouncementListView,
        meta: {
          hideInMenu: true
        }
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
        path: "/manage/problemSets",
        name: "题单管理",
        component: ManageProblemSetsView,
        meta: {
            access: AccessEnum.USER
        }
    },
    {
        path: "/message/center",
        name: "消息中心",
        component: MessageCenterView,
        meta: {
            access: AccessEnum.USER,
            hideInMenu: true
        }
    },
    {
        path: "/admin/message/send",
        name: "发送管理消息",
        component: AdminMessageSendViewOptimized,
        meta: {
            access: AccessEnum.ADMIN
        }
    },
    {
        path: "/permission",
        name: "权限管理",
        component: PermissionManagement,
        meta: {
            access: AccessEnum.ADMIN,
            hideInMenu: true
        },
        children: [
            {
                path: "/permission/users",
                name: "用户权限管理",
                component: UserManagement,
                meta: {
                    access: AccessEnum.ADMIN,
                    hideInMenu: true
                }
            },
            {
                path: "/permission/roles",
                name: "角色权限管理",
                component: RoleManagement,
                meta: {
                    access: AccessEnum.ADMIN,
                    hideInMenu: true
                }
            },
            {
                path: "/permission/config",
                name: "权限配置管理",
                component: PermissionConfig,
                meta: {
                    access: AccessEnum.ADMIN,
                    hideInMenu: true
                }
            },
            {
                path: "/permission/logs",
                name: "权限操作日志",
                component: OperationLog,
                meta: {
                    access: AccessEnum.ADMIN,
                    hideInMenu: true
                }
            },
            {
                path: "/permission/checker",
                name: "权限检查工具",
                component: PermissionChecker,
                meta: {
                    access: AccessEnum.ADMIN,
                    hideInMenu: true
                }
            },
            {
                path: "/permission/cache",
                name: "权限缓存管理",
                component: CacheManagement,
                meta: {
                    access: AccessEnum.ADMIN,
                    hideInMenu: true
                }
            }
        ]
    },
    {
        path: "/workplace",
        name: "个人数据总览",
        component: Workplace,
        meta: {
            access: accessEnum.USER,
            hideInMenu: true
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
        component: NoAuthView,
        meta: {
            hideInMenu: true
        }
    },
];
