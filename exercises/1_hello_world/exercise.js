const exercise = require('workshopper-exercise')()
const verifyProcessor = require('workshopper-verify-processor')
const path = require('path')
const { delay } = require('../../lib/utils.js')

exercise.addVerifyProcessor(verifyProcessor(exercise, async (test) => {
  const solution = path.resolve(path.join(process.cwd(), exercise.args[0]))
  const { default: fn } = await import(solution)

  await test.truthy(typeof fn === 'function', 'default_export_a_function')

  const { default: libp2p } = await import(path.resolve(path.join(__dirname, '../../lib/libp2p.mjs')))

  await fn(libp2p.getMultiaddrs()[0])

  for (let i = 0; i < 10; i++) {
    if (libp2p.getConnections().length > 0) {
      break
    }

    await delay(1000)
  }

  await test.truthy(libp2p.getConnections().length, 'node_had_connection')
}))

module.exports = exercise
