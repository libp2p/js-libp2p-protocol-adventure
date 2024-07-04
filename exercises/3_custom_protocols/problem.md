libp2p's stream multiplexing allows you to open many streams over a connection.

Each multiplexed stream has a `protocol` - a string that is used by the remote node to select the correct handler function for the incoming stream.

It's common to include a version number in the protocol name, though it's for developer benefit only - the name is treated as an opaque string during negotiation.

## Outbound streams

A stream can be opened on a remote node like this:

```js
const myProtocolId = '/my-protocol/1.0.0'

// it's a good idea to pass a timeout when doing async work
const signal = AbortSignal.timeout(5000)

const stream = await libp2p.dialProtocol(multiaddr, myProtocolId, {
  signal
})
```

If no connection to the remote node exists, one will be opened before opening the stream.

Alternatively you can open the connection yourself with:

```js
const signal = AbortSignal.timeout(5000)

const conn = await libp2p.dial(multiaddr, {
  signal
})
const stream = await conn.newStream(myProtocolId, {
  signal
})
```

In general it's preferable to let libp2p handle the opening/closing of connections since several protocols will activate on the establishment of a new connection, and forcibly closing them while these protocols are running can adversely affect the functionality of your node.

## Inbound streams

You can define handlers for incoming streams on a given protocol like this:

```js
const myProtocolId = '/my-protocol/1.0.0'

libp2p.handle(myProtocolId, ({ stream, connection }) => {
  // your code here
}, {
  // protocol options
})
```

Your handler will be invoked when a remote peer opens a stream for your protocol.

## Challenge

Write a script that exports two functions, one called `dial` and one called `respond`.

### dial

- The `dial` function should accept a multiaddr, a protocol name and an array of `Uint8Array`s
- It should dial the multiaddr and open a protocol stream with the passed name
- It should write the passed data into the stream and read any output from the stream
- The function should return an array or a promise of an array containing the data read from the stream

### respond

- The `respond` function should accept a protocol name
- It should create a libp2p node that creates a `TCP` listener on a free port
- It should register a protocol handler for the passed protocol name
- The protocol handler should echo any data read from the incoming stream back into itself
- The function should return the `Multiaddr` that the node is listening on

## Verify

Once you have done this, verify your solution:

```console
$ protocol-adventure verify path/to/my/solution.js
```

## Hints

- You can discover the multiaddrs your node is listening on with `libp2p.getMultiaddrs()`

## References

- libp2p.handle https://libp2p.github.io/js-libp2p/interfaces/_libp2p_interface.Libp2p.html#handle.handle-1
- StreamHandler https://libp2p.github.io/js-libp2p/interfaces/_libp2p_interface.StreamHandler.html
- StreamHandlerOptions https://libp2p.github.io/js-libp2p/interfaces/_libp2p_interface.StreamHandlerOptions.html
