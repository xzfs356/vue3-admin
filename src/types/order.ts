export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'

export interface OrderItem {
  id: number
  orderNo: string
  username: string
  productName: string
  amount: number
  status: OrderStatus
  address: string
  createTime: string
}

export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; type: string }> = {
  pending: { label: '待付款', type: 'warning' },
  paid: { label: '已付款', type: 'primary' },
  shipped: { label: '已发货', type: 'success' },
  completed: { label: '已完成', type: 'info' },
  cancelled: { label: '已取消', type: 'danger' },
}
