import { ReactElement, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '../routes'
import { QueryClient, QueryClientProvider } from 'react-query'

import Header from 'components/layouts/Header'
import SelectWalletModal from './SelectWalletModal'
import KeplrDownModal from './KeplrDownModal'
import NetworkErrorScreen from './NetworkErrorScreen'

import useApp from './useApp'

const queryClient = new QueryClient()

const App = (): ReactElement => {
  const [initComplete, setInitComplete] = useState(false)

  const { initApp } = useApp()
  useEffect(() => {
    initApp().then(() => {
      setInitComplete(true)
    })
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {initComplete && (
          <>
            <div className="text-white min-h-full">
              <Header />
              <AppRoutes />
            </div>
            <SelectWalletModal />
            <KeplrDownModal />
            <NetworkErrorScreen />
          </>
        )}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
