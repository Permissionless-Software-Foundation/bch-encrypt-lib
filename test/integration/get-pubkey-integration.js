/*
  Integration tests for the get-pubkey.js  library.
*/

// npm libraries
const assert = require('chai').assert
const BCHJS = require('@psf/bch-js')

const bchjs = new BCHJS()

// Unit under test
const GetPubKeyLib = require('../../lib/get-pubkey')
let uut

describe('#get-pubkey.js', () => {
  // Refresh the uut before each test.
  beforeEach(() => (uut = new GetPubKeyLib({ bchjs })))

  describe('#queryBlockchain', () => {
    it('should return false if public key could not be found on the blockchain', async () => {
      const addr = 'bitcoincash:qp3sn6vlwz28ntmf3wmyra7jqttfx7z6zgtkygjhc7'

      const pubkey = await uut.queryBlockchain(addr)

      assert.isBoolean(pubkey)
      assert.isFalse(pubkey)
    })

    it('should get public key on an address', async () => {
      const addr = 'bitcoincash:qq5z2rqupzthfwt8ttyvfref0avgg7p46qu0q9g3z6'

      const pubkey = await uut.queryBlockchain(addr)

      assert.isString(pubkey)
    })
  })
})
