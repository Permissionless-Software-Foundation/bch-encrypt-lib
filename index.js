/*
  An npm JavaScript library for front end web apps, compiled with Browserify.
  Targeted for message.fullstack.cash. Allows e2e encryption using Bitcoin
  Cash addresses.
*/

/* eslint-disable no-async-promise-executor */

'use strict'

const BCHJS = require('@psf/bch-js')

// Load the component libraries.
const GetPubKey = require('./lib/get-pubkey')
const Encryption = require('./lib/encryption')

let _this // local global for 'this'.

class BchEncryption {
  constructor () {
    _this = this

    _this.bchjs = new BCHJS()

    // Create config object to pass to component libraries.
    const config = {
      bchjs: _this.bchjs
    }

    _this.getPubKey = new GetPubKey(config)
    _this.encryption = new Encryption()
  }
}

module.exports = BchEncryption
