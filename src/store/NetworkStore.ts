import { atom } from 'recoil'

import { BlockChainType } from 'types/network'

type EvmNetwork = { chainId: number; name: string }

const evmNetwork = atom<EvmNetwork | undefined>({
  key: 'evmNetwork',
  default: undefined,
})

const keplrExt = atom<{ chainID: string; name: string } | undefined>({
  key: 'keplrExt',
  default: undefined,
})

const isVisibleNotSupportNetworkModal = atom<boolean>({
  key: 'isVisibleNotSupportNetworkModal',
  default: false,
})

const triedNotSupportNetwork = atom<
  | {
      blockChain: BlockChainType
      name: string
      chainId: string | number
    }
  | undefined
>({
  key: 'triedNotSupportNetwork',
  default: undefined,
})

export default {
  evmNetwork,
  keplrExt,
  isVisibleNotSupportNetworkModal,
  triedNotSupportNetwork,
}
