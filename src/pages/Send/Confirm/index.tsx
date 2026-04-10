import { ReactElement } from 'react'
import { useRecoilValue } from 'recoil'
import { BoxArrowUpRight } from 'components/icons'

import { UTIL, COLOR } from 'consts'

import { ExtLink, Text } from 'components'
import FormImage from 'components/FormImage'

import SendStore from 'store/SendStore'

import useAsset from 'hooks/useAsset'

import SendProcessStore from 'store/SendProcessStore'
import useNetwork from 'hooks/useNetwork'

const Confirm = (): ReactElement => {
  const { formatBalance } = useAsset()

  // Send Data
  const asset = useRecoilValue(SendStore.asset)
  const toAddress = useRecoilValue(SendStore.toAddress)
  const amount = useRecoilValue(SendStore.amount)

  const requestTxResult = useRecoilValue(SendProcessStore.requestTxResult)

  const { getScannerLink } = useNetwork()

  return (
    <div className="pt-5">
      <div className="flex justify-between items-center py-3 border-b border-white/5 break-all">
        <div className="inline-block text-white/60 whitespace-nowrap text-xs font-normal leading-[1.25] tracking-[-0.28px]">
          Asset
        </div>
        <div className="flex items-center text-right pl-2.5">
          <FormImage
            src={asset?.logoURI || ''}
            size={18}
            style={{ paddingRight: 5 }}
          />
          <Text className="text-base font-medium leading-[1.5] tracking-[-0.37px]">
            {asset?.symbol}
          </Text>
        </div>
      </div>

      <div className="flex justify-between items-center py-3 border-b border-white/5 break-all">
        <div className="inline-block text-white/60 whitespace-nowrap text-xs font-normal leading-[1.25] tracking-[-0.28px]">
          Destination Address
        </div>
        <div className="flex items-center text-right pl-2.5">
          <Text className="text-base font-medium leading-[1.5] tracking-[-0.37px]">
            {UTIL.truncate(toAddress, [10, 10])}
          </Text>
        </div>
      </div>

      <div className="flex justify-between items-center py-3 border-b border-white/5 break-all">
        <div className="w-full flex justify-between items-center">
          <div className="inline-block text-white/60 whitespace-nowrap text-xs font-normal leading-[1.25] tracking-[-0.28px]">
            Receive amount
          </div>
          <div className="flex items-center text-right pl-2.5">
            <Text className="text-base font-medium leading-[1.5] tracking-[-0.37px]">
              {`${formatBalance(amount)} ${asset?.symbol}`}
            </Text>
          </div>
        </div>
      </div>

      {requestTxResult?.success && (
        <div className="flex justify-between items-center py-3 border-b border-white/5 break-all">
          <div
            className="inline-block whitespace-nowrap text-xs font-normal leading-[1.25] tracking-[-0.28px]"
            style={{ color: '#5592f7', opacity: 1 }}
          >
            TX
          </div>
          <div className="flex items-center text-right pl-2.5">
            <Text className="text-xs font-normal tracking-[-0.19px] text-right">
              {
                <ExtLink
                  href={getScannerLink({
                    address: requestTxResult.hash,
                    type: 'tx',
                  })}
                  style={{ padding: 0, display: 'flex', alignItems: 'center' }}
                >
                  <div>{UTIL.truncate(requestTxResult.hash, [15, 15])}</div>
                  <BoxArrowUpRight
                    color="#5592f7"
                    style={{ paddingLeft: 3, marginTop: -2 }}
                  />
                </ExtLink>
              }
            </Text>
          </div>
        </div>
      )}
    </div>
  )
}

export default Confirm
