/*
  Unit tests for the encryption.js  library.
*/

// npm libraries
const assert = require('chai').assert
const fs = require('fs')

// Unit under test
const Encryption = require('../../lib/encryption')

let originalFileHex // hex with the original file data
let encryptedFileHex // hex with the encrypted file data

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
      const pubkey =
        '025af6595415c8cc3c8b3f28c4614b281131f5370622699087322fcb91511c0a17'

      const filePath = `${__dirname}/encryption.unit.js`
      const fileBuff = await fs.readFileSync(filePath)
      const fileHex = fileBuff.toString('hex')
      originalFileHex = fileHex

      const result = await uut.encryptFile(pubkey, fileHex)
      encryptedFileHex = result

      assert.isString(result)
      assert.notEqual(
        fileHex,
        result,
        'Expected to be different to the original file'
      )
    })
  })

  describe('#decryptFile', () => {
    it('should throw error if privKey is not a string', async () => {
      try {
        const privKey = 1234

        await uut.decryptFile(privKey)

        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'privKey must be a string')
      }
    })

    it('should throw error if privKey is not a WIF format', async () => {
      try {
        const privKey = 'wrong format'

        await uut.decryptFile(privKey)

        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'privKey must be a WIF format')
      }
    })

    it('should throw error if encryptedFile is not a hex string', async () => {
      try {
        const privKey = 'L5jmhgcC1BabZPvRQ6Bn1BRQoe9N5vPkNXMKAEo2DCS9fAtpDA2H'
        const encryptedFile = 1234

        await uut.decryptFile(privKey, encryptedFile)

        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'encryptedFile must be a hex string')
      }
    })

    it('should return a hex string representing the decrypted file', async () => {
      try {
        const privKey = 'L5jmhgcC1BabZPvRQ6Bn1BRQoe9N5vPkNXMKAEo2DCS9fAtpDA2H'
        const result = await uut.decryptFile(privKey, encryptedFileHex)

        assert.isString(result)
        assert.equal(
          originalFileHex,
          result,
          'Expected to be same as original file'
        )
      } catch (err) {
        assert.equal(true, false, 'unexpected result')
      }
    })
  })

  describe('#convertToEncryptStruct', () => {
    it('should throw error if input is invalid type', async () => {
      try {
        await uut.convertToEncryptStruct(123)
      } catch (err) {
        assert.include(err.message, 'Invalid type')
      }
    })

    it('should throw error if input is empty', async () => {
      try {
        await uut.convertToEncryptStruct()
      } catch (err) {
        assert.include(err.message, 'input must be a buffer')
      }
    })

    it('should return encrypt struct', async () => {
      try {
        const encryptedBuff = Buffer.from([3, 4, 5, 6, 7, 8, 9])

        const result = await uut.convertToEncryptStruct(encryptedBuff)

        assert.property(result, 'iv')
        assert.property(result, 'ephemPublicKey')
        assert.property(result, 'ciphertext')
        assert.property(result, 'mac')
      } catch (err) {
        assert.equal(true, false, 'unexpected result')
      }
    })

    it('should return encrypt struct', async () => {
      try {
        const encryptedBuff = Buffer.from(encryptedFileHex, 'hex')

        const result = await uut.convertToEncryptStruct(encryptedBuff)

        assert.property(result, 'iv')
        assert.property(result, 'ephemPublicKey')
        assert.property(result, 'ciphertext')
        assert.property(result, 'mac')
      } catch (err) {
        assert.equal(true, false, 'unexpected result')
      }
    })
  })
})
