const exercise = require('workshopper-exercise')()
const verifyProcessor = require('workshopper-verify-processor')
const { bufferArraysEqual, loadSolution, loadLibp2p } = require('../../lib/utils.js')

exercise.addVerifyProcessor(verifyProcessor(exercise, async (test) => {
  const { dial, respond } = await loadSolution(exercise.args[0])

  await test.truthy(typeof dial === 'function', 'export_a_function', {
    name: 'dial'
  })
  await test.truthy(typeof respond === 'function', 'export_a_function', {
    name: 'respond'
  })

  const libp2p = await loadLibp2p()

  await testDial(test, libp2p, dial)
  await testRespond(test, libp2p, respond)
}))

async function testDial (test, libp2p, dial) {
  const { pipe } = await import('it-pipe')
  const protocol = '/echo/dial/1.0.0'
  const ma = libp2p.getMultiaddrs()[0]

  const input = [
    Uint8Array.from([0, 1, 2, 3]),
    Uint8Array.from([4, 5, 6, 7]),
    Uint8Array.from([8, 9, 0, 1])
  ]
  const echoed = []
  let e

  libp2p.handle(protocol, ({ stream }) => {
    pipe(
      stream,
      async function * (source) {
        for await (const buf of source) {
          echoed.push(buf)
          yield buf
        }
      },
      stream
    ).catch(err => {
      e = err
    })
  })

  const output = await dial(ma, protocol, input)

  await test.falsey(e, 'dial_echo')
  await test.truthy(await bufferArraysEqual(input, echoed), 'dial_sent_data')
  await test.truthy(await bufferArraysEqual(input, output), 'dial_read_data')
}

async function testRespond (test, libp2p, respond) {
  const { pipe } = await import('it-pipe')
  const protocol = '/echo/respond/1.0.0'
  const ma = await respond(protocol)

  const stream = await libp2p.dialProtocol(ma, protocol, {
    signal: AbortSignal.timeout(1000)
  })

  const input = [
    Uint8Array.from([8, 9, 0, 1]),
    Uint8Array.from([4, 5, 6, 7]),
    Uint8Array.from([0, 1, 2, 3])
  ]

  const echoed = []

  await pipe(
    input,
    stream,
    async (source) => {
      for await (const buf of source) {
        echoed.push(buf)
      }
    }
  )

  await test.truthy(await bufferArraysEqual(input, echoed), 'respond_sent_data')
}

module.exports = exercise
