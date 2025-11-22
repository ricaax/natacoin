# NataCoin Architecture

## High-Level Overview

NataCoin is a Celo-native stablecoin and cooperative system designed for Lisbon, integrating with MiniPay, Self Protocol, DAVINCI, Filecoin, and libp2p.

## Architecture Summary

1. **Smart Contracts Layer (Celo/Alfajores)**
   - `NataToken`: ERC-20 stablecoin with cost-of-living coefficient tracking
   - `Treasury`: Centralized minting/burning controller (can be upgraded to DAO)
   - `GovernanceRegistry`: Tracks user locality, reputation, participation for voting weights
   - `PropertyVault`: Cooperative fund accepting NATA deposits/withdrawals

2. **Frontend Layer (React + TypeScript)**
   - MiniPay-compatible dApp with wallet connection (Celo Connect/ethers)
   - Pages: Wallet Overview, Send NATA, Vault Management, Governance Voting, Identity Status
   - Web3 hooks for contract interactions

3. **Backend Services (Node.js + TypeScript)**
   - Filecoin/Synapse SDK integration for storing proposals and property records
   - libp2p node for P2P messaging/attestations
   - REST API endpoints for frontend integration
   - Stubs for DAVINCI (voting) and Self Protocol (residency verification)

4. **Integration Points**
   - **MiniPay**: Wallet connection and transaction signing
   - **Self Protocol**: zk residency verification (stub → real SDK)
   - **DAVINCI**: Governance voting system (stub → real SDK)
   - **Filecoin Onchain Cloud**: Decentralized storage via Synapse SDK
   - **libp2p**: P2P messaging for community attestations

5. **Data Flow**
   - User connects wallet → reads NATA balance from `NataToken`
   - User deposits NATA → `PropertyVault` tracks shares
   - User votes → on-chain vote + proposal metadata stored on Filecoin
   - Locality verification → `GovernanceRegistry` updated (via Self Protocol stub)

6. **Security Model (MVP)**
   - Treasury has mint/burn privileges (admin-controlled for MVP)
   - GovernanceRegistry updates require admin or future DAO approval
   - PropertyVault is non-custodial (users can withdraw their deposits)

7. **Deployment Target**
   - Primary: Celo Alfajores testnet
   - Contracts deployable via Hardhat scripts
   - Frontend connects to Celo RPC endpoints

8. **MVP Scope Limitations**
   - Mocked oracle for NATA peg (simple admin-set coefficient)
   - Stubbed integrations (DAVINCI, Self Protocol) with clear upgrade paths
   - Basic governance (single proposal voting, not full DAO)
   - Simple vault (no complex yield strategies)

9. **Tech Stack**
   - Contracts: Solidity ^0.8.x, Hardhat, OpenZeppelin
   - Frontend: React + Vite, TypeScript, ethers/viem
   - Backend: Node.js, TypeScript, Express (lightweight)
   - Storage: Filecoin via Synapse SDK

10. **Development Workflow**
    - Local Hardhat node for contract testing
    - Deploy to Alfajores for integration testing
    - Frontend connects to deployed contracts
    - Backend services run independently with configurable endpoints
