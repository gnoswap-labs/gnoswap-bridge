import { ReactElement, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { BoxArrowUpRight } from 'components/icons'

import { UTIL, NETWORK, COLOR } from 'consts'

import { ExtLink, Text } from 'components'

import SendStore from 'store/SendStore'
import PacketTracker from 'components/PacketTracker'

import useAsset from 'hooks/useAsset'

import SendProcessStore from 'store/SendProcessStore'
import AuthStore from 'store/AuthStore'
import FormImage from 'components/FormImage'
import { isCosmosChain } from 'types/network'

const Finish = (): ReactElement => {
  const { formatBalance } = useAsset()
  const cosmosWallet = useRecoilValue(AuthStore.cosmosWallet)
  const evmWallet = useRecoilValue(AuthStore.evmWallet)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const walletType = isCosmosChain(fromBlockChain)
    ? cosmosWallet?.walletType || 'Keplr'
    : evmWallet?.walletType || 'MetaMask'

  // Send Data
  const asset = useRecoilValue(SendStore.asset)
  const [toAddress, setToAddress] = useRecoilState(SendStore.toAddress)
  const [amount, setAmount] = useRecoilState(SendStore.amount)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)

  const [requestTxResult, setRequestTxResult] = useRecoilState(
    SendProcessStore.requestTxResult
  )
  const [waitForReceiptError, setWaitForReceiptError] = useRecoilState(
    SendProcessStore.waitForReceiptError
  )

  const [displayAmount] = useState(amount)
  const [displayToAddress] = useState(toAddress)
  const [displayRequestTxResult] = useState(requestTxResult)
  const [displayErrorMessage] = useState(waitForReceiptError)

  useEffect(() => {
    setToAddress('')
    setAmount('')
    setRequestTxResult({ success: false })
    setWaitForReceiptError('')
  }, [])

  return (
    <div className="pt-5 pb-10">
      {!!displayErrorMessage ? (
        <Text
          className="whitespace-pre-wrap text-center block mb-[46px] text-xs"
          style={{ color: COLOR.red }}
        >
          {displayErrorMessage}
        </Text>
      ) : (
        <>
          <Text
            className="whitespace-pre-wrap text-center block mb-[46px] text-xs"
            style={{ color: COLOR.skyGray }}
          >
            {`Transferring ${asset?.symbol} from ${NETWORK.blockChainName[fromBlockChain]} Network to ${NETWORK.blockChainName[toBlockChain]} Network.\nTransaction will be submitted via ${walletType}`}
          </Text>
        </>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          paddingBottom: 15,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FormImage src={asset?.logoURI || ''} size={24} />
          <Text
            style={{
              fontSize: 22,
              paddingLeft: 10,
              letterSpacing: -0.5,
              wordBreak: 'break-all',
            }}
          >
            {formatBalance(displayAmount)} {asset?.symbol}
          </Text>
        </div>
      </div>
      <div className="flex justify-between items-start py-4 border-b border-white/5 break-all">
        <div className="inline-block text-white/60 whitespace-nowrap text-xs font-normal leading-[1.25] tracking-[-0.19px]">
          Destination Address
        </div>
        <div className="inline-block text-right pl-2.5">
          <Text className="text-xs font-normal tracking-[-0.19px] text-right">
            {UTIL.truncate(displayToAddress, [10, 10])}
          </Text>
        </div>
      </div>

      {displayRequestTxResult?.success && (
        <>
          {displayRequestTxResult.packetHash && (
            <>
              <div className="flex justify-between items-start py-4 border-b border-white/5 break-all">
                <div
                  className="inline-block whitespace-nowrap text-xs font-normal leading-[1.25] tracking-[-0.19px]"
                  style={{ color: '#5592f7', opacity: 1 }}
                >
                  TX
                </div>
                <div className="inline-block text-right pl-2.5">
                  <Text className="text-xs font-normal tracking-[-0.19px] text-right">
                    <ExtLink
                      href={`https://app.union.build/explorer/transfers/${displayRequestTxResult.packetHash}`}
                      style={{
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        {UTIL.truncate(
                          displayRequestTxResult.packetHash,
                          [10, 10]
                        )}
                      </div>
                      <BoxArrowUpRight
                        color="#5592f7"
                        size={12}
                        style={{ paddingLeft: 3, marginTop: -2 }}
                      />
                    </ExtLink>
                  </Text>
                </div>
              </div>

              <PacketTracker packetHash={displayRequestTxResult.packetHash} />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Finish
