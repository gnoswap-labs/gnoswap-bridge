import { ReactElement } from 'react'

import { CHAIN_DISPLAY } from 'packages/union/dashboard-graphql'

const ChainBadge = ({ chainId }: { chainId: string }): ReactElement => {
  const chain = CHAIN_DISPLAY[chainId] ?? { name: chainId, color: '#9F9F9F' }

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ background: 'rgba(255,255,255,0.05)' }}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: chain.color }}
      />
      {chain.name}
    </span>
  )
}

export default ChainBadge
