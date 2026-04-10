import { ReactElement, useEffect, useRef, useState } from 'react'

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { CaretDownFill } from 'components/icons'

import { COLOR } from 'consts'

import { AssetType } from 'types/asset'

import { Text, View, Row } from 'components'
import DefaultModal from 'components/Modal'
import FormInput from 'components/FormInput'
import FormImage from 'components/FormImage'

import useAsset from 'hooks/useAsset'
import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'
import ContractStore from 'store/ContractStore'

import { InfoElement } from './WarningInfo'

const AssetItem = ({
  asset,
  setShowModal,
  onChangeAmount,
}: {
  asset: AssetType
  setShowModal: (value: boolean) => void
  onChangeAmount: ({ value }: { value: string }) => void
}): ReactElement => {
  const [oriAsset, setAsset] = useRecoilState(SendStore.asset)
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  const { formatBalance } = useAsset()

  return (
    <div
      className="relative border-b border-white/5 py-2.5 px-5 leading-4 cursor-pointer hover:bg-[#171717] last:border-b-0"
      onClick={(): void => {
        if (oriAsset !== asset) {
          onChangeAmount({ value: '' })
        }
        setAsset(asset)
        setShowModal(false)
      }}
    >
      <Row style={{ justifyContent: 'space-between' }}>
        <Row>
          <View className="flex-[0_0_8%] self-center mt-[3px] mb-[3px] pr-2.5">
            <FormImage src={asset.logoURI} size={20} />
          </View>
          <View>
            <Text style={{ fontSize: 14, fontWeight: 500 }}>
              {asset.symbol}
            </Text>
            <Text style={{ color: COLOR.blueGray, fontSize: 12 }}>
              {asset.name}
            </Text>
          </View>
        </Row>
        {isLoggedIn && (
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ fontSize: 14 }}>
              {asset.balance ? formatBalance(asset.balance, asset.denom) : '0'}{' '}
            </Text>
          </View>
        )}
      </Row>
    </div>
  )
}

const SelectAssetButton = ({
  asset,
  setShowModal,
}: {
  asset?: AssetType
  setShowModal: (value: boolean) => void
}): ReactElement => {
  const { formatBalance } = useAsset()
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  return (
    <div
      className="cursor-pointer border-b-2 border-bridge-gray pt-3 pb-1.5 text-sm font-medium hover:opacity-80"
      onClick={(): void => {
        setShowModal(true)
      }}
    >
      {asset && (
        <Row>
          <Row style={{ flex: 1, alignItems: 'center' }}>
            <FormImage
              src={asset.logoURI}
              size={18}
              style={{ marginTop: -2 }}
            />
            <Text style={{ marginLeft: 10, fontSize: 16 }}>{asset.symbol}</Text>
          </Row>
          <Row style={{ alignItems: 'center' }}>
            {isLoggedIn && (
              <Text
                style={{
                  justifyContent: 'flex-end',
                  marginRight: 10,
                  fontWeight: 'normal',
                  color: '#A3A3A3',
                }}
              >
                Available{' '}
                {asset.balance
                  ? formatBalance(asset.balance, asset.denom)
                  : '0'}
              </Text>
            )}
            <CaretDownFill style={{ fontSize: 8, marginTop: -2 }} />
          </Row>
        </Row>
      )}
    </div>
  )
}

const AssetList = ({
  selectedAsset,
  onChangeAmount,
}: {
  selectedAsset?: AssetType
  onChangeAmount: ({ value }: { value: string }) => void
}): ReactElement => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const assetList = useRecoilValue(ContractStore.assetList)
  const setAsset = useSetRecoilState(SendStore.asset)
  const [showModal, setShowModal] = useState(false)
  const [inputFilter, setInputFilter] = useState('')

  const filteredAssetList = assetList.filter((x) => {
    const inputFilterLower = inputFilter.toLowerCase()
    return inputFilterLower
      ? x.name.toLowerCase().includes(inputFilterLower) ||
          x.symbol.toLowerCase().includes(inputFilterLower)
      : true
  })

  useEffect(() => {
    if (showModal) {
      setInputFilter('')
      scrollRef.current?.scrollTo({ top: 200, behavior: 'smooth' })
    }
  }, [showModal])

  useEffect(() => {
    if (Array.isArray(assetList) && assetList.length > 0) {
      if (selectedAsset) {
        setAsset(
          assetList.find((x) => x.denom === selectedAsset.denom) || assetList[0]
        )
      } else {
        setAsset(assetList[0])
      }
    }
  }, [assetList])

  return (
    <>
      <SelectAssetButton asset={selectedAsset} setShowModal={setShowModal} />
      <DefaultModal
        {...{
          isOpen: showModal,
          close: (): void => {
            setShowModal(false)
          },
        }}
        header={<Text style={{ justifyContent: 'center' }}>Select Asset</Text>}
      >
        <div className="px-[25px] pb-10 bg-bridge-gray max-[575px]:px-6 max-[575px]:pb-5">
          <div
            style={{
              marginBottom: 25,
              border: 'solid 1px rgba(255,255,255,.15)',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <FormInput
              onChange={({ currentTarget: { value } }): void => {
                setInputFilter(value)
              }}
              maxLength={30}
              placeholder={'Search'}
              style={{ marginLeft: 24 }}
            />
          </div>

          <div
            ref={scrollRef}
            className="p-0 h-[500px] max-h-[60vh] overflow-y-scroll bg-[#202020] rounded-[10px] [&::-webkit-scrollbar]:bg-[#202020] [&::-webkit-scrollbar]:w-4 [&::-webkit-scrollbar-track]:bg-[#202020] [&::-webkit-scrollbar-thumb]:bg-[#171717] [&::-webkit-scrollbar-thumb]:rounded-2xl [&::-webkit-scrollbar-thumb]:border-4 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-[#202020] [&::-webkit-scrollbar-button]:hidden"
            onLoad={(): void => {
              const index = selectedAsset
                ? filteredAssetList.indexOf(selectedAsset)
                : 0
              scrollRef.current?.scrollTo({
                top: index * 45,
                behavior: 'smooth',
              })
            }}
          >
            {Array.isArray(filteredAssetList) &&
            filteredAssetList.length > 0 ? (
              filteredAssetList.map((asset, index) => (
                <AssetItem
                  key={`asset-${index}`}
                  asset={asset}
                  setShowModal={setShowModal}
                  onChangeAmount={onChangeAmount}
                />
              ))
            ) : (
              <Text style={{ padding: 20, fontSize: 14 }}>
                {inputFilter
                  ? `"${inputFilter}" does not exist`
                  : 'AssetList is empty'}{' '}
              </Text>
            )}
            <InfoElement
              style={{ marginLeft: 16, marginTop: 26, padding: '10px 20px' }}
            >
              If you can't find your asset try to switch chain or bridge used
            </InfoElement>
          </div>
        </div>
      </DefaultModal>
    </>
  )
}

export default AssetList
