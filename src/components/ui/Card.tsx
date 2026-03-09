import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, description, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-card text-card-foreground shadow-sm',
          className
        )}
        {...props}
      >
        {(title || description) && (
          <div className="flex flex-col space-y-1.5 p-6">
            {title && <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
        )}
        <div className="p-6 pt-0">{children}</div>
      </div>
    )
  }
)
Card.displayName = 'Card'

export { Card }
