import { ReactElement } from 'react'

const StatsCard = ({
  label,
  value,
  subtitle,
  loading = false,
}: {
  label: string
  value: string | number | null
  subtitle?: string
  loading?: boolean
}): ReactElement => (
  <div className="bg-bridge-dark rounded-lg p-5 flex flex-col gap-2">
    <span className="text-xs text-gray-500 uppercase tracking-wide">
      {label}
    </span>
    {loading ? (
      <div className="h-8 w-20 bg-bridge-gray rounded animate-pulse" />
    ) : (
      <span className="text-xl font-semibold text-white">{value ?? '--'}</span>
    )}
    {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
  </div>
)

export default StatsCard
