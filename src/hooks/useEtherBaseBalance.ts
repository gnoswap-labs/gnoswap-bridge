import { useRecoilValue } from 'recoil'
import { createPublicClient, custom, erc20Abi } from 'viem'
import { mainnet, base } from 'viem/chains'

import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'

import { WhiteListType, BalanceListType } from 'types/asset'
import { BlockChainType, isEvmChain } from 'types/network'

const useEtherBaseBalance = (): {
  getEtherBalances: ({
    whiteList,
  }: {
    whiteList: WhiteListType
  }) => Promise<BalanceListType>
} => {
  const evmWallet = useRecoilValue(AuthStore.evmWallet)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const getEtherBalances = async ({
    whiteList,
  }: {
    whiteList: WhiteListType
  }): Promise<BalanceListType> => {
    const userAddress = evmWallet?.address
    if (!userAddress || !isEvmChain(fromBlockChain)) {
      return {}
    }

    const chain = fromBlockChain === BlockChainType.base ? base : mainnet
    const publicClient = createPublicClient({
      chain,
      transport: custom(window.ethereum!),
    })

    const list: BalanceListType = {}
    await Promise.all(
      whiteList.map(async (token) => {
        try {
          const balance = await publicClient.readContract({
            address: token as `0x${string}`,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [userAddress as `0x${string}`],
          })
          list[token] = balance.toString()
        } catch (e) {
          console.error(`Failed to fetch balance for ${token}:`, e)
          list[token] = '0'
        }
      })
    )
    return list
  }

  return { getEtherBalances }
}

export default useEtherBaseBalance
