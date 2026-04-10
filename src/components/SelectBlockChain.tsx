import { ReactElement } from 'react'

import { NETWORK, COLOR } from 'consts'

import { BlockChainType } from 'types/network'

import { Text } from 'components'
import FormSelect from 'components/FormSelect'
import FormImage from 'components/FormImage'
import { useRecoilValue } from 'recoil'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

const SelectBlockChain = ({
  blockChain,
  setBlockChain,
  optionList,
  label,
}: {
  blockChain: BlockChainType
  setBlockChain: (value: BlockChainType) => void
  optionList: {
    value: BlockChainType
    label: string
    isDisabled?: boolean
  }[]
  label: string
}): ReactElement => {
  const status = useRecoilValue(SendProcessStore.sendProcessStatus)

  return (
    <div className="w-[160px] relative max-[450px]:w-[140px]">
      <div
        className="h-[140px] w-[140px] mx-auto flex justify-center items-start bg-no-repeat bg-[length:100%] bg-[#202020] rounded-full max-[450px]:h-[110px] max-[450px]:w-[110px]"
        style={{
          border: label === 'FROM' ? '1px solid #4ABCF0' : '1px solid #BB7CB3',
          boxShadow: label === 'FROM' ? '0 0 6px #4ABCF0' : '0 0 6px #BB7CB3',
        }}
      >
        <div style={{ paddingTop: 28 }}>
          <FormImage
            src={NETWORK.blockChainImage[blockChain]}
            size={window.innerWidth > 450 ? 54 : 38}
          />
          {status === ProcessStatus.Input ? (
            <Text className="pt-3 text-xs font-medium text-[#a3a3a3] justify-center max-[450px]:pt-1 max-[450px]:text-[11px]">
              {label}
            </Text>
          ) : (
            <Text className="pt-1.5 text-base font-medium text-[#e9e9e9] justify-center">
              {NETWORK.blockChainName[blockChain]}
            </Text>
          )}
        </div>
      </div>

      {status === ProcessStatus.Input && (
        <div style={{ position: 'absolute', width: '100%', marginTop: -24 }}>
          {setBlockChain && (
            <FormSelect
              icons={true}
              selectedValue={blockChain}
              optionList={optionList}
              onSelect={setBlockChain}
              containerStyle={{
                width: '100%',
                textAlign: 'left',
              }}
              selectedTextStyle={{
                fontSize: window.innerWidth > 450 ? '16px' : '14px',
                fontWeight: '400',
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default SelectBlockChain
