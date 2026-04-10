import { atom, selector } from 'recoil'

import { CosmosWallet, EvmWallet } from 'types/auth'
import { isCosmosChain } from 'types/network'

import SendStore from './SendStore'

const cosmosWallet = atom<CosmosWallet | null>({
  key: 'cosmosWallet',
  default: null,
  dangerouslyAllowMutability: true,
})

const evmWallet = atom<EvmWallet | null>({
  key: 'evmWallet',
  default: null,
  dangerouslyAllowMutability: true,
})

const isLoggedIn = selector({
  key: 'isLoggedIn',
  get: ({ get }): boolean => {
    const fromBlockChain = get(SendStore.fromBlockChain)
    if (isCosmosChain(fromBlockChain)) {
      return !!get(cosmosWallet)
    }
    return !!get(evmWallet)
  },
})

const isFullyConnected = selector({
  key: 'isFullyConnected',
  get: ({ get }): boolean => {
    return !!get(cosmosWallet) && !!get(evmWallet)
  },
})

export default {
  cosmosWallet,
  evmWallet,
  isLoggedIn,
  isFullyConnected,
}
