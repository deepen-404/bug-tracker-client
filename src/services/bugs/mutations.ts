import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { bugsApi } from './api'
import { BUG_KEYS } from '../query-keys'
import type { IBug, ICreateBugDto, IUpdateBugDto, IUpdateBugStatusDto } from '@/types'

interface IApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

interface IUpdateBugParams {
  id: number
  payload: IUpdateBugDto
}

interface IUpdateBugStatusParams {
  id: number
  payload: IUpdateBugStatusDto
}

interface IAssignBugParams {
  bugId: number
  developerId?: string
}

export function useCreateBugMutation(options?: UseMutationOptions<IBug, IApiError, ICreateBugDto>) {
  return useMutation<IBug, IApiError, ICreateBugDto>({
    mutationKey: [BUG_KEYS.CREATE_BUG],
    mutationFn: (payload: ICreateBugDto) => bugsApi.create(payload),
    ...options,
  })
}

export function useUpdateBugMutation(
  options?: UseMutationOptions<IBug, IApiError, IUpdateBugParams>
) {
  return useMutation<IBug, IApiError, IUpdateBugParams>({
    mutationKey: [BUG_KEYS.UPDATE_BUG],
    mutationFn: (params: IUpdateBugParams) => bugsApi.update(params.id, params.payload),
    ...options,
  })
}

export function useUpdateBugStatusMutation(
  options?: UseMutationOptions<IBug, IApiError, IUpdateBugStatusParams>
) {
  return useMutation<IBug, IApiError, IUpdateBugStatusParams>({
    mutationKey: [BUG_KEYS.UPDATE_BUG_STATUS],
    mutationFn: (params: IUpdateBugStatusParams) => bugsApi.updateStatus(params.id, params.payload),
    ...options,
  })
}

export function useAssignBugMutation(
  options?: UseMutationOptions<IBug, IApiError, IAssignBugParams>
) {
  return useMutation<IBug, IApiError, IAssignBugParams>({
    mutationKey: [BUG_KEYS.ASSIGN_BUG],
    mutationFn: (params: IAssignBugParams) => bugsApi.assign(params.bugId, params.developerId),
    ...options,
  })
}

export function useUnassignBugMutation(options?: UseMutationOptions<IBug, IApiError, number>) {
  return useMutation<IBug, IApiError, number>({
    mutationKey: [BUG_KEYS.UNASSIGN_BUG],
    mutationFn: (id: number) => bugsApi.unassign(id),
    ...options,
  })
}

export function useDeleteBugMutation(options?: UseMutationOptions<void, IApiError, number>) {
  return useMutation<void, IApiError, number>({
    mutationKey: [BUG_KEYS.DELETE_BUG],
    mutationFn: (id: number) => bugsApi.delete(id),
    ...options,
  })
}
