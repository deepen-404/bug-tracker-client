import { useState } from 'react'
import { useGetAssignedBugs } from '@/services'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BugTable } from '@/components/bugs/bug-table'
import { Pagination } from '@/components/ui/pagination'

export function AssignedBugsPage() {
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10

  const { data: paginatedData, isLoading, error } = useGetAssignedBugs({ pageNumber, pageSize })

  function handlePageChange(page: number) {
    setPageNumber(page)
  }

  if (isLoading && !paginatedData) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assigned Bugs</h1>
        <p className="text-muted-foreground mt-2">Bugs assigned to you for resolution</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Assignments</CardTitle>
          <CardDescription>
            {paginatedData?.totalCount || 0} bug{paginatedData?.totalCount !== 1 ? 's' : ''}{' '}
            assigned
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-destructive">Failed to load bugs</div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <BugTable bugs={paginatedData?.items || []} showAssignee={false} />
              {paginatedData && (
                <Pagination
                  pageNumber={paginatedData.pageNumber}
                  totalPages={paginatedData.totalPages}
                  totalCount={paginatedData.totalCount}
                  hasPreviousPage={paginatedData.hasPreviousPage}
                  hasNextPage={paginatedData.hasNextPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
