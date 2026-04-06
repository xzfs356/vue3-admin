import router from './index'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'

// const whiteList = ['/login', '/404']

// router.beforeEach(async (to, _from) => {
//   const userStore = useUserStore()
//   const permissionStore = usePermissionStore()
//   const token = userStore.token

//   if (token) {
//     if (to.path === '/login') {
//       return { path: '/' }
//     }

//     // 判断是否已经加载过路由了
//     const isRoutesLoaded = permissionStore.routes.length > 0
//     if (!isRoutesLoaded) {
//       // 根据角色过滤路由并动态添加
//       const roles = userStore.userInfo?.roles ?? []
//       const accessRoutes = permissionStore.generateRoutes(roles)

//       accessRoutes.forEach(route => router.addRoute(route))

//       // 路由添加完后重新跳转，让新路由生效
//       return { ...to, replace: true }
//     }

//     return true
//   } else {
//     if (whiteList.includes(to.path)) {
//       return true
//     }
//     return { path: '/login', query: { redirect: to.path } }
//   }
// })

const whiteList = ['/login','/404']

router.beforeEach(async(to,_from) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const token = userStore.token

  if(token){
    if(to.path === '/login'){
      return { path: '/'}
    }

    const isRoutesLoaded = permissionStore.routes.length > 0
    if(!isRoutesLoaded){
      const roles = userStore.userInfo?.roles ?? []
      const accessRoutes = permissionStore.generateRoutes(roles)
      accessRoutes.forEach(route => router.addRoute(route))
      return { ...to, replace: true}
    }
    return true
  } else{
    if(whiteList.includes(to.path)){
      return true
    }
    return { path:'/login',query:{ redirect: to.path } }
  }
})