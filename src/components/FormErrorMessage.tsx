import { ReactElement } from 'react'

const FormErrorMessage = ({
  errorMessage,
  style,
}: {
  errorMessage?: string
  style?: React.CSSProperties
}): ReactElement => {
  return (
    <>
      {errorMessage && (
        <div
          className="text-bridge-red break-all whitespace-pre-wrap text-xs font-normal tracking-tight pt-[5px] mb-2"
          style={style}
        >
          {errorMessage}
        </div>
      )}
    </>
  )
}

export default FormErrorMessage
