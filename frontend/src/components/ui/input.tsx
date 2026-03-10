import * as React from 'react'
import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded border border-ink-200 bg-white px-3 py-2 text-sm font-body text-ink placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent disabled:opacity-50 transition-all',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }
