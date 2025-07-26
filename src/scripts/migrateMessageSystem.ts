// 消息系统迁移脚本
import { MessageAPI } from '../services/api/MessageAPI';
import { messageWebSocket } from '../services/websocket/EnhancedWebSocketManager';
import messageModule from '../store/modules/message-optimized';

interface MigrationConfig {
  // 是否备份现有数据
  backupExisting: boolean;
  // 是否清理旧数据
  cleanupOld: boolean;
  // 是否测试新功能
  testNewFeatures: boolean;
  // 迁移步骤控制
  steps: {
    updateStore: boolean;
    updateComponents: boolean;
    updateRoutes: boolean;
    testWebSocket: boolean;
    testAPI: boolean;
  };
}

class MessageSystemMigration {
  private config: MigrationConfig;
  private results: {
    success: boolean;
    errors: string[];
    warnings: string[];
    migrated: {
      store: boolean;
      components: boolean;
      routes: boolean;
      websocket: boolean;
      api: boolean;
    };
  };

  constructor(config: Partial<MigrationConfig> = {}) {
    this.config = {
      backupExisting: true,
      cleanupOld: false,
      testNewFeatures: true,
      steps: {
        updateStore: true,
        updateComponents: true,
        updateRoutes: true,
        testWebSocket: true,
        testAPI: true
      },
      ...config
    };

    this.results = {
      success: false,
      errors: [],
      warnings: [],
      migrated: {
        store: false,
        components: false,
        routes: false,
        websocket: false,
        api: false
      }
    };
  }

  /**
   * 执行完整迁移
   */
  async migrate(): Promise<typeof this.results> {
    console.log('🚀 开始消息系统迁移...');

    try {
      // 步骤1: 备份现有数据
      if (this.config.backupExisting) {
        await this.backupExistingData();
      }

      // 步骤2: 更新Vuex Store
      if (this.config.steps.updateStore) {
        await this.updateVuexStore();
      }

      // 步骤3: 测试API连接
      if (this.config.steps.testAPI) {
        await this.testAPIConnections();
      }

      // 步骤4: 测试WebSocket连接
      if (this.config.steps.testWebSocket) {
        await this.testWebSocketConnection();
      }

      // 步骤5: 验证新功能
      if (this.config.testNewFeatures) {
        await this.testNewFeatures();
      }

      // 步骤6: 清理旧数据（可选）
      if (this.config.cleanupOld) {
        await this.cleanupOldData();
      }

      this.results.success = true;
      console.log('✅ 消息系统迁移完成！');

    } catch (error) {
      this.results.errors.push(`迁移失败: ${error}`);
      console.error('❌ 消息系统迁移失败:', error);
    }

    return this.results;
  }

  /**
   * 备份现有数据
   */
  private async backupExistingData(): Promise<void> {
    console.log('📦 备份现有消息数据...');

    try {
      // 这里可以实现备份逻辑
      // 例如导出现有消息到本地存储或文件
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupKey = `message_backup_${timestamp}`;

      // 备份到localStorage（实际项目中可能需要更复杂的备份方案）
      const existingData = {
        messages: localStorage.getItem('messages') || '[]',
        unreadCounts: localStorage.getItem('unreadCounts') || '{}',
        settings: localStorage.getItem('messageSettings') || '{}'
      };

      localStorage.setItem(backupKey, JSON.stringify(existingData));
      console.log(`✅ 数据已备份到: ${backupKey}`);

    } catch (error) {
      this.results.warnings.push(`备份数据时出现警告: ${error}`);
      console.warn('⚠️ 备份数据时出现问题:', error);
    }
  }

  /**
   * 更新Vuex Store
   */
  private async updateVuexStore(): Promise<void> {
    console.log('🔄 更新Vuex Store...');

    try {
      // 检查新store模块是否正确导入
      if (!messageModule.namespaced) {
        throw new Error('新的消息Store模块未正确配置');
      }

      // 验证actions和mutations
      const requiredActions = [
        'loadMessages', 'loadUnreadCounts', 'markAsRead',
        'deleteMessage', 'initWebSocket'
      ];
      const requiredMutations = [
        'SET_MESSAGES', 'SET_UNREAD_COUNTS', 'UPDATE_MESSAGE',
        'SET_WS_CONNECTED'
      ];

      for (const action of requiredActions) {
        if (!messageModule.actions?.[action]) {
          throw new Error(`缺少必需的action: ${action}`);
        }
      }

      for (const mutation of requiredMutations) {
        if (!messageModule.mutations?.[mutation]) {
          throw new Error(`缺少必需的mutation: ${mutation}`);
        }
      }

      this.results.migrated.store = true;
      console.log('✅ Vuex Store更新成功');

    } catch (error) {
      this.results.errors.push(`Store更新失败: ${error}`);
      throw error;
    }
  }

  /**
   * 测试API连接
   */
  private async testAPIConnections(): Promise<void> {
    console.log('🔗 测试API连接...');

    try {
      // 测试获取消息列表
      const messagesResponse = await MessageAPI.getMessages({
        pageNum: 1,
        pageSize: 1
      });

      if (messagesResponse.code !== 0) {
        throw new Error(`消息列表API测试失败: ${messagesResponse.message}`);
      }

      // 测试获取未读数量
      const unreadResponse = await MessageAPI.getUnreadCount();
      if (unreadResponse.code !== 0) {
        throw new Error(`未读数量API测试失败: ${unreadResponse.message}`);
      }

      // 测试获取推送设置
      const settingsResponse = await MessageAPI.getPushSettings();
      if (settingsResponse.code !== 0) {
        this.results.warnings.push('推送设置API可能不可用');
      }

      this.results.migrated.api = true;
      console.log('✅ API连接测试成功');

    } catch (error) {
      this.results.errors.push(`API测试失败: ${error}`);
      throw error;
    }
  }

  /**
   * 测试WebSocket连接
   */
  private async testWebSocketConnection(): Promise<void> {
    console.log('🔌 测试WebSocket连接...');

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.results.warnings.push('WebSocket连接超时，但不影响其他功能');
        resolve();
      }, 10000); // 10秒超时

      messageWebSocket.on('connected', () => {
        clearTimeout(timeout);
        this.results.migrated.websocket = true;
        console.log('✅ WebSocket连接测试成功');
        resolve();
      });

      messageWebSocket.on('connectionError', (error) => {
        clearTimeout(timeout);
        this.results.warnings.push(`WebSocket连接问题: ${error}`);
        resolve(); // 不要因为WebSocket问题阻止迁移
      });

      // 尝试连接
      try {
        messageWebSocket.connectGeneral();
      } catch (error) {
        clearTimeout(timeout);
        this.results.warnings.push(`WebSocket连接失败: ${error}`);
        resolve();
      }
    });
  }

  /**
   * 测试新功能
   */
  private async testNewFeatures(): Promise<void> {
    console.log('🧪 测试新功能...');

    try {
      // 测试消息工具函数
      const { formatMessageTime, getMessageTypeText } = await import('../utils/messageUtils');

      // 基本功能测试
      const timeFormatTest = formatMessageTime(new Date().toISOString());
      if (!timeFormatTest) {
        throw new Error('时间格式化功能异常');
      }

      const typeTextTest = getMessageTypeText('SYSTEM_ANNOUNCEMENT' as any);
      if (!typeTextTest) {
        throw new Error('消息类型文本获取功能异常');
      }

      // 测试桌面通知权限
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'denied') {
          this.results.warnings.push('用户拒绝了桌面通知权限');
        }
      }

      console.log('✅ 新功能测试完成');

    } catch (error) {
      this.results.errors.push(`新功能测试失败: ${error}`);
      throw error;
    }
  }

  /**
   * 清理旧数据
   */
  private async cleanupOldData(): Promise<void> {
    console.log('🧹 清理旧数据...');

    try {
      // 清理localStorage中的旧数据
      const keysToRemove = [
        'old_messages',
        'old_unread_counts',
        'old_message_settings'
      ];

      keysToRemove.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(`🗑️ 已清理: ${key}`);
        }
      });

      console.log('✅ 旧数据清理完成');

    } catch (error) {
      this.results.warnings.push(`清理旧数据时出现问题: ${error}`);
    }
  }

  /**
   * 回滚迁移
   */
  async rollback(): Promise<void> {
    console.log('🔄 开始回滚迁移...');

    try {
      // 查找最新的备份
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith('message_backup_'))
        .sort()
        .reverse();

      if (backupKeys.length === 0) {
        throw new Error('没有找到备份数据');
      }

      const latestBackup = localStorage.getItem(backupKeys[0]);
      if (!latestBackup) {
        throw new Error('备份数据已损坏');
      }

      const backupData = JSON.parse(latestBackup);

      // 恢复数据
      if (backupData.messages) {
        localStorage.setItem('messages', backupData.messages);
      }
      if (backupData.unreadCounts) {
        localStorage.setItem('unreadCounts', backupData.unreadCounts);
      }
      if (backupData.settings) {
        localStorage.setItem('messageSettings', backupData.settings);
      }

      console.log('✅ 迁移回滚完成');

    } catch (error) {
      console.error('❌ 迁移回滚失败:', error);
      throw error;
    }
  }

  /**
   * 生成迁移报告
   */
  generateReport(): string {
    const report = `
# 消息系统迁移报告

## 迁移状态: ${this.results.success ? '✅ 成功' : '❌ 失败'}

## 迁移详情:
- Store更新: ${this.results.migrated.store ? '✅' : '❌'}
- API测试: ${this.results.migrated.api ? '✅' : '❌'}
- WebSocket测试: ${this.results.migrated.websocket ? '✅' : '⚠️'}
- 组件更新: ${this.results.migrated.components ? '✅' : '❌'}
- 路由更新: ${this.results.migrated.routes ? '✅' : '❌'}

## 错误信息:
${this.results.errors.length > 0 ? 
  this.results.errors.map(error => `- ❌ ${error}`).join('\n') : 
  '无错误'}

## 警告信息:
${this.results.warnings.length > 0 ? 
  this.results.warnings.map(warning => `- ⚠️ ${warning}`).join('\n') : 
  '无警告'}

## 后续步骤:
1. 更新路由配置，添加新的消息管理页面
2. 在全局布局中集成MessageCenter组件
3. 更新现有组件以使用新的API
4. 测试所有消息相关功能
5. 部署到测试环境进行完整测试

生成时间: ${new Date().toLocaleString()}
    `.trim();

    return report;
  }
}

// 导出迁移工具
export default MessageSystemMigration;

// 便捷函数
export async function quickMigration(): Promise<void> {
  const migration = new MessageSystemMigration({
    backupExisting: true,
    cleanupOld: false,
    testNewFeatures: true
  });

  const result = await migration.migrate();

  if (!result.success) {
    console.error('迁移失败，详细信息:', result.errors);
    console.log('生成迁移报告:');
    console.log(migration.generateReport());
    throw new Error('消息系统迁移失败');
  }

  console.log('🎉 消息系统迁移成功完成！');
  console.log(migration.generateReport());
}

// 在浏览器控制台中可以直接调用的函数
(window as any).migrateMessageSystem = quickMigration;
