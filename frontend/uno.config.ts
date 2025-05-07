import { defineConfig } from 'unocss';
import { presetUno, presetIcons, presetAttributify } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetAttributify(),
  ],
  theme: {
    colors: {
      // 主题色系
      primary: '#1e1e2f', // 深太空蓝
      neon: '#00e0d1', // 霓虹青绿
      violet: '#9b4dca', // 紫罗兰
      metal: '#b1b3b8', // 钛金属银
      darkbg: '#121212', // 深灰色背景
      textlight: '#ffffff', // 白色文字
      textgray: '#e0e0e0', // 浅灰文字
    },
    fontFamily: {
      sans: ['Inter', 'Satoshi', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      'main-title': '48px',
      'sub-title': '32px',
      body: '16px',
    },
    maxWidth: {
      content: '1200px',
    },
  },
  shortcuts: {
    // 按钮
    btn: 'px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer',
    'btn-primary':
      'btn bg-neon text-white hover:bg-primary active:transform active:scale-98 active:translate-y-0.5',
    'btn-secondary':
      'btn bg-metal text-primary hover:bg-violet hover:text-white active:transform active:scale-98 active:translate-y-0.5',

    // 输入框
    input:
      'px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-neon/50',

    // 卡片组件
    card: 'bg-white/10 backdrop-blur-sm rounded-xl shadow-md p-4',

    // 布局
    container: 'mx-auto px-4 max-w-content',

    // 导航栏
    navbar:
      'fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-md transition-all duration-300',
    'nav-link': 'px-3 py-2 text-textgray hover:text-textlight transition-colors duration-200',

    // 文本样式
    title: 'text-main-title font-bold text-textlight',
    subtitle: 'text-sub-title font-medium text-textlight',
    text: 'text-body text-textgray',
  },
});
