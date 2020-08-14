/*
  An npm JavaScript library for front end web apps. Implements a minimal
  Bitcoin Cash wallet.
*/

/* eslint-disable no-async-promise-executor */

'use strict'

const BCHJS = require('@psf/bch-js')

// Load the component libraries.
const GetPubKey = require('./lib/get-pubkey')

let _this // local global for 'this'.

class BoilplateLib {
  constructor () {
    _this = this

    _this.bchjs = new BCHJS()

    // Create config object to pass to component libraries.
    const config = {
      bchjs: _this.bchjs
    }

    _this.getPubKey = new GetPubKey(config)
  }
}

module.exports = BoilplateLib
