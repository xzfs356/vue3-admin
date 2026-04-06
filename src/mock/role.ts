import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/roles',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'success',
      data: {
        list: [
          {
            id: 1,
            name: '管理员',
            code: 'admin',
            description: '拥有所有权限',
            permissions: ['user:add', 'user:edit', 'user:delete', 'role:add', 'role:edit', 'role:delete'],
            createTime: '2024-01-01 10:00:00',
          },
          {
            id: 2,
            name: '编辑',
            code: 'editor',
            description: '只能编辑用户',
            permissions: ['user:edit'],
            createTime: '2024-01-02 10:00:00',
          },
          {
            id: 3,
            name: '普通用户',
            code: 'user',
            description: '只读权限',
            permissions: [],
            createTime: '2024-01-03 10:00:00',
          },
        ],
        total: 3,
      },
    }),
  },
  {
    url: '/api/roles',
    method: 'post',
    response: ({ body }: { body: any }) => ({
      code: 200,
      message: '新增成功',
      data: { ...body, id: Date.now(), createTime: new Date().toLocaleString() },
    }),
  },
  {
    url: '/api/roles/:id',
    method: 'put',
    response: ({ body }: { body: any }) => ({
      code: 200,
      message: '编辑成功',
      data: body,
    }),
  },
  {
    url: '/api/roles/:id',
    method: 'delete',
    response: () => ({
      code: 200,
      message: '删除成功',
      data: null,
    }),
  },
] as MockMethod[]