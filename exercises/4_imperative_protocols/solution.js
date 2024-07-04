import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { tls } from '@libp2p/tls'
import { yamux } from '@chainsafe/libp2p-yamux'
import { byteStream } from 'it-byte-stream'

export default async function imperativeProtocols (ma, protocol) {
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

  const bytes = byteStream(stream)
  const val = await bytes.read(1, {
    signal
  })
  const data = new Uint8Array(val.get(0))

  await bytes.write(data, {
    signal
  })

  await stream.close()
}
