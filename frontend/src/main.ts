import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';
import { logger } from './utils/logger';

// 引入样式
import 'uno.css';
import './styles/index.css';

// 创建应用实例
const app = createApp(App);

// 使用插件
app.use(createPinia());
app.use(router);

// 注册全局错误处理
app.config.errorHandler = (err, instance, info) => {
  logger.error('App:Global', `Vue Error: ${info}`, {
    error: err,
    component: instance?.$options?.name,
  });
};

// 输出启动日志
logger.info('App:Bootstrap', '应用程序正在启动');

// 挂载应用
app.mount('#app');

// 输出加载完成日志
logger.info('App:Bootstrap', '应用程序加载完成', {
  version: 'Atom Nexus v1.0.0',
  environment: process.env.NODE_ENV,
});
