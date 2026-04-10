import { useSetRecoilState } from 'recoil'

import { NETWORK } from 'consts'

import AuthStore from 'store/AuthStore'
import NetworkStore from 'store/NetworkStore'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

import { CosmosWallet, EvmWallet } from 'types/auth'
import { BlockChainType } from 'types/network'
import { WalletEnum } from 'types/wallet'

enum LocalStorageKey {
  lastFromBlockChain = 'lastFromBlockChain',
  lastToBlockChain = 'lastToBlockChain',
  lastWalletType = 'lastWalletType',
}

const useAuth = (): {
  loginCosmos: (wallet: CosmosWallet) => Promise<void>
  loginEvm: (wallet: EvmWallet) => Promise<void>
  disconnectCosmos: () => void
  disconnectEvm: () => void
  disconnectAll: () => void
  getLoginStorage: () => {
    lastFromBlockChain?: BlockChainType
    lastToBlockChain?: BlockChainType
    lastWalletType?: WalletEnum
  }
  setBlockchainStorage: (props: {
    fromBlockChain: BlockChainType
    toBlockChain: BlockChainType
  }) => void
} => {
  const setCosmosWallet = useSetRecoilState(AuthStore.cosmosWallet)
  const setEvmWallet = useSetRecoilState(AuthStore.evmWallet)
  const setEvmNetwork = useSetRecoilState(NetworkStore.evmNetwork)
  const setKeplrExt = useSetRecoilState(NetworkStore.keplrExt)
  const setIsVisibleNotSupportNetworkModal = useSetRecoilState(
    NetworkStore.isVisibleNotSupportNetworkModal
  )
  const setStatus = useSetRecoilState(SendProcessStore.sendProcessStatus)

  const loginCosmos = async (wallet: CosmosWallet): Promise<void> => {
    const chainId = await wallet.signer?.getChainId()
    if (chainId) {
      setKeplrExt({
        chainID: chainId,
        name: NETWORK.blockChainName[BlockChainType.atomone],
      })
      setCosmosWallet(wallet)
      localStorage.setItem(LocalStorageKey.lastWalletType, WalletEnum.Keplr)
    } else {
      setIsVisibleNotSupportNetworkModal(true)
    }
  }

  const loginEvm = async (wallet: EvmWallet): Promise<void> => {
    const chainId = await wallet.walletClient?.getChainId()
    if (chainId) {
      setEvmNetwork({ chainId, name: 'Ethereum' })
      setEvmWallet(wallet)
      localStorage.setItem(LocalStorageKey.lastWalletType, WalletEnum.MetaMask)
    } else {
      setIsVisibleNotSupportNetworkModal(true)
    }
  }

  const disconnectCosmos = (): void => {
    setCosmosWallet(null)
    setKeplrExt(undefined)
  }

  const disconnectEvm = (): void => {
    setEvmWallet(null)
    setEvmNetwork(undefined)
  }

  const disconnectAll = (): void => {
    disconnectCosmos()
    disconnectEvm()
    setStatus(ProcessStatus.Input)
    localStorage.removeItem(LocalStorageKey.lastWalletType)
  }

  const setBlockchainStorage = (props: {
    fromBlockChain: BlockChainType
    toBlockChain: BlockChainType
  }): void => {
    localStorage.setItem(
      LocalStorageKey.lastFromBlockChain,
      props.fromBlockChain
    )
    localStorage.setItem(LocalStorageKey.lastToBlockChain, props.toBlockChain)
  }

  const getLoginStorage = (): {
    lastFromBlockChain?: BlockChainType
    lastToBlockChain?: BlockChainType
    lastWalletType?: WalletEnum
  } => {
    return {
      lastFromBlockChain: (localStorage.getItem(
        LocalStorageKey.lastFromBlockChain
      ) || undefined) as BlockChainType | undefined,
      lastToBlockChain: (localStorage.getItem(
        LocalStorageKey.lastToBlockChain
      ) || undefined) as BlockChainType | undefined,
      lastWalletType: (localStorage.getItem(LocalStorageKey.lastWalletType) ||
        undefined) as WalletEnum | undefined,
    }
  }

  return {
    loginCosmos,
    loginEvm,
    disconnectCosmos,
    disconnectEvm,
    disconnectAll,
    getLoginStorage,
    setBlockchainStorage,
  }
}

export default useAuth
