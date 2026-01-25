import { cn } from '@/utilities/ui'
import * as React from 'react'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ type, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex w-full border-0 border-b border-[#18CB96]/30 bg-transparent px-2 py-4 text-sm',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground',
          'disabled:cursor-not-allowed disabled:opacity-50',
          // hover + focus + click states
          'hover:border-[#18CB96] focus:border-[#18CB96] active:border-[#18CB96]',
          // remove all default focus UI
          'outline-none focus:outline-none ring-0 focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none',
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
