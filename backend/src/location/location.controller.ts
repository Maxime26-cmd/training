/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { LocationService } from './location.service';
import { User } from '../users/entities/user.entity';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  async create(@Body() data: { latitude: number; longitude: number; userId: number }) {
    const user = new User();
    user.id = data.userId;
    return this.locationService.create(data.latitude, data.longitude, user);
  }

  @Get()
  async findAll() {
    return this.locationService.findAll();
  }

  @Get('user/:id')
  async findByUser(@Param('id') userId: number) {
    return this.locationService.findByUser(userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.locationService.delete(id);
  }
}
