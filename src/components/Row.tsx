import { HTMLAttributes, forwardRef } from 'react'

const Row = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => {
    return <div ref={ref} className={`flex flex-row ${className}`} {...props} />
  }
)

Row.displayName = 'Row'

export default Row
