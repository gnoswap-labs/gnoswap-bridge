import { ReactElement, useMemo } from 'react'

import type { ChartPoint } from 'hooks/useDashboard'

const SERIES = [
  { key: 'atomoneToEth', color: '#627EEA', label: 'AtomOne → Ethereum' },
  { key: 'ethToAtomone', color: '#6BEFFF', label: 'Ethereum → AtomOne' },
  { key: 'atomoneToBase', color: '#0052FF', label: 'AtomOne → Base' },
  { key: 'baseToAtomone', color: '#F4AFFF', label: 'Base → AtomOne' },
] as const

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

const TransferChart = ({
  data,
  loading = false,
}: {
  data: ChartPoint[]
  loading?: boolean
}): ReactElement => {
  const maxValue = useMemo(
    () => (data.length ? Math.max(...data.map((d) => d.total), 1) : 1),
    [data]
  )

  const barWidth = useMemo(
    () => (data.length ? Math.max(100 / data.length - 1, 2) : 0),
    [data]
  )

  const labelIndices = useMemo(() => {
    const len = data.length
    if (len <= 6) return data.map((_, i) => i)
    const step = Math.floor(len / 5)
    const indices: number[] = []
    for (let i = 0; i < len; i += step) indices.push(i)
    if (indices[indices.length - 1] !== len - 1) indices.push(len - 1)
    return indices
  }, [data])

  return (
    <div className="bg-bridge-dark rounded-lg p-5">
      <h3 className="text-base font-semibold mb-4">Daily Transfer Volume</h3>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Loading chart data...</span>
        </div>
      ) : !data.length ? (
        <div className="h-48 flex items-center justify-center">
          <span className="text-gray-500 text-sm">
            No transfer data available
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* SVG Chart */}
          <div className="relative w-full" style={{ height: 200 }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
              className="overflow-visible"
            >
              {/* Horizontal grid lines */}
              {[0, 50, 100, 150, 200].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="1000"
                  y2={y}
                  stroke="#272727"
                  strokeWidth="1"
                />
              ))}

              {/* Stacked bars */}
              {data.map((point, i) => {
                const x = (i / data.length) * 1000 + 2
                const w = barWidth * 10
                let stackY = 200

                return (
                  <g key={point.date}>
                    {SERIES.map(({ key, color, label }) => {
                      const val = point[key]
                      const h = Math.max((val / maxValue) * 200, 0)
                      stackY -= h
                      return (
                        <rect
                          key={key}
                          x={x}
                          y={stackY}
                          width={w}
                          height={h}
                          fill={color}
                          opacity={0.8}
                        >
                          <title>
                            {formatDate(point.date)}: {label} {val}
                          </title>
                        </rect>
                      )
                    })}
                  </g>
                )
              })}
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between text-xs text-gray-500 px-1">
            {labelIndices.map((idx) => (
              <span key={idx}>{formatDate(data[idx].date)}</span>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
            {SERIES.map(({ key, color, label }) => (
              <span key={key} className="inline-flex items-center gap-1">
                <span
                  className="w-3 h-2 rounded-sm"
                  style={{ background: color }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TransferChart
