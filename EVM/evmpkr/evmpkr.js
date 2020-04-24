/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

const shim = require('fabric-shim');
const util = require('util');

const Web3 = require('web3')
const path = require('path')

var web3;


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

    const evm = {
      address: args[0]
    };

    await stub.putState('EVMADDRESS', Buffer.from(JSON.stringify(evm)));

  }


  async getEVMAddress(stub) {

    const evmAsBytes = await stub.getState('EVMADDRESS'); 
    if (!evmAsBytes || evmAsBytes.length === 0) {
        throw new Error(`EVMADDRESS does not exist`);
    }
    console.log(evmAsBytes.toString());

    const strValue = Buffer.from(evmAsBytes).toString('utf8');
    let evm;
    try {
        evm = JSON.parse(strValue);
    } catch (err) {
        console.log(err);
        evm = strValue;
    }

    if(evm.address){
      return evm.address;
    } else {
      return evm;
    }

  }

  async deploySC(stub, args){
    const evmAsBytes = await stub.getState('EVMADDRESS'); 
    if (!evmAsBytes || evmAsBytes.length === 0) {
        throw new Error(`EVMADDRESS does not exist`);
    }

    if(!web3){
        throw new Error(`Fab3 not connected`);      
    }
  }


  async setSCAddress(stub, args){
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    const sc = {
      address: args[0]
    };

    await stub.putState('SCADDRESS', Buffer.from(JSON.stringify(sc)));

  }

  async getSCAddress(stub) {

    const scAsBytes = await stub.getState('SCADDRESS'); 
    if (!scAsBytes || scAsBytes.length === 0) {
        throw new Error(`SCADDRESS does not exist`);
    }
    console.log(scAsBytes.toString());

      const strValue = Buffer.from(scAsBytes).toString('utf8');
      let sc;
      try {
          sc = JSON.parse(strValue);
      } catch (err) {
          console.log(err);
          sc = strValue;
      }

    if(sc.address){
      return sc.address;
    } else {
      return sc;
    }

  }

  async connectToFab3(stub){
    const evmAddress = await getEVMAddress(stub);
    web3 = new Web3(evmAddress)
  }

  async validateRequirements(stub){
    const evmAsBytes = await stub.getState('EVMADDRESS'); 
    if (!evmAsBytes || evmAsBytes.length === 0) {
        throw new Error(`EVMADDRESS does not exist`);
    }

    const scAsBytes = await stub.getState('SCADDRESS'); 
    if (!scAsBytes || scAsBytes.length === 0) {
        throw new Error(`SCADDRESS does not exist`);
    }

    if(!web3){
        throw new Error(`Fab3 not connected`);      
    }

    return true;
  }

  async setGreeting(stub, args){
    console.info('============= START : Set Greeting ===========');

    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    await validateRequirements(stub);

    const contractAddress = await getSCAddress(stub);
    const greeterContract = new web3.eth.Contract(require(path.join(__dirname, "abi.json")), contractAddress)

    await greeterContract.methods.set(args[0]).send({from: account.address});

    console.info('============= END : Set Greeting ===========');
  }

  async getGreeting(stub){
    console.info('============= START : Get Greeting ===========');


    await validateRequirements(stub);
      
    const contractAddress = await getSCAddress(stub);
    const greeterContract = new web3.eth.Contract(require(path.join(__dirname, "abi.json")), contractAddress)

    const greet = await greeterContract.methods.greet().call({from: account.address}) //Call to greet function


    console.info('============= END : Get Greeting ===========');
                
    return greet;
  }

};

shim.start(new EVMPKR());
