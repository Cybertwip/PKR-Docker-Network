import { AuthConfig } from './auth.config';
import { UsersService } from './../users/users.service';
import { Inject, Injectable } from '@nestjs/common';
import { default as Web3 } from "web3"
import * as path from 'path';
import * as fs from 'fs';

import Global = NodeJS.Global;
export interface GlobalWithCognitoFix extends Global {
    fetch: any
}
declare const global: GlobalWithCognitoFix;
global.fetch = require('node-fetch');

const InfuraEndpointUrl = 'https://mainnet.infura.io/v3/5c5e1003069e4b6a902eb6ce50bd5dba'

const walletPath = path.join(__dirname, '..', '..', '..', 'instanceWallet');


import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  ICognitoUserPoolData,
} from 'amazon-cognito-identity-js';
import { AuthCredentialsDto, AuthRegisterDto } from './auth.interface';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  private web3: Web3;
  constructor(
    @Inject('AuthConfig')
    private readonly authConfig: AuthConfig,
    @Inject('UsersService')
    private readonly usersService: UsersService
  ) {
      console.log(this.authConfig.UserPoolId);
      console.log(this.authConfig.ClientId);
    this.userPool = new CognitoUserPool({ UserPoolId: this.authConfig.UserPoolId, ClientId: this.authConfig.ClientId });

    this.web3 = new Web3(new Web3.providers.HttpProvider(InfuraEndpointUrl));
  }

  get secretKey() {
    return this.authConfig.secretKey;
  }

  async register(authRegisterRequest: AuthRegisterDto) {
    const { name, email, password } = authRegisterRequest;
    return new Promise(((resolve, reject) => {
      return this.userPool.signUp(name, password, [new CognitoUserAttribute({ Name: 'email', Value: email })], null, (err, result) => {
        if (!result) {
          reject(err);
        } else {

          var account = this.web3.eth.accounts.create();

          var crypto = {
            username: "",
            address: "",
            privateKey: ""
          }

          crypto.username = result.user.getUsername();
          crypto.address = account.address;
          crypto.privateKey = account.privateKey


          var json = JSON.stringify(crypto);

          fs.writeFileSync(path.join(walletPath, crypto.username + ".json"), json);

          //this.usersService.create();

          resolve(result.user);
        }
      });
    }));
  }

  async authenticateUser(user: AuthCredentialsDto) {
    const { name, password } = user;
    const authenticationDetails = new AuthenticationDetails({
      Username: name,
      Password: password,
    });
    const userData = {
      Username: name,
      Pool: this.userPool,
    };
    const newUser = new CognitoUser(userData);
    return new Promise(((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: ((err) => {
          reject(err);
        }),
      });
    }));
  }
}