import { Badge } from '@/components/ui/badge'
import { Status } from '@/types'

interface StatusBadgeProps {
  status: Status
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    pending: { label: 'Pending', variant: 'pending' as const },
    processing: { label: 'Processing', variant: 'processing' as const },
    completed: { label: 'Completed', variant: 'completed' as const },
    failed: { label: 'Failed', variant: 'failed' as const },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}

