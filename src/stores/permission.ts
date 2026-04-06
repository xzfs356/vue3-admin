import { defineStore } from 'pinia'
import { ref } from 'vue'
import { asyncRoutes, constantRoutes } from '@/router'
import type { RouteRecordRaw } from 'vue-router'


// 判断当前角色是否有权限访问该路由
// function hasPermission(roles: string[], route: RouteRecordRaw): boolean {
//   if (route.meta?.roles) {
//     return roles.some(role => route.meta!.roles!.includes(role))
//   }
//   // 没有设置 roles 的路由，默认所有人都能访问
//   return true
// }
function hasPermission(roles: string[], route:RouteRecordRaw): boolean{
  if(route.meta?.roles){
    return roles.some(role => route.meta!.roles!.includes(role))
  }else{
    return true
  }
}

// 递归过滤出当前角色有权限的路由
// function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
//   return routes.reduce<RouteRecordRaw[]>((acc, route) => {
//     if (hasPermission(roles, route)) {
//       const tmp = { ...route }
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       acc.push(tmp)
//     }
//     return acc
//   }, [])
// }

function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]):RouteRecordRaw[] {
  return routes.reduce<RouteRecordRaw[]>((acc,route) => {
    if(hasPermission(roles,route)){
      const tmp = { ...route }
      if(tmp.children){
        tmp.children = filterAsyncRoutes(tmp.children,roles)
      }
      acc.push(tmp)
    }
    return acc
  }, [])
}

// export const usePermissionStore = defineStore('permission', () => {
//   const routes = ref<RouteRecordRaw[]>([])

//   function generateRoutes(roles: string[]) {
//     const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
//     routes.value = constantRoutes.concat(accessedRoutes)
//     return accessedRoutes
//   }

//   return { routes, generateRoutes }
// })
export const usePermissionStore = defineStore('permission', () => {
  const routes = ref<RouteRecordRaw[]>([])
  function generateRoutes(roles: string[]): RouteRecordRaw[] {
    const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    routes.value =[...constantRoutes,...accessedRoutes]
    return accessedRoutes
  }

  return{routes,generateRoutes}
})