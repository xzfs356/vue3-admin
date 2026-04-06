import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/api'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import router from '@/router'


// const service: AxiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_BASE_URL,
//   timeout: 10000,
// })

// // 请求拦截器 —— 每个请求自动带上 token
// service.interceptors.request.use(
//   config => {
//     const userStore = useUserStore()
//     if (userStore.token) {
//       config.headers['Authorization'] = `Bearer ${userStore.token}`
//     }
//     return config
//   },
//   error => Promise.reject(error)
// )

// // 响应拦截器 —— 统一处理错误
// service.interceptors.response.use(
//   (response: AxiosResponse<ApiResponse>) => {
//     const { code, message, data } = response.data

//     if (code === 200) {
//       return data
//     }

//     // 业务错误
//     ElMessage.error(message || '请求失败')
//     return Promise.reject(new Error(message))
//   },
//   error => {
//     const status = error.response?.status

//     if (status === 401) {
//       // token 过期，退出登录
//       const userStore = useUserStore()
//       userStore.logout()
//       router.push('/login')
//       ElMessage.error('登录已过期，请重新登录')
//     } else if (status === 403) {
//       ElMessage.error('没有权限访问')
//     } else if (status === 500) {
//       ElMessage.error('服务器错误')
//     } else {
//       ElMessage.error('网络错误，请稍后重试')
//     }

//     return Promise.reject(error)
//   }
// )

// export default service

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
})

service.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization ='Bearer ' + userStore.token
      
    }
    return config
  },
  error => Promise.reject(error)
)

service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code,message,data } = response.data
    if (code === 200){
      return data
    }
    ElMessage.error(message || '请求失败')
    return Promise.reject(new Error(message))
  },
  error => {
    const status = error.response?.status
    if (status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      router.push('/login')
      ElMessage.error('登录已过期，请重新登录')
    } else if (status === 403) {
      ElMessage.error('没有权限访问')
    } else if (status === 500) {
      ElMessage.error('服务器错误')
    } else {
      ElMessage.error('网络错误，请稍后重试')

    }
    return Promise.reject(error)
  }
)
export default service