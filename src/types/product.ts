export interface ProductItem {
  id: number
  name: string
  price: number
  stock: number
  category: string
  cover: string
  status: 0 | 1 // 0 下架 1 上架
  createTime: string
}
