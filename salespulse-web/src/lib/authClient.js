import { api } from './api'

export const authClient = {
  me: async () => (await api.get('/auth/me')).data.user,
  login: async (payload) => (await api.post('/auth/login', payload)).data.user,
  register: async (payload) => (await api.post('/auth/register', payload)).data.user,
  logout: async () => (await api.post('/auth/logout')).data.ok,
}
