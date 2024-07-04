So far we've been sending very small amounts of data, the kind of amounts that would fit into a single network packet.

What if we want to send many bytes in one go?

In this case the underlying network connection may split the data into multiple packets which will arrive at the recipient one by one.

To create robust protocols we should inform the remote peer how much data we are about to send them.

This allows the network layer to optimize sending in whatever way it sees fit, and also allows the remote to reject the message if it is larger than they are willing to accept.

## varints

A common way to inform the remote peer of how many bytes we are about to sent them is to prefix the message with a varint, the value of which is the size of the following bytes.

A varint is represented by one or more bytes.

- If the most significant bit (msb) in the byte is `1` then the subsequent byte is also part of the varint
- If it is `0` then we should take all previous bytes, remove the msb and interpret what's left as the number

Modules such as `it-length-prefixed` allow us to apply varint encoding to streaming messages, and `it-length-prefixed-stream` allow us to do the same thing in the imperative style.

```js
import { lpStream } from 'it-length-prefixed-stream'

// it's a good idea to pass a timeout when doing async work
const signal = AbortSignal.timeout(5000)

const stream = await libp2p.dialProtocol(multiaddr, myProtocolId, {
  signal
})

const bytes = lpStream(stream)

// write bytes into the stream
await bytes.write(Uint8Array.from([0, 1, 2, 3, 4]), {
  signal
})

// read the next chunk, the size is
const result = await bytes.read({
  signal
})
```

## Challenge

Write a script with a function as it's default export.

- The function should take a multiaddr and a protocol name and return a promise
- It should start a libp2p node and open a protocol stream using the passed arguments
- All messages sent over this stream will be prefixed by a varint describing the length of the message
- It should read a length-prefixed value from the stream
- The value itself should also be interpreted as a varint
- It should then write that many bytes of data back into the stream and close it

Once the stream has closed the promise returned from the function should resolve.

## Verify

Once you have done this, verify your solution:

```console
$ protocol-adventure verify path/to/my/solution.js
```

## Hints

- You can solve this in the streaming or imperative style, it's up to you!
- Values returned from `it-length-prefixed` and `it-length-prefixed-stream` are `Uint8ArrayList`s as in the previous exercise
- You can convert a `Uint8ArrayList` to a `Uint8Array` by calling `.slice` on it
- You can use the `uint8-varint` module to easily convert bytes to a numeric value

## References

- it-length-prefixed https://www.npmjs.com/package/it-length-prefixed
- it-length-prefixed-stream https://www.npmjs.com/package/it-length-prefixed-stream
- uint8arraylist https://www.npmjs.com/package/uint8arraylist
- uint8-varint https://www.npmjs.com/package/uint8-varint
