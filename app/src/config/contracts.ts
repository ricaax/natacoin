/**
 * Contract addresses configuration
 * These should be set in .env file after deployment
 */
export const CONTRACT_ADDRESSES = {
  NATA_TOKEN: import.meta.env.VITE_NATA_TOKEN_ADDRESS || '',
  TREASURY: import.meta.env.VITE_TREASURY_ADDRESS || '',
  GOVERNANCE_REGISTRY: import.meta.env.VITE_GOVERNANCE_REGISTRY_ADDRESS || '',
  PROPERTY_VAULT: import.meta.env.VITE_PROPERTY_VAULT_ADDRESS || '',
  SIMPLE_GOVERNANCE: import.meta.env.VITE_SIMPLE_GOVERNANCE_ADDRESS || '',
}

export const CELO_RPC_URL = import.meta.env.VITE_CELO_RPC_URL || 'https://alfajores-forno.celo-testnet.org'
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

/**
 * Validate that all contract addresses are set
 */
export function validateContractAddresses(): boolean {
  return Object.values(CONTRACT_ADDRESSES).every(addr => addr.length > 0)
}

