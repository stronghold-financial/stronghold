const consola = require('consola')
const { generateKey } = require('ironfish-wasm-nodejs')

beforeAll(() => {
  // This causes the WASM to be initialized, which is 1 time 2 second cost for each test suite
  if (process.env.TEST_INIT_WASM) {
    generateKey()
  }
})

beforeEach(() => {
  consola.pause()
})
