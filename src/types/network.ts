export enum BlockChainType {
  atomone = 'atomone',
  ethereum = 'ethereum',
  base = 'base',
}

export enum BridgeType {
  union = 'union',
}

export const availableBridges: Record<BlockChainType, BridgeType[]> = {
  [BlockChainType.atomone]: [BridgeType.union],
  [BlockChainType.ethereum]: [BridgeType.union],
  [BlockChainType.base]: [BridgeType.union],
}

export function getDefaultBridge(
  _from: BlockChainType,
  _to: BlockChainType
): BridgeType {
  return BridgeType.union
}

export function isCosmosChain(chain: BlockChainType): boolean {
  return chain === BlockChainType.atomone
}

export function isEvmChain(chain: BlockChainType): boolean {
  return chain === BlockChainType.ethereum || chain === BlockChainType.base
}

export const ATOMONE_CHAIN_ID = 'atomone-1'
export const ATOMONE_RPC = 'https://atomone-rpc.allinbits.com/'
export const ATOMONE_API = 'https://atomone-api.allinbits.com/'
export const ATOMONE_BECH32_PREFIX = 'atone'

export const EVM_CHAIN_IDS: Record<string, number> = {
  [BlockChainType.ethereum]: 1,
  [BlockChainType.base]: 8453,
}
