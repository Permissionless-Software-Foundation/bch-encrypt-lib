/*
  A mocking library for get-pubkey.js unit tests.
  A mocking library contains data to use in place of the data that would come
  from an external dependency.
*/

'use strict'

const mockPubkey = {
  success: true,
  publicKey: '025af6595415c8cc3c8b3f28c4614b281131f5370622699087322fcb91511c0a17'
}

module.exports = {
  mockPubkey
}
