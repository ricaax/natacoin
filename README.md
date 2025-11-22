# NataCoin

**A MiniPay-native financial cooperative for Lisbon**

NataCoin is a Celo-native stablecoin and cooperative system that enables everyday payments, cooperative property funds, and community governance.

## Project Structure

```
Natacoin/
├── contracts/          # Solidity smart contracts
├── app/                # React frontend (MiniPay dApp)
├── backend/            # Node.js backend services
└── docs/               # Architecture and documentation
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or MiniPay wallet (for Celo Alfajores)

### Setup

1. **Install dependencies:**
   ```bash
   # Contracts
   cd contracts && npm install

   # Frontend
   cd ../app && npm install

   # Backend
   cd ../backend && npm install
   ```

2. **Deploy contracts to Alfajores:**
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.ts --network alfajores
   ```

3. **Start backend:**
   ```bash
   cd backend
   npm run dev
   ```

4. **Start frontend:**
   ```bash
   cd app
   npm run dev
   ```

See individual README files in each directory for detailed instructions.

## Features (MVP)

- ✅ NATA stablecoin (ERC-20)
- ✅ Treasury minting/burning
- ✅ Governance registry (locality, reputation, participation)
- ✅ Property cooperative vault
- ✅ Basic governance voting (stub)
- ✅ Filecoin storage integration (Synapse SDK)
- ✅ libp2p messaging (minimal demo)

## Integrations

- **MiniPay**: Wallet connection and payments
- **Self Protocol**: Residency verification (stub)
- **DAVINCI**: Governance voting (stub)
- **Filecoin**: Decentralized storage
- **libp2p**: P2P messaging

## Development

This is a hackathon MVP. Some integrations are stubbed and can be upgraded to production SDKs later.

See `docs/architecture.md` for detailed architecture.


