import { ReactElement } from 'react'

const FormLabel = ({
  title,
  color,
}: {
  title: string
  color?: string
}): ReactElement => {
  return (
    <label
      className="font-normal text-xs tracking-tight pointer-events-none"
      style={{ color: color || '#737373' }}
    >
      {title}
    </label>
  )
}

export default FormLabel
