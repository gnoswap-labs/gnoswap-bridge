import { HTMLAttributes, forwardRef } from 'react'

const View = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return <div ref={ref} className={`flex flex-col ${className}`} {...props} />
  }
)

View.displayName = 'View'

export default View
