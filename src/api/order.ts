import request from '@/utils/request'
import type { OrderItem, OrderStatus } from '@/types/order'
import type { PageResult } from '@/types/api'

export function getOrderList(params?: {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
}) {
  return request.get<any, PageResult<OrderItem>>('/orders', { params })
}

export function updateOrderStatus(id: number, status: OrderStatus) {
  return request.put<any, null>(`/orders/${id}/status`, { status })
}
