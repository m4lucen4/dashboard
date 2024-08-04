export interface IRequest {
  inProgress: boolean
  messages: string
  ok: boolean
}

export interface CurrentUser {
  uid: string
  language?: string
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
  language: string
  createdAt?: string
  updatedAt?: string
}

export interface SpecialPrice {
  dates: string[]
  specialPrice: number
}

export interface InventoryItem {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  description: string
  category: string
  subcategory: string
  price: number
  units: number
  block: number
  breakageFee?: number
  images?: string[]
  documentation?: string[]
  specialPrice?: SpecialPrice[]
}

export interface CategoryItem {
  id: string
  createdAt: string
  updatedAt: string
  categoryName: string
  subcategoryName?: string
}
