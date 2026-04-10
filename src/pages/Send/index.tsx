import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import loading from 'images/loading.gif'
import failed from 'images/failed.gif'
import complete from 'images/complete.gif'

import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

import useSendValidate from 'hooks/useSendValidate'

import { Container } from 'components'
import FormTitle from './FormTitle'
import SendForm from './SendForm'
import Confirm from './Confirm'
import Finish from './Finish'
import SendFormButton from './SendFormButton'
import BlockChainNetwork from './BlockChainNetwork'
import FormImage from 'components/FormImage'
import FinishButton from './FinishButton'
import AuthStore from 'store/AuthStore'
import useAuth from 'hooks/useAuth'
import SendStore from 'store/SendStore'
import { BlockChainType } from 'types/network'
import { InfoElement, WarningInfo } from './SendForm/WarningInfo'

const ProcessCircle = ({
  style,
  children,
}: {
  style?: React.CSSProperties
  children?: React.ReactNode
}): ReactElement => (
  <div
    className="h-[128px] w-[128px] mx-auto rounded-[100px] border border-[#4abcf0] flex items-center justify-center"
    style={{
      boxShadow:
        '0 2px 4px 0 rgba(15, 15, 24, 0.3), 0 -1px 4px 0 rgba(119, 232, 255, 0.5)',
      ...style,
    }}
  >
    {children}
  </div>
)

const Send = (): ReactElement => {
  const formScrollView = useRef<HTMLDivElement>(null)

  const [status, setStatus] = useRecoilState(SendProcessStore.sendProcessStatus)
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)
  const { getLoginStorage } = useAuth()
  const [initPage, setInitPage] = useState(false)
  const [toBlockChain, setToBlockChain] = useRecoilState(SendStore.toBlockChain)
  const [fromBlockChain, setFromBlockChain] = useRecoilState(
    SendStore.fromBlockChain
  )

  const { validateFee } = useSendValidate()
  const feeValidationResult = validateFee()

  const renderProcessStatus = useCallback((): ReactElement => {
    switch (status) {
      case ProcessStatus.Done:
        return (
          <ProcessCircle>
            <FormImage src={complete} />
          </ProcessCircle>
        )
      case ProcessStatus.Failed:
        return (
          <ProcessCircle
            style={{
              boxShadow:
                '0 2px 4px 0 rgba(254, 99, 99, 0.3), 0 -1px 4px 0 rgba(255, 119, 119, 0.5)',
              border: 'solid 1px #ff5964',
            }}
          >
            <FormImage src={failed} />
          </ProcessCircle>
        )
      case ProcessStatus.Pending:
        return (
          <ProcessCircle style={{ marginBottom: 60 }}>
            <FormImage
              src={loading}
              size={140}
              style={{ marginLeft: -6, marginTop: -6 }}
            />
          </ProcessCircle>
        )
      default:
        return (
          <div style={{ marginBottom: 100 }}>
            <BlockChainNetwork />
          </div>
        )
    }
  }, [status])

  const onClickGoBackToSendInputButton = async (): Promise<void> => {
    setStatus(ProcessStatus.Input)
  }

  useEffect(() => {
    setInitPage(true)
    const { lastFromBlockChain, lastToBlockChain } = getLoginStorage()

    const sanitize = (b?: BlockChainType): BlockChainType | undefined =>
      b === BlockChainType.base ? BlockChainType.ethereum : b

    const restoredFrom = sanitize(lastFromBlockChain)
    const restoredTo = sanitize(lastToBlockChain)

    if (restoredFrom) {
      setFromBlockChain(restoredFrom)
      restoredTo && setToBlockChain(restoredTo)
    }
  }, [])

  useEffect(() => {
    if (initPage) {
      if (
        fromBlockChain !== BlockChainType.atomone &&
        fromBlockChain !== toBlockChain
      ) {
        setToBlockChain(BlockChainType.atomone)
      }
    }
  }, [fromBlockChain])

  useEffect(() => {
    const scroll = formScrollView.current
    if (scroll) {
      if (status === ProcessStatus.Input) {
        scroll.scrollTo({ left: 0, behavior: 'smooth' })
      } else if (status === ProcessStatus.Confirm) {
        scroll.scrollTo({ left: 600, behavior: 'smooth' })
      }
    }
  }, [status])

  return (
    <Container className="max-w-[640px] p-0 h-full max-[575px]:w-screen max-[575px]:overflow-x-hidden">
      <div
        key={String(isLoggedIn)}
        className="relative bg-[#1E1E1E] p-[60px] rounded-[2em] max-[575px]:rounded-none max-[575px]:px-6 max-[575px]:pt-[38px] max-[575px]:pb-5"
      >
        {/* FormTitle */}
        <FormTitle
          onClickGoBackToSendInputButton={onClickGoBackToSendInputButton}
        />

        {/* Select From, To Blockchain Network */}
        <div style={{ textAlign: 'center' }}>{renderProcessStatus()}</div>

        {[ProcessStatus.Done, ProcessStatus.Failed].includes(status) ? (
          <>
            <Finish />
            <WarningInfo />
            <FinishButton />
          </>
        ) : (
          <>
            <div style={{ marginTop: -40 }}>
              <div style={{ marginTop: -40 }}>
                <InfoElement>
                  GnoSwap Bridge powered by Union protocol.
                </InfoElement>
              </div>
            </div>

            <div
              ref={formScrollView}
              style={{ display: 'flex', overflowX: 'hidden' }}
            >
              <div style={{ minWidth: '100%' }}>
                <SendForm feeValidationResult={feeValidationResult} />
              </div>
              <div style={{ minWidth: '100%' }}>
                <Confirm />
              </div>
            </div>
            <WarningInfo />

            {[
              ProcessStatus.Input,
              ProcessStatus.Submit,
              ProcessStatus.Confirm,
              ProcessStatus.Pending,
            ].includes(status) && (
              <SendFormButton feeValidationResult={feeValidationResult} />
            )}
          </>
        )}
      </div>
    </Container>
  )
}

export default Send
