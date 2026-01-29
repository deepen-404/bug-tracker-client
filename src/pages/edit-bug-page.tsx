import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetBugById, useUpdateBugMutation } from '@/services'
import { Severity } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

const editBugSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  severity: z.nativeEnum(Severity),
  reproductionSteps: z.string().optional(),
})

type EditBugFormData = z.infer<typeof editBugSchema>

export function EditBugPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const bugId = id ? parseInt(id) : 0

  const { data: bug, isLoading: isFetching, error: fetchError } = useGetBugById(bugId)

  const updateBugMutation = useUpdateBugMutation({
    onSuccess: () => {
      navigate(`/bugs/${id}`)
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditBugFormData>({
    resolver: zodResolver(editBugSchema),
  })

  useEffect(() => {
    if (bug) {
      reset({
        title: bug.title,
        description: bug.description,
        severity: bug.severity,
        reproductionSteps: bug.reproductionSteps || '',
      })
    }
  }, [bug, reset])

  function onSubmit(data: EditBugFormData) {
    if (!bugId) return
    updateBugMutation.mutate({ id: bugId, payload: data })
  }

  if (isFetching) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (fetchError || !bug) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{fetchError?.message || 'Bug not found'}</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Bug #{bug.id}</CardTitle>
          <CardDescription>Update the bug details</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {updateBugMutation.error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {updateBugMutation.error.message || 'Failed to update bug. Please try again.'}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Brief description of the bug" {...register('title')} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the bug..."
                rows={5}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select id="severity" {...register('severity', { valueAsNumber: true })}>
                <option value={Severity.Low}>Low</option>
                <option value={Severity.Medium}>Medium</option>
                <option value={Severity.High}>High</option>
              </Select>
              {errors.severity && (
                <p className="text-sm text-destructive">{errors.severity.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reproductionSteps">Reproduction Steps (Optional)</Label>
              <Textarea
                id="reproductionSteps"
                placeholder="Step 1: ...\nStep 2: ..."
                rows={4}
                {...register('reproductionSteps')}
              />
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={updateBugMutation.isPending}>
                {updateBugMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
