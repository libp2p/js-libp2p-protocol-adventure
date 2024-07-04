const exercise = require('workshopper-exercise')()
const verifyProcessor = require('workshopper-verify-processor')
const path = require('path')
const { randomString, defer } = require('../../lib/utils.js')

exercise.addVerifyProcessor(verifyProcessor(exercise, async (test) => {
  const solution = path.resolve(path.join(process.cwd(), exercise.args[0]))
  const { default: fn } = await import(solution)

  await test.truthy(typeof fn === 'function', 'default_export_a_function')

  const { default: libp2p } = await import(path.resolve(path.join(__dirname, '../../lib/libp2p.mjs')))
  const protocol = '/imperative-protocol/1.0.0'

  const { lpStream } = await import('it-length-prefixed-stream')
  const result = defer()
  const challenge = randomString(100)
  const cborg = await import('cborg')

  libp2p.handle(protocol, ({ stream }) => {
    Promise.resolve().then(async () => {
      try {
        const signal = AbortSignal.timeout(1000)
        const bytes = lpStream(stream)

        await bytes.write(cborg.encode({
          type: 'REQUEST',
          challenge
        }), {
          signal
        })

        result.resolve(await bytes.read({
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
  const response = cborg.decode(val.slice())
  await test.truthy(response, 'response_sent')
  await test.equals(response.type, 'RESPONSE', 'response_type')
  await test.equals(response.answer, challenge.split('').reverse().join(''), 'response_value')
}))

module.exports = exercise
