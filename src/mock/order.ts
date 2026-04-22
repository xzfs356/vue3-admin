import type { MockMethod } from 'vite-plugin-mock'
import type { OrderStatus } from '@/types/order'

const statuses: OrderStatus[] = ['pending', 'paid', 'shipped', 'completed', 'cancelled']
const products = ['苹果 iPhone 15', '小米14 Pro', '华为 Mate60', 'iPad Pro', 'MacBook Air']
const users = ['张三', '李四', '王五', '赵六', '陈七']

const orders = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  orderNo: `ORD${String(Date.now()).slice(-8)}${i}`,
  username: users[i % 5],
  productName: products[i % 5],
  amount: parseFloat((Math.random() * 9000 + 100).toFixed(2)),
  status: statuses[i % 5],
  address: `广东省深圳市南山区科技园${i + 1}号`,
  createTime: `2024-0${(i % 9) + 1}-01 10:00:00`,
}))

export default [
  {
    url: '/api/orders',
    method: 'get',
    response: ({ query }: { query: any }) => {
      const { page = 1, pageSize = 10, keyword = '', status = '' } = query
      let list = [...orders]
      if (keyword)
        list = list.filter((o) => o.orderNo.includes(keyword) || o.username.includes(keyword))
      if (status) list = list.filter((o) => o.status === status)
      const start = (page - 1) * pageSize
      return {
        code: 200,
        message: 'success',
        data: {
          list: list.slice(start, start + Number(pageSize)),
          total: list.length,
        },
      }
    },
  },
  {
    url: '/api/orders/:id/status',
    method: 'put',
    response: ({ body }: { body: any }) => ({
      code: 200,
      message: '状态更新成功',
      data: body,
    }),
  },
] as MockMethod[]
