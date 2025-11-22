import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { filecoinService } from './services/filecoin.js'
import { libp2pService } from './services/libp2p.js'
import { davinciClient } from './services/davinciClient.js'
import { selfClient } from './services/selfClient.js'
import proposalRoutes from './routes/proposals.js'
import propertyRoutes from './routes/properties.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/proposals', proposalRoutes)
app.use('/api/properties', propertyRoutes)

// Integration status endpoints
app.get('/api/integrations/status', async (req, res) => {
  res.json({
    filecoin: {
      status: 'stub',
      message: 'Filecoin/Synapse integration is stubbed for MVP'
    },
    libp2p: {
      status: libp2pService.isRunning() ? 'running' : 'stopped',
      topic: process.env.LIBP2P_TOPIC || 'natacoin-property-attestations'
    },
    davinci: {
      status: 'stub',
      message: 'DAVINCI integration is stubbed for MVP'
    },
    self: {
      status: 'stub',
      message: 'Self Protocol integration is stubbed for MVP'
    }
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NataCoin backend server running on port ${PORT}`)
  console.log(`📡 Health check: http://localhost:${PORT}/health`)
  console.log(`🔗 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`)
  
  // Initialize services
  libp2pService.start().catch(console.error)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...')
  await libp2pService.stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...')
  await libp2pService.stop()
  process.exit(0)
})

