const {defineConfig} = require("@vue/cli-service");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
module.exports = defineConfig({
    transpileDependencies: true,
    // 引入monaco代码编辑器组件
    chainWebpack(config) {
        config.plugin("monaco").use(new MonacoWebpackPlugin());
    },
    devServer: {
        client: {
            overlay: {
                errors: true,
                warnings: false,
                runtimeErrors: (error) => {
                    // 过滤掉 ResizeObserver 错误
                    const ignoreErrors = [
                        'ResizeObserver loop limit exceeded',
                        'ResizeObserver loop completed with undelivered notifications',
                        'Non-Error promise rejection captured'
                    ];
                    
                    if (ignoreErrors.some(ignoreError => 
                        error.message && error.message.includes(ignoreError))) {
                        return false;
                    }
                    
                    return true;
                }
            }
        }
    }
});
