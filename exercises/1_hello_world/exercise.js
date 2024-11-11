const exercise = require('workshopper-exercise')()
const verifyProcessor = require('workshopper-verify-processor')
const { delay, loadSolution, loadLibp2p } = require('../../lib/utils.js')

exercise.addVerifyProcessor(verifyProcessor(exercise, async (test) => {
  const { default: fn } = await loadSolution(exercise.args[0])

  await test.truthy(typeof fn === 'function', 'default_export_a_function')

  const libp2p = await loadLibp2p()

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
