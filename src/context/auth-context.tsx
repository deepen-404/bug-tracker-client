import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { IUser, ILoginDto, IRegisterDto, IAuthResponse } from '@/types'
import { authApi } from '@/services'

interface IAuthContext {
  user: IUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: ILoginDto) => Promise<void>
  register: (data: IRegisterDto) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(function loadStoredUser() {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  function handleAuthResponse(response: IAuthResponse) {
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    setUser(response.user)
  }

  async function login(data: ILoginDto) {
    const response = await authApi.login(data)
    handleAuthResponse(response)
  }

  async function register(data: IRegisterDto) {
    const response = await authApi.register(data)
    handleAuthResponse(response)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): IAuthContext {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
