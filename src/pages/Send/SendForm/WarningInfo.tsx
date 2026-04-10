import { ReactElement } from 'react'
import { useRecoilValue } from 'recoil'

import warningSvg from 'images/warning.svg'
import dangerSvg from 'images/danger.svg'
import infoSvg from 'images/info.svg'

import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

import SendStore from 'store/SendStore'

import { Text } from 'components'

import FormImage from 'components/FormImage'

export const DangerElement = ({
  children,
}: {
  children: React.ReactNode
}): ReactElement => {
  return (
    <div className="flex items-center rounded px-5 py-4 mb-[15px] bg-[#d64c5518] border border-[#d64c5518] whitespace-pre-wrap text-xs">
      <div style={{ paddingRight: 12 }}>
        <FormImage src={dangerSvg} size={18} />
      </div>
      <Text className="text-sm font-normal leading-[1.5] text-[#d64c55] inline [&_span]:cursor-pointer [&_span]:underline [&_a]:font-bold [&_a]:text-[#d64c55] [&_a]:underline">
        {children}
      </Text>
    </div>
  )
}

export const WarningElement = ({
  children,
}: {
  children: React.ReactNode
}): ReactElement => {
  return (
    <div className="flex items-center rounded px-5 py-4 mb-[15px] bg-[#eca44d18] border border-[#eca44d18] whitespace-pre-wrap text-xs">
      <div style={{ paddingRight: 12 }}>
        <FormImage src={warningSvg} size={18} />
      </div>
      <Text className="text-sm font-normal leading-[1.5] text-[#eca44d] inline [&_a]:font-bold [&_a]:text-[#eca44d] [&_a]:underline">
        {children}
      </Text>
    </div>
  )
}

export const InfoElement = ({
  style,
  children,
}: {
  style?: React.CSSProperties
  children: React.ReactNode
}): ReactElement => {
  return (
    <div
      className="flex items-center rounded px-5 py-4 mb-[15px] bg-[#727e8b18] border border-[#727e8b18] whitespace-pre-wrap text-xs"
      style={style}
    >
      <div style={{ paddingRight: 12 }}>
        <FormImage src={infoSvg} size={18} />
      </div>
      <Text className="text-sm font-normal leading-[1.5] text-[#a3a3a3] inline [&_a]:font-bold [&_a]:text-[#a3a3a3] [&_a]:underline">
        {children}
      </Text>
    </div>
  )
}

export const WarningInfo = (): ReactElement => {
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const status = useRecoilValue(SendProcessStore.sendProcessStatus)

  function infoText(): string | undefined {
    if (fromBlockChain !== toBlockChain) {
      return "Don't use exchange addresses for cross-chain transfers. Make sure that the token type is correct before making transfers to the exchanges."
    }
  }

  return (
    <div style={{ marginBottom: '40px' }}>
      {status === ProcessStatus.Input && (
        <>{infoText() && <WarningElement>{infoText()}</WarningElement>}</>
      )}
    </div>
  )
}
