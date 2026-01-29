import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useCreateBugMutation } from '@/services'
import { Severity } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const createBugSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  severity: z.nativeEnum(Severity),
  reproductionSteps: z.string().optional(),
})

type CreateBugFormData = z.infer<typeof createBugSchema>

export function CreateBugPage() {
  const navigate = useNavigate()

  const createBugMutation = useCreateBugMutation({
    onSuccess: (bug) => {
      navigate(`/bugs/${bug.id}`)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBugFormData>({
    resolver: zodResolver(createBugSchema),
    defaultValues: {
      severity: Severity.Medium,
    },
  })

  function onSubmit(data: CreateBugFormData) {
    createBugMutation.mutate(data)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Report a Bug</CardTitle>
          <CardDescription>Provide details about the bug you've encountered</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {createBugMutation.error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {createBugMutation.error.message || 'Failed to create bug. Please try again.'}
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
              <Button type="submit" disabled={createBugMutation.isPending}>
                {createBugMutation.isPending ? 'Creating...' : 'Create Bug Report'}
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
