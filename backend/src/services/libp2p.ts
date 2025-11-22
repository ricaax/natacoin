/**
 * libp2p Node for P2P Messaging
 * 
 * For MVP: Minimal libp2p node that joins a pubsub topic
 * In production: Add more features like peer discovery, encryption, etc.
 */

// @ts-ignore - libp2p types may not be perfect
import { createLibp2p } from 'libp2p'
// @ts-ignore
import { webSockets } from '@libp2p/websockets'
// @ts-ignore
import { mplex } from '@libp2p/mplex'
// @ts-ignore
import { noise } from '@libp2p/noise'
// @ts-ignore
import { gossipsub } from '@libp2p/pubsub'
// @ts-ignore
import { bootstrap } from '@libp2p/bootstrap'

let libp2pNode: any = null
let isRunning = false
const topic = process.env.LIBP2P_TOPIC || 'natacoin-property-attestations'

/**
 * Create and start libp2p node
 */
export async function startLibp2p(): Promise<void> {
  if (isRunning) {
    console.log('[libp2p] Node already running')
    return
  }

  try {
    libp2pNode = await createLibp2p({
      transports: [webSockets()],
      streamMuxers: [mplex()],
      connectionEncryption: [noise()],
      pubsub: gossipsub(),
      peerDiscovery: [
        bootstrap({
          list: [
            // Add bootstrap nodes here if needed
            // '/dns4/bootstrap.libp2p.io/tcp/443/wss/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN'
          ]
        })
      ]
    })

    // Start the node
    await libp2pNode.start()
    isRunning = true

    console.log(`[libp2p] Node started with ID: ${libp2pNode.peerId.toString()}`)

    // Subscribe to topic
    await libp2pNode.pubsub.subscribe(topic, (message: any) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(message.data))
        console.log(`[libp2p] Received message on ${topic}:`, data)
        
        // Handle different message types
        if (data.type === 'property_attestation') {
          handlePropertyAttestation(data)
        } else if (data.type === 'community_message') {
          handleCommunityMessage(data)
        }
      } catch (error) {
        console.error('[libp2p] Error processing message:', error)
      }
    })

    console.log(`[libp2p] Subscribed to topic: ${topic}`)

    // Listen for peer connections
    libp2pNode.addEventListener('peer:connect', (evt: any) => {
      console.log(`[libp2p] Peer connected: ${evt.detail.toString()}`)
    })

    libp2pNode.addEventListener('peer:disconnect', (evt: any) => {
      console.log(`[libp2p] Peer disconnected: ${evt.detail.toString()}`)
    })

  } catch (error) {
    console.error('[libp2p] Error starting node:', error)
    throw error
  }
}

/**
 * Stop libp2p node
 */
export async function stopLibp2p(): Promise<void> {
  if (!isRunning || !libp2pNode) {
    return
  }

  try {
    await libp2pNode.pubsub.unsubscribe(topic)
    await libp2pNode.stop()
    isRunning = false
    console.log('[libp2p] Node stopped')
  } catch (error) {
    console.error('[libp2p] Error stopping node:', error)
  }
}

/**
 * Publish message to topic
 */
export async function publishMessage(data: any): Promise<void> {
  if (!isRunning || !libp2pNode) {
    throw new Error('libp2p node is not running')
  }

  try {
    const message = new TextEncoder().encode(JSON.stringify(data))
    await libp2pNode.pubsub.publish(topic, message)
    console.log(`[libp2p] Published message to ${topic}:`, data)
  } catch (error) {
    console.error('[libp2p] Error publishing message:', error)
    throw error
  }
}

/**
 * Handle property attestation message
 */
function handlePropertyAttestation(data: any) {
  console.log('[libp2p] Property attestation received:', data)
  // In production: Store attestation, verify signature, etc.
}

/**
 * Handle community message
 */
function handleCommunityMessage(data: any) {
  console.log('[libp2p] Community message received:', data)
  // In production: Process community messages, notifications, etc.
}

/**
 * Get node info
 */
export function getNodeInfo() {
  if (!libp2pNode) {
    return null
  }

  return {
    peerId: libp2pNode.peerId.toString(),
    addresses: libp2pNode.getMultiaddrs().map((addr: any) => addr.toString()),
    topic,
    isRunning
  }
}

export const libp2pService = {
  start: startLibp2p,
  stop: stopLibp2p,
  publishMessage,
  getNodeInfo,
  isRunning: () => isRunning
}

