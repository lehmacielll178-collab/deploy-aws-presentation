import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded px-2 py-0.5 text-xs font-mono font-medium transition-colors',
  {
    variants: {
      variant: {
        available: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        booked: 'bg-ink-950 text-cream/70 border border-ink-800',
        closed: 'bg-ink-100 text-ink-500 border border-ink-200',
        lunch: 'bg-gold-50 text-gold-700 border border-gold-200',
        dayclosed: 'bg-red-50 text-red-700 border border-red-200',
      },
    },
    defaultVariants: {
      variant: 'available',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
