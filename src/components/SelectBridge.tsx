import { ReactElement } from 'react'
import { COLOR } from 'consts'
import { BridgeType } from 'types/network'
import { Text } from 'components'

const SelectBridge = (): ReactElement => {
  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(-50%,0)',
        width: window.innerWidth > 450 ? '115px' : '105px',
        textAlign: 'center',
      }}
    >
      <div>
        <Text
          style={{
            color: COLOR.white,
            opacity: 0.6,
            padding: '.4rem .8rem',
            marginTop: '.6rem',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          {BridgeType.union.toUpperCase()}
        </Text>
      </div>
    </div>
  )
}

export default SelectBridge
