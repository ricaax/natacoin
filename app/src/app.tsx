import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import WalletOverview from './pages/WalletOverview'
import SendNata from './pages/SendNata'
import CooperativeVault from './pages/CooperativeVault'
import Governance from './pages/Governance'
import IdentityStatus from './pages/IdentityStatus'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/wallet" replace />} />
            <Route path="/wallet" element={<WalletOverview />} />
            <Route path="/send" element={<SendNata />} />
            <Route path="/vault" element={<CooperativeVault />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="/identity" element={<IdentityStatus />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

