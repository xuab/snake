const readline = require('readline')

const setupInput = (callbacks) => {
  readline.emitKeypressEvents(process.stdin)
  process.stdin.setRawMode(true)
  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') process.exit()
    callbacks[key.name]?.()
  })
}

module.exports = { setupInput }