import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { usersApi } from './api'
import { USER_KEYS } from '../query-keys'
import type { IDeveloper } from '@/types'

export function useGetDevelopers(options?: Partial<UseQueryOptions<IDeveloper[], Error>>) {
  return useQuery<IDeveloper[], Error>({
    queryKey: [USER_KEYS.DEVELOPERS],
    queryFn: async () => {
      const response = await usersApi.getDevelopers()
      return response
    },
    placeholderData: [],
    ...options,
  })
}
