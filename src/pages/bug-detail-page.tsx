import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/auth-context'
import {
  useGetBugById,
  useGetDevelopers,
  useAssignBugMutation,
  useUnassignBugMutation,
  useUpdateBugStatusMutation,
  useDeleteBugMutation,
  useUploadAttachmentMutation,
  useDownloadAttachmentMutation,
  useDeleteAttachmentMutation,
} from '@/services'
import { BugStatus } from '@/types'
import { SEVERITY_VARIANT, SEVERITY_LABEL, STATUS_VARIANT, STATUS_LABEL } from '@/constants/bug'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  User,
  Calendar,
  Paperclip,
  Trash2,
  Download,
  Upload,
  UserX,
  Pencil,
} from 'lucide-react'

export function BugDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bugId = id ? parseInt(id) : 0

  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const { data: bug, isLoading, error: fetchError, refetch } = useGetBugById(bugId)

  const isDeveloper = user?.role === 'Developer'
  const isReporter = bug?.reporterId === user?.id
  const isAssignedDeveloper = bug?.assignedDeveloperId === user?.id
  const canAssign = isDeveloper || isReporter
  const canUpdateStatus = isDeveloper && isAssignedDeveloper
  const canEdit = isReporter || isAssignedDeveloper

  const { data: developers = [] } = useGetDevelopers({ enabled: canAssign && !!bug })

  const assignBugMutation = useAssignBugMutation({
    onSuccess: () => {
      refetch()
    },
    onError: () => {
      setError('Failed to assign bug')
    },
  })

  const unassignBugMutation = useUnassignBugMutation({
    onSuccess: () => {
      refetch()
      setSelectedDeveloperId('')
    },
    onError: () => {
      setError('Failed to unassign bug')
    },
  })

  const updateStatusMutation = useUpdateBugStatusMutation({
    onSuccess: () => {
      refetch()
    },
    onError: () => {
      setError('Failed to update status')
    },
  })

  const deleteBugMutation = useDeleteBugMutation({
    onSuccess: () => {
      navigate('/dashboard')
    },
    onError: () => {
      setError('Failed to delete bug')
    },
  })

  const uploadAttachmentMutation = useUploadAttachmentMutation({
    onSuccess: () => {
      refetch()
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    onError: () => {
      setError('Failed to upload file')
    },
  })

  const downloadAttachmentMutation = useDownloadAttachmentMutation()

  const deleteAttachmentMutation = useDeleteAttachmentMutation({
    onSuccess: () => {
      refetch()
    },
    onError: () => {
      setError('Failed to delete attachment')
    },
  })

  function handleAssign(developerId?: string) {
    if (!bug) return
    assignBugMutation.mutate({ bugId: bug.id, developerId })
  }

  function handleUnassign() {
    if (!bug) return
    unassignBugMutation.mutate(bug.id)
  }

  function handleDeveloperChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const developerId = e.target.value
    setSelectedDeveloperId(developerId)
    if (developerId) {
      handleAssign(developerId)
    }
  }

  function handleStatusChange(newStatus: string) {
    if (!bug) return
    updateStatusMutation.mutate({
      id: bug.id,
      payload: { status: parseInt(newStatus) as BugStatus },
    })
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !bug) return
    uploadAttachmentMutation.mutate({ bugId: bug.id, file })
  }

  function handleDownload(attachmentId: number, fileName: string) {
    downloadAttachmentMutation.mutate(
      { attachmentId },
      {
        onSuccess: (blob) => {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = fileName
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        },
        onError: () => {
          setError('Failed to download file')
        },
      }
    )
  }

  function handleDeleteAttachment(attachmentId: number) {
    if (!confirm('Are you sure you want to delete this attachment?')) return
    deleteAttachmentMutation.mutate(attachmentId)
  }

  function handleDeleteBug() {
    if (!bug || !confirm('Are you sure you want to delete this bug?')) return
    deleteBugMutation.mutate(bug.id)
  }

  const isUpdating =
    assignBugMutation.isPending || unassignBugMutation.isPending || updateStatusMutation.isPending

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (fetchError && !bug) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{fetchError.message || 'Failed to load bug details'}</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  if (!bug) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {canEdit && (
          <Button variant="outline" onClick={() => navigate(`/bugs/${bug.id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Bug
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{bug.title}</CardTitle>
                  <CardDescription>Bug #{bug.id}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={SEVERITY_VARIANT[bug.severity]}>
                    {SEVERITY_LABEL[bug.severity]}
                  </Badge>
                  <Badge variant={STATUS_VARIANT[bug.status]}>{STATUS_LABEL[bug.status]}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{bug.description}</p>
              </div>

              {bug.reproductionSteps && (
                <div>
                  <h3 className="font-semibold mb-2">Reproduction Steps</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {bug.reproductionSteps}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5" />
                  Attachments ({bug.attachments.length})
                </CardTitle>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadAttachmentMutation.isPending}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadAttachmentMutation.isPending ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {bug.attachments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No attachments</p>
              ) : (
                <div className="space-y-2">
                  {bug.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{attachment.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {(attachment.fileSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(attachment.id, attachment.fileName)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAttachment(attachment.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Reporter:</span>
                <span>{bug.reporterName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Assigned to:</span>
                <span>{bug.assignedDeveloperName || 'Unassigned'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(bug.createdAt).toLocaleDateString()}</span>
              </div>
              {bug.updatedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(bug.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {(canAssign || canUpdateStatus) && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {canAssign && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assign to Developer</label>
                    <Select
                      value={selectedDeveloperId || bug.assignedDeveloperId || ''}
                      onChange={handleDeveloperChange}
                      disabled={isUpdating}
                    >
                      <option value="">Select a developer...</option>
                      {developers.map((dev) => (
                        <option key={dev.id} value={dev.id}>
                          {dev.fullName} {dev.id === user?.id ? '(Me)' : ''}
                        </option>
                      ))}
                    </Select>
                    {isDeveloper && !bug.assignedDeveloperId && (
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => handleAssign()}
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Assigning...' : 'Assign to Me'}
                      </Button>
                    )}
                    {bug.assignedDeveloperId && (
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={handleUnassign}
                        disabled={isUpdating}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        {isUpdating ? 'Unassigning...' : 'Unassign'}
                      </Button>
                    )}
                  </div>
                )}

                {canUpdateStatus && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Update Status</label>
                    <Select
                      value={bug.status.toString()}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={isUpdating}
                    >
                      <option value={BugStatus.Open}>Open</option>
                      <option value={BugStatus.InProgress}>In Progress</option>
                      <option value={BugStatus.Resolved}>Resolved</option>
                      <option value={BugStatus.Closed}>Closed</option>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {bug.reporterId === user?.id && (
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDeleteBug}
                  disabled={deleteBugMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deleteBugMutation.isPending ? 'Deleting...' : 'Delete Bug'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
