import { Link } from 'react-router-dom'
import type { IBugListItem } from '@/types'
import { SEVERITY_VARIANT, SEVERITY_LABEL, STATUS_VARIANT, STATUS_LABEL } from '@/constants/bug'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Eye, Paperclip } from 'lucide-react'

interface IBugTableProps {
  bugs: IBugListItem[]
  showAssignee?: boolean
}

export function BugTable({ bugs, showAssignee = true }: IBugTableProps) {
  if (bugs.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No bugs found</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reporter</TableHead>
          {showAssignee && <TableHead>Assignee</TableHead>}
          <TableHead>Created</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bugs.map((bug) => (
          <TableRow key={bug.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                {bug.title}
                {bug.attachmentCount > 0 && (
                  <span className="flex items-center text-muted-foreground">
                    <Paperclip className="h-3 w-3" />
                    <span className="text-xs">{bug.attachmentCount}</span>
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={SEVERITY_VARIANT[bug.severity]}>{SEVERITY_LABEL[bug.severity]}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[bug.status]}>{STATUS_LABEL[bug.status]}</Badge>
            </TableCell>
            <TableCell>{bug.reporterName}</TableCell>
            {showAssignee && (
              <TableCell>
                {bug.assignedDeveloperName || (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </TableCell>
            )}
            <TableCell>{new Date(bug.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <Link to={`/bugs/${bug.id}`}>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
