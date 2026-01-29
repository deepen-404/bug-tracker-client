import { Severity, BugStatus } from '@/types'

export const SEVERITY_VARIANT = {
  [Severity.Low]: 'secondary' as const,
  [Severity.Medium]: 'warning' as const,
  [Severity.High]: 'destructive' as const,
}

export const SEVERITY_LABEL = {
  [Severity.Low]: 'Low',
  [Severity.Medium]: 'Medium',
  [Severity.High]: 'High',
}

export const STATUS_VARIANT = {
  [BugStatus.Open]: 'default' as const,
  [BugStatus.InProgress]: 'warning' as const,
  [BugStatus.Resolved]: 'success' as const,
  [BugStatus.Closed]: 'secondary' as const,
}

export const STATUS_LABEL = {
  [BugStatus.Open]: 'Open',
  [BugStatus.InProgress]: 'In Progress',
  [BugStatus.Resolved]: 'Resolved',
  [BugStatus.Closed]: 'Closed',
}
