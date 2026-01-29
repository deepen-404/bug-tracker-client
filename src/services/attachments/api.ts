import api from '../api-client'
import type { IAttachment } from '@/types'

export const attachmentsApi = {
  upload: async function upload(bugId: number, file: File): Promise<IAttachment> {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<IAttachment>(`/bugs/${bugId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  download: async function download(id: number): Promise<Blob> {
    const response = await api.get(`/attachments/${id}`, {
      responseType: 'blob',
    })
    return response.data
  },

  delete: async function deleteAttachment(id: number): Promise<void> {
    await api.delete(`/attachments/${id}`)
  },
}
