import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo } from '@/types/user'
import { resetRouter } from '@/router'

export const useUserStore = defineStore('user', () => {
  // const token = ref<string>(localStorage.getItem('token') || '')
  const token = ref<string>(localStorage.getItem('token') || '')

  // 从 localStorage 恢复 userInfo
  const stored = localStorage.getItem('userInfo')
  const userInfo = ref<UserInfo | null>(stored ? JSON.parse(stored) : null)

  // function setToken(val: string) {
  //   token.value = val
  //   localStorage.setItem('token', val)
  // }
  function setToken(val: string) {
    token.value = val
    localStorage.setItem('token', val)
  }

  function setUserInfo(info: UserInfo) {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info)) // 👈 持久化
  }

  // function logout() {
  //   token.value = ''
  //   userInfo.value = null
  //   localStorage.removeItem('token')
  //   localStorage.removeItem('userInfo') // 👈 清掉
  //   resetRouter()
  // }
  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    resetRouter()
  }

  return { token, userInfo, setToken, setUserInfo, logout }
})