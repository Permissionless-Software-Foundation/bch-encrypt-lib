/*
  An library for doing eliptic curve encryption using a BCH public key for
  encrypting data, and a BCH private key for decrypting the data.
*/

'use strict'

const eccrypto = require('eccrypto-js')
const wif = require('wif')
let _this

class Encrypt {
  constructor () {
    _this = this
    this.eccrypto = eccrypto
    this.wif = wif
  }

  // Encrypt a file with the public key.
  // pubKey: public key in hex-string format
  // file: binary file in hex-string format
  // Output: A hex-string representing the encrypted file
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

  // Decrypt a file with the private key.
  // privKey: private key in hex-string format
  // encryptedFile: encrypted file in hex-string format
  // Output: Decrypted file in hex-string format
  async decryptFile (privKey, encryptedFile) {
    try {
      // Validate Input
      if (!privKey || typeof privKey !== 'string') {
        throw new Error('privKey must be a string')
      }
      if (privKey.length !== 52) {
        throw new Error('privKey must be a WIF format')
      }
      if (!encryptedFile || typeof encryptedFile !== 'string') {
        throw new Error('encryptedFile must be a hex string')
      }
      // Generate a private key from the WIF for decrypting the data.
      const privKeyBuf = await _this.wif.decode(privKey).privateKey

      // Convert the hex encoded file to a buffer
      const encryptedBuff = Buffer.from(encryptedFile, 'hex')

      // Convert the bufer into a structured object.
      const structData = await _this.convertToEncryptStruct(encryptedBuff)

      // Decrypt the data with a private key.
      const fileBuf = await _this.eccrypto.decrypt(privKeyBuf, structData)

      // Convert buffer data into a hex string
      const decryptedStr = fileBuf.toString('hex')

      return decryptedStr
    } catch (err) {
      console.error('Error in encryption.js/decryptFile()')
      throw err
    }
  }

  // Converts a serialized buffer containing encrypted data into an object
  // that can interpreted by the eccryptoJS library.
  convertToEncryptStruct (encbuf) {
    try {
      // Validate Input
      if (!encbuf) {
        throw new Error('input must be a buffer')
      }

      let offset = 0
      const tagLength = 32
      let pub

      switch (encbuf[0]) {
        case 4:
          pub = encbuf.slice(0, 65)
          break
        case 3:
        case 2:
          pub = encbuf.slice(0, 33)
          break
        default:
          throw new Error(`Invalid type: ${encbuf[0]}`)
      }
      offset += pub.length

      const c = encbuf.slice(offset, encbuf.length - tagLength)
      const ivbuf = c.slice(0, 128 / 8)
      const ctbuf = c.slice(128 / 8)

      const d = encbuf.slice(encbuf.length - tagLength, encbuf.length)

      return {
        iv: ivbuf,
        ephemPublicKey: pub,
        ciphertext: ctbuf,
        mac: d
      }
    } catch (err) {
      console.error('Error in encryption.js/convertToEncryptStruct()')
      throw err
    }
  }
}

module.exports = Encrypt
