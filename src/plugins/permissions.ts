import { App } from 'vue';
import { Store } from 'vuex';
import { usePermission } from '@/hooks/usePermission';

/**
 * 权限管理插件
 * 提供全局的权限检查方法和状态管理集成
 */

// 全局权限检查器
export class PermissionManager {
  private store: Store<any>;
  
  constructor(store: Store<any>) {
    this.store = store;
  }
  
  /**
   * 检查用户是否有指定角色
   * @param roles 角色或角色数组
   * @param logic 逻辑关系
   * @returns 是否有角色
   */
  hasRole(roles: string | string[], logic: 'AND' | 'OR' = 'OR'): boolean {
    const loginUser = this.store.state.user.loginUser;
    if (!loginUser || !loginUser.userRole) {
      return false;
    }
    
    const userRole = loginUser.userRole;
    
    if (typeof roles === 'string') {
      return userRole === roles;
    }
    
    if (Array.isArray(roles)) {
      if (logic === 'AND') {
        return roles.every(role => userRole === role);
      } else {
        return roles.includes(userRole);
      }
    }
    
    return false;
  }
  
  /**
   * 检查用户是否为管理员
   * @returns 是否为管理员
   */
  isAdmin(): boolean {
    return this.store.getters['user/isAdmin'];
  }
  
  /**
   * 检查用户是否为超级管理员
   * @returns 是否为超级管理员
   */
  isSuperAdmin(): boolean {
    return this.store.getters['user/isSuperAdmin'];
  }
  
  /**
   * 检查用户是否已登录
   * @returns 是否已登录
   */
  isLoggedIn(): boolean {
    return this.store.getters['user/isLoggedIn'];
  }
  
  /**
   * 获取当前用户信息
   * @returns 用户信息
   */
  getCurrentUser() {
    return this.store.state.user.loginUser;
  }
  
  /**
   * 获取用户权限信息
   * @returns 权限信息
   */
  getUserPermissions() {
    return this.store.getters['user/getUserPermissions'];
  }
  
  /**
   * 刷新用户权限
   * @returns Promise<void>
   */
  async refreshPermissions(): Promise<void> {
    await this.store.dispatch('user/refreshUserPermissions');
  }
  
  /**
   * 清除权限缓存
   */
  clearPermissionCache(): void {
    this.store.commit('user/clearPermissions');
  }
}

// Vue插件安装函数
export default {
  install(app: App, options: { store: Store<any> }) {
    const permissionManager = new PermissionManager(options.store);
    
    // 注册全局属性
    app.config.globalProperties.$permission = permissionManager;
    
    // 提供inject key
    app.provide('permission', permissionManager);
    
    // 注册全局指令 v-permission
    app.directive('permission', {
      mounted(el: HTMLElement, binding) {
        const { value, modifiers } = binding;
        const hasPermission = permissionManager.hasRole(value, modifiers.and ? 'AND' : 'OR');
        
        if (!hasPermission) {
          el.style.display = 'none';
          el.setAttribute('disabled', 'true');
        }
      },
      updated(el: HTMLElement, binding) {
        const { value, modifiers } = binding;
        const hasPermission = permissionManager.hasRole(value, modifiers.and ? 'AND' : 'OR');
        
        if (!hasPermission) {
          el.style.display = 'none';
          el.setAttribute('disabled', 'true');
        } else {
          el.style.display = '';
          el.removeAttribute('disabled');
        }
      }
    });
    
    // 注册管理员指令 v-admin
    app.directive('admin', {
      mounted(el: HTMLElement, binding) {
        const isAdmin = permissionManager.isAdmin();
        if (!isAdmin) {
          el.style.display = 'none';
        }
      },
      updated(el: HTMLElement, binding) {
        const isAdmin = permissionManager.isAdmin();
        if (!isAdmin) {
          el.style.display = 'none';
        } else {
          el.style.display = '';
        }
      }
    });
    
    // 注册超级管理员指令 v-super-admin
    app.directive('super-admin', {
      mounted(el: HTMLElement, binding) {
        const isSuperAdmin = permissionManager.isSuperAdmin();
        if (!isSuperAdmin) {
          el.style.display = 'none';
        }
      },
      updated(el: HTMLElement, binding) {
        const isSuperAdmin = permissionManager.isSuperAdmin();
        if (!isSuperAdmin) {
          el.style.display = 'none';
        } else {
          el.style.display = '';
        }
      }
    });
  }
};

// TypeScript声明扩展
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $permission: PermissionManager;
  }
}