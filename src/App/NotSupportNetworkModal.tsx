import { ReactElement } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { Text } from 'components'
import DefaultModal from 'components/Modal'

import NetworkStore from 'store/NetworkStore'

const NotSupportNetworkModal = (): ReactElement => {
  const [isVisibleModal, setIsVisibleModal] = useRecoilState(
    NetworkStore.isVisibleNotSupportNetworkModal
  )

  const network = useRecoilValue(NetworkStore.triedNotSupportNetwork)

  return (
    <DefaultModal
      {...{
        isOpen: isVisibleModal,
        close: (): void => {
          setIsVisibleModal(false)
        },
      }}
      header={
        <Text style={{ justifyContent: 'center' }}>UNSUPPORTED NETWORK</Text>
      }
    >
      <p
        style={{
          textAlign: 'center',
          color: '#CCC',
          margin: '0 4rem',
          marginBottom: '2.3rem',
        }}
      >
        {network
          ? `Your wallet is connected to an unsupported network (${network.name}). Please switch to a supported network.`
          : 'Please switch to a supported network and refresh the page.'}
      </p>
    </DefaultModal>
  )
}

export default NotSupportNetworkModal
