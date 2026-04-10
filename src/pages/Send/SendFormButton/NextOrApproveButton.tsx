import { ReactElement } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { ValidateItemResultType } from 'types/send'

import { Button } from 'components'

import SendStore from 'store/SendStore'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

const NextOrApproveButton = ({
  feeValidationResult,
}: {
  feeValidationResult: ValidateItemResultType
}): ReactElement => {
  const setStatus = useSetRecoilState(SendProcessStore.sendProcessStatus)

  const validationResult = useRecoilValue(SendStore.validationResult)

  const ableButton = validationResult.isValid && feeValidationResult.isValid

  const onClickSendNextButton = async (): Promise<void> => {
    setStatus(ProcessStatus.Confirm)
  }

  return (
    <Button onClick={onClickSendNextButton} disabled={!ableButton}>
      Next
    </Button>
  )
}

export default NextOrApproveButton
