import request from '@/utils/request'
import type { RoleItem } from '@/types/role'
import type { PageResult } from '@/types/api'

export function getRoleList() {
  return request.get<any, PageResult<RoleItem>>('/roles')
}

export function createRole(data: Partial<RoleItem>) {
  return request.post<any, RoleItem>('/roles', data)
}

export function updateRole(id: number, data: Partial<RoleItem>) {
  return request.put<any, RoleItem>(`/roles/${id}`, data)
}

export function deleteRole(id: number) {
  return request.delete<any, null>(`/roles/${id}`)
}