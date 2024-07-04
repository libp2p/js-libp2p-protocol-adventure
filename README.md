# libp2p-protocol-adventure

A workshop for learning about custom protocol streams in libp2p

![protocol-adventure](https://raw.githubusercontent.com/libp2p/js-libp2p-protocol-adventure/master/assets/image.png)

## Requirements

1. Node.js install
1. A working knowledge of [JavaScript](https://www.npmjs.com/package/javascripting), [Node.js](https://www.npmjs.com/package/learnyounode)
1. Some time and a pot of coffee

## Installation

```sh
$ npm install -g @libp2p/protocol-adventure
```

That didn't work.

```sh
$ sudo npm install -g @libp2p/protocol-adventure
```

[Okay](https://xkcd.com/149/).

## Usage

After installing, start the workshop and follow the instructions:

```sh
$ protocol-adventure
```

## Can I use TypeScript?

Yes you can, but due to complications around everyone's preferred TypeScript setup, please compile your solutions yourself and verify the compiled code:

```console
$ tsc my-solution.ts
$ protocol-adventure verify ./build/my-solution.js
```
