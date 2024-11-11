import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { tls } from '@libp2p/tls'
import { yamux } from '@chainsafe/libp2p-yamux'
import { lpStream } from 'it-length-prefixed-stream'
import * as cbor from 'cborg'

export default async function structuredData (ma, protocol) {
  const node = await createLibp2p({
    transports: [
      tcp()
    ],
    connectionEncrypters: [
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

  const bytes = lpStream(stream)
  const val = await bytes.read({
    signal
  })
  const request = cbor.decode(val.slice())
  const response = cbor.encode({
    type: 'RESPONSE',
    answer: request.challenge.split('').reverse().join('')
  })

  await bytes.write(response, {
    signal
  })

  await stream.close()
}
