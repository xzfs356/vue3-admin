import request from '@/utils/request'
import type { ProductItem } from '@/types/product'
import type { PageResult } from '@/types/api'

export function getProductList(params?: {
  page?: number
  pageSize?: number
  keyword?: string
  category?: string
}) {
  return request.get<any, PageResult<ProductItem>>('/products', { params })
}

export function createProduct(data: Partial<ProductItem>) {
  return request.post<any, ProductItem>('/products', data)
}

export function updateProduct(id: number, data: Partial<ProductItem>) {
  return request.put<any, ProductItem>(`/products/${id}`, data)
}

export function deleteProduct(id: number) {
  return request.delete<any, null>(`/products/${id}`)
}
