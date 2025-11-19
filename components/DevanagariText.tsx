'use client'

import { cn } from '@/lib/utils'

interface DevanagariTextProps {
  children: React.ReactNode
  className?: string
}

export function DevanagariText({ children, className }: DevanagariTextProps) {
  return (
    <span className={cn('text-devanagari', className)}>
      {children}
    </span>
  )
}

