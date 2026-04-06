import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 静态路由（不需要权限，任何人都能访问）
export const constantRoutes:RouteRecordRaw[] = [
  {
    path: '/login',
    name:'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title:'登录',hidden:true}
  },
   {
    path: '/404',
    name:'404',
    component: () => import('@/views/404.vue'),
    meta: { title:'404',hidden:true}
  }
]

// 动态路由（需要权限才能访问，后面权限管理会用到）
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'House', roles: ['admin', 'editor'] },
      },
    ],
  },
  {
    path: '/user',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'User',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '用户管理', icon: 'User', roles: ['admin'] },
      },
    ],
  },
  {
    path: '/role',
    component: () => import('@/layout/index.vue'),
    children:[{
      path:'',
      name:'Role',
      component:() => import('@/views/role/index.vue'),
      meta:{title:'角色管理',icon:'Lock',roles:['admin']}
    }]
  },
  // {
  //   path: '/role',
  //   component: () => import('@/layout/index.vue'),
  //   children: [
  //     {
  //       path: '',
  //       name: 'Role',
  //       component: () => import('@/views/role/index.vue'),
  //       meta: { title: '角色管理', icon: 'Lock', roles: ['admin'] },
  //     },
  //   ],
  // },
  // 放在最后，匹配所有未知路由跳转 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes, // 初始只挂载静态路由
  scrollBehavior: () => ({ top: 0 }), // 跳转页面后滚动到顶部
})

// 新增：重置路由方法（退出登录时用）
export function resetRouter() {
  asyncRoutes.forEach(route => {
    if (route.name && router.hasRoute(route.name)) {
      router.removeRoute(route.name)
    }
  })
}


export default router