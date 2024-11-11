const path = require('node:path')
const url = require('node:url')

async function delay (ms) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

async function bufferArraysEqual (arr1, arr2) {
  const { Uint8ArrayList } = await import('uint8arraylist')

  const buf1 = new Uint8ArrayList(...arr1)
  const buf2 = new Uint8ArrayList(...arr2)

  return buf1.equals(buf2)
}

function randomNumber (min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

function randomString (length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let output = ''

  for (let i = 0; i < length; i++) {
    output += characters[randomNumber(0, characters.length)]
  }

  return output
}

function defer () {
  let resolve, reject

  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  return {
    promise,
    resolve,
    reject
  }
}

async function loadSolution (solution) {
  let file = solution

  if (!path.isAbsolute(file)) {
    file = path.resolve(path.join(process.cwd(), solution))
  }

  return await import(url.pathToFileURL(file))
}

async function loadLibp2p () {
  const file = path.resolve(path.join(__dirname, 'libp2p.mjs'))
  const { default: libp2p } = await import(url.pathToFileURL(file))

  return libp2p
}

module.exports = {
  delay,
  bufferArraysEqual,
  randomNumber,
  randomString,
  defer,
  loadSolution,
  loadLibp2p
}
