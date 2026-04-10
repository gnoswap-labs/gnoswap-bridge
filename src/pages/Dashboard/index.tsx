import { ReactElement } from 'react'

import { useDashboard } from 'hooks/useDashboard'
import DashboardFilters from './DashboardFilters'
import StatsCard from './StatsCard'
import TransferChart from './TransferChart'
import TransferTable from './TransferTable'

const Dashboard = (): ReactElement => {
  const {
    tokenFilter,
    setTokenFilter,
    routeFilter,
    setRouteFilter,
    timeRange,
    setTimeRange,
    filteredTransfers,
    transfersLoading,
    transfersError,
    statsLoading,
    statsError,
    chartData,
    totalTransfers,
    successRate,
    medianLatency,
    activeRoutes,
    currentPage,
    nextPage,
    prevPage,
    resetPagination,
    hasNextPage,
    hasPrevPage,
    transfersCount,
  } = useDashboard()

  const handleRouteChange = (v: typeof routeFilter): void => {
    setRouteFilter(v)
    resetPagination()
  }

  return (
    <div className="w-full max-w-[1024px] mx-auto px-4 pb-12">
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
          <h1 className="text-xl font-semibold">Bridge Dashboard</h1>
          <DashboardFilters
            tokenFilter={tokenFilter}
            routeFilter={routeFilter}
            timeRange={timeRange}
            onTokenChange={setTokenFilter}
            onRouteChange={handleRouteChange}
            onTimeRangeChange={setTimeRange}
          />
        </div>

        {/* Error banners */}
        {(transfersError || statsError) && (
          <div className="bg-bridge-red/20 border border-bridge-red/40 rounded-lg px-4 py-3 text-bridge-red text-sm">
            {transfersError?.message ??
              statsError?.message ??
              'Failed to load data'}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Transfers"
            value={totalTransfers}
            subtitle={`Last ${timeRange} days`}
            loading={statsLoading}
          />
          <StatsCard
            label="Success Rate"
            value={successRate != null ? `${successRate}%` : null}
            subtitle={`Last ${transfersCount} transfers`}
            loading={transfersLoading}
          />
          <StatsCard
            label="Avg Bridge Time"
            value={medianLatency != null ? `${medianLatency}s` : null}
            subtitle="Median end-to-end"
          />
          <StatsCard
            label="Active Routes"
            value={statsLoading ? null : activeRoutes.count || null}
            subtitle={activeRoutes.chains || undefined}
            loading={statsLoading}
          />
        </div>

        {/* Chart */}
        <TransferChart data={chartData} loading={statsLoading} />

        {/* Transfer History Table */}
        <TransferTable
          transfers={filteredTransfers}
          loading={transfersLoading}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          currentPage={currentPage}
          onNext={nextPage}
          onPrev={prevPage}
        />
      </div>
    </div>
  )
}

export default Dashboard
