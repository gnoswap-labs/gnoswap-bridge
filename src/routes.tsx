import { ReactElement } from 'react'
import { Routes, Route } from 'react-router-dom'

import SendPage from 'pages/Send'
import DashboardPage from 'pages/Dashboard'

const AppRoutes = (): ReactElement => {
  return (
    <Routes>
      <Route path="/" element={<SendPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  )
}
export default AppRoutes
