import { WalletClient } from 'viem'
import { SigningStargateClient } from '@cosmjs/stargate'
import { WalletEnum } from './wallet'

export type CosmosWallet = {
  address: string
  signer: SigningStargateClient
  walletType: WalletEnum.Keplr
}

export type EvmWallet = {
  address: string
  walletClient: WalletClient
  walletType: WalletEnum.MetaMask
}

// Legacy User type for backward compat during transition
export type User = {
  address: string
  walletClient?: WalletClient
  signer?: SigningStargateClient
  walletType: WalletEnum
}
