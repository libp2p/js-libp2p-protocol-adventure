Duplex iterable streams combined with `it-pipe` give a very powerful and low overhead way of interacting with remote nodes but sometimes we want a more request/response style of protocol design.

Modules like `it-byte-stream` make programming using a more imperative model much easier.

After opening a stream, one can use the `read`/`write` methods to send or receive data.

When writing data, once the promise resolves, the data is guaranteed to have been passed off to the underlying transport.

```js
import { byteStream } from 'it-byte-stream'

// it's a good idea to pass a timeout when doing async work
const signal = AbortSignal.timeout(5000)

const stream = await libp2p.dialProtocol(multiaddr, myProtocolId, {
  signal
})

const bytes = byteStream(stream)

// write bytes into the stream
await bytes.write(Uint8Array.from([0, 1, 2, 3, 4]){
  signal
})

// read five bytes from the stream, or time out
const fiveBytes = await bytes.read(5, {
  signal
})
```

## Challenge

Write a script with a function as it's default export.

- The function should take a multiaddr and a protocol name and return a promise.
- It should start a libp2p node and open a protocol stream using the passed arguments.
- It should read one byte from the stream and treat it as a numeric value.
- It should then write that many bytes of data back into the stream and close it.

Once the stream has closed the promise returned from the function should resolve.

## Verify

Once you have done this, verify your solution:

```console
$ protocol-adventure verify path/to/my/solution.js
```

## Hints

- The values returned from `it-byte-stream` are `Uint8ArrayList`s
- `Uint8ArrayList`s allow us to treat multiple `Uint8Array`s as one array instead of copying them all to create a new `Uint8Array`
- You can retrieve values from them with `.get`
  - e.g. `list.get(8)` will return the 8th byte in the list

## References

- it-byte-stream https://www.npmjs.com/package/it-byte-stream
- uint8arraylist https://www.npmjs.com/package/uint8arraylist
