import { useState, useMemo } from 'react'
import { debounce } from 'lodash-es'
import { useGetUnassignedBugs } from '@/services'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BugTable } from '@/components/bugs/bug-table'
import { Pagination } from '@/components/ui/pagination'
import { Search } from 'lucide-react'

export function UnassignedBugsPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10

  const {
    data: paginatedData,
    isLoading,
    error,
  } = useGetUnassignedBugs({
    search: debouncedSearch || undefined,
    pagination: { pageNumber, pageSize },
  })

  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 300),
    []
  )

  function handlePageChange(page: number) {
    setPageNumber(page)
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearch(value)
    setPageNumber(1)
    debouncedSetSearch(value)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Unassigned Bugs</h1>
        <p className="text-muted-foreground mt-2">Pick up new bugs to work on</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Available Bugs</CardTitle>
              <CardDescription>
                {paginatedData?.totalCount || 0} bug{paginatedData?.totalCount !== 1 ? 's' : ''}{' '}
                waiting for assignment
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search bugs..."
                value={search}
                onChange={handleSearchChange}
                className="pl-9"
              />
            </div>
          </div>
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
