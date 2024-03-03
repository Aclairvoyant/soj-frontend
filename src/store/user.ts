import {StoreOptions} from "vuex";
import AccessEnum from "@/access/accessEnum";
import {UserControllerService} from "../../generated";

export default {
    namespaced: true,
    state: () => ({
        loginUser: {
            userName: "未登录",
        },
    }),
    actions: {
        // 获取登录用户信息
        async getLoginUser({ commit, state }, payload) {
            try {
                //拿到payload信息，如果没有内容，则远程进行请求数据
                if (payload === undefined) {
                    payload = await UserControllerService.getLoginUserUsingGet();
                }
                // 从远程请求获取登录信息
                if (payload.code === 200) {
                    commit("updateUser", payload.data);
                }
            } catch (e) {
                commit("updateUser", {
                    ...state.loginUser,
                    userRole: AccessEnum.NOT_LOGIN,
                });
            }
        },
    },
    mutations: {
        updateUser(state, payload) {
            state.loginUser = payload;
        },
    },
} as StoreOptions<any>
