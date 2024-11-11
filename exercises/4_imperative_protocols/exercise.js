const exercise = require('workshopper-exercise')()
const verifyProcessor = require('workshopper-verify-processor')
const { randomNumber, defer, loadSolution, loadLibp2p } = require('../../lib/utils.js')

exercise.addVerifyProcessor(verifyProcessor(exercise, async (test) => {
  const { default: fn } = await loadSolution(exercise.args[0])

  await test.truthy(typeof fn === 'function', 'default_export_a_function')

  const libp2p = await loadLibp2p()
  const protocol = '/imperative-protocol/1.0.0'

  const { byteStream } = await import('it-byte-stream')
  const result = defer()
  const count = randomNumber(0, 10)

  libp2p.handle(protocol, ({ stream }) => {
    Promise.resolve().then(async () => {
      try {
        const signal = AbortSignal.timeout(1000)
        const bytes = byteStream(stream)

        await bytes.write(Uint8Array.from([count]), {
          signal
        })

        result.resolve(await bytes.read(count, {
          signal
        }))
      } catch (err) {
        stream.abort(err)
        result.reject(err)
      }
    })
  })

  fn(libp2p.getMultiaddrs()[0], protocol)

  const val = await result.promise
  await test.truthy(val, 'data_sent')
  await test.equals(val.byteLength, count, 'data_amount_sent')
}))

module.exports = exercise
