const cbor = require('cbor');
const crypto = require('crypto');
const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');

const FAMILY_NAME = 'hello';

class Handler extends TransactionHandler {
  constructor () {
    super(FAMILY_NAME, ['1.0'], [Handler.hash(FAMILY_NAME).substr(0, 6)]);
  }

  static hash (val) {
    return crypto.createHash('sha512').update(val).digest('hex').toLowerCase().substr(0, 64);
  }

  apply (transactionProcessRequest, context) {
    const payload = cbor.decode(transactionProcessRequest.payload);
    const name = payload.name;
    const address = Handler.hash(FAMILY_NAME).substr(0, 6) + Handler.hash(name);

    const header = transactionProcessRequest.header;
    const signer = header.signerPublicKey;

    context.addEvent(
      'hello/greet',
      [['name', name], ['creator', signer]],
      null
    );

    return context.setState({ [address]: name }, 500);

    //let header = transactionProcessRequest.header;
    //let signerKey = header.signerPublicKey;
    //throw new InvalidTransaction('Invalid Action.');
  }
}

module.exports = Handler;
