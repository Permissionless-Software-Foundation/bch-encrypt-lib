/*
  Unit tests for the get-pubkey.js  library.
*/

// npm libraries
const chai = require('chai')
const sinon = require('sinon')

// Locally global variables.
const assert = chai.assert

// Mocking data libraries.
const mockData = require('./mocks/get-pubkey-mocks')

// Unit under test
const GetPubKeyLib = require('../../lib/get-pubkey')
const uut = new GetPubKeyLib()

describe('#get-pubkey.js', () => {
  let sandbox

  // Restore the sandbox before each test.
  beforeEach(() => (sandbox = sinon.createSandbox()))
  afterEach(() => sandbox.restore())

  describe('#queryBlockchain', () => {
    it('should throw error if address is not a string', async () => {
      try {
        const addr = 1234

        await uut.queryBlockchain(addr)

        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'Address must be a string')
      }
    })
    it('should return false if public key could not be found on the blockchain', async () => {
      // Mock external dependencies.
      sandbox
        .stub(uut.bchjs.encryption, 'getPubKey')
        .resolves({ success: false })
      const addr = 'bitcoincash:qp3sn6vlwz28ntmf3wmyra7jqttfx7z6zgtkygjhc7'

      const pubkey = await uut.queryBlockchain(addr)
      assert.isBoolean(pubkey)
      assert.isFalse(pubkey)
    })

    it('should get public key on an address', async () => {
      // Mock external dependencies.
      sandbox
        .stub(uut.bchjs.encryption, 'getPubKey')
        .resolves(mockData.mockPubkey)

      const addr = 'bitcoincash:qp3sn6vlwz28ntmf3wmyra7jqttfx7z6zgtkygjhc7'

      const pubkey = await uut.queryBlockchain(addr)

      // Assert that top-level properties exist.
      assert.isString(pubkey)
    })
  })
})
