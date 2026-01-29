import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { bugsApi } from './api'
import { BUG_KEYS } from '../query-keys'
import type {
  IBug,
  IBugListItem,
  IPaginatedResponse,
  IPaginationParams,
  Severity,
  BugStatus,
} from '@/types'

interface ISearchBugsParams {
  searchTerm?: string
  severity?: Severity
  status?: BugStatus
  pagination?: IPaginationParams
}

interface IUnassignedBugsParams {
  search?: string
  pagination?: IPaginationParams
}

export function useGetBugById(id: number, options?: Partial<UseQueryOptions<IBug, Error>>) {
  return useQuery<IBug, Error>({
    queryKey: [BUG_KEYS.BUG_BY_ID, id],
    queryFn: async () => {
      const response = await bugsApi.getById(id)
      return response
    },
    enabled: !!id,
    ...options,
  })
}

export function useGetMyBugs(
  params: IPaginationParams,
  options?: Partial<UseQueryOptions<IPaginatedResponse<IBugListItem>, Error>>
) {
  return useQuery<IPaginatedResponse<IBugListItem>, Error>({
    queryKey: [BUG_KEYS.MY_BUGS, params],
    queryFn: async () => {
      const response = await bugsApi.getMyBugs(params)
      return response
    },
    placeholderData: {
      items: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    },
    ...options,
  })
}

export function useGetAssignedBugs(
  params: IPaginationParams,
  options?: Partial<UseQueryOptions<IPaginatedResponse<IBugListItem>, Error>>
) {
  return useQuery<IPaginatedResponse<IBugListItem>, Error>({
    queryKey: [BUG_KEYS.ASSIGNED_BUGS, params],
    queryFn: async () => {
      const response = await bugsApi.getAssignedBugs(params)
      return response
    },
    placeholderData: {
      items: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    },
    ...options,
  })
}

export function useGetUnassignedBugs(
  params: IUnassignedBugsParams,
  options?: Partial<UseQueryOptions<IPaginatedResponse<IBugListItem>, Error>>
) {
  return useQuery<IPaginatedResponse<IBugListItem>, Error>({
    queryKey: [BUG_KEYS.UNASSIGNED_BUGS, params],
    queryFn: async () => {
      const response = await bugsApi.getUnassignedBugs(params.search, params.pagination)
      return response
    },
    placeholderData: {
      items: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    },
    ...options,
  })
}

export function useSearchBugs(
  params: ISearchBugsParams,
  options?: Partial<UseQueryOptions<IPaginatedResponse<IBugListItem>, Error>>
) {
  return useQuery<IPaginatedResponse<IBugListItem>, Error>({
    queryKey: [BUG_KEYS.SEARCH_BUGS, params],
    queryFn: async () => {
      const response = await bugsApi.search(
        params.searchTerm,
        params.severity,
        params.status,
        params.pagination
      )
      return response
    },
    placeholderData: {
      items: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    },
    ...options,
  })
}
