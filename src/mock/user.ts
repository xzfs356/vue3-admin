import type { MockMethod } from 'vite-plugin-mock'

export default [
  // 登录接口
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: { body: { username: string; password: string } }) => {
      const { username, password } = body

      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          message: 'success',
          data: {
            token: 'mock-token-admin',
            userInfo: {
              id: 1,
              username: 'admin',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
              roles: ['admin'],
              permissions: ['user:add', 'user:edit', 'user:delete'],
            },
          },
        }
      }

      if (username === 'editor' && password === '123456') {
        return {
          code: 200,
          message: 'success',
          data: {
            token: 'mock-token-editor',
            userInfo: {
              id: 2,
              username: 'editor',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor',
              roles: ['editor'],
              permissions: ['user:edit'],
            },
          },
        }
      }

      return {
        code: 401,
        message: '用户名或密码错误',
        data: null,
      }
    },
  },

  // 获取用户列表
  {
    url: '/api/users',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: {
          list: [
            { id: 1, username: 'admin', email: 'admin@test.com', status: 1, role: '管理员', createTime: '2024-01-01 10:00:00' },
            { id: 2, username: 'editor', email: 'editor@test.com', status: 1, role: '编辑', createTime: '2024-01-02 10:00:00' },
            { id: 3, username: 'zhangsan', email: 'zs@test.com', status: 0, role: '普通用户', createTime: '2024-01-03 10:00:00' },
            { id: 4, username: 'lisi', email: 'ls@test.com', status: 1, role: '普通用户', createTime: '2024-01-04 10:00:00' },
          ],
          total: 4,
          page: 1,
          pageSize: 10,
        },
      }
    },
  },

  // 新增用户
  {
    url: '/api/users',
    method: 'post',
    response: ({ body }: { body: any }) => ({
      code: 200,
      message: 'success',
      data: { ...body, id: Date.now(), createTime: new Date().toLocaleString() },
    }),
  },

  // 编辑用户
  {
    url: '/api/users/:id',
    method: 'put',
    response: ({ body }: { body: any }) => ({
      code: 200,
      message: '编辑成功',
      data: body,
    }),
  },

  // 删除用户
  {
    url: '/api/users/:id',
    method: 'delete',
    response: () => ({
      code: 200,
      message: '删除成功',
      data: null,
    }),
  },
] as MockMethod[]