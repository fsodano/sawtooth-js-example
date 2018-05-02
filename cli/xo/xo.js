import sawtooth from '../sawtooth.js';

const cbor = require('cbor');
const { createHash } = require('crypto');

export default {

  createPlayer () {
    return sawtooth.createSigner();
  },

  async getGame (gameName) {
    const rawGame = await sawtooth.queryAddress(api.getGameAddress(gameName));

    let gameCsv;
    let rawTiles = '---------';

    try {
      gameCsv = atob(rawGame.data.data);
    } catch (e) {
      gameCsv = `${gameName},${rawTiles},GAME-NOT-STARTED`;
    }

    const game = { tiles: {} };
    [game.name, rawTiles, game.state] = gameCsv.split(',');

    [
      game.tiles[0],
      game.tiles[1],
      game.tiles[2],
      game.tiles[3],
      game.tiles[4],
      game.tiles[5],
      game.tiles[6],
      game.tiles[7],
      game.tiles[8]
    ] = rawTiles.split('');

    return game;

  },

  async createGame (player, gameName) {
    const encodedPayload = api.encodePayload(api.getCreateGamePayload(gameName));
    return await api.sendPayload(player, gameName, encodedPayload);
  },

  async deleteGame (player, gameName) {
    const encodedPayload = api.encodePayload(api.getDeleteGamePayload(gameName));
    return await api.sendPayload(player, gameName, encodedPayload);
  },

  async play (player, gameName, cell) {
    const encodedPayload = api.encodePayload(api.getPlayGamePayload(gameName, cell));
    return await api.sendPayload(player, gameName, encodedPayload);
  }
};

const api = {
  async sendPayload (player, gameName, encodedPayload) {
    const gameAddress = api.getGameAddress(gameName);
    const transactionHeader = sawtooth.createTransactionHeader('xo', '1.0', player, [gameAddress], [gameAddress], encodedPayload);
    const transaction = sawtooth.createTransaction(player, transactionHeader, encodedPayload);
    const transactions = [transaction];
    const batchHeader = sawtooth.createBatchHeader(player, transactions);
    const batch = sawtooth.createBatch(player, batchHeader, transactions);
    const encodedBatches = sawtooth.createEncodedBatches([batch]);
    return await sawtooth.sendBatches(encodedBatches);
  },

  getPlayGamePayload (gameName, cell) {
    return {
      name: gameName,
      action: 'take',
      space: cell
    };
  },

  getCreateGamePayload (gameName) {
    return {
      name: gameName,
      action: 'create',
      space: 0
    };
  },

  getDeleteGamePayload (gameName) {
    return {
      name: gameName,
      action: 'delete',
      space: 0
    };
  },

  encodePayload (payload) {
    return cbor.encode(payload);
  },
  getGameAddress (name) {
    const familyPortion = createHash('sha512').update('xo').digest('hex').substr(0, 6);
    const gameNamePortion = createHash('sha512').update(name).digest('hex').substr(0, 64);
    return familyPortion.concat(gameNamePortion);
  }
};
