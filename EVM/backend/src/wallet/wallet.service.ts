import { default as Authority } from 'fabric-ca-client';
import { User } from 'fabric-common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Wallet, Wallets, X509Identity } from 'fabric-network';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { ModuleRef } from '@nestjs/core';

const getNodeConfig = (nodeConfigPath) =>
  JSON.parse(fs.readFileSync(nodeConfigPath, 'utf8'));

const getCaClient = (nodeConfig) =>
  new Authority(nodeConfig.certificateAuthorities['ca.org1.pkrstudio.com'].url);

const walletPath = path.join(__dirname, '..', '..', '..', 'instanceWallet');

@Injectable()
export class WalletService implements OnModuleInit {
  self: Wallet;
  manager: User;
  authority: Authority;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      this.self = await Wallets.newFileSystemWallet(walletPath);
      this.authority = getCaClient(this.configService.get('networkConfig'));
    } catch (error) {
      /**
       * Throw new error
       */
      throw new Error(error);
    }
    
    const manager = await this.self.get('admin');
    if (!manager) {
      console.log(
        'An identity for the admin user "admin" does not exist in the wallet',
      );
      console.log('Run the enrollAdmin command on the CLI before retrying');
    }

    this.manager = await this.self
      .getProviderRegistry()
      .getProvider(manager.type)
      .getUserContext(manager, 'admin');
  }

  async get(label: string) {
    const identity = await this.self.get(label);
    if (!identity) {
      /**
       * Throw new error
       */
    }

    return identity;
  }

  async put(label: string, attributes: Authority.IKeyValueAttribute[]) {
    const identityAlreadyExists = await this.self.get(label);
    if (identityAlreadyExists) {
      /**
       * Throw new IdentityAlreadyExistError
       */
    }

    const registry = {
      role: 'user',
      affiliation: 'org1.department1',
      attrs: attributes,
      enrollmentID: label,
    };
    const secret = await this.authority.register(registry, this.manager);

    const enrollment = {
      enrollmentID: label,
      enrollmentSecret: secret,
    };
    const credentials = await this.authority.enroll(enrollment);

    const X509Identity: X509Identity = {
      credentials: {
        certificate: credentials.certificate,
        privateKey: credentials.key.toBytes(),
      },
      mspId: 'Org1MSP',
      type: 'X.509',
    };
    await this.self.put(label, X509Identity);
  }
}
