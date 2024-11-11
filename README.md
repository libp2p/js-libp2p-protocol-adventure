# libp2p-protocol-adventure

[![libp2p.io](https://img.shields.io/badge/project-libp2p-yellow.svg?style=flat-square)](http://libp2p.io/)
[![Discuss](https://img.shields.io/discourse/https/discuss.libp2p.io/posts.svg?style=flat-square)](https://discuss.libp2p.io)
[![codecov](https://img.shields.io/codecov/c/github/libp2p/js-libp2p-protocol-adventure.svg?style=flat-square)](https://codecov.io/gh/libp2p/js-libp2p-protocol-adventure)
[![CI](https://img.shields.io/github/actions/workflow/status/libp2p/js-libp2p-protocol-adventure/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/libp2p/js-libp2p-protocol-adventure/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> A workshop for learning about custom protocol streams in libp2p

![protocol-adventure](https://raw.githubusercontent.com/libp2p/js-libp2p-protocol-adventure/master/assets/image.png)

## Requirements

1. Node.js install
2. A working knowledge of [JavaScript](https://www.npmjs.com/package/javascripting), [Node.js](https://www.npmjs.com/package/learnyounode)
3. Some time and a pot of coffee

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

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/libp2p/js-libp2p-protocol-adventure/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/libp2p/js-libp2p-protocol-adventure/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
