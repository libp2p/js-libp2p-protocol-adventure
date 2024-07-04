import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { tls } from '@libp2p/tls'
import { yamux } from '@chainsafe/libp2p-yamux'
import { rpc } from 'it-rpc'
import { pipe } from 'it-pipe'
import all from 'it-all'

export async function finder (protocol) {
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
    const rpcDuplex = rpc()
    pipe(stream, rpcDuplex, stream)

    const resolver = rpcDuplex.createClient('resolver')

    const finder = {
      async * findValues (options) {
        for (let i = 0; i < options.count; i++) {
          const key = `key-${Math.random()}`

          options.onProgress(`request-${key}`)
          const value = await resolver.resolveValue(key)

          yield {
            key,
            value
          }
        }
      }
    }
    rpcDuplex.createTarget('finder', finder)
  })

  return node.getMultiaddrs()[0]
}

export async function resolver (ma, protocol) {
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

  const signal = AbortSignal.timeout(1000)

  const stream = await node.dialProtocol(ma, protocol, {
    signal
  })

  const rpcDuplex = rpc()
  pipe(stream, rpcDuplex, stream)

  const resolver = {
    async resolveValue (key) {
      return `value-${key}`
    }
  }
  rpcDuplex.createTarget('resolver', resolver)

  const finder = rpcDuplex.createClient('finder')

  const events = []

  const values = await all(finder.findValues({
    count: 10,
    onProgress: (event) => {
      events.push(event)
    }
  }))

  await stream.close()

  return {
    values,
    events
  }
}
