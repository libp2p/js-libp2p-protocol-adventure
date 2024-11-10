libp2p is a modular system for building distributed applications in JavaScript.

In this first challenge we're going to configure a libp2p node and have it dial another.

In a basic configuration, a libp2p node requires certain components:

1. Transports

Transports are how libp2p sends traffic to other nodes over the network.

Common transports are `TCP`, `WebSockets`, `WebRTC` and `WebTransport`.

Each platform supports a different set of transports. In our challenge we will use TCP.

2. Connection Encrypters

To ensure traffic cannot be eavesdropped on, we will encrypt the data sent over the transport.

Example encrypters are `tls` and `noise`.

3. Stream multiplexers

Libp2p performs stream multiplexing over connections, this allows us to open many concurrent streams over a single connection.

Some transports provide their own stream multiplexers, for others we need to configure one such as `yamux`.

## Getting started

First we're going to install `libp2p` along with some supporting modules:

```console
$ npm install libp2p @libp2p/tcp @libp2p/tls @chainsafe/libp2p-yamux
```

Then configure your application:

```js
import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { tls } from '@libp2p/tls'
import { yamux } from '@chainsafe/libp2p-yamux'

const node = await createLibp2p({
  addresses: {
    listen: [
      // listen on a random port and accept incoming connections from any host
      '/ip4/0.0.0.0/tcp/0'
    ]
  },
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

console.info('My node id:', node.peerId.toString())
```

This should start the node and display the peer id.

## Challenge

Write a script that exports a default function that takes a multiaddr as an argument.

The function should start a libp2p node with the `tcp` transport, `tls` encryption and the `yamux` multiplexer, and make the node dial the passed address.

## Verify

Once you have done this, verify your solution:

```console
$ protocol-adventure verify path/to/my/solution.js
```

## Hints

- Find the dial method in the libp2p API docs to see how to dial a multiaddr

## References

- libp2p API docs https://libp2p.github.io/js-libp2p/interfaces/_libp2p_interface.Libp2p.html
- Multiaddr https://github.com/multiformats/multiaddr
