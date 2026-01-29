import api from '../api-client'
import type { IAuthResponse, IRegisterDto, ILoginDto, IUser } from '@/types'

export const authApi = {
  register: async function register(data: IRegisterDto): Promise<IAuthResponse> {
    const response = await api.post<IAuthResponse>('/auth/register', data)
    return response.data
  },

  login: async function login(data: ILoginDto): Promise<IAuthResponse> {
    const response = await api.post<IAuthResponse>('/auth/login', data)
    return response.data
  },

  getCurrentUser: async function getCurrentUser(): Promise<IUser> {
    const response = await api.get<IUser>('/auth/me')
    return response.data
  },
}
