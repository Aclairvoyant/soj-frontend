import {StoreOptions} from "vuex";
import AccessEnum from "@/access/accessEnum";
import {Service} from "../../generated";
import type { UserPermissionVO } from "../../generated";

// 定义用户状态类型
interface UserState {
    loginUser: {
        userName: string;
        id?: string;
        userRole?: string;
        userAvatar?: string;
        email?: string;
        createTime?: string;
        updateTime?: string;
        roleId?: number;
        permissionVersion?: number;
    };
    userPermissions: UserPermissionVO | null;
    permissionCacheTime: number | null;
    permissionLoading: boolean;
}

export default {
    namespaced: true,
    state: (): UserState => ({
        loginUser: {
            userName: "未登录",
        },
        userPermissions: null,
        permissionCacheTime: null,
        permissionLoading: false,
    }),
    getters: {
        // 检查用户是否登录
        isLoggedIn: (state) => {
            return state.loginUser.userName !== "未登录" && state.loginUser.id;
        },
        
        // 获取用户角色
        getUserRole: (state) => {
            return state.loginUser.userRole || AccessEnum.NOT_LOGIN;
        },
        
        // 检查是否为管理员
        isAdmin: (state) => {
            const role = state.loginUser.userRole;
            return role === AccessEnum.ADMIN || role === AccessEnum.SUPER_ADMIN;
        },
        
        // 检查是否为超级管理员
        isSuperAdmin: (state) => {
            return state.loginUser.userRole === AccessEnum.SUPER_ADMIN;
        },
        
        // 检查用户是否被封禁
        isBanned: (state) => {
            return state.loginUser.userRole === AccessEnum.BAN;
        },
        
        // 获取用户权限信息
        getUserPermissions: (state) => {
            return state.userPermissions;
        },
        
        // 检查权限缓存是否有效（30分钟）
        isPermissionCacheValid: (state) => {
            if (!state.permissionCacheTime) {
                return false;
            }
            const now = Date.now();
            const cacheAge = now - state.permissionCacheTime;
            return cacheAge < 30 * 60 * 1000; // 30分钟
        }
    },
    actions: {
        // 获取登录用户信息
        async getLoginUser({ commit, state, dispatch }, payload) {
            try {
                // 拿到payload信息，如果没有内容，则远程进行请求数据
                if (payload === undefined) {
                    payload = await Service.getLoginUserUsingGet();
                }
                // 从远程请求获取登录信息
                if (payload.code === 200) {
                    const userData = payload.data;
                    commit("updateUser", userData);
                    
                    // 如果用户已登录，自动获取权限信息
                    if (userData && userData.id && userData.userName !== "未登录") {
                        await dispatch("getUserPermissions", { userId: userData.id });
                    }
                }
            } catch (e) {
                console.error("获取用户信息失败:", e);
                commit("updateUser", {
                    ...state.loginUser,
                    userRole: AccessEnum.NOT_LOGIN,
                });
                commit("clearPermissions");
            }
        },
        
        // 获取用户权限信息
        async getUserPermissions({ commit, state, getters }, { userId, forceRefresh = false }) {
            // 检查缓存是否有效
            if (!forceRefresh && getters.isPermissionCacheValid && state.userPermissions) {
                return state.userPermissions;
            }
            
            if (!userId) {
                return null;
            }
            
            try {
                commit("setPermissionLoading", true);
                const response = await Service.getUserPermissionsUsingGet(userId);
                
                if (response.code === 200 && response.data) {
                    commit("updateUserPermissions", response.data);
                    commit("setPermissionCacheTime", Date.now());
                    return response.data;
                }
                
                return null;
            } catch (error) {
                console.error("获取用户权限信息失败:", error);
                return null;
            } finally {
                commit("setPermissionLoading", false);
            }
        },
        
        // 刷新用户权限
        async refreshUserPermissions({ dispatch, state }) {
            if (state.loginUser.id) {
                return await dispatch("getUserPermissions", { 
                    userId: state.loginUser.id, 
                    forceRefresh: true 
                });
            }
            return null;
        },
        
        // 用户登出
        async logout({ commit }) {
            try {
                await Service.userLogoutUsingPost();
            } catch (error) {
                console.error("登出请求失败:", error);
            } finally {
                // 清除用户状态和权限信息
                commit("updateUser", {
                    userName: "未登录",
                });
                commit("clearPermissions");
            }
        },
        
        // 更新用户权限版本（当权限发生变化时调用）
        async updatePermissionVersion({ commit, dispatch, state }, newVersion) {
            if (state.loginUser.permissionVersion !== newVersion) {
                commit("updatePermissionVersion", newVersion);
                // 刷新权限信息
                await dispatch("refreshUserPermissions");
            }
        }
    },
    mutations: {
        updateUser(state, payload) {
            state.loginUser = payload || { userName: "未登录" };
        },
        
        updateUserPermissions(state, permissions: UserPermissionVO) {
            state.userPermissions = permissions;
        },
        
        setPermissionCacheTime(state, time: number) {
            state.permissionCacheTime = time;
        },
        
        setPermissionLoading(state, loading: boolean) {
            state.permissionLoading = loading;
        },
        
        clearPermissions(state) {
            state.userPermissions = null;
            state.permissionCacheTime = null;
            state.permissionLoading = false;
        },
        
        updatePermissionVersion(state, version: number) {
            if (state.loginUser) {
                state.loginUser.permissionVersion = version;
            }
        }
    },
} as StoreOptions<any>
