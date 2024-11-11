/* eslint-env mocha */
/* eslint-disable no-loop-func */
'use strict'

const { spawn } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const menu = require('../exercises/menu.json')

function makeConfigDir () {
  const dir = path.join(os.tmpdir(), 'protocol-adventure-test', `dir-${Math.random()}`)
  fs.mkdirSync(dir, {
    recursive: true
  })

  return dir
}

function selectLanguage (selected, dir) {
  const containingDir = path.join(dir, '.config', 'workshopper')
  fs.mkdirSync(containingDir, {
    recursive: true
  })
  fs.writeFileSync(path.join(containingDir, 'lang.json'), `${JSON.stringify({ selected }, 0, 2)}\n`)
}

function selectExercise (exercise, dir) {
  const containingDir = path.join(dir, '.config', '@libp2p/protocol-adventure')
  fs.mkdirSync(containingDir, {
    recursive: true
  })
  fs.writeFileSync(path.join(containingDir, 'current.json'), `${JSON.stringify(exercise)}\n`)
}

describe('protocol-adventure', () => {
  let configDir

  before(() => {
    configDir = makeConfigDir()
    selectLanguage('en', configDir)
  })

  beforeEach(() => {

  })

  for (const exercise of menu) {
    it(`should pass ${exercise}`, async () => {
      selectExercise(exercise, configDir)

      const solution = path.resolve(__dirname, '..', 'exercises', exercise, 'solution.mjs')
      const verify = spawn('node', ['index.js', 'verify', solution], {
        env: {
          ...process.env,
          WORKSHOPPER_ADVENTURE_STORAGE_DIR: configDir
        },
        stdio: 'inherit'
      })

      await new Promise((resolve, reject) => {
        verify.on('close', (code) => {
          if (code === 0) {
            resolve()
          } else {
            reject(new Error(`Failed to verify solution to ${exercise} - child process exited with code ${code}`))
          }
        })
      })
    })
  }
})
