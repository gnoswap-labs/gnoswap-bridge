import { useState, useCallback } from 'react'
import { EncodeObject } from '@cosmjs/proto-signing'
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx'
import { useRecoilValue } from 'recoil'
import { createPublicClient, custom, erc20Abi, maxUint256 } from 'viem'
import { mainnet, base } from 'viem/chains'

import { makeAtoneToEthTransaction } from 'packages/union/a1-eth-hook'
import { makeEthToAtoneTransaction } from 'packages/union/eth-a1-hook'
import { ETH_ZKGM_ADDRESS, BASE_ZKGM_ADDRESS } from 'packages/union/constants'
import routes from 'consts/routes.json'
import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'
import { BlockChainType } from 'types/network'
import { RequestTxResultType } from 'types/send'
import { NETWORK } from 'consts'

interface BridgeInfo {
  memo: unknown
  hash: string
  baseToken: string
  receiver: string
  sourceChannel: string
}

const buildBridgeInfo = async (
  src: string,
  dest: string,
  rcpt: string,
  sender: string,
  denom: string,
  amount: string
): Promise<BridgeInfo> => {
  const route = routes.find(
    (r) =>
      r.src.toLowerCase() === src.toLowerCase() &&
      r.dest.toLowerCase() === dest.toLowerCase() &&
      denom === r.denom
  )
  if (!route) {
    throw new Error(
      `Bridge from ${src} to ${dest} with denom ${denom} is not supported.`
    )
  }

  if (src === 'atomone') {
    const { hash, ...memo } = await makeAtoneToEthTransaction(
      src,
      dest,
      sender,
      rcpt,
      BigInt(amount),
      route.baseToken,
      route.quoteToken,
      route.metadata
    )
    return {
      memo,
      hash,
      baseToken: route.baseToken,
      receiver: dest === 'ethereum' ? ETH_ZKGM_ADDRESS : BASE_ZKGM_ADDRESS,
      sourceChannel: `channel-${route.source_channel}`,
    }
  } else {
    const { hash, ...tx } = await makeEthToAtoneTransaction(
      src,
      dest,
      sender,
      rcpt,
      BigInt(amount),
      route.baseToken,
      route.quoteToken,
      route.metadata
    )
    return {
      hash,
      memo: tx.preparedRequest,
      baseToken: route.baseToken,
      receiver: tx.preparedRequest.to as string,
      sourceChannel: `channel-${route.source_channel}`,
    }
  }
}

export interface UseBridgeReturn {
  loading: boolean
  createBridge: (
    src: string,
    dest: string,
    rcpt: string,
    denom: string,
    amount: string
  ) => Promise<RequestTxResultType>
}

export default function useBridge(): UseBridgeReturn {
  const [loading, setLoading] = useState(false)
  const cosmosWallet = useRecoilValue(AuthStore.cosmosWallet)
  const evmWallet = useRecoilValue(AuthStore.evmWallet)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const createBridge = useCallback(
    async (
      src: string,
      dest: string,
      rcpt: string,
      denom: string,
      amount: string
    ): Promise<RequestTxResultType> => {
      setLoading(true)
      try {
        if (src === 'atomone') {
          const signer = cosmosWallet?.signer
          const address = cosmosWallet?.address
          if (!signer || !address) {
            return {
              success: false,
              errorMessage: 'Keplr wallet not connected',
            }
          }

          const { memo, receiver, hash, sourceChannel } = await buildBridgeInfo(
            src,
            dest,
            rcpt,
            address,
            denom,
            amount
          )

          const msg = MsgTransfer.fromPartial({
            sender: address,
            sourcePort: 'transfer',
            sourceChannel,
            token: { denom, amount: String(amount) },
            receiver,
            memo: JSON.stringify(memo),
            timeoutHeight: undefined,
            timeoutTimestamp:
              BigInt(Date.now() + 10 * 60 * 1000) * BigInt(1_000_000),
          })

          const transfer: EncodeObject = {
            typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
            value: msg,
          }

          const txResult = await signer.signAndBroadcast(
            address,
            [transfer],
            'auto'
          )

          return {
            success: true,
            hash: txResult.transactionHash,
            packetHash: hash,
          }
        }

        if (src === 'ethereum' || src === 'base') {
          const walletClient = evmWallet?.walletClient
          const address = evmWallet?.address
          if (!walletClient || !address) {
            return { success: false, errorMessage: 'MetaMask not connected' }
          }

          const { memo, baseToken, hash } = await buildBridgeInfo(
            src,
            dest,
            rcpt,
            address,
            denom,
            amount
          )

          // ERC20 approval — spender is the UCS03 ZKGM contract on the EVM chain
          if (baseToken.startsWith('0x')) {
            const spender = (memo as Record<string, unknown>)
              .to as `0x${string}`
            const chain =
              fromBlockChain === BlockChainType.base ? base : mainnet
            const publicClient = createPublicClient({
              chain,
              transport: custom(window.ethereum!),
            })

            const allowance = await publicClient.readContract({
              address: baseToken as `0x${string}`,
              abi: erc20Abi,
              functionName: 'allowance',
              args: [address as `0x${string}`, spender],
            })

            if (allowance < BigInt(amount)) {
              const approveTxHash = await walletClient.writeContract({
                address: baseToken as `0x${string}`,
                abi: erc20Abi,
                functionName: 'approve',
                args: [spender, maxUint256],
                account: address as `0x${string}`,
                chain,
              })

              // Wait for approval to be mined
              await publicClient.waitForTransactionReceipt({
                hash: approveTxHash,
              })
            }
          }

          // memo is the full preparedRequest from Union SDK
          const preparedRequest = memo as Record<string, unknown>

          const txHash = await walletClient.sendTransaction({
            to: preparedRequest.to as `0x${string}`,
            data: preparedRequest.data as `0x${string}`,
            value: preparedRequest.value
              ? BigInt(preparedRequest.value as string)
              : BigInt(0),
            account: address as `0x${string}`,
            chain: undefined,
          })

          return {
            success: true,
            hash: txHash,
            packetHash: hash,
          }
        }

        return {
          success: false,
          errorMessage: `Unsupported source chain: ${src}`,
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return { success: false, errorMessage: message }
      } finally {
        setLoading(false)
      }
    },
    [cosmosWallet, evmWallet]
  )

  return { loading, createBridge }
}
