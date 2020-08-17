/*
  An library for doing eliptic curve encryption using a BCH public key for
  encrypting data, and a BCH private key for decrypting the data.
*/

'use strict'

const eccrypto = require('eccrypto-js')

let _this

class Encrypt {
  constructor () {
    _this = this
    this.eccrypto = eccrypto
  }

  // Encrypt a file with the public key.
  async encryptFile (pubKey, file) {
    try {
      // Validate Input
      if (!pubKey || typeof pubKey !== 'string') {
        throw new Error('pubkey must be a hex string')
      }

      if (!file || typeof file !== 'string') {
        throw new Error('file must be a hex string')
      }

      const pubKeyBuf = Buffer.from(pubKey, 'hex')
      const bufferedFile = Buffer.from(file, 'hex')
      const structuredEj = await _this.eccrypto.encrypt(pubKeyBuf, bufferedFile)
      // console.log(`structuredEj: ${JSON.stringify(structuredEj, null, 2)}`)

      // Serialize the encrypted data object
      const encryptedEj = Buffer.concat([
        structuredEj.ephemPublicKey,
        structuredEj.iv,
        structuredEj.ciphertext,
        structuredEj.mac
      ])

      const encryptedStr = encryptedEj.toString('hex')
      return encryptedStr
    } catch (err) {
      console.error('Error in encryption.js/encryptFile()')
      throw err
    }
  }
}

module.exports = Encrypt
