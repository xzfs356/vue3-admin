import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/dashboard/stats',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'success',
      data: {
        userCount: 1284,
        orderCount: 5678,
        revenue: 98765,
        visitCount: 23456,
      },
    }),
  },
  {
    url: '/api/dashboard/trend',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'success',
      data: {
        months: ['1月', '2月', '3月', '4月', '5月', '6月'],
        users: [820, 932, 901, 934, 1290, 1284],
        orders: [2100, 3200, 2800, 4100, 4800, 5678],
      },
    }),
  },
] as MockMethod[]