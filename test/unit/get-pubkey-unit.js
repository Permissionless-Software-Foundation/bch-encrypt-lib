/*
  Unit tests for the get-pubkey.js  library.
*/

// npm libraries
const assert = require('chai').assert
const sinon = require('sinon')
const BCHJS = require('@psf/bch-js')
const bchjs = new BCHJS()

// Mocking data libraries.
const mockData = require('./mocks/get-pubkey-mocks')

// Unit under test
const GetPubKeyLib = require('../../lib/get-pubkey')
let uut

describe('#get-pubkey.js', () => {
  let sandbox

  beforeEach(() => {
    // Create a new sandbox before each test case.
    sandbox = sinon.createSandbox()

    // Re-instantiate the uut before each test.
    uut = new GetPubKeyLib({ bchjs })
  })

  // Restore the sandbox before each test.
  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should accept bch-js passed as a config option', () => {
      const config = { bchjs }

      uut = new GetPubKeyLib(config)

      assert.property(uut.bchjs, 'restURL')
    })

    it('should throw an error if no config object is passed', () => {
      try {
        const testUut = new GetPubKeyLib()

        assert.fail('Unexpected result')
        console.log('testUut: ', testUut)
      } catch (err) {
        assert.include(
          err.message,
          'A config object must be passed when instantiating the GetPubKey Class.'
        )
      }
    })

    it('should throw an error if not passed a bch-js instance', () => {
      try {
        const testUut = new GetPubKeyLib({})

        assert.fail('Unexpected result')
        console.log('testUut: ', testUut)
      } catch (err) {
        assert.include(
          err.message,
          'An instance of bch-js must be passed when instantiating GetPubKey.'
        )
      }
    })
  })

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
