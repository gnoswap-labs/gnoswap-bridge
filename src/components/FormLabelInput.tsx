import { InputHTMLAttributes, LabelHTMLAttributes, ReactElement } from 'react'

const FormLabelInput = ({
  inputProps,
  labelProps,
}: {
  inputProps: InputHTMLAttributes<HTMLInputElement>
  labelProps: LabelHTMLAttributes<HTMLLabelElement>
}): ReactElement => {
  return (
    <div className="relative flex flex-1">
      <input
        {...inputProps}
        // Placeholder ' ' used to distinguish of label position
        placeholder=" "
        onWheel={(e: React.WheelEvent<HTMLInputElement>): void => {
          e.currentTarget.blur()
        }}
        className="peer flex-1 pt-3 pb-1.5 border-none rounded-none pl-0 text-base text-bridge-white border-b border-bridge-gray bg-transparent focus:outline-none"
      />
      <label
        {...labelProps}
        className="absolute top-2.5 text-base font-normal tracking-tight text-[#737373] pointer-events-none transition-all duration-200 ease-in-out peer-focus:top-[-15px] peer-focus:text-xs peer-focus:tracking-tight peer-[:not(:placeholder-shown)]:top-[-15px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:tracking-tight"
      />
    </div>
  )
}

export default FormLabelInput
