import { Link, useLocation } from 'react-router-dom'
import { useWallet } from '../hooks/useWallet'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { address, isConnected, connect, disconnect } = useWallet()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">NataCoin</h1>
          <p className="tagline">MiniPay-native financial cooperative for Lisbon</p>
        </div>
        <div className="wallet-section">
          {isConnected && address ? (
            <div className="wallet-info">
              <span className="address">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <button onClick={disconnect} className="btn-secondary">
                Disconnect
              </button>
            </div>
          ) : (
            <button onClick={connect} className="btn-primary">
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      <nav className="nav">
        <Link
          to="/wallet"
          className={isActive('/wallet') ? 'nav-link active' : 'nav-link'}
        >
          Wallet
        </Link>
        <Link
          to="/send"
          className={isActive('/send') ? 'nav-link active' : 'nav-link'}
        >
          Send NATA
        </Link>
        <Link
          to="/vault"
          className={isActive('/vault') ? 'nav-link active' : 'nav-link'}
        >
          Vault
        </Link>
        <Link
          to="/governance"
          className={isActive('/governance') ? 'nav-link active' : 'nav-link'}
        >
          Governance
        </Link>
        <Link
          to="/identity"
          className={isActive('/identity') ? 'nav-link active' : 'nav-link'}
        >
          Identity
        </Link>
      </nav>

      <main className="main">{children}</main>
    </div>
  )
}

