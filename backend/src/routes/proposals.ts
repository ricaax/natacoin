import { Router } from 'express'
import { filecoinService } from '../services/filecoin.js'
import { davinciClient } from '../services/davinciClient.js'

const router = Router()

/**
 * POST /api/proposals
 * Store a proposal on Filecoin
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, proposer } = req.body

    if (!title || !description || !proposer) {
      return res.status(400).json({ error: 'Missing required fields: title, description, proposer' })
    }

    const proposalData = {
      title,
      description,
      proposer,
      timestamp: Math.floor(Date.now() / 1000)
    }

    const cid = await filecoinService.storeProposal(proposalData)

    res.json({
      success: true,
      cid,
      proposal: proposalData
    })
  } catch (error: any) {
    console.error('Error storing proposal:', error)
    res.status(500).json({ error: error.message || 'Failed to store proposal' })
  }
})

/**
 * GET /api/proposals/:cid
 * Fetch a proposal from Filecoin
 */
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params

    const proposal = await filecoinService.fetchProposal(cid)

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' })
    }

    res.json({
      success: true,
      cid,
      proposal
    })
  } catch (error: any) {
    console.error('Error fetching proposal:', error)
    res.status(500).json({ error: error.message || 'Failed to fetch proposal' })
  }
})

export default router

