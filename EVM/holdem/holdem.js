/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

const shim = require('fabric-shim');
const util = require('util');

const Web3 = require('web3')
const path = require('path')

var EVMPKR = class {

  // Initialize the chaincode
  async Init(stub) {
    console.info('========= Hold Em Init =========');
    return shim.success();
  }

  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    let method = this[ret.fcn];
    if (!method) {
      console.log('no method of name:' + ret.fcn + ' found');
      return shim.success();
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }


  async createGame(stub, args){
    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }


    let id = args[0];
    let gameType = args[1];
    let gameOwner = args[2];
    let gameSeed = args[3];

    var gameObject = {};

    gameObject.id = id;
    gameObject.type = gameType;
    gameObject.owner = gameOwner;
    gameObject.seed = gameSeed;

    gameObject.bets = []

    gameObject.playing = true;

    await stub.putState(id, Buffer.from(JSON.stringify(gameObject)));
    
  }

  async bet(stub, args){
    if (args.length != 4) {
      throw new Error('Incorrect number of arguments. Expecting 4');
    }

    let id = args[0]
    let gameId = args[1];
    let playerId = args[2];
    let amount = args[3];

    const gameAsBytes = await stub.getState(gameId); 
    if (!gameAsBytes || gameAsBytes.length === 0) {
        throw new Error(`Game does not exist`);
    }

    const gameObject = JSON.parse(gameAsBytes);

    gameObject.bets.push({id: id, gameId: gameId, playerId: playerId, amount: amount});

    await stub.putState(gameId, Buffer.from(JSON.stringify(gameObject)));

  }

  async finish(stub, args){
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    let id = args[0]

    const gameAsBytes = await stub.getState(id); 
    if (!gameAsBytes || gameAsBytes.length === 0) {
        throw new Error(`Game does not exist`);
    }

    const gameObject = JSON.parse(gameAsBytes);

    gameObject.playing = false;

    await stub.putState(id, Buffer.from(JSON.stringify(gameObject)));

  }




};

shim.start(new EVMPKR());
