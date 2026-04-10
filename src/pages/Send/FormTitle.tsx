import { ReactElement } from 'react'
import { useRecoilValue } from 'recoil'

import { Text, View } from 'components'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'
import FormImage from 'components/FormImage'
import btn_back from 'images/btn_back.png'

const FormTitleText: Record<ProcessStatus, string> = {
  [ProcessStatus.Input]: 'Send',
  [ProcessStatus.Confirm]: 'Confirm',
  [ProcessStatus.Submit]: 'Confirm',
  [ProcessStatus.Pending]: 'Confirm',
  [ProcessStatus.Done]: 'Complete',
  [ProcessStatus.Failed]: 'Failed',
}

const FormTitle = ({
  onClickGoBackToSendInputButton,
}: {
  onClickGoBackToSendInputButton: () => void
}): ReactElement => {
  const status = useRecoilValue(SendProcessStore.sendProcessStatus)
  const GoBackButton = (): ReactElement => {
    return (
      <View
        style={{ position: 'absolute', cursor: 'pointer', left: 0 }}
        onClick={onClickGoBackToSendInputButton}
      >
        <FormImage src={btn_back} size={18} />
      </View>
    )
  }
  return (
    <View className="relative items-center">
      {status === ProcessStatus.Confirm && <GoBackButton />}
      <Text className="mb-[42px] h-6 text-xl font-medium leading-normal tracking-[-0.31px] justify-center text-white">
        {FormTitleText[status]}
      </Text>
    </View>
  )
}

export default FormTitle
