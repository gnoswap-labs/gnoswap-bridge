import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import NetworkStore from 'store/NetworkStore'
import SendStore from 'store/SendStore'

import {
  BlockChainType,
  isCosmosChain,
  isEvmChain,
  EVM_CHAIN_IDS,
} from 'types/network'

const useNetwork = (): {
  getScannerLink: (props: { address: string; type: 'tx' | 'address' }) => string
  fromTokenAddress?: string
  toTokenAddress?: string
} => {
  const asset = useRecoilValue(SendStore.asset)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const evmNetwork = useRecoilValue(NetworkStore.evmNetwork)

  const getScannerLink = ({
    address,
    type,
  }: {
    address: string
    type: 'tx' | 'address'
  }): string => {
    if (isCosmosChain(fromBlockChain)) {
      // AtomOne explorer
      return type === 'tx'
        ? `https://explorer.atomone.com/atomone-1/tx/${address}`
        : `https://explorer.atomone.com/atomone-1/account/${address}`
    } else if (fromBlockChain === BlockChainType.ethereum) {
      return `https://etherscan.io/${type}/${address}`
    } else if (fromBlockChain === BlockChainType.base) {
      return `https://basescan.org/${type}/${address}`
    }
    return ''
  }

  const fromTokenAddress = useMemo(() => asset?.denom, [asset])
  const toTokenAddress = useMemo(() => asset?.denom, [asset])

  return {
    getScannerLink,
    fromTokenAddress,
    toTokenAddress,
  }
}

export default useNetwork
