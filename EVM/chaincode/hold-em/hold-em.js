/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

const shim = require('fabric-shim');

var HOLDEM = class {

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

  async SetGame(stub, args){
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    var result = { status: 'Correct', description: 'Game set successfully'}

    try {
      let gameData = JSON.parse(args[0]);

      await stub.putState("GAME:" + gameData.id, Buffer.from(JSON.stringify(gameData)));

    } catch(err){
      console.log(err);
      result.status = 'Error';
      result.description = 'Failed to parse JSON input';
    }

    return Buffer.from(JSON.stringify(result));
  }

  async GetGame(stub, args){
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    var result = { status: 'Correct', description: 'Got game successfully'}

    try {
      const gameId = args[0];

      const gameAsBytes = await stub.getState('GAME:' + gameId); 
      if (!gameAsBytes || gameAsBytes.length === 0) {
          result.status = "Error";
          result.description = "Game with Id: " + gameId.toString() + " not found";
      }      

      if(result.status == "Error"){
        return Buffer.from(JSON.stringify(result));
      }

      const gameData = JSON.parse(gameAsBytes);

      result = gameData;

    } catch(err){
      console.log(err);
      result.status = 'Error';
      result.description = 'Failed to parse JSON input';
    }

    return Buffer.from(JSON.stringify(result));
  }  

  async Create(stub, args){
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    var result = { status: 'Correct', description: 'Game created successfully'}

    try {
      let gameData = JSON.parse(args[0]);

      gameData.playing = true;

      if(gameData.players.length >= 2){

        await stub.putState("GAME:" + gameData.id, Buffer.from(JSON.stringify(gameData)));

      } else{
        result.status = 'Error';
        result.description = 'Game should have 2 or more players';
      }

    } catch(err){
      console.log(err);
      result.status = 'Error';
      result.description = 'Failed to parse JSON input';
    }

    return Buffer.from(JSON.stringify(result));
    
  }

  async ValidateUser(stub, args){
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }
    var result = { status: 'Correct', description: 'Limited tokens' }

    const gameId = args[0];
    const userId = args[1];


    const gameAsBytes = await stub.getState('GAME:' + gameId); 
    if (!gameAsBytes || gameAsBytes.length === 0) {
        result.status = "Error";
        result.description = "Game with Id: " + gameId.toString() + " not found";
    }      

    if(result.status == "Error"){
      return Buffer.from(JSON.stringify(result));
    }

    const gameData = JSON.parse(gameAsBytes);

    var userFound = false;
    var userPlaying = false;
    var isCPU = false;
    for(var i = 0; i<gameData.players.length; ++i){
        if(gameData.players[i].id == userId){
          userFound = true;

          if(gameData.players[i].status == 1){
            userPlaying = false;            
          } else {
            userPlaying = true;
          }

          if(gameData.players[i].cpu){
            isCPU = true;
          }
          break;
        }
    }

    if(userFound && userPlaying && !isCPU){
      result.description = "Limited tokens";
    } else if(userFound && userPlaying && isCPU){
      result.description = "Infinite tokens";
    } else if(!userFound && !userPlaying){
      result.status = 'Error';
      result.description = 'User not found'
    } else {
      result.status = 'Error';
      result.description = 'User no longer playing'
    }

    return Buffer.from(JSON.stringify(result));

  }

  async Play(stub, args){
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    var result = { status: 'Correct', description: 'Bet correctly' }

    let bet = {}

    try{
      bet = JSON.parse(args[0]);
    } catch(err){
      console.log(err);
      result.status = 'Error';
      result.description = 'Failed to parse JSON input';
      return Buffer.from(JSON.stringify(result));
    }

    try{

      const gameAsBytes = await stub.getState('GAME:' + bet.gameId); 
      if (!gameAsBytes || gameAsBytes.length === 0) {
          throw new Error(`Game does not exist`);
      }      

      const gameData = JSON.parse(gameAsBytes);


      if(!gameData.playing){
        result.status = 'Error';
        result.description = 'Game is not playing anymore';
        throw new Error('Game already played');
      }

      var filteredBets = gameData.bets.filter(bet => bet.action != 2); // different than abandon

      switch(bet.action){
          case 0:{ // small blind
              if(filteredBets.length != 0){
                  result.status = "Error";
                  result.description = "Can't make small blind while other bets already took place";
                  throw new Error('Not acceptable exception');
              }
          }
          break;

          case 1:{ // big blind
              if(filteredBets.length == 0){
                  result.status = "Error";
                  result.description = "Big blind bet requires a small blind bet before";
                  throw new Error('Not acceptable exception');
              } 

              var previousBet = filteredBets[filteredBets.length - 1];
              if(previousBet.action != BetAction.SmallBlind){
                  result.status = "Error";
                  result.description = "Big blind bet requires a small blind bet before";
                  throw new Error('Not acceptable exception');
              }

          
          }
          break;

          case 2:{ // abandon
              for(var i = 0; i<gameData.players.length; ++i){
                  if(gameData.players[i].id == bet.playerId){
                      gameData.players[i].status = 1;
                  }
              }
          }
          break;


          case 3:{ // skip
              if(filteredBets.length == 0){
                  result.status = "Error";
                  result.description = "Can't skip if no previous bets are made";

                  throw new Error('Not acceptable exception');
              } 

              var previousBet = filteredBets[filteredBets.length - 1];
              if(previousBet.action == BetAction.Normal || previousBet.action == BetAction.Rise){
                  result.status = "Error";
                  result.description = "Can't skip if previous bet is normal bet or rise bet";

                  throw new Error('Not acceptable exception');
              }
          }
          break;          

          case 4:{ // normal
              if(filteredBets.length == 0){
                  result.status = "Error";
                  result.description = "Can't bet if no previous big blind bet is made";
                  throw new Error('Not acceptable exception');


              } 

              var previousBet = filteredBets[filteredBets.length - 1];
              if(previousBet.action == BetAction.Rise){

                  result.status = "Error";
                  result.description = "Can't bet normally if previous bet is a rise bet";
                  throw new Error('Not acceptable exception');

              }
          }
          break;

      }

      if(result.status == 'Correct'){
        gameData.bets.push(bet);
        gameData.pot = gameData.pot + parseInt(bet.amount.toString());

        await stub.putState('GAME:' + bet.gameId, Buffer.from(JSON.stringify(gameData)));        
      }

    } catch (err) {
      console.log(err);
    }

    return Buffer.from(JSON.stringify(result));
  }

  async Finish(stub, args){
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    let veredict = JSON.parse(args[0])

    let id = veredict.gameId;
    let winnerId = veredict.winnerId;

    const gameAsBytes = await stub.getState('GAME:' + id); 
    if (!gameAsBytes || gameAsBytes.length === 0) {
        throw new Error(`Game does not exist`);
    }

    const gameData = JSON.parse(gameAsBytes);

    gameData.playing = false;
    gameData.winnerId = winnerId;

    await stub.putState('GAME:' + id, Buffer.from(JSON.stringify(gameData)));

    return Buffer.from(JSON.stringify(gameData));

  }




};

shim.start(new HOLDEM());
