# NataCoin Frontend

React + TypeScript frontend for the NataCoin MiniPay dApp.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your deployed contract addresses:
   ```env
   VITE_NATA_TOKEN_ADDRESS=0x...
   VITE_TREASURY_ADDRESS=0x...
   VITE_GOVERNANCE_REGISTRY_ADDRESS=0x...
   VITE_PROPERTY_VAULT_ADDRESS=0x...
   VITE_SIMPLE_GOVERNANCE_ADDRESS=0x...
   VITE_CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
   VITE_BACKEND_URL=http://localhost:3001
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Features

- **Wallet Overview**: View NATA balance and coefficient
- **Send NATA**: Transfer NATA to other addresses
- **Cooperative Vault**: Deposit and withdraw NATA from the property fund
- **Governance**: View and vote on proposals
- **Identity Status**: View locality, reputation, and participation scores

## Wallet Connection

The app supports:
- MiniPay (Celo mobile wallet)
- MetaMask (with Celo network configured)
- Any wallet that supports Celo/Alfajores

## Development

- Built with Vite + React + TypeScript
- Uses ethers.js for blockchain interactions
- React Query for data fetching
- React Router for navigation

## Build

```bash
npm run build
```

Output will be in the `dist/` directory.

