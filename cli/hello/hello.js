import sawtooth from '../sawtooth.js';

const cbor = require('cbor');
const { createHash } = require('crypto');

export default {
  sayHello (name) {
    const signer = sawtooth.createSigner();
    const encodedPayload = api.encodePayload({ name });
    return api.sendPayload(signer, name, encodedPayload);
  }
};

const api = {
  sendPayload (signer, name, encodedPayload) {
    const address = this.getNameAddress(name);
    const txnHeader = sawtooth.createTransactionHeader('hello', '1.0', signer, [address], [address], encodedPayload);
    const transaction = sawtooth.createTransaction(signer, txnHeader, encodedPayload);
    const transactions = [transaction];
    const batchHeader = sawtooth.createBatchHeader(signer, transactions);
    const batch = sawtooth.createBatch(signer, batchHeader, transactions);
    const encodedBatches = sawtooth.createEncodedBatches([batch]);
    return sawtooth.sendBatches(encodedBatches);
  },

  encodePayload (payload) {
    return cbor.encode(payload);
  },
  getNameAddress (name) {
    const familyPortion = createHash('sha512').update('hello').digest('hex').substr(0, 6);
    const namePortion = createHash('sha512').update(name).digest('hex').substr(0, 64);
    return familyPortion.concat(namePortion);
  }
};
