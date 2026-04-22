import type { MockMethod } from 'vite-plugin-mock'

const products = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name:
    [
      '苹果 iPhone 15',
      '小米14 Pro',
      '华为 Mate60',
      'iPad Pro',
      'MacBook Air',
      'AirPods Pro',
      '索尼耳机 WH1000XM5',
      '戴尔显示器',
      '罗技鼠标',
      '机械键盘',
    ][i % 10] + (i >= 10 ? '（新款）' : ''),
  price: parseFloat((Math.random() * 9000 + 100).toFixed(2)),
  stock: Math.floor(Math.random() * 500),
  category: ['手机', '电脑', '平板', '配件', '耳机'][i % 5],
  cover: `https://api.dicebear.com/7.x/shapes/svg?seed=${i}`,
  status: i % 4 === 0 ? 0 : 1,
  createTime: `2024-0${(i % 9) + 1}-01 10:00:00`,
}))

export default [
  {
    url: '/api/products',
    method: 'get',
    response: ({ query }: { query: any }) => {
      const { page = 1, pageSize = 10, keyword = '', category = '' } = query
      let list = [...products]
      if (keyword) list = list.filter((p) => p.name.includes(keyword))
      if (category) list = list.filter((p) => p.category === category)
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
    url: '/api/products',
    method: 'post',
    response: ({ body }: { body: any }) => ({
      code: 200,
      message: '新增成功',
      data: { ...body, id: Date.now(), createTime: new Date().toLocaleString() },
    }),
  },
  {
    url: '/api/products/:id',
    method: 'put',
    response: ({ body }: { body: any }) => ({
      code: 200,
      message: '编辑成功',
      data: body,
    }),
  },
  {
    url: '/api/products/:id',
    method: 'delete',
    response: () => ({
      code: 200,
      message: '删除成功',
      data: null,
    }),
  },
] as MockMethod[]
