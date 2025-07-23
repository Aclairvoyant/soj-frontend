import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import "@arco-design/web-vue/dist/arco.css";
import "@/plugins/axios";
import "@/access/index";
import 'bytemd/dist/index.css';
import "@/theme/index.less";

// 重写 ResizeObserver 以避免错误
if (typeof window !== 'undefined' && window.ResizeObserver) {
  const OriginalResizeObserver = window.ResizeObserver;
  
  window.ResizeObserver = class extends OriginalResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      const wrappedCallback: ResizeObserverCallback = (entries, observer) => {
        try {
          callback(entries, observer);
        } catch (error) {
          // 静默处理 ResizeObserver 错误
          console.warn('ResizeObserver error caught:', error);
        }
      };
      super(wrappedCallback);
    }
  };
}

// 全局错误处理 - 捕获并忽略 ResizeObserver 错误
const isResizeObserverError = (error: any): boolean => {
  return (
    error &&
    (
      (typeof error === 'string' && error.includes('ResizeObserver')) ||
      (error.message && error.message.includes('ResizeObserver')) ||
      (error.name && error.name.includes('ResizeObserver')) ||
      (typeof error === 'string' && error.includes('loop completed with undelivered notifications')) ||
      (error.message && error.message.includes('loop completed with undelivered notifications'))
    )
  );
};

// 捕获 window 错误
window.addEventListener('error', (e: ErrorEvent) => {
  if (isResizeObserverError(e.error) || isResizeObserverError(e.message)) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  }
});

// 捕获未处理的 Promise 错误
window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
  if (isResizeObserverError(e.reason)) {
    e.preventDefault();
    return;
  }
});

const app = createApp(App);

// Vue 全局错误处理
app.config.errorHandler = (err: any, instance: any, info: string) => {
  // 忽略 ResizeObserver 相关错误
  if (isResizeObserverError(err)) {
    return;
  }
  console.error('Vue Global Error:', err, info);
};

// 劫持 console.error 来过滤 ResizeObserver 错误
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // 检查错误信息中是否包含 ResizeObserver 相关内容
  const errorString = args.join(' ');
  if (errorString.includes('ResizeObserver') || 
      errorString.includes('loop completed with undelivered notifications')) {
    return; // 静默处理，不显示错误
  }
  originalConsoleError.apply(console, args);
};

app
    .use(ArcoVue)
    .use(ArcoVueIcon)
    .use(store)
    .use(router)
    .mount("#app");
