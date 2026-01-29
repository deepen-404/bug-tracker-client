import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import { attachmentsApi } from './api'
import { ATTACHMENT_KEYS } from '../query-keys'
import type { IAttachment } from '@/types'

interface IApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

interface IUploadAttachmentParams {
  bugId: number
  file: File
}

interface IDownloadAttachmentParams {
  attachmentId: number
}

export function useUploadAttachmentMutation(
  options?: UseMutationOptions<IAttachment, IApiError, IUploadAttachmentParams>
) {
  return useMutation<IAttachment, IApiError, IUploadAttachmentParams>({
    mutationKey: [ATTACHMENT_KEYS.UPLOAD_ATTACHMENT],
    mutationFn: (params: IUploadAttachmentParams) =>
      attachmentsApi.upload(params.bugId, params.file),
    ...options,
  })
}

export function useDownloadAttachmentMutation(
  options?: UseMutationOptions<Blob, IApiError, IDownloadAttachmentParams>
) {
  return useMutation<Blob, IApiError, IDownloadAttachmentParams>({
    mutationKey: [ATTACHMENT_KEYS.DOWNLOAD_ATTACHMENT],
    mutationFn: (params: IDownloadAttachmentParams) => attachmentsApi.download(params.attachmentId),
    ...options,
  })
}

export function useDeleteAttachmentMutation(options?: UseMutationOptions<void, IApiError, number>) {
  return useMutation<void, IApiError, number>({
    mutationKey: [ATTACHMENT_KEYS.DELETE_ATTACHMENT],
    mutationFn: (id: number) => attachmentsApi.delete(id),
    ...options,
  })
}
