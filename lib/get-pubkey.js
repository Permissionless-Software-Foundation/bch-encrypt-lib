/*
  An example of a typical utility library. Things to notice:
  - This library is exported as a Class.
  - External dependencies are embedded into the class 'this' object: this.bitbox
  - `_this` maintains top-level context for `this`.
*/

'use strict'

// npm libraries
const BCHJS = require('@psf/bch-js')

// Locally global variables.
let _this

class GetPubKey {
  constructor (config) {
    if (config && config.bchjs) {
      this.bchjs = config.bchjs
    } else {
      this.bchjs = new BCHJS()
    }

    _this = this
  }

  // Make an axios call to the FullStack.cash API to look for the public key.
  async queryBlockchain (addr) {
    try {
      // Validate Input
      if (typeof addr !== 'string') throw new Error('Address must be a string')

      const result = await _this.bchjs.encryption.getPubKey(addr)
      if (!result.success) {
        console.log('Public key could not be found on the blockchain.')
        return false
      }

      // console.log(`Public key: ${result.publicKey}`)
      return result.publicKey
    } catch (err) {
      console.error('Error in get-pubkey.js/queryBlockchain()')
      throw err
    }
  }
}

module.exports = GetPubKey
