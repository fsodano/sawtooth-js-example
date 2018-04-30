import request from 'request-promise';
import { createContext, CryptoFactory } from 'sawtooth-sdk/signing';
import { createHash } from 'crypto';
import protobuf from 'sawtooth-sdk/protobuf';
import axios from 'axios';

export default {
  createSigner () {
    const context = createContext('secp256k1');
    const privateKey = context.newRandomPrivateKey();
    return (new CryptoFactory(context)).newSigner(privateKey);
  },

  createTransactionHeader (familyName, familyVersion, signer, inputs, outputs, encodedPayload) {
    return protobuf.TransactionHeader.encode({
      familyName: familyName,
      familyVersion: familyVersion,
      inputs: inputs,
      outputs: outputs,
      signerPublicKey: signer.getPublicKey().asHex(),
      // In this example, we're signing the batch with the same private key,
      // but the batch can be signed by another party, in which case, the
      // public key will need to be associated with that key.
      batcherPublicKey: signer.getPublicKey().asHex(),
      // In this example, there are no dependencies.  This list should include
      // an previous transaction header signatures that must be applied for
      // this transaction to successfully commit.
      // For example,
      // dependencies: ['540a6803971d1880ec73a96cb97815a95d374cbad5d865925e5aa0432fcf1931539afe10310c122c5eaae15df61236079abbf4f258889359c4d175516934484a'],
      dependencies: [],
      payloadSha512: createHash('sha512').update(encodedPayload).digest('hex')
    }).finish();
  },

  createTransaction (signer, transactionHeader, encodedPayload) {
    const signature = signer.sign(transactionHeader);

    return protobuf.Transaction.create({
      header: transactionHeader,
      headerSignature: signature,
      payload: encodedPayload
    });
  },

  createBatchHeader (signer, transactions) {
    return protobuf.BatchHeader.encode({
      signerPublicKey: signer.getPublicKey().asHex(),
      transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish();
  },

  createBatch (signer, batchHeader, transactions) {
    const signature = signer.sign(batchHeader);

    return protobuf.Batch.create({
      header: batchHeader,
      headerSignature: signature,
      transactions: transactions
    });
  },

  createEncodedBatches (batches) {
    return protobuf.BatchList.encode({
      batches: batches
    }).finish();
  },

  async sendBatches (batches) {
    /*

        axios.post('http://localhost:3000/batches?wait',
          batches,
          {
            responseType: 'arraybuffer',
            headers: { 'Content-Type': 'application/octet-stream' }
          }
        ).then((data) => {
          console.log(data);
        });
    */

    const res = await request.post({
      url: 'http://localhost:3000/batches?wait',
      body: batches,
      headers: { 'Content-Type': 'application/octet-stream' }
    }, (err, response) => {
      if (err) return console.log(err);
      console.log(response.body);
    });

    return res.body;

  },

  queryAddress (address) {
    return axios.get(`http://localhost:3000/state/${address}`);
  }
};