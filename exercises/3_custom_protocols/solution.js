import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { tls } from '@libp2p/tls'
import { yamux } from '@chainsafe/libp2p-yamux'
import { pipe } from 'it-pipe'
import all from 'it-all'

export async function dial (ma, protocol, data) {
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

  const stream = await node.dialProtocol(ma, protocol, {
    signal: AbortSignal.timeout(1000)
  })

  return await pipe(
    data,
    stream,
    source => all(source)
  )
}

export async function respond (protocol) {
  const node = await createLibp2p({
    addresses: {
      listen: [
        '/ip4/0.0.0.0/tcp/0'
      ]
    },
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

  node.handle(protocol, ({ stream }) => {
    pipe(
      stream,
      stream
    )
  })

  return node.getMultiaddrs()[0]
}
