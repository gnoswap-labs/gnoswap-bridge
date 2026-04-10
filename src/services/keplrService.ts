import { SigningStargateClient, GasPrice } from '@cosmjs/stargate'
import {
  BlockChainType,
  ATOMONE_CHAIN_ID,
  ATOMONE_RPC,
  ATOMONE_BECH32_PREFIX,
} from 'types/network'

declare global {
  interface Window {
    keplr: any
  }
}

const checkInstalled = (): boolean => {
  return !!window.keplr
}

const connect = async (
  _chain: BlockChainType
): Promise<{
  address: string
  signingCosmosClient: SigningStargateClient
}> => {
  const keplr = window.keplr
  const chainId = ATOMONE_CHAIN_ID

  if (keplr.experimentalSuggestChain) {
    try {
      await keplr.experimentalSuggestChain({
        chainId,
        chainName: 'AtomOne',
        rpc: ATOMONE_RPC,
        rest: 'https://atomone-api.allinbits.com/',
        bip44: { coinType: 118 },
        coinType: 118,
        stakeCurrency: {
          coinDenom: 'ATONE',
          coinMinimalDenom: 'uatone',
          coinDecimals: 6,
        },
        bech32Config: {
          bech32PrefixAccAddr: ATOMONE_BECH32_PREFIX,
          bech32PrefixAccPub: `${ATOMONE_BECH32_PREFIX}pub`,
          bech32PrefixValAddr: `${ATOMONE_BECH32_PREFIX}valoper`,
          bech32PrefixValPub: `${ATOMONE_BECH32_PREFIX}valoperpub`,
          bech32PrefixConsAddr: `${ATOMONE_BECH32_PREFIX}valcons`,
          bech32PrefixConsPub: `${ATOMONE_BECH32_PREFIX}valconspub`,
        },
        currencies: [
          { coinDenom: 'ATONE', coinMinimalDenom: 'uatone', coinDecimals: 6 },
          {
            coinDenom: 'PHOTON',
            coinMinimalDenom: 'uphoton',
            coinDecimals: 6,
          },
        ],
        feeCurrencies: [
          {
            coinDenom: 'PHOTON',
            coinMinimalDenom: 'uphoton',
            coinDecimals: 6,
          },
        ],
        gasPriceStep: { low: 0.001, average: 0.0025, high: 0.004 },
      })
    } catch (error) {
      console.error('Failed to suggest AtomOne chain:', error)
    }
  }

  await keplr.enable(chainId)
  const keplrOfflineSigner = await keplr.getOfflineSignerAuto(chainId)
  const accounts = await keplrOfflineSigner.getAccounts()
  const address = accounts[0].address

  const signingCosmosClient = await SigningStargateClient.connectWithSigner(
    ATOMONE_RPC,
    keplrOfflineSigner,
    { gasPrice: GasPrice.fromString('0.0025uphoton') }
  )

  // @ts-expect-error attach chainId for reference
  signingCosmosClient.chainId = chainId

  return { address, signingCosmosClient }
}

export default { connect, checkInstalled }
