import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authClient } from '../lib/authClient'

export function useAuth() {
  const qc = useQueryClient()

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: authClient.me,
    staleTime: 5 * 60 * 1000,
  })

  const login = useMutation({
    mutationFn: authClient.login,
    onSuccess: (user) => qc.setQueryData(['me'], user),
  })

  const register = useMutation({
    mutationFn: authClient.register,
    onSuccess: (user) => qc.setQueryData(['me'], user),
  })

  const logout = useMutation({
    mutationFn: authClient.logout,
    onSuccess: () => qc.setQueryData(['me'], null),
  })

  return {
    user: meQuery.data || null,
    loading: meQuery.isLoading,
    login,
    register,
    logout,
  }
}
