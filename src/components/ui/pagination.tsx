import { Button } from './button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface IPaginationProps {
  pageNumber: number
  totalPages: number
  totalCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  onPageChange: (page: number) => void
}

export function Pagination({
  pageNumber,
  totalPages,
  totalCount,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
}: IPaginationProps) {
  if (totalPages <= 1) return null

  function getVisiblePages(): number[] {
    const pages: number[] = []
    const maxVisible = 5

    let start = Math.max(1, pageNumber - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        {totalCount} total item{totalCount !== 1 ? 's' : ''}
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={!hasPreviousPage}
          className="h-8 w-8 p-0"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pageNumber - 1)}
          disabled={!hasPreviousPage}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {visiblePages[0] > 1 && <span className="px-2 text-muted-foreground">...</span>}

        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={page === pageNumber ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(page)}
            className="h-8 w-8 p-0"
          >
            {page}
          </Button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <span className="px-2 text-muted-foreground">...</span>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pageNumber + 1)}
          disabled={!hasNextPage}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          className="h-8 w-8 p-0"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        Page {pageNumber} of {totalPages}
      </div>
    </div>
  )
}
