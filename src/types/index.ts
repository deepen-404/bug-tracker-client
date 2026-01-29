export enum Severity {
  Low = 1,
  Medium = 2,
  High = 3,
}

export enum BugStatus {
  Open = 1,
  InProgress = 2,
  Resolved = 3,
  Closed = 4,
}

export interface IUser {
  id: string
  email: string
  fullName: string
  role: string
}

export interface IAuthResponse {
  token: string
  expiration: string
  user: IUser
}

export interface IBug {
  id: number
  title: string
  description: string
  severity: Severity
  status: BugStatus
  reproductionSteps?: string
  createdAt: string
  updatedAt?: string
  reporterId: string
  reporterName: string
  reporterEmail: string
  assignedDeveloperId?: string
  assignedDeveloperName?: string
  assignedDeveloperEmail?: string
  attachments: IAttachment[]
}

export interface IBugListItem {
  id: number
  title: string
  severity: Severity
  status: BugStatus
  createdAt: string
  reporterName: string
  assignedDeveloperName?: string
  attachmentCount: number
}

export interface IAttachment {
  id: number
  fileName: string
  contentType: string
  fileSize: number
  uploadedAt: string
}

export interface ICreateBugDto {
  title: string
  description: string
  severity: Severity
  reproductionSteps?: string
}

export interface IUpdateBugDto {
  title: string
  description: string
  severity: Severity
  reproductionSteps?: string
}

export interface IUpdateBugStatusDto {
  status: BugStatus
}

export interface IRegisterDto {
  email: string
  password: string
  fullName: string
  role?: string
}

export interface ILoginDto {
  email: string
  password: string
}

export interface IDeveloper {
  id: string
  fullName: string
  email: string
}

export interface IAssignBugDto {
  developerId: string
}

export interface IPaginatedResponse<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface IPaginationParams {
  pageNumber?: number
  pageSize?: number
}
