export interface IRequest {
  inProgress: boolean
  messages: string
  ok: boolean
}

export interface CurrentUser {
  uid: string
  createdAt: string
  updatedAt: string
  token?: string
}

export interface User {
  id?: string
  uid?: string
  email: string
  firstName: string
  lastName: string
  document?: string
  password: string
  phone: number
  phone2?: number
  address?: string
  cp?: number
  province?: string
  city?: string
  role: string
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export interface InventoryItem {
  id: string
  title: string
  description: string
  price: number
  units: number
  images?: string[]
}

export interface Category {
  id: string
  categoryName: string
}

export interface Subcategory {
  id: string
  subcategoryName: string
}
