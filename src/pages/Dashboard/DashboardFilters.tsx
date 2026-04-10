import { ReactElement } from 'react'

import type { TokenFilter, RouteFilter, TimeRange } from 'hooks/useDashboard'

const selectCls =
  'bg-bridge-gray text-white text-sm rounded px-3 py-2 border border-bridge-gray focus:outline-none focus:border-gray-500 cursor-pointer'

const DashboardFilters = ({
  tokenFilter,
  routeFilter,
  timeRange,
  onTokenChange,
  onRouteChange,
  onTimeRangeChange,
}: {
  tokenFilter: TokenFilter
  routeFilter: RouteFilter
  timeRange: TimeRange
  onTokenChange: (v: TokenFilter) => void
  onRouteChange: (v: RouteFilter) => void
  onTimeRangeChange: (v: TimeRange) => void
}): ReactElement => (
  <div className="flex flex-wrap gap-3">
    <select
      value={tokenFilter}
      className={selectCls}
      onChange={(e) => onTokenChange(e.target.value as TokenFilter)}
    >
      <option value="all">All Tokens</option>
      <option value="ATONE">ATONE</option>
      <option value="PHOTON">PHOTON</option>
    </select>

    <select
      value={routeFilter}
      className={selectCls}
      onChange={(e) => {
        onRouteChange(e.target.value as RouteFilter)
      }}
    >
      <option value="all">All Routes</option>
      <option value="atomone-ethereum">AtomOne - Ethereum</option>
      <option value="atomone-base">AtomOne - Base</option>
    </select>

    <select
      value={timeRange}
      className={selectCls}
      onChange={(e) => onTimeRangeChange(Number(e.target.value) as TimeRange)}
    >
      <option value={7}>7 days</option>
      <option value={30}>30 days</option>
      <option value={90}>90 days</option>
    </select>
  </div>
)

export default DashboardFilters
