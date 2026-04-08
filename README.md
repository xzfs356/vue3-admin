# Vue3 Admin 后台管理系统

基于 Vue3 + TypeScript + Vite 的后台管理解决方案，实现了完整的 RBAC 权限控制、动态路由、Mock 接口模拟、用户/角色管理等核心功能，并集成了工程化规范与性能优化实践。

## 技术栈

- **框架**：Vue 3 (Composition API)
- **语言**：TypeScript
- **构建工具**：Vite
- **状态管理**：Pinia (持久化存储)
- **路由**：Vue Router (动态路由 + 路由守卫)
- **UI 组件库**：Element Plus 
- **HTTP 请求**：Axios (请求/响应拦截器)
- **Mock 数据**：Mock.js / vite-plugin-mock
- **图表**：ECharts
- **工程化**：ESLint + Prettier + Husky + Commitlint + lint-staged

## 功能特性

### 基础功能
- ✅ **登录认证**：表单验证、Token 存储、登录跳转
- ✅ **路由权限**：动态路由生成、路由守卫、角色过滤
- ✅ **状态管理**：用户信息、权限路由、Pinia 持久化
- ✅ **Axios 封装**：请求/响应拦截、Token 自动注入、统一错误处理
- ✅ **Mock 接口**：模拟登录、用户列表、角色列表等完整 CRUD 接口
- ✅ **全局布局**：侧边栏、顶部导航、面包屑导航
- ✅ **首页看板**：数据统计卡片、ECharts 折线图
- ✅ **用户管理**：分页查询、搜索、增删改查、弹窗表单
- ✅ **角色管理**：角色列表、权限勾选、增删改查

### 工程化规范
- ✅ **Git 提交规范**：Husky + Commitlint，强制使用 Conventional Commits 格式
- ✅ **代码质量**：ESLint + Prettier 自动检查与格式化
- ✅ **提交前检查**：lint-staged 仅对暂存文件运行检查，提升效率

### 进阶特性（已实现/进行中）
- ✅ **动态表单**：通过 JSON 配置驱动表单渲染，支持动态校验（已完成）
- ✅ **虚拟滚动**：优化长列表性能，支持万级数据流畅滚动（已完成）
- ✅ **前端监控 SDK**：封装错误捕获、性能上报模块（已完成）
- 🔄 **权限控制**：基于路由守卫 + 自定义指令实现按钮级权限（已完成）
- 📌 **低代码思想**：配置化渲染，可扩展为可视化搭建工具（规划中）

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发环境

```bash
pnpm dev
```

### 生产构建

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

## 项目结构

```
src/
├── api/          # API 接口
├── assets/       # 静态资源
├── components/   # 通用组件
├── composables/  # 组合式函数 (useTable, useForm)
├── layout/       # 布局组件
├── mock/         # Mock 数据
├── router/       # 路由配置 (动态路由)
├── stores/       # Pinia 状态管理
├── styles/       # 全局样式
├── utils/        # 工具函数 (Axios 封装、监控 SDK)
└── views/        # 页面视图
```

## 在线预览

[https://vue3-admin-eight.vercel.app](https://vue3-admin-eight.vercel.app)（可能需要代理访问）

## 开发总结

- 登录页：表单验证、Token 存储、跳转逻辑
- 路由权限：动态路由、路由守卫、角色过滤
- Pinia 状态管理：用户信息、权限路由、持久化
- Axios 封装：请求拦截、响应拦截、Token 注入、统一错误处理
- Mock 接口：模拟登录、用户列表、角色列表等完整接口
- 全局布局：侧边栏、顶部导航、面包屑
- 首页统计：数据卡片、ECharts 折线图
- 用户管理：分页、搜索、增删改查、弹窗表单
- 角色管理：角色列表、权限勾选、增删改查
- **工程化**：配置 Husky + Commitlint + ESLint + Prettier，保证代码规范
- **性能优化**：虚拟滚动 + 路由懒加载 + 组件异步加载
- **前端监控**：封装错误上报、性能数据收集 SDK

## 待优化

- [ ] 接入真实后端 API
- [ ] 添加单元测试
- [ ] 优化打包体积（代码分割）
- [ ] 完善监控 SDK 的数据分析后台

---

