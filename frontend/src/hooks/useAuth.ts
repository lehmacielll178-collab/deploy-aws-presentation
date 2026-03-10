import { useState, useCallback } from 'react'
import { authService } from '@/services/api'

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated)

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authService.login(email, password)
      authService.saveToken(res.token)
      setIsAuthenticated(true)
      return res
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao fazer login'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setIsAuthenticated(false)
  }, [])

  return { login, logout, loading, error, isAuthenticated }
}
