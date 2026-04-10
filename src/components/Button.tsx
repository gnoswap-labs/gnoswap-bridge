import { ButtonHTMLAttributes, ReactElement } from 'react'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button = (props: ButtonProps): ReactElement => {
  const { className = '', ...rest } = props

  return (
    <div className="w-full">
      <button
        type="button"
        className={`w-full py-4 px-2 bg-bridge-sky text-bridge-white text-sm text-center rounded-[27px] border-none box-border select-none font-medium cursor-pointer hover:opacity-80 disabled:opacity-30 disabled:pointer-events-none ${className}`}
        {...rest}
      />
    </div>
  )
}

export default Button
