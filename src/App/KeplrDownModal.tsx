import { ReactElement } from 'react'
import { useRecoilState } from 'recoil'

import { NETWORK } from 'consts'

import { Text } from 'components'
import Button from 'components/Button'
import DefaultModal from 'components/Modal'
import ExtLink from 'components/ExtLink'

import SelectWalletStore, {
  SelectWalletModalType,
} from 'store/SelectWalletStore'

const KeplrDownModal = (): ReactElement => {
  const handleInstalled = (): void => {
    window.location.reload()
  }

  const [isVisibleModalType, setIsVisibleModalType] = useRecoilState(
    SelectWalletStore.isVisibleModalType
  )
  return (
    <DefaultModal
      {...{
        isOpen: isVisibleModalType === SelectWalletModalType.keplrInstall,
        close: (): void => {
          setIsVisibleModalType(undefined)
        },
      }}
    >
      <div className="px-[30px] pb-[30px]">
        {!navigator.userAgent.includes('Chrome') ? (
          <div style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: 18 }}>
              {'Bridge currently\nonly supports desktop Chrome'}
            </Text>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center' }}>
              <ExtLink href={NETWORK.KEPLR_EXTENSION}>
                <Text style={{ color: 'inherit', fontSize: 18 }}>
                  Download Keplr Extension
                </Text>
              </ExtLink>
              <br />
              <Text style={{ fontSize: 18 }}>{'to connect your wallet'}</Text>
            </div>
            <br />
            <Button onClick={handleInstalled}>I installed it.</Button>
          </>
        )}
      </div>
    </DefaultModal>
  )
}

export default KeplrDownModal
