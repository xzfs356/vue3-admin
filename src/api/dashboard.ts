import request from '@/utils/request'

export interface StatsData {
  userCount: number
  orderCount: number
  revenue: number
  visitCount: number
}

export interface TrendData {
  months: string[]
  users: number[]
  orders: number[]
}

export function getStats() {
  return request.get<any, StatsData>('/dashboard/stats')
}

export function getTrend() {
  return request.get<any, TrendData>('/dashboard/trend')
}