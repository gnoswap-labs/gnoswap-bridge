import { useRecoilValue } from 'recoil'
import { getContract, GetContractReturnType } from 'viem'

import abi from 'consts/abi.json'
import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'
import { isEvmChain } from 'types/network'

const useEtherBaseContract = (): {
  getEtherBaseContract: ({
    token,
  }: {
    token: string
  }) => GetContractReturnType | undefined
} => {
  const evmWallet = useRecoilValue(AuthStore.evmWallet)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const getEtherBaseContract = ({
    token,
  }: {
    token: string
  }): GetContractReturnType | undefined => {
    if (isEvmChain(fromBlockChain) && evmWallet?.walletClient && token) {
      try {
        return getContract({
          address: token as `0x${string}`,
          abi: abi as any,
          client: evmWallet.walletClient,
        })
      } catch {}
    }
    return undefined
  }

  return { getEtherBaseContract }
}

export default useEtherBaseContract
