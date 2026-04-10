import { BlockChainType, isEvmChain, EVM_CHAIN_IDS } from 'types/network'
import AtoneSvg from 'images/atone.svg'
import EthereumSvg from 'images/ethereum.svg'
import BaseSvg from 'images/base.svg'

const blockChainImage: Record<BlockChainType, string> = {
  [BlockChainType.atomone]: AtoneSvg,
  [BlockChainType.ethereum]: EthereumSvg,
  [BlockChainType.base]: BaseSvg,
}

const blockChainName: Record<BlockChainType, string> = {
  [BlockChainType.atomone]: 'AtomOne',
  [BlockChainType.ethereum]: 'Ethereum',
  [BlockChainType.base]: 'Base',
}

const evmRpc: Record<string, string[]> = {
  [BlockChainType.ethereum]: ['https://eth.llamarpc.com'],
  [BlockChainType.base]: ['https://mainnet.base.org'],
}

function isEtherBaseBlockChain(blockChain: BlockChainType): boolean {
  return isEvmChain(blockChain)
}

const KEPLR_EXTENSION =
  'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap'

export default {
  blockChainImage,
  blockChainName,
  evmRpc,
  isEtherBaseBlockChain,
  EVM_CHAIN_IDS,
  KEPLR_EXTENSION,
}
