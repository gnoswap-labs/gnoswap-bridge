import { ReactElement } from 'react'
import { ValidateItemResultType } from 'types/send'

const FormFeeInfo = ({
  feeValidationResult: _feeValidationResult,
}: {
  feeValidationResult: ValidateItemResultType
}): ReactElement => {
  // Fee info is handled by the Union bridge protocol.
  // No client-side fee display needed.
  return <></>
}

export default FormFeeInfo
