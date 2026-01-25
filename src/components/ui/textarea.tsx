import { cn } from '@/utilities/ui'
import * as React from 'react'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[80px] w-full border-0 border-b border-[#18CB96]/30 bg-transparent px-2 py-4 text-sm',
        'placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        // hover + focus + click states
        'hover:border-[#18CB96] focus:border-[#18CB96] active:border-[#18CB96]',
        // remove all default focus UI
        'outline-none focus:outline-none ring-0 focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none',
        className,
      )}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
