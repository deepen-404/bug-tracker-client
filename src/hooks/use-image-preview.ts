import { useState, useEffect } from 'react'
import { attachmentsApi } from '@/services/attachments/api'
import type { IAttachment } from '@/types'

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp']

function isImageFile(fileName: string): boolean {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  return IMAGE_EXTENSIONS.includes(ext)
}

export function useImagePreview(attachments: IAttachment[] | undefined) {
  const [imagePreviews, setImagePreviews] = useState<Record<number, string>>({})
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (!attachments) return

    const imageAttachments = attachments.filter((a) => isImageFile(a.fileName))

    imageAttachments.forEach(async (attachment) => {
      if (imagePreviews[attachment.id] || loadingImages[attachment.id]) return

      setLoadingImages((prev) => ({ ...prev, [attachment.id]: true }))

      try {
        const blob = await attachmentsApi.download(attachment.id)
        const url = window.URL.createObjectURL(blob)
        setImagePreviews((prev) => ({ ...prev, [attachment.id]: url }))
      } catch {
        // Silently fail for image preview
      } finally {
        setLoadingImages((prev) => ({ ...prev, [attachment.id]: false }))
      }
    })

    return () => {
      Object.values(imagePreviews).forEach((url) => {
        window.URL.revokeObjectURL(url)
      })
    }
  }, [attachments])

  return { imagePreviews, isImageFile, loadingImages }
}
