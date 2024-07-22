Another approach to working with protocol streams at a high level is to use RPC.

The `it-rpc` module allows calling methods on a remote target over a duplex iterable like a libp2p protocol stream.

The only rules are that any returned values must be promises (since synchronous access would be impossible), so no property access is allowed but calling methods that return void are.  If a void method throws an error it will be

## Challenge

Given the following interfaces:

```ts
interface Value {
  key: string
  value: string
}

interface FindValuesOptions {
  /**
   * How many values to find
   */
  count: number
  /**
   * A progress handler callback
   */
  onProgress(event: string): void
}

interface ValueFinder {
  /**
   * When invoked this will call back to the client to supply values
   */
  findValues(options: FindValuesOptions): AsyncGenerator<Value>
}

interface ValueResolver {
  /**
   * Called by the server to supply values for the key
   */
  resolveValue(key: string): Promise<string>
}
```

Write a script that exports two functions - `finder` and `resolver`.

### finder

- The `finder` function should take a protocol name and return a promise that resolves to a `Multiaddr`
- It should start a libp2p node and have it listen on a random TCP port
- Register a protocol handler for the passed protocol

The protocol handler should:

1. Create an instance of `it-rpc`
1. Pipe the incoming stream to the `it-rpc` instance, and pipe the `it-rpc` instance back to the stream
1. Create an rpc client object named `resolver` that implements the `ValueResolver` interface
1. Implement the `ValueFinder` interface and expose as an RPC target with the name `finder`

The `findValues` method implementation should:

1. Generate a random string key
1. Invoke the passed `onProgress` callback with a suitable string
1. Call `.resolveValue` on the `resolver` rpc client object
1. Yield the key and the value in a way that conforms to the `Value` interface

### resolver

- The `resolver` function should take a `Multiaddr` and a protocol name and return a promise
- It should start a libp2p node and open a protocol stream using the passed arguments

It should then:

1. Create an instance of `it-rpc`
1. Pipe the incoming stream to the `it-rpc` instance, and pipe the `it-rpc` instance back to the stream
1. Create an rpc client object named `finder` that implements the `ValueFinder` interface
1. Implement the `ValueResolver` interface and expose as an RPC target with the name `resolver`
1. The `resolveValue` method should return a suitable string

The function should resolve a number of values, and collect the `onProgress` strings and return them in a way that conforms to this interface:

```ts
interface ResolverResult {
  values: Value[]
  events: string[]
}
```

Once all values have been resolved the stream can be closed and the promise returned from the function should resolve.

## Verify

Once you have done this, verify your solution:

```console
$ protocol-adventure verify path/to/my/solution.js
```

## Hints

- Well done making it this far
- Check the model solution if you get stuck

## References

- rpc https://en.wikipedia.org/wiki/Remote_procedure_call
- it-rpc https://www.npmjs.com/package/it-rpc
