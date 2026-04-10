import { ReactElement, HTMLAttributes } from 'react'

const Container = ({
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>): ReactElement => {
  return <div className={`w-full mx-auto ${className}`} {...props} />
}

export default Container
