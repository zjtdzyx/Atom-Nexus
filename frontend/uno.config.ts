import { defineConfig } from 'unocss'
import { presetUno, presetIcons, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle'
      }
    }),
    presetAttributify()
  ],
  theme: {
    colors: {
      // 定义主题色
      primary: {
        DEFAULT: '#4f46e5',
        50: '#eef2ff',
        100: '#e0e7ff',
        200: '#c7d2fe',
        300: '#a5b4fc',
        400: '#818cf8',
        500: '#6366f1',
        600: '#4f46e5',
        700: '#4338ca',
        800: '#3730a3',
        900: '#312e81'
      }
    }
  },
  shortcuts: {
    // 常用组合样式
    'btn': 'px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer',
    'btn-primary': 'btn bg-primary text-white hover:bg-primary-700 active:bg-primary-800',
    'btn-outline': 'btn border border-gray-300 hover:bg-gray-100 active:bg-gray-200',
    'input': 'px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50',
    'card': 'bg-white rounded-xl shadow-md p-4'
  }
}) 