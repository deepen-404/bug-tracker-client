import api from '../api-client'
import type { IDeveloper } from '@/types'

export const usersApi = {
  getDevelopers: async function getDevelopers(): Promise<IDeveloper[]> {
    const response = await api.get<IDeveloper[]>('/users/developers')
    return response.data
  },
}
