#!/usr/bin/env node

const workshopper = require('workshopper-adventure')

const workshop = workshopper({
  appDir: __dirname,
  languages: ['en'],
  header: require('workshopper-adventure/default/header'),
  footer: require('workshopper-adventure/default/footer')
})

workshop.addAll(require('./exercises/menu.json'))
workshop.execute(process.argv.slice(2))

process.on('unhandledRejection', error => {
  console.error(error.stack ? error.stack : error.toString())
  throw error
})
