import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string        // 页面标题
    icon?: string         // 菜单图标
    roles?: string[]      // 哪些角色可以访问
    hidden?: boolean      // 是否在菜单中隐藏
    keepAlive?: boolean   // 是否缓存页面
  }
}