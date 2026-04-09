import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
  },
  {
    rules: {
      // 关闭组件名多单词校验
      'vue/multi-word-component-names': 'off',

      // 👇 允许使用 any（你最需要的）
      '@typescript-eslint/no-explicit-any': 'off',

      // 👇 允许定义变量但不使用（解决你封装hook的问题）
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
])
