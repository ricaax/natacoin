# Local Development Guide

Complete guide for running NataCoin locally for development and testing.

## Prerequisites

- Node.js 18+ and npm
- A Celo-compatible wallet (MiniPay, MetaMask, etc.)
- Git

## Quick Start

### 1. Clone and Setup

```bash
# Navigate to project root
cd Natacoin

# Install contract dependencies
cd contracts
npm install

# Install frontend dependencies
cd ../app
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Deploy Contracts (Local Hardhat Node)

**Terminal 1 - Start Hardhat node:**
```bash
cd contracts
npx hardhat node
```

**Terminal 2 - Deploy contracts:**
```bash
cd contracts
npm run deploy:local
```

Save the contract addresses from the deployment output.

### 3. Configure Frontend

```bash
cd app
cp .env.example .env
```

Edit `.env` and add the deployed contract addresses:
```env
VITE_NATA_TOKEN_ADDRESS=0x...
VITE_TREASURY_ADDRESS=0x...
VITE_GOVERNANCE_REGISTRY_ADDRESS=0x...
VITE_PROPERTY_VAULT_ADDRESS=0x...
VITE_SIMPLE_GOVERNANCE_ADDRESS=0x...
VITE_CELO_RPC_URL=http://localhost:8545
VITE_BACKEND_URL=http://localhost:3001
```

### 4. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=3001
CORS_ORIGIN=http://localhost:3000
LIBP2P_TOPIC=natacoin-property-attestations
```

### 5. Start Services

**Terminal 3 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 4 - Frontend:**
```bash
cd app
npm run dev
```

### 6. Connect Wallet

1. Open `http://localhost:3000` in your browser
2. Connect your wallet (MetaMask with Hardhat network, or MiniPay)
3. Make sure your wallet is connected to `http://localhost:8545` (Hardhat node)

## Testing Workflow

### 1. Get Test Tokens

- Use the "Mint Test NATA" button on the Wallet page (requires Treasury owner)
- Or use Hardhat console to mint:
  ```bash
  cd contracts
  npx hardhat console --network localhost
  # Then in console:
  const Treasury = await ethers.getContractFactory("Treasury")
  const treasury = Treasury.attach("TREASURY_ADDRESS")
  await treasury.mintNata("YOUR_ADDRESS", ethers.parseEther("1000"))
  ```

### 2. Test Features

- **Send NATA**: Send tokens between addresses
- **Vault**: Deposit and withdraw NATA
- **Governance**: Create proposals and vote (requires setting up user profiles first)
- **Identity**: Verify locality (requires admin privileges)

### 3. Set Up Governance Test Data

```bash
cd contracts
npx hardhat console --network localhost
```

```javascript
const Registry = await ethers.getContractFactory("GovernanceRegistry")
const registry = Registry.attach("REGISTRY_ADDRESS")

// Verify locality for a user
await registry.setLocality("USER_ADDRESS", true)

// Add reputation
await registry.incrementReputation("USER_ADDRESS", 30)

// Add participation
await registry.incrementParticipation("USER_ADDRESS", 20)

// Create a proposal
const Governance = await ethers.getContractFactory("SimpleGovernance")
const governance = Governance.attach("GOVERNANCE_ADDRESS")
await governance.createProposal("Select pilot cooperative property fund")
```

## Deploying to Alfajores (Testnet)

### 1. Get Testnet CELO

- Use the Alfajores faucet: https://faucet.celo.org/

### 2. Configure Environment

```bash
cd contracts
# Create .env file
echo "PRIVATE_KEY=your_private_key" > .env
echo "CELO_ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org" >> .env
```

### 3. Deploy

```bash
npm run deploy:alfajores
```

### 4. Update Frontend Config

Update `app/.env` with Alfajores contract addresses and RPC URL:
```env
VITE_CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
```

## Troubleshooting

### Wallet Connection Issues

- Make sure wallet is connected to the correct network (localhost:8545 for local, Alfajores for testnet)
- Clear browser cache and reload
- Check browser console for errors

### Contract Interaction Errors

- Verify contract addresses in `.env` are correct
- Make sure contracts are deployed and addresses match
- Check RPC URL is correct

### Backend Not Starting

- Check if port 3001 is available
- Verify `.env` file exists and is configured
- Check for missing dependencies: `npm install`

### libp2p Issues

- libp2p node may take a moment to start
- Check backend logs for libp2p status
- For MVP, libp2p is minimal - errors are non-critical

## Development Tips

1. **Hot Reload**: Frontend (Vite) and backend (tsx watch) both support hot reload
2. **Contract Changes**: After changing contracts, redeploy and update frontend addresses
3. **Testing**: Run `npm test` in `contracts/` directory to run contract tests
4. **Logs**: Check browser console for frontend errors, terminal for backend logs

## Next Steps

- Integrate real Filecoin/Synapse SDK
- Replace DAVINCI stub with real SDK
- Replace Self Protocol stub with real SDK
- Enhance libp2p with more features
- Add more comprehensive error handling
- Add authentication/authorization for admin functions

