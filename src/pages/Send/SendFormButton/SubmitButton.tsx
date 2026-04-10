import { ReactElement, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const CircularProgress = ({ size = 20 }: { size?: number }): ReactElement => (
  <svg
    className="animate-spin"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
)

import { BlockChainType, isCosmosChain, isEvmChain } from 'types/network'
import { RequestTxResultType } from 'types/send'

import { Button } from 'components'
import SendStore from 'store/SendStore'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'
import FormErrorMessage from 'components/FormErrorMessage'
import useSend from 'hooks/useSend'

const SubmitButton = (): ReactElement => {
  const [status, setStatus] = useRecoilState(SendProcessStore.sendProcessStatus)

  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const setRequestTxResult = useSetRecoilState(SendProcessStore.requestTxResult)
  const setWaitForReceiptError = useSetRecoilState(
    SendProcessStore.waitForReceiptError
  )

  const [errorMessage, setErrorMessage] = useState('')

  const { submitRequestTx } = useSend()

  const loading = [ProcessStatus.Pending, ProcessStatus.Submit].includes(status)

  const onClickSubmitButton = async (): Promise<void> => {
    setErrorMessage('')
    setWaitForReceiptError('')

    try {
      const submitResult = await submitRequestTx()

      setRequestTxResult(submitResult)

      if (submitResult.success) {
        setStatus(ProcessStatus.Done)
      } else {
        setErrorMessage(submitResult.errorMessage || 'Transaction failed')
        setWaitForReceiptError(
          submitResult.errorMessage || 'Transaction failed'
        )
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setErrorMessage(message)
      setWaitForReceiptError(message)
    }
  }

  return (
    <>
      <Button onClick={onClickSubmitButton} disabled={loading}>
        {loading ? <CircularProgress size={20} /> : <>Confirm</>}
      </Button>
      <FormErrorMessage
        errorMessage={errorMessage}
        style={{ display: 'block', textAlign: 'center', marginTop: 10 }}
      />
    </>
  )
}

export default SubmitButton
