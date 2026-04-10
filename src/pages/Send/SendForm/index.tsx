import { ReactElement, useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { useDebouncedCallback } from 'use-debounce'
import BigNumber from 'bignumber.js'
import { ArrowClockwise } from 'components/icons'

import { COLOR } from 'consts'

import { ValidateItemResultType } from 'types/send'
import { Text, Row } from 'components'
import FormLabel from 'components/FormLabel'
import FormErrorMessage from 'components/FormErrorMessage'
import FormLabelInput from 'components/FormLabelInput'

import useSendValidate from 'hooks/useSendValidate'
import useAsset from 'hooks/useAsset'

import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'

import AssetList from './AssetList'
import AutoFillButton from './AutoFillButton'

const RefreshButton = (): ReactElement => {
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)
  const { getAssetList } = useAsset()
  const [refreshing, setRefreshing] = useState(false)
  const dbcRefresh = useDebouncedCallback(() => {
    setRefreshing(true)
    getAssetList().finally((): void => {
      setTimeout(() => {
        setRefreshing(false)
      }, 500)
    })
  }, 300)

  return (
    <>
      {isLoggedIn && (
        <div
          className="flex items-center text-bridge-sky text-xs font-bold select-none"
          style={{
            opacity: refreshing ? 0.5 : 1,
            cursor: refreshing ? 'default' : 'pointer',
          }}
          onClick={(): void => {
            dbcRefresh()
          }}
        >
          <ArrowClockwise style={{ marginRight: 5 }} size={14} />
          <Text
            style={{
              fontWeight: 500,
              fontSize: 10,
              color: COLOR.terraSky,
            }}
          >
            {refreshing ? 'REFRESHING...' : 'REFRESH'}
          </Text>
        </div>
      )}
    </>
  )
}

const SendForm = ({
  feeValidationResult,
}: {
  feeValidationResult: ValidateItemResultType
}): ReactElement => {
  const cosmosWallet = useRecoilValue(AuthStore.cosmosWallet)
  const evmWallet = useRecoilValue(AuthStore.evmWallet)
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  // Send Data
  const asset = useRecoilValue(SendStore.asset)
  const [toAddress, setToAddress] = useRecoilState(SendStore.toAddress)
  const [amount, setAmount] = useRecoilState(SendStore.amount)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const [validationResult, setValidationResult] = useRecoilState(
    SendStore.validationResult
  )

  const [inputAmount, setInputAmount] = useState('')

  const { formatBalance, getAssetList, getDecimals } = useAsset()
  const { validateSendData } = useSendValidate()

  const onChangeToAddress = ({ value }: { value: string }): void => {
    setToAddress(value)
  }

  const onChangeAmount = ({ value }: { value: string }): void => {
    if (!value || value.length === 0) {
      setInputAmount('')
      setAmount('')
      return
    }

    if (false === isNaN(Number(value))) {
      setInputAmount(value)
      const decimalSize = new BigNumber(getDecimals())
      setAmount(new BigNumber(value).times(decimalSize).toString(10))
    }
  }

  const onClickMaxButton = async (): Promise<void> => {
    const assetAmount = new BigNumber(asset?.balance || 0)
    onChangeAmount({ value: formatBalance(assetAmount) })
  }

  const dbcGetValidation = useDebouncedCallback(async () => {
    setValidationResult({ isValid: false })
    const sendDataResult = await validateSendData()
    setValidationResult(sendDataResult)
  }, 300)

  useEffect(() => {
    dbcGetValidation()
    return (): void => {
      dbcGetValidation.cancel()
    }
  }, [amount, toAddress, toBlockChain, fromBlockChain, asset])

  useEffect(() => {
    onChangeAmount({ value: inputAmount })
    getAssetList().then((): void => {
      dbcGetValidation()
    })
  }, [cosmosWallet, evmWallet, toBlockChain, fromBlockChain])

  return (
    <div>
      <div className="mb-10">
        <Row style={{ justifyContent: 'space-between' }}>
          <FormLabel title={'Asset'} />
          <RefreshButton />
        </Row>

        <AssetList {...{ selectedAsset: asset, onChangeAmount }} />
        <FormErrorMessage
          errorMessage={validationResult.errorMessage?.asset}
          style={{ marginBottom: 0 }}
        />
      </div>

      <div className="mb-10">
        <div style={{ position: 'relative' }}>
          <FormLabelInput
            inputProps={{
              type: 'number',
              value: inputAmount,
              onChange: ({ target: { value } }): void => {
                onChangeAmount({ value })
              },
            }}
            labelProps={{ children: 'Amount' }}
          />
          <div
            className="absolute top-1/2 -mt-[13px] right-0 bg-bridge-gray text-xs rounded-[5px] px-2.5 leading-6 h-[26px] flex items-center cursor-pointer hover:bg-[#323842]"
            onClick={onClickMaxButton}
          >
            Max
          </div>
        </div>

        {isLoggedIn && (
          <FormErrorMessage
            errorMessage={validationResult.errorMessage?.amount}
          />
        )}
      </div>

      <div className="mb-10">
        <div style={{ position: 'relative' }}>
          <FormLabelInput
            inputProps={{
              value: toAddress,
              onChange: ({ target: { value } }): void => {
                onChangeToAddress({ value })
              },
            }}
            labelProps={{ children: 'Destination Address' }}
          />
          <AutoFillButton />
        </div>
        <FormErrorMessage
          errorMessage={validationResult.errorMessage?.toAddress}
        />
      </div>
    </div>
  )
}

export default SendForm
