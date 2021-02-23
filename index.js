/*
  An npm JavaScript library for front end web apps, compiled with Browserify.
  Targeted for message.fullstack.cash. Allows e2e encryption using Bitcoin
  Cash addresses.
*/

/* eslint-disable no-async-promise-executor */

'use strict'

// const BCHJS = require('@psf/bch-js')

// Load the component libraries.
const GetPubKey = require('./lib/get-pubkey')
const Encryption = require('./lib/encryption')

class BchEncryption {
  constructor (config) {
    if (!config) {
      throw new Error(
        'A config object must be passed when instantiating the bch-encrypt-lib Class.'
      )
    }

    if (!config.bchjs) {
      throw new Error(
        'An instance of bch-js must be passed when instantiating bch-encrypt-lib.'
      )
    }

    // Create config object to pass to component libraries.
    const pubKeyConfig = {
      bchjs: config.bchjs
    }

    this.getPubKey = new GetPubKey(pubKeyConfig)
    this.encryption = new Encryption()
  }
}

module.exports = BchEncryption
