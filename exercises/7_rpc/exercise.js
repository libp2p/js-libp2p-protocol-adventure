const exercise = require('workshopper-exercise')()
const verifyProcessor = require('workshopper-verify-processor')
const { loadSolution, loadLibp2p } = require('../../lib/utils.js')

exercise.addVerifyProcessor(verifyProcessor(exercise, async (test) => {
  const { resolver, finder } = await loadSolution(exercise.args[0])

  await test.truthy(typeof resolver === 'function', 'export_a_function', {
    name: 'resolver'
  })
  await test.truthy(typeof finder === 'function', 'export_a_function', {
    name: 'finder'
  })

  const libp2p = await loadLibp2p()

  await testFinder(test, libp2p, finder)
  await testResolver(test, libp2p, resolver)
}))

async function testFinder (test, libp2p, impl) {
  const { rpc } = await import('it-rpc')
  const { pipe } = await import('it-pipe')
  const { default: all } = await import('it-all')
  const protocol = '/rpc/finder/1.0.0'
  const ma = await impl(protocol)

  const signal = AbortSignal.timeout(1000)

  const stream = await libp2p.dialProtocol(ma, protocol, {
    signal
  })

  const rpcDuplex = rpc()
  pipe(stream, rpcDuplex, stream)

  const keys = []

  const resolver = {
    async resolveValue (key) {
      keys.push(key)
      return `value-${key}`
    }
  }
  rpcDuplex.createTarget('resolver', resolver)

  const finder = rpcDuplex.createClient('finder')

  const count = 10
  const events = []
  const values = await all(finder.findValues({
    count,
    onProgress: (event) => {
      events.push(event)
    }
  }))

  await stream.close()

  const result = {
    values,
    events
  }

  await test.equals(result.values.length, count, 'finder_sent_values')
  await test.equals(result.events.length, count, 'finder_invoked_progress_callback')

  for (let i = 0; i < count; i++) {
    await test.equals(result.values[i].key, keys[i], 'finder_key', {
      index: i
    })
    await test.equals(result.values[i].value, `value-${keys[i]}`, 'finder_value', {
      index: i
    })
  }
}

async function testResolver (test, libp2p, impl) {
  const { rpc } = await import('it-rpc')
  const { pipe } = await import('it-pipe')
  const protocol = '/rpc/resolver/1.0.0'

  const interactions = {
    values: [],
    events: []
  }

  libp2p.handle(protocol, ({ stream }) => {
    const rpcDuplex = rpc()
    pipe(stream, rpcDuplex, stream)

    const resolver = rpcDuplex.createClient('resolver')

    const finder = {
      async * findValues (options) {
        interactions.count = options.count

        for (let i = 0; i < options.count; i++) {
          const key = `key-${Math.random()}`
          const event = `request-${key}`

          interactions.events.push(event)

          options.onProgress(event)
          const value = await resolver.resolveValue(key)

          interactions.values.push({
            key,
            value
          })

          yield {
            key,
            value
          }
        }
      }
    }
    rpcDuplex.createTarget('finder', finder)
  })

  const ma = libp2p.getMultiaddrs()[0]
  const result = await impl(ma, protocol)

  await test.equals(result.values.length, interactions.count, 'resolver_resolved_values')

  for (let i = 0; i < interactions.count; i++) {
    await test.equals(result.values[i].key, interactions.values[i].key, 'resolver_key', {
      index: i
    })
    await test.equals(result.values[i].value, interactions.values[i].value, 'resolver_value', {
      index: i
    })
    await test.equals(result.events[i], interactions.events[i], 'resolver_event', {
      index: i
    })
  }
}

module.exports = exercise
