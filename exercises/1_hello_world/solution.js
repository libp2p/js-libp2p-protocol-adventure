import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { tls } from '@libp2p/tls'
import { yamux } from '@chainsafe/libp2p-yamux'

export default async function helloWorld (ma) {
  const node = await createLibp2p({
    transports: [
      tcp()
    ],
    connectionEncryption: [
      tls()
    ],
    streamMuxers: [
      yamux()
    ]
  })

  await node.dial(ma)
}
