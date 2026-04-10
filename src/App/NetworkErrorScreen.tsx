import { ReactElement, useEffect, useState } from 'react'

import { COLOR } from 'consts'
import { Button, Text, Container } from 'components'

import { ExclamationCircle } from 'components/icons'

const RefreshButton = ({ isOnline }: { isOnline: boolean }): ReactElement => (
  <>
    {isOnline && (
      <Button
        onClick={(): void => {
          window.location.reload()
        }}
        style={{ marginTop: 40 }}
      >
        Refresh
      </Button>
    )}
  </>
)

const NetworkErrorScreen = (): ReactElement => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)
  const [showError, setShowError] = useState(false)
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>()

  const onOffline = (): void => {
    setIsOnline(false)
    setShowError(true)
    setTitle('No internet connection')
    setContent('Please check your internet connection and try again.')
  }

  const onOnline = (): void => {
    setIsOnline(true)
    setShowError(false)
  }

  useEffect(() => {
    if (!isOnline) {
      onOffline()
    }
  }, [isOnline])

  useEffect(() => {
    window.addEventListener('offline', onOffline)
    window.addEventListener('online', onOnline)
    return (): void => {
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('online', onOnline)
    }
  }, [])

  return showError ? (
    <div className="absolute z-10 top-0 bg-black/80 w-full h-full p-5 flex items-center">
      <Container className="bg-[#202020] max-w-[640px] p-10 rounded-[2em] max-[575px]:rounded-none max-[575px]:p-5">
        <div style={{ textAlign: 'center' }}>
          <ExclamationCircle
            style={{ fontSize: 32, marginBottom: 5, color: COLOR.red }}
          />
        </div>
        <Text
          className="block text-lg font-normal text-center"
          style={{ color: COLOR.red }}
        >
          {title}
        </Text>
        <Text className="block text-sm break-all whitespace-pre-wrap px-5 pt-2.5 text-center">
          {content}
        </Text>
        <RefreshButton isOnline={isOnline} />
      </Container>
    </div>
  ) : (
    <></>
  )
}

export default NetworkErrorScreen
