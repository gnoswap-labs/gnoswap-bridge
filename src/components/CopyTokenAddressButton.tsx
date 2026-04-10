import { ReactElement, useState } from 'react'
import useClipboard from 'react-use-clipboard'
import { Check } from 'components/icons'

import { COLOR, NETWORK } from 'consts'
import copyClipboardPng from 'images/copy_clipboard.png'

import Row from './Row'
import Text from './Text'
import View from './View'
import FormImage from './FormImage'
import { BlockChainType } from 'types/network'

const CopyTokenAddressButton = ({
  blockChain,
  value,
}: {
  blockChain: BlockChainType
  value: string
}): ReactElement => {
  const [isCopied, setIsCopied] = useState(false)
  const [, setCopied] = useClipboard(value)

  return (
    <Row
      className="cursor-pointer py-[3px] px-2 rounded-[10px] bg-bridge-gray items-center w-auto"
      onClick={(): void => {
        if (isCopied) {
          return
        }
        setCopied()
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 1500)
      }}
    >
      <View style={{ paddingRight: 4 }}>
        {isCopied ? (
          <Check size={12} color={COLOR.primary} />
        ) : (
          <FormImage src={copyClipboardPng} size={12} />
        )}
      </View>
      <Text style={{ fontSize: 11, color: '#737373', alignItems: 'center' }}>
        {NETWORK.blockChainName[blockChain]}
      </Text>
    </Row>
  )
}

export default CopyTokenAddressButton
