import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { tls } from '@libp2p/tls'
import { yamux } from '@chainsafe/libp2p-yamux'
import { lpStream } from 'it-length-prefixed-stream'
import * as varint from 'uint8-varint'

export default async function lengthPrefixedData (ma, protocol) {
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
  const requestedBytes = varint.decode(val)
  const data = new Uint8Array(requestedBytes)

  await bytes.write(data, {
    signal
  })

  await stream.close()
}
