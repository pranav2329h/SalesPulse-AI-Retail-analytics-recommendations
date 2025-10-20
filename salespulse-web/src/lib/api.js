import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
})

// Auth
export const register = (payload) => api.post('/auth/register', payload)
export const login = (payload) => api.post('/auth/login', payload)
export const me = () => api.get('/auth/me')
export const logout = () => api.post('/auth/logout')

// Products
export const listProducts = (q) => api.get('/products', { params: q ? { search: q } : {} })
export const getProduct = (id) => api.get(`/products/${id}`)
export const createProduct = (payload) => api.post('/products', payload)
export const updateProduct = (id, payload) => api.put(`/products/${id}`, payload)
export const deleteProduct = (id) => api.delete(`/products/${id}`)

// KPIs (optional direct calls)
export const revenueByDay = (days=30) => api.get('/kpis/revenue-by-day', { params: { days } })
export const topSkus = (days=60, limit=10) => api.get('/kpis/top-skus', { params: { days, limit } })
export const categorySales = (days=60) => api.get('/kpis/category-sales', { params: { days } })

export default api
