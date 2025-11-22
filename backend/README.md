# NataCoin Backend

Node.js backend services for NataCoin, including Filecoin/Synapse integration, libp2p messaging, and integration stubs.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3001
   CORS_ORIGIN=http://localhost:3000
   LIBP2P_TOPIC=natacoin-property-attestations
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Proposals
- `POST /api/proposals` - Store proposal on Filecoin
  ```json
  {
    "title": "Proposal Title",
    "description": "Proposal description",
    "proposer": "0x..."
  }
  ```
- `GET /api/proposals/:cid` - Fetch proposal by CID

### Properties
- `POST /api/properties` - Store property record on Filecoin
  ```json
  {
    "propertyId": "prop_123",
    "address": "Lisbon, Portugal",
    "owner": "0x...",
    "value": "1000000"
  }
  ```
- `GET /api/properties/:cid` - Fetch property record by CID
- `POST /api/properties/:propertyId/attestations` - Create property attestation

### Integrations
- `GET /api/integrations/status` - Get status of all integrations

## Services

### Filecoin/Synapse (Stub)
- `storeProposal(data)` - Store proposal data
- `fetchProposal(cid)` - Fetch proposal by CID
- `storePropertyRecord(data)` - Store property record
- `fetchPropertyRecord(cid)` - Fetch property record

**Note**: Currently stubbed with in-memory storage. Replace with actual Synapse SDK in production.

### libp2p
- P2P messaging for property attestations
- Pubsub topic: `natacoin-property-attestations`
- Automatically starts when backend starts

**Note**: For MVP, uses minimal configuration. In production, add bootstrap nodes and more features.

### DAVINCI (Stub)
- `createProposal()` - Create governance proposal
- `castVote()` - Cast vote on proposal
- `getProposal()` - Get proposal details
- `getVotes()` - Get votes for proposal

**Note**: Currently stubbed. Replace with actual DAVINCI SDK in production.

### Self Protocol (Stub)
- `verifyResidency()` - Verify user residency
- `getResidencyProof()` - Get residency proof
- `revokeResidency()` - Revoke residency

**Note**: Currently stubbed. Replace with actual Self Protocol SDK in production.

## Development

- Built with Express + TypeScript
- Uses ES modules
- Hot reload with `tsx watch`

## Production

Build and run:
```bash
npm run build
npm start
```

## Integration Upgrade Path

To upgrade from stubs to real integrations:

1. **Filecoin/Synapse**: Install Synapse SDK and replace functions in `src/services/filecoin.ts`
2. **DAVINCI**: Install DAVINCI SDK and replace functions in `src/services/davinciClient.ts`
3. **Self Protocol**: Install Self Protocol SDK and replace functions in `src/services/selfClient.ts`
4. **libp2p**: Enhance with more features like peer discovery, encryption, etc.

