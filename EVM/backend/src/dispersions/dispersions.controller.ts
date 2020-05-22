import { Controller, Post } from '@nestjs/common';
import { DispersionsService } from './dispersions.service';

@Controller('dispersions')
export class DispersionsController {
  constructor(private readonly dispersionsService: DispersionsService) {}

  @Post()
  async create() {
    return await this.dispersionsService.create();
  }
}
