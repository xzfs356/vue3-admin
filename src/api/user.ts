import request from '@/utils/request'
import type { LoginForm, UserListItem } from '@/types/user'
import type { PageResult } from '@/types/api'

// 登录
// export function login(data: LoginForm) {
//   return request.post<any, { token: string; userInfo: any }>('/auth/login', data)
// }

// // 获取用户列表
// export function getUserList(params?: { page?: number; pageSize?: number; keyword?: string }) {
//   return request.get<any, PageResult<UserListItem>>('/users', { params })
// }

// // 新增用户
// export function createUser(data: Partial<UserListItem>) {
//   return request.post<any, UserListItem>('/users', data)
// }

// // 编辑用户
// export function updateUser(id: number, data: Partial<UserListItem>) {
//   return request.put<any, UserListItem>(`/users/${id}`, data)
// }

// // 删除用户
// export function deleteUser(id: number) {
//   return request.delete<any, null>(`/users/${id}`)
// }

export function login(data: LoginForm) {
  return request.post<any, { token: string; userInfo: any }>('/auth/Login', data)
}

export function getUserList(params?: { page?: number; pageSize?: number; keyword?: string }) {
  return request.get<any, PageResult<UserListItem>>('/users', { params })
}

export function createUser(data: Partial<UserListItem>) {
  return request.post<any, UserListItem>('/users', data)
}

export function updateUser(id: number, data: Partial<UserListItem>) {
  return request.put<any, UserListItem>(`/users/${id}`, data)
}

export function deleteUser(id: number) {
  return request.delete<any, null>(`/users/${id}`)
}
export function getAllUsers() {
  return request.get<any, UserListItem[]>('/users/all')
}
