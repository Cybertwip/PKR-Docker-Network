import { Injectable } from '@nestjs/common';
import { Identity } from 'fabric-network';
import { WalletService } from '../wallet/wallet.service';


@Injectable()
export class UsersService {
  constructor(private wallet: WalletService) {}

  async read(label: string): Promise<Identity> {
    return await this.wallet.get(label);
  }

  async create(user) {
    const { id, hash } = user
    const properties = [{ name: 'hash', value: hash, ecert: true }]
    await this.wallet.put(id, properties);
  }
}
