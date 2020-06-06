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
    console.info('========= EVMPKR Init =========');
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

  async CashIn(stub, args){
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    var result = { status: 'Correct', description: 'User retrieval is successful' }

    //let gameId = args[0];
    let userId = args[0];
    let cashedTokens = args[1];

    let userData = {}

    const userAsBytes = await stub.getState('USER:' + userId); 
    if (!userAsBytes || userAsBytes.length === 0) {
        result.status = 'Error';
        result.description = 'User not found';
    } else {
      result.status = 'Correct';
      result.description = 'User found';

      userData = JSON.parse(userAsBytes);
      userData.tokens = userData.tokens + parseInt(cashedTokens.toString());

      await stub.putState('USER:' + userData.id, Buffer.from(JSON.stringify(userData)));

    }

    if(result.status != 'Correct'){
      return Buffer.from(JSON.stringify(result));      
    }
    else{
      throw new Error('User not found');
    }
  }

  async User(stub, args){
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    var result = { status: 'Correct', description: 'User retrieval is successful' }

    //let gameId = args[0];
    let userId = args[0];

    let userData = {}

    const userAsBytes = await stub.getState('USER:' + userId); 
    if (!userAsBytes || userAsBytes.length === 0) {
        result.status = 'Error';
        result.description = 'User not found';
    } else {
      result.status = 'Correct';
      result.description = 'User found';

      userData = JSON.parse(userAsBytes);
    }

    if(result.status == 'Correct'){
      return Buffer.from(JSON.stringify(userData));      
    }
    else{
      throw new Error('User not found');
    }

  }


  async RegisterUser(stub, args){
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    var result = { status: 'Correct', description: 'Register user is successful' }


    let userData = {}

    try{
      userData = JSON.parse(args[0]);
    } catch(err){
      console.log(err);
      result.status = 'Error';
      result.description = 'Failed to parse JSON input';
      throw new Error(result.description);
;
    }

    userData.tokens = 1000;

    await stub.putState('USER:' + userData.id, Buffer.from(JSON.stringify(userData)));

    return Buffer.from(JSON.stringify(result));
  }

  async SetGame(stub, args){
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    const channelName = 'pkr';

    const gameIdentifier = args[0];

    var result = { status: 'Error', description: "Game not found"}

    if(gameIdentifier == 'hold-em'){
      const chaincodeName = gameIdentifier;
      const functionArgs = ['SetGame', args[1]];
      const chaincodeResult = await stub.invokeChaincode(chaincodeName, functionArgs, channelName);
      result = JSON.parse(chaincodeResult.payload.toString('utf8'));
    } else {
      throw new Error('Game not found');
    }

    return Buffer.from(JSON.stringify(result));
  }

  async GetGame(stub, args){
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    const channelName = 'pkr';

    const gameIdentifier = args[0];

    var result = { status: 'Error', description: "Game not found"}

    if(gameIdentifier == 'hold-em'){
      const chaincodeName = gameIdentifier;
      const functionArgs = ['GetGame', args[1]];
      const chaincodeResult = await stub.invokeChaincode(chaincodeName, functionArgs, channelName);
      result = JSON.parse(chaincodeResult.payload.toString('utf8'));
    }
    else{
  
      throw new Error('Game not found');

    }

    return Buffer.from(JSON.stringify(result));
  }




  async Create(stub, args){
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    const channelName = 'pkr';

    const gameIdentifier = args[0];

    var result = { status: 'Error', description: "Game not found"}

    if(gameIdentifier == 'hold-em'){
      const chaincodeName = gameIdentifier;
      const functionArgs = ['Create', args[1]];
      const chaincodeResult = await stub.invokeChaincode(chaincodeName, functionArgs, channelName);
      result = JSON.parse(chaincodeResult.payload.toString('utf8'));
    }
    else{
      throw new Error('Game not found');
    }

    if(result.status == 'Error'){
      throw new Error('Failed to parse JSON');
    }

    return Buffer.from(JSON.stringify(result));
  }

  async Play(stub, args){
    if (args.length != 5) {
      throw new Error('Incorrect number of arguments. Expecting 5');
    }

    var result = { status: 'Error', description: "Game not found"}


    const channelName = 'pkr';

    const gameIdentifier = args[0];

    const tokens = parseInt(args[1].toString());

    const userId = args[2];

    const gameId = args[3];

    var subtractTokens = true;

    if(gameIdentifier == 'hold-em'){

      const chaincodeName = gameIdentifier;
      const functionArgs = ['ValidateUser', gameId, userId];
      const chaincodeResult = await stub.invokeChaincode(chaincodeName, functionArgs, channelName);
      result = JSON.parse(chaincodeResult.payload.toString('utf8'));

      if(result.status == 'Correct' && result.description == "Infinite tokens"){
        subtractTokens = false;
      } else if (result.status == 'Correct') {
        subtractTokens = true;
      } else {
        throw new Error('User not found');
      }
    }

    if(subtractTokens){
      const userAsBytes = await stub.getState('USER:' + userId); 
      if (!userAsBytes || userAsBytes.length === 0) {
          result.status = 'Error';
          result.description = 'User not found';
          throw new Error('User not found');

      } else {
        result.status = 'Correct';
        result.description = 'User found';

        var userData = JSON.parse(userAsBytes);
        userData.tokens = userData.tokens - tokens;

        if(userData.tokens < 0){
          userData.tokens = 0;
          result.status = 'Error';
          result.description = 'User does not have enough funds to perform the game';
          throw new Error('User does not have enough funds');
        }

        await stub.putState('USER:' + userData.id, Buffer.from(JSON.stringify(userData)));

      }      
    }

    if(gameIdentifier == 'hold-em'){
      const chaincodeName = gameIdentifier;
      const functionArgs = ['Play', args[4]];
      const chaincodeResult = await stub.invokeChaincode(chaincodeName, functionArgs, channelName);
      result = JSON.parse(chaincodeResult.payload.toString('utf8'));
    }

    return Buffer.from(JSON.stringify(result));
  }

  async Finish(stub, args){
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    const channelName = 'pkr';

    const gameIdentifier = args[0];

    var result = { status: 'Error', description: "Game not found"}

    if(gameIdentifier == 'hold-em'){
      const chaincodeName = gameIdentifier;
      const functionArgs = ['Finish', args[1]];
      const chaincodeResult = await stub.invokeChaincode(chaincodeName, functionArgs, channelName);
      result = JSON.parse(chaincodeResult.payload.toString('utf8'));

      if(!result.winnerId){
        result.status = 'Error';
        result.description = 'Error while processing winner';
        throw new Error(result.description);
      }
      else{
        let gameId = result.id;
        let userId = result.winnerId;
        let pot = result.pot;


        var addTokens = true;

        const chaincodeName = gameIdentifier;
        const functionArgs = ['ValidateUser', gameId, userId];
        const chaincodeResult = await stub.invokeChaincode(chaincodeName, functionArgs, channelName);
        const validationResult = JSON.parse(chaincodeResult.payload.toString('utf8'));

        if(validationResult.status == 'Correct' && validationResult.description == "Infinite tokens"){
          addTokens = false;
        } else if (validationResult.status == 'Correct') {
          addTokens = true;
        } else {

          throw new Error('User not found');

        }

        if(addTokens){
          const userAsBytes = await stub.getState('USER:' + userId); 
          if (!userAsBytes || userAsBytes.length === 0) {
              result.status = 'Error';
              result.description = 'User not found';
          } else {
            result.status = 'Correct';
            result.description = 'Winner found awarded: ' + pot.toString() + ' tokens';

            var userData = JSON.parse(userAsBytes);

            userData.tokens = userData.tokens + pot;
            userData.cpu = false;
            userData.awarded = pot;

            await stub.putState('USER:' + userData.id, Buffer.from(JSON.stringify(userData)));

            result = userData;
          }

        } else {

            var userData = {};

            userData.tokens = -1;
            userData.cpu = true;
            userData.awarded = pot;

            result = userData;

        }


      }

    }

    return Buffer.from(JSON.stringify(result));
  }

  async SetEVMAddress(stub, args){
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    await stub.putState('EVMADDRESS', Buffer.from(JSON.stringify({address: args[0]})));

  }


  async GetEVMAddress(stub) {
    console.info('============= START : getEVMAddress ===========');


    const evmAsBytes = await stub.getState('EVMADDRESS'); 
    if (!evmAsBytes || evmAsBytes.length === 0) {
        throw new Error(`EVMADDRESS does not exist`);
    }

    var evmAddress = JSON.parse(evmAsBytes);

    console.info(evmAddress);

    console.info('============= END : getEVMAddress ===========');

    return Buffer.from(JSON.stringify(evmAddress.address));


  }

  async DeploySC(stub, args){
    console.info('============= START : deploySC ===========');

    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }

    const evmAsBytes = await stub.getState('EVMADDRESS'); 
    if (!evmAsBytes || evmAsBytes.length === 0) {
        throw new Error(`EVMADDRESS does not exist`);
    }

    var evmAddress = JSON.parse(evmAsBytes);


    console.info('============= Setup Web3 ===========');

    console.info('============= Web3 address ===========');

    console.info('Address: ' + evmAddress);
    console.info('Address: ' + evmAddress.toString());

    //evmAddress = "http://docker.for.mac.localhost:5000";

    var web3 = new Web3(evmAddress);

    console.info('============= Get accounts ===========');


    let accounts = await web3.eth.getAccounts();

    const contractName = args[0];
    const contractABI  = JSON.parse(args[1]);
    const contractCode = args[2];

    console.info('============= Instantiate contract ===========');

    const newContract = new web3.eth.Contract(contractABI);

    console.info('============= Deploy contract ===========');

    var contractInstancePromise = newContract.deploy({ data: contractCode });
    

    console.info('============= Send promise ===========');

    var contractInstance = await contractInstancePromise.send({
      from: accounts[0]
    });
 
    //var contractInstance = await contractInstancePromise.send();


    console.info('============= Store address ===========');

    await stub.putState(contractName, Buffer.from(contractInstance.options.address));

    console.info('============= Store ABI ===========');

    await stub.putState(contractName + '_ABI', Buffer.from(JSON.stringify(contractABI)));

    console.info('============= END : deploySC ===========');

  }


  async Query(stub, args){
    console.info('============= START : query ===========');

    const evmAsBytes = await stub.getState('EVMADDRESS'); 
    if (!evmAsBytes || evmAsBytes.length === 0) {
        throw new Error(`EVMADDRESS does not exist`);
    }

    const evmAddress = JSON.parse(evmAsBytes);

    var web3 = new Web3(evmAddress);
    
    let accounts = await web3.eth.getAccounts();

    const contractName = args[0];

    const queryMethod = args[1];

    const contractAddressAsBytes = await stub.getState(contractName); 
    if (!contractAddressAsBytes || contractAddressAsBytes.length === 0) {
        throw new Error(`Contract address does not exist, i.e. might not be deployed yet`);
    }

    const contractABIAsBytes = await stub.getState(contractName + '_ABI'); 
    if (!contractABIAsBytes || contractABIAsBytes.length === 0) {
        throw new Error(`Contract ABI does not exist, i.e. might not be deployed yet`);
    }

    const contractAddress = contractAddressAsBytes.toString();

    const contractABI = JSON.parse(contractABIAsBytes.toString());

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const prepareData = e => `${e.name}(${e.inputs.map(e => e.type)})`
    //const encodeSelector = f => web3.sha3(f).slice(0,10)

    const output = contractABI
        .filter(e => e.type === "function" && e.name === queryMethod)
        .flatMap(e => `${prepareData(e)}`)

    if(output.length == 1){

      var methodPromise = contract.methods[output[0]].apply(contract, args.slice(2, args.length));
      var queryResult = await methodPromise.call({from: accounts[0]});

      console.info('============= END : query ===========');

      return queryResult;

    } else {

      console.info('============= END : query ===========');

      throw new Error(`Called method ${queryMethod} does not exist or more than one methods found with the same name`);
    }
  }



  async Transact(stub, args){
    console.info('============= START : transact ===========');
    
    const evmAsBytes = await stub.getState('EVMADDRESS'); 
    if (!evmAsBytes || evmAsBytes.length === 0) {
        throw new Error(`EVMADDRESS does not exist`);
    }

    const evmAddress = JSON.parse(evmAsBytes);

    var web3 = new Web3(evmAddress);
    
    let accounts = await web3.eth.getAccounts();

    const contractName = args[0];

    const transactMethod = args[1];

    const contractAddressAsBytes = await stub.getState(contractName); 
    if (!contractAddressAsBytes || contractAddressAsBytes.length === 0) {
        throw new Error(`Contract address does not exist, i.e. might not be deployed yet`);
    }

    const contractABIAsBytes = await stub.getState(contractName + '_ABI'); 
    if (!contractABIAsBytes || contractABIAsBytes.length === 0) {
        throw new Error(`Contract ABI does not exist, i.e. might not be deployed yet`);
    }

    const contractAddress = contractAddressAsBytes.toString();

    const contractABI = JSON.parse(contractABIAsBytes.toString());

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const prepareData = e => `${e.name}(${e.inputs.map(e => e.type)})`
    //const encodeSelector = f => web3.sha3(f).slice(0,10)

    const output = contractABI
        .filter(e => e.type === "function" && e.name === transactMethod)
        .flatMap(e => `${prepareData(e)}`)

    if(output.length == 1){

      var methodPromise = contract.methods[output[0]].apply(contract, args.slice(2, args.length));
      var queryResult = await methodPromise.send({from: accounts[0]});

      console.info('============= END : transact ===========');

    } else {

      console.info('============= END : transact ===========');

      throw new Error(`Called method ${transactMethod} does not exist or more than one methods found with the same name`);
    }
  }





};

shim.start(new EVMPKR());
