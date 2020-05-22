import { Controller, Get, Param, Post, Req, Body } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async read(@Param('id') id) {
    return await this.usersService.read(id);
  }

  @Post()
  async create(@Body() user) {
    return await this.usersService.create(user);
  }
}
