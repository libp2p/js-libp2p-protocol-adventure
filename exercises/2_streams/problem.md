We're going to make a quick detour into streaming primitives.

There are several streaming primitives available in JavaScript, such as:

- WHAT-WG Streams - https://streams.spec.whatwg.org/
- Node streams - https://nodejs.org/api/stream.html
- pull-streams - https://pull-stream.github.io
- ..etc

`Web Streams` would be the preferred interface as they are (now) available on all platforms, unfortunately at the time of writing their performance suffers compared to `Node Streams`, though we will continue to monitor the situation.

`Node Streams` are not available in browsers so must be polyfilled which can increase bundle sizes unexpectedly due to extra dependencies.

## Streams in libp2p

libp2p uses platform-agnostic streaming-iterables as its streaming primitive, which make extensive use of AsyncGenerators.

At their simplest, a duplex (e.g. bidirectional) stream looks like this:

```js
const stream = {
  source: AsyncGenerator
  sink(source: AsyncGenerator): Promise<void>
}
```

### source

The stream source is an `AsyncGenerator` that yields values, typically `Uint8Array`s.

The source is how we read data from a stream:

```js
for await (const buf of stream.source) {
  console.info(buf) // binary data, eg. [0x0, 0x1, 0x2...]
}
```

### sink

A sink is a function that takes an `AsyncGenerator` and returns a promise that resolves to no value once the passed generator has returned.

The sink is how we write data to a stream:

```js
const generator = async function * () {
  yield Uint8Array.from([0, 1, 2, 3])
}

await stream.sink(generator())
```

## Working with streams

Async generators can be awkward to work with, so several supporting modules have appeared to ease the pain a little.

For example you can use `it-all` to collect all values from a generator:

```js
import all from `it-all`

const values = await all(stream.source)
```

This buffers all values into memory.  If you wish to just read a generator until it ends, you can use `it-drain`:

```js
import drain from 'it-drain'

await drain(stream.source)
```

To write values into a stream, you can use `it-pushable`:

```js
import { pushable } from 'it-pushable'

const p = pushable()
p.push(Uint8Array.from([0, 1, 2, 3]))
p.end()

await stream.sink(p)
```

The `it-pipe` module lets you chain streams and transforms together.

The first argument should be a source, all subsequent arguments should be transforms, and the last argument may be a sink.

It and understands `{ source, sink }`-style duplexes out of the box so is a great way to simplify your streaming code.

To pipe a stream back to itself (e.g. create an echo stream):

```js
import { pipe } from 'it-pipe'

await pipe(
  stream,
  stream
)
```

To write values and to a stream, then wait until it is closed:

```js
import { pipe } from 'it-pipe'
import drain from 'it-drain'

await pipe(
  [Uint8Array.from([0, 1, 2, 3])],
  stream,
  (source) => drain(source)
)
```

There are lots of other `it-*` modules available, such as `it-first`, `it-last`, `it-filter`, `it-length`, `it-map`, `it-take`, etc.

## Challenge

Write a script that exports a default function that takes a stream as an argument.

The function should filter all values so only numbers with values less than `5` remain, multiply any non-filtered values by `2` and write the results back to the stream.

## Verify

Once you have done this, verify your solution:

```console
$ protocol-adventure verify path/to/my/solution.js
```

## Hints

Check out some of the `it-*` modules:

- it-pipe https://npmjs.com/package/it-pipe
- it-pushable https://npmjs.com/package/it-pushable
- it-filter https://npmjs.com/package/it-filter
- it-map https://npmjs.com/package/it-map
- it-all https://npmjs.com/package/it-all
- it-drain https://npmjs.com/package/it-drain

## References

- Streaming Iterables https://github.com/libp2p/js-libp2p/blob/main/doc/STREAMING_ITERABLES.md
- AsyncGenerators https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncGenerator
- Uint8Arrays https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
- WebStream performance https://github.com/nodejs/node/pull/53256#pullrequestreview-2095785321
- Streams benchmark https://github.com/ipfs-shipyard/js-streams-benchmark
