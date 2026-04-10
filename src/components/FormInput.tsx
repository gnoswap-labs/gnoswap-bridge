import { InputHTMLAttributes, ReactElement } from 'react'

const FormInput = ({
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>): ReactElement => {
  return (
    <div className="flex flex-1">
      <input
        className={`flex-1 py-3 border-none text-sm rounded-bridge text-bridge-white bg-bridge-gray focus:outline-none ${className}`}
        {...props}
      />
    </div>
  )
}

export default FormInput
