import api from '../api-client'
import type {
  IBug,
  IBugListItem,
  ICreateBugDto,
  IUpdateBugDto,
  IUpdateBugStatusDto,
  IAssignBugDto,
  IPaginatedResponse,
  IPaginationParams,
  Severity,
  BugStatus,
} from '@/types'

export const bugsApi = {
  create: async function create(data: ICreateBugDto): Promise<IBug> {
    const response = await api.post<IBug>('/bugs', data)
    return response.data
  },

  getById: async function getById(id: number): Promise<IBug> {
    const response = await api.get<IBug>(`/bugs/${id}`)
    return response.data
  },

  getMyBugs: async function getMyBugs(
    pagination?: IPaginationParams
  ): Promise<IPaginatedResponse<IBugListItem>> {
    const params: Record<string, number> = {}
    if (pagination?.pageNumber) params.pageNumber = pagination.pageNumber
    if (pagination?.pageSize) params.pageSize = pagination.pageSize
    const response = await api.get<IPaginatedResponse<IBugListItem>>('/bugs/my-bugs', { params })
    return response.data
  },

  getAssignedBugs: async function getAssignedBugs(
    pagination?: IPaginationParams
  ): Promise<IPaginatedResponse<IBugListItem>> {
    const params: Record<string, number> = {}
    if (pagination?.pageNumber) params.pageNumber = pagination.pageNumber
    if (pagination?.pageSize) params.pageSize = pagination.pageSize
    const response = await api.get<IPaginatedResponse<IBugListItem>>('/bugs/assigned', { params })
    return response.data
  },

  getUnassignedBugs: async function getUnassignedBugs(
    search?: string,
    pagination?: IPaginationParams
  ): Promise<IPaginatedResponse<IBugListItem>> {
    const params: Record<string, string | number> = {}
    if (search) params.search = search
    if (pagination?.pageNumber) params.pageNumber = pagination.pageNumber
    if (pagination?.pageSize) params.pageSize = pagination.pageSize
    const response = await api.get<IPaginatedResponse<IBugListItem>>('/bugs/unassigned', { params })
    return response.data
  },

  search: async function search(
    searchTerm?: string,
    severity?: Severity,
    status?: BugStatus,
    pagination?: IPaginationParams
  ): Promise<IPaginatedResponse<IBugListItem>> {
    const params: Record<string, string | number> = {}
    if (searchTerm) params.search = searchTerm
    if (severity) params.severity = severity
    if (status) params.status = status
    if (pagination?.pageNumber) params.pageNumber = pagination.pageNumber
    if (pagination?.pageSize) params.pageSize = pagination.pageSize
    const response = await api.get<IPaginatedResponse<IBugListItem>>('/bugs/search', { params })
    return response.data
  },

  update: async function update(id: number, data: IUpdateBugDto): Promise<IBug> {
    const response = await api.put<IBug>(`/bugs/${id}`, data)
    return response.data
  },

  updateStatus: async function updateStatus(id: number, data: IUpdateBugStatusDto): Promise<IBug> {
    const response = await api.patch<IBug>(`/bugs/${id}/status`, data)
    return response.data
  },

  assign: async function assign(id: number, developerId?: string): Promise<IBug> {
    const data: IAssignBugDto | undefined = developerId ? { developerId } : undefined
    const response = await api.patch<IBug>(`/bugs/${id}/assign`, data)
    return response.data
  },

  unassign: async function unassign(id: number): Promise<IBug> {
    const response = await api.patch<IBug>(`/bugs/${id}/unassign`)
    return response.data
  },

  delete: async function deleteBug(id: number): Promise<void> {
    await api.delete(`/bugs/${id}`)
  },
}
