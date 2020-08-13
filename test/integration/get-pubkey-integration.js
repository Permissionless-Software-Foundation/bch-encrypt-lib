/*
  Integration tests for the get-pubkey.js  library.
*/

// npm libraries
const chai = require('chai')

// Locally global variables.
const assert = chai.assert

// Unit under test
const GetPubKeyLib = require('../../lib/get-pubkey')
const uut = new GetPubKeyLib()

describe('#get-pubkey.js', () => {
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
