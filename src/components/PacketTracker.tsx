import { ReactElement, useEffect, useState, useRef } from 'react'
import type { PacketDetails, PacketStatus } from 'packages/union/graphql'

const STEPS: { status: PacketStatus; label: string }[] = [
  { status: 'PACKET_SEND', label: 'Sent' },
  { status: 'PACKET_RECV', label: 'Received' },
  { status: 'WRITE_ACK', label: 'Acknowledged' },
  { status: 'PACKET_ACK', label: 'Completed' },
]

const STATUS_ORDER: Record<string, number> = {
  PACKET_SEND: 0,
  PACKET_RECV: 1,
  WRITE_ACK: 2,
  PACKET_ACK: 3,
}

function StepDot({
  active,
  completed,
}: {
  active: boolean
  completed: boolean
}): ReactElement {
  if (completed) {
    return (
      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="white">
          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
        </svg>
      </div>
    )
  }
  if (active) {
    return (
      <div className="w-6 h-6 rounded-full bg-bridge-sky flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
      </div>
    )
  }
  return (
    <div className="w-6 h-6 rounded-full bg-[#3a3a3a] border border-[#555]" />
  )
}

export default function PacketTracker({
  packetHash,
}: {
  packetHash: string
}): ReactElement {
  const [packet, setPacket] = useState<PacketDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (!packetHash) return

    const poll = async (): Promise<void> => {
      try {
        const res = await fetch('https://graphql.union.build/v1/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query($h: String!) @cached(ttl:15) {
              v2_packets(args:{p_packet_hash:$h}) {
                packet_hash status
                packet_send_transaction_hash
                packet_recv_transaction_hash
                packet_ack_transaction_hash
                source_universal_chain_id
                destination_universal_chain_id
                traces { type height timestamp transaction_hash chain { universal_chain_id } }
              }
            }`,
            variables: { h: packetHash },
          }),
        })
        const json = await res.json()
        const packets = json?.data?.v2_packets
        if (packets && packets.length > 0) {
          setPacket(packets[0])
          if (packets[0].status === 'PACKET_ACK') {
            clearInterval(intervalRef.current)
          }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to query packet')
      }
    }

    poll()
    intervalRef.current = setInterval(poll, 10_000)
    return (): void => clearInterval(intervalRef.current)
  }, [packetHash])

  if (!packetHash) return <></>

  const currentOrder = packet ? STATUS_ORDER[packet.status] ?? -1 : -1

  return (
    <div className="bg-bridge-dark rounded-xl p-5 mt-4">
      <div className="text-gray-400 text-xs mb-3">Packet Tracking</div>

      {error && <div className="text-bridge-red text-xs mb-3">{error}</div>}

      <div className="flex items-center justify-between mb-4">
        {STEPS.map((step, i) => {
          const stepOrder = STATUS_ORDER[step.status]
          const completed = currentOrder > stepOrder
          const active = currentOrder === stepOrder
          return (
            <div key={step.status} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <StepDot active={active} completed={completed} />
                <span
                  className={`text-[10px] mt-1 ${
                    completed
                      ? 'text-green-400'
                      : active
                      ? 'text-bridge-sky'
                      : 'text-gray-600'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 mb-4 ${
                    currentOrder > stepOrder ? 'bg-green-500' : 'bg-[#3a3a3a]'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="text-gray-500 text-[10px] font-mono break-all">
        {packetHash}
      </div>
    </div>
  )
}
