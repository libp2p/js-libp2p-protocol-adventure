
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
  return Math.round(Math.random() * (max - min) + min);
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

  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  return {
    promise,
    resolve,
    reject
  }
}

module.exports = {
  delay,
  bufferArraysEqual,
  randomNumber,
  randomString,
  defer
}
