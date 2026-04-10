import { ReactElement } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import type { Transfer } from 'packages/union/dashboard-graphql'
import ChainBadge from './ChainBadge'
import StatusBadge from './StatusBadge'

dayjs.extend(relativeTime)

const truncateAddr = (addr: string): string => {
  if (!addr) return '--'
  if (addr.length <= 16) return addr
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`
}

const formatAmount = (amount: string, decimals: number): string => {
  if (!amount) return '--'
  const num = Number(amount) / Math.pow(10, decimals)
  if (num === 0) return '0'
  if (num < 0.001) return '< 0.001'
  return num.toLocaleString(undefined, { maximumFractionDigits: 3 })
}

const formatTime = (timestamp: string | null): string => {
  if (!timestamp) return '--'
  return dayjs(timestamp).fromNow()
}

const TransferTable = ({
  transfers,
  loading = false,
  hasNextPage,
  hasPrevPage,
  currentPage,
  onNext,
  onPrev,
}: {
  transfers: Transfer[]
  loading?: boolean
  hasNextPage: boolean
  hasPrevPage: boolean
  currentPage: number
  onNext: () => void
  onPrev: () => void
}): ReactElement => (
  <div className="bg-bridge-dark rounded-lg p-5">
    <h3 className="text-base font-semibold mb-4">Transfer History</h3>

    {loading ? (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-bridge-gray rounded animate-pulse" />
        ))}
      </div>
    ) : !transfers.length ? (
      <div className="py-8 text-center text-gray-500 text-sm">
        No transfers found
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs uppercase tracking-wide border-b border-bridge-gray">
              <th className="text-left py-3 px-2 font-medium">Time</th>
              <th className="text-left py-3 px-2 font-medium">Token</th>
              <th className="text-right py-3 px-2 font-medium">Amount</th>
              <th className="text-left py-3 px-2 font-medium">From</th>
              <th className="text-left py-3 px-2 font-medium">To</th>
              <th className="text-left py-3 px-2 font-medium">Sender</th>
              <th className="text-left py-3 px-2 font-medium">Receiver</th>
              <th className="text-center py-3 px-2 font-medium">Status</th>
              <th className="text-center py-3 px-2 font-medium">Link</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((t) => (
              <tr
                key={t.packet_hash}
                className="border-b border-bridge-gray hover:bg-bridge-gray/40 transition-colors"
              >
                <td className="py-3 px-2 text-gray-500 whitespace-nowrap">
                  {formatTime(t.transfer_send_timestamp)}
                </td>
                <td className="py-3 px-2 font-medium whitespace-nowrap">
                  {t.token_symbol || '--'}
                </td>
                <td className="py-3 px-2 text-right whitespace-nowrap">
                  {formatAmount(t.base_amount, t.token_decimals)}
                </td>
                <td className="py-3 px-2">
                  <ChainBadge chainId={t.source_universal_chain_id} />
                </td>
                <td className="py-3 px-2">
                  <ChainBadge chainId={t.destination_universal_chain_id} />
                </td>
                <td
                  className="py-3 px-2 text-gray-500 whitespace-nowrap"
                  title={t.sender_display}
                >
                  {truncateAddr(t.sender_display)}
                </td>
                <td
                  className="py-3 px-2 text-gray-500 whitespace-nowrap"
                  title={t.receiver_display}
                >
                  {truncateAddr(t.receiver_display)}
                </td>
                <td className="py-3 px-2 text-center">
                  <StatusBadge success={t.success} />
                </td>
                <td className="py-3 px-2 text-center">
                  <a
                    href={`https://app.union.build/explorer/transfers/${t.packet_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bridge-sky hover:underline text-xs"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-bridge-gray">
          <button
            disabled={!hasPrevPage}
            className={`text-sm px-3 py-1.5 rounded transition-colors ${
              hasPrevPage
                ? 'text-white hover:bg-bridge-gray cursor-pointer'
                : 'text-gray-600 cursor-default'
            }`}
            onClick={onPrev}
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">Page {currentPage + 1}</span>
          <button
            disabled={!hasNextPage}
            className={`text-sm px-3 py-1.5 rounded transition-colors ${
              hasNextPage
                ? 'text-white hover:bg-bridge-gray cursor-pointer'
                : 'text-gray-600 cursor-default'
            }`}
            onClick={onNext}
          >
            Next
          </button>
        </div>
      </div>
    )}
  </div>
)

export default TransferTable
