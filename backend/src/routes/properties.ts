import { Router } from 'express'
import { filecoinService } from '../services/filecoin.js'
import { libp2pService } from '../services/libp2p.js'

const router = Router()

/**
 * POST /api/properties
 * Store a property record on Filecoin
 */
router.post('/', async (req, res) => {
  try {
    const { propertyId, address, owner, value } = req.body

    if (!propertyId || !address || !owner || !value) {
      return res.status(400).json({ 
        error: 'Missing required fields: propertyId, address, owner, value' 
      })
    }

    const propertyData = {
      propertyId,
      address,
      owner,
      value,
      timestamp: Math.floor(Date.now() / 1000)
    }

    const cid = await filecoinService.storePropertyRecord(propertyData)

    // Publish property record to libp2p network
    if (libp2pService.isRunning()) {
      await libp2pService.publishMessage({
        type: 'property_record',
        data: propertyData,
        cid
      })
    }

    res.json({
      success: true,
      cid,
      property: propertyData
    })
  } catch (error: any) {
    console.error('Error storing property:', error)
    res.status(500).json({ error: error.message || 'Failed to store property' })
  }
})

/**
 * GET /api/properties/:cid
 * Fetch a property record from Filecoin
 */
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params

    const property = await filecoinService.fetchPropertyRecord(cid)

    if (!property) {
      return res.status(404).json({ error: 'Property record not found' })
    }

    res.json({
      success: true,
      cid,
      property
    })
  } catch (error: any) {
    console.error('Error fetching property:', error)
    res.status(500).json({ error: error.message || 'Failed to fetch property' })
  }
})

/**
 * POST /api/properties/:propertyId/attestations
 * Create a property attestation and publish to libp2p
 */
router.post('/:propertyId/attestations', async (req, res) => {
  try {
    const { propertyId } = req.params
    const { attester, attestation, signature } = req.body

    if (!attester || !attestation) {
      return res.status(400).json({ 
        error: 'Missing required fields: attester, attestation' 
      })
    }

    const attestationData = {
      type: 'property_attestation',
      propertyId,
      attester,
      attestation,
      signature: signature || null,
      timestamp: Math.floor(Date.now() / 1000)
    }

    // Publish to libp2p network
    if (libp2pService.isRunning()) {
      await libp2pService.publishMessage(attestationData)
    } else {
      console.warn('[libp2p] Node not running, attestation not published')
    }

    res.json({
      success: true,
      attestation: attestationData
    })
  } catch (error: any) {
    console.error('Error creating attestation:', error)
    res.status(500).json({ error: error.message || 'Failed to create attestation' })
  }
})

export default router

