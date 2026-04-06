//当前登录人的个人信息 + 权限
export interface UserInfo {
  id: number
  username: string
  avatar: string
  roles: string[]
  permissions: string[]
}

//登录表单数据
export interface LoginForm {
  username: string
  password: string
  remember: boolean
}

//用户管理表格每一行的数据
export interface UserListItem {
  id: number
  username: string
  email: string
  status: 0 | 1
  role: string
  createTime: string
}