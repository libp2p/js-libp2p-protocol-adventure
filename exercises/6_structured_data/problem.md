Sending raw bytes back and forward is all good and well, but applications generally want to work with structured data instead.

There are several approaches to sending structured data across a network connection, if you like to keep things lightweight you could use JSON or CBOR.

If you have a requirement for schemas you could use Protocol Buffers or even XML. Modules like `it-protobuf-stream` and `protons` make this simple.

Now that you can send arbitrarily sized messages via libp2p streams the possibilities are (almost) endless!

## Challenge

Write a script with a function as it's default export.

- The function should take a multiaddr and a protocol name and return a promise
- It should start a libp2p node and open a protocol stream using the passed arguments
- All messages sent over this stream will be prefixed by a varint describing the length of the message
- Each message will be in CBOR format
- It should read a message from the stream and decode it to a JavaScript object, it will have the following shape:

```json
{
  "type": "REQUEST",
  "challenge": "foobarbaz"
}
```

- The function should take the value corresponding to the `challenge` key and reverse the string value, then send it back to the remote peer as length-prefixed CBOR generated from an object with the shape:

```json
{
  "type": "RESPONSE",
  "answer": "zabraboof"
}
```

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

- json https://www.json.org/
- cbor https://cbor.io/
- protocol buffers https://protobuf.dev/
- cborg https://www.npmjs.com/package/cborg
- protons https://www.npmjs.com/package/protons
