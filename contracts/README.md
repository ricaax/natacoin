# NataCoin Contracts

Smart contracts for the NataCoin cooperative system, deployed on Celo (Alfajores testnet).

## Contracts

- **NataToken.sol**: ERC-20 stablecoin with cost-of-living coefficient
- **Treasury.sol**: Minting/burning controller for NATA
- **GovernanceRegistry.sol**: Tracks user locality, reputation, and participation
- **PropertyVault.sol**: Cooperative vault for property fund deposits
- **SimpleGovernance.sol**: Minimal governance voting (DAVINCI stub)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```env
   PRIVATE_KEY=your_private_key_here
   CELO_ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
   ```

3. **Compile contracts:**
   ```bash
   npm run compile
   ```

## Deployment

### Deploy to Alfajores (testnet):
```bash
npm run deploy:alfajores
```

### Deploy to local Hardhat node:
```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy
npm run deploy:local
```

## Testing

Run tests:
```bash
npm test
```

## Contract Addresses

After deployment, save the contract addresses to use in your frontend and backend:

- `NataToken`: ERC-20 token contract
- `Treasury`: Minting/burning controller
- `GovernanceRegistry`: User reputation/locality tracking
- `PropertyVault`: Cooperative vault
- `SimpleGovernance`: Voting system

## Development

- Contracts use Solidity 0.8.20
- OpenZeppelin contracts for security (ERC-20, Ownable, etc.)
- Hardhat for compilation, testing, and deployment

## Notes

- For MVP: Treasury and GovernanceRegistry are owner-controlled
- Future: Can be upgraded to DAO governance
- Integrations (DAVINCI, Self Protocol) are stubbed in SimpleGovernance and GovernanceRegistry


