import { NETWORK } from 'consts'
import { BlockChainType, EVM_CHAIN_IDS } from 'types/network'

declare global {
  interface Window {
    ethereum?: any
  }
}

const checkInstalled = (): boolean => {
  return typeof window !== 'undefined' && !!window.ethereum?.isMetaMask
}

const connect = async (): Promise<{
  address: string
  provider: any
}> => {
  const accounts = await window.ethereum?.request({
    method: 'eth_requestAccounts',
  })
  const address = (accounts && accounts[0]) || ''
  return { address, provider: window.ethereum }
}

const install = (): void => {
  window.open('https://metamask.io/download/', '_blank')
}

async function addNetworkAndSwitch(
  network: BlockChainType,
  target: number
): Promise<void> {
  const formatChainId = (n: number): string => '0x' + n.toString(16)
  const currentChain = window.ethereum?.networkVersion
  /* eslint eqeqeq: "off" */
  if (currentChain == target) return

  try {
    await window.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: formatChainId(target),
        },
      ],
    })
  } catch (e: any) {
    if (e.code === 4902) {
      await window.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: formatChainId(target),
            chainName: NETWORK.blockChainName[network],
            rpcUrls: NETWORK.evmRpc[network],
          },
        ],
      })
    } else {
      throw new Error(e)
    }
  }
}

const switchNetwork = async (network: BlockChainType): Promise<void> => {
  const chainId = EVM_CHAIN_IDS[network]
  if (chainId) {
    await addNetworkAndSwitch(network, chainId)
  }
}

export default { connect, checkInstalled, install, switchNetwork }
