/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { User } from '../users/entities/user.entity';
@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async create(latitude: number, longitude: number, user: User): Promise<Location> {
    const location = this.locationRepository.create({ latitude, longitude, user });
    return this.locationRepository.save(location);
  }

  async findAll() {
    return this.locationRepository.find({
      relations: ['user'],
      select: {
        id: true,
        latitude: true,
        longitude: true,
        user: {
          id: true, 
          username: true 
        }
      }
    });
  }

  async findByUser(userId: number): Promise<Location[]> {
    return this.locationRepository.find({ where: { user: { id: userId } } });
  }

  async delete(id: number): Promise<void> {
    await this.locationRepository.delete(id);
  }
}
