
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('queue') private queue: Queue) {

  }

  async add(name: string, data: any){
    this.queue.add(name, data);
  }
}