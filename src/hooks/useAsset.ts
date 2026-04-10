import { useRecoilValue, useSetRecoilState } from 'recoil'
import BigNumber from 'bignumber.js'

import { ASSET } from 'consts'
import SendStore from 'store/SendStore'
import ContractStore from 'store/ContractStore'
import AuthStore from 'store/AuthStore'

import { SUPPORTED_ASSETS, ASSET_DECIMALS, AssetType } from 'types/asset'
import { BlockChainType, isCosmosChain, isEvmChain } from 'types/network'
import routes from 'consts/routes.json'

import useKeplrBalance from './useKeplrBalance'
import useEtherBaseBalance from './useEtherBaseBalance'

const useAsset = (): {
  getAssetList: () => Promise<void>
  formatBalance: (balance: string | BigNumber, coin?: string) => string
  getDecimals: (coin?: string) => number
} => {
  const asset = useRecoilValue(SendStore.asset)
  const setAsset = useSetRecoilState(SendStore.asset)
  const setAssetList = useSetRecoilState(ContractStore.assetList)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const cosmosWallet = useRecoilValue(AuthStore.cosmosWallet)
  const evmWallet = useRecoilValue(AuthStore.evmWallet)

  const { getKeplrBalances } = useKeplrBalance()
  const { getEtherBalances } = useEtherBaseBalance()

  const getAssetList = async (): Promise<void> => {
    let updatedAssets: AssetType[] = SUPPORTED_ASSETS.map((a) => ({
      ...a,
      balance: undefined,
    }))

    try {
      if (isCosmosChain(fromBlockChain) && cosmosWallet) {
        const whiteList = SUPPORTED_ASSETS.map((a) => a.denom)
        const balances = await getKeplrBalances({ whiteList })
        updatedAssets = SUPPORTED_ASSETS.map((a) => ({
          ...a,
          balance: balances[a.denom] || '0',
        }))
      } else if (isEvmChain(fromBlockChain) && evmWallet) {
        const srcName =
          fromBlockChain === BlockChainType.ethereum ? 'Ethereum' : 'Base'
        const denomToContract: Record<string, string> = {}
        for (const r of routes) {
          if (r.src === srcName && r.baseToken.startsWith('0x')) {
            denomToContract[r.denom] = r.baseToken
          }
        }

        const contractAddresses = Object.values(denomToContract)
        if (contractAddresses.length > 0) {
          const balances = await getEtherBalances({
            whiteList: contractAddresses,
          })
          updatedAssets = SUPPORTED_ASSETS.map((a) => {
            const contract = denomToContract[a.denom]
            return {
              ...a,
              balance: contract ? balances[contract] || '0' : '0',
            }
          })
        }
      }
    } catch (e) {
      console.error('Failed to fetch balances:', e)
    }

    setAssetList(updatedAssets)

    const currentDenom = asset?.denom
    const selectedAsset = currentDenom
      ? updatedAssets.find((a) => a.denom === currentDenom) || updatedAssets[0]
      : updatedAssets[0]
    setAsset(selectedAsset)
  }

  const getDecimals = (coin?: string): number => {
    const denom = coin || asset?.denom
    if (denom) {
      const decimals = ASSET_DECIMALS[denom as keyof typeof ASSET_DECIMALS]
      if (decimals !== undefined) {
        return Math.pow(10, decimals)
      }
    }
    return ASSET.ATOMONE_DECIMAL
  }

  const formatBalance = (
    balance: string | BigNumber,
    coin?: string
  ): string => {
    if (balance) {
      const bnBalance =
        typeof balance === 'string' ? new BigNumber(balance) : balance

      const decimals = getDecimals(coin)
      return bnBalance
        .div(decimals / ASSET.ATOMONE_DECIMAL)
        .integerValue(BigNumber.ROUND_DOWN)
        .div(ASSET.ATOMONE_DECIMAL)
        .dp(6)
        .toString(10)
    }

    return ''
  }

  return {
    getAssetList,
    formatBalance,
    getDecimals,
  }
}

export default useAsset
