/*
  Unit tests for the get-pubkey.js  library.
*/

// npm libraries
const assert = require('chai').assert
const fs = require('fs')

// Unit under test
const Encryption = require('../../lib/encryption')
let uut

describe('#encryption.js', () => {
  beforeEach(() => {
    // Re-instantiate the uut before each test.
    uut = new Encryption()
  })

  describe('#encryptFile', () => {
    it('should throw error if pubkey is not a hex string', async () => {
      try {
        const pubkey = 1234

        await uut.encryptFile(pubkey)

        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'pubkey must be a hex string')
      }
    })

    it('should throw error if file is not a hex string', async () => {
      try {
        const pubkey = 'a public key'
        const fileHex = 1234

        await uut.encryptFile(pubkey, fileHex)

        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'file must be a hex string')
      }
    })
    it('should return a hex string representing the encrypted file', async () => {
      try {
        const pubkey = '025af6595415c8cc3c8b3f28c4614b281131f5370622699087322fcb91511c0a17'

        const filePath = `${__dirname}/encryption.js`
        const fileBuff = await fs.readFileSync(filePath)
        const fileHex = fileBuff.toString('hex')

        const result = await uut.encryptFile(pubkey, fileHex)

        assert.isString(result)
      } catch (err) {
        assert.equal(true, false, 'unexpected result')
      }
    })
  })
})
