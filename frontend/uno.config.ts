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
      // Atom Nexus 主题色系
      primary: '#050A1F', // 深太空蓝 
      neon: '#0CFFE1', // 霓虹青绿
      violet: '#8A2BE2', // 紫罗兰
      metal: '#E0E5EC', // 钛金属银
      darkbg: '#0A1128', // 深色背景
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
    extend: {
      boxShadow: {
        'neon': '0 0 10px rgba(12, 255, 225, 0.5)',
        'violet': '0 0 10px rgba(138, 43, 226, 0.5)',
        'orbit': '0 0 20px rgba(12, 255, 225, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orbit': 'orbit 15s linear infinite',
        'orbit-reverse': 'orbit 20s linear infinite reverse',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(12, 255, 225, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(12, 255, 225, 0.8)' },
        },
      },
    },
  },
  shortcuts: {
    // 按钮
    btn: 'px-4 py-2 rounded-full transition-all duration-200 cursor-pointer',
    'btn-primary': 'btn bg-gradient-to-r from-neon to-violet text-white hover:shadow-neon active:transform active:scale-98 active:translate-y-0.5',
    'btn-secondary': 'btn border border-neon/30 text-neon hover:bg-neon/10 hover:shadow-neon active:transform active:scale-98 active:translate-y-0.5',
    'btn-outline': 'btn bg-transparent border border-neon/50 text-neon hover:border-neon hover:bg-neon/5 active:transform active:scale-98',
    
    // 输入框
    input: 'px-4 py-2 rounded-full bg-primary/80 border border-neon/30 text-textlight focus:outline-none focus:border-neon focus:shadow-neon',
    
    // 卡片组件
    card: 'bg-primary/80 backdrop-blur-sm border border-neon/10 rounded-xl shadow-md transition-all duration-300 hover:border-neon/20',
    'card-glow': 'card hover:shadow-neon',
    'card-atom': 'card relative overflow-hidden',
    
    // 布局
    container: 'mx-auto px-4 max-w-content',
    
    // 导航栏
    navbar: 'fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-md border-b border-neon/10 transition-all duration-300',
    'nav-link': 'px-3 py-2 text-textgray hover:text-neon transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neon after:opacity-0 after:transition-all hover:after:opacity-100',
    
    // 文本样式
    title: 'text-main-title font-bold text-textlight bg-clip-text text-transparent bg-gradient-to-r from-neon to-violet',
    subtitle: 'text-sub-title font-medium text-textlight',
    text: 'text-body text-textgray',
    
    // Atom 组件样式
    'atom-core': 'w-4 h-4 rounded-full bg-neon shadow-neon animate-pulse-slow',
    'atom-orbit': 'absolute border border-neon/20 rounded-full animate-orbit',
    'atom-orbit-inner': 'w-16 h-16 atom-orbit border-neon/30',
    'atom-orbit-outer': 'w-24 h-24 atom-orbit animate-orbit-reverse',
    'atom-particle': 'absolute w-1.5 h-1.5 rounded-full bg-violet shadow-violet',
    
    // 网络连接线
    'nexus-line': 'absolute bg-gradient-to-r from-neon/50 to-transparent h-px animate-pulse-slow',
  },
});
