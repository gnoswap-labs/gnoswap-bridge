import { ReactElement } from 'react'

const StatusBadge = ({
  success,
}: {
  success: boolean | null
}): ReactElement => {
  if (success === true) {
    return (
      <span className="inline-flex text-xs font-medium px-2 py-0.5 rounded-full bg-bridge-sky/20 text-bridge-sky">
        Success
      </span>
    )
  }
  if (success === false) {
    return (
      <span className="inline-flex text-xs font-medium px-2 py-0.5 rounded-full bg-bridge-red/20 text-bridge-red">
        Failed
      </span>
    )
  }
  return (
    <span className="inline-flex text-xs font-medium px-2 py-0.5 rounded-full bg-bridge-gray text-gray-400">
      Pending
    </span>
  )
}

export default StatusBadge
