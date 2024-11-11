const exercise = require('workshopper-exercise')()
const verifyProcessor = require('workshopper-verify-processor')
const { loadSolution } = require('../../lib/utils.js')

exercise.addVerifyProcessor(verifyProcessor(exercise, async (test) => {
  const { default: fn } = await loadSolution(exercise.args[0])

  await test.truthy(typeof fn === 'function', 'default_export_a_function')

  const output = []
  const expected = [2, 4, 8, 0.4, 6]

  const stream = {
    source: (async function * () {
      yield * [1, 10, 2, 59, 7, 'hello', 9, 4, {}, 0.2, 8, () => {}, 14, 3]
    }()),
    sink: async function (source) {
      for await (const val of source) {
        output.push(val)
      }
    }
  }

  await fn(stream)

  await test.equals(output.length, expected.length, 'too_many_values')

  for (let i = 0; i < output.length; i++) {
    await test.equals(output[i], expected[i], 'incorrect_values', {
      index: i
    })
  }
}))

module.exports = exercise
