import { AuthConfig } from './auth.config';
import { Inject, Injectable } from '@nestjs/common';

import Global = NodeJS.Global;
export interface GlobalWithCognitoFix extends Global {
    fetch: any
}
declare const global: GlobalWithCognitoFix;
global.fetch = require('node-fetch');

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
  constructor(
    @Inject('AuthConfig')
    private readonly authConfig: AuthConfig,
  ) {
      console.log(this.authConfig.UserPoolId);
      console.log(this.authConfig.ClientId);
    this.userPool = new CognitoUserPool({ UserPoolId: this.authConfig.UserPoolId, ClientId: this.authConfig.ClientId });
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