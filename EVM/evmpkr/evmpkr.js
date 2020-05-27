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

  async setEVMAddress(stub, args){
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    await stub.putState('EVMADDRESS', Buffer.from(JSON.stringify({address: args[0]})));

  }


  async getEVMAddress(stub) {
    console.info('============= START : getEVMAddress ===========');


    const evmAsBytes = await stub.getState('EVMADDRESS'); 
    if (!evmAsBytes || evmAsBytes.length === 0) {
        throw new Error(`EVMADDRESS does not exist`);
    }

    var evmAddress = JSON.parse(evmAsBytes);

    console.info(evmAddress);

    console.info('============= END : getEVMAddress ===========');

    return JSON.stringify(evmAddress.address);


  }

  async deploySC(stub, args){
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


  async query(stub, args){
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



  async transact(stub, args){
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
