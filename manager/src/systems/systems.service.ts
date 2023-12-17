import { Injectable } from '@nestjs/common';
import { CreateSystemDto } from './dto/create-system.dto';
import { UpdateSystemDto } from './dto/update-system.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { System } from '/src/systems/entities/system.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SystemsService {
  constructor(
    @InjectRepository(System)
    private readonly systemRepository: Repository<System>,
  ) {}
  create(createSystemDto: CreateSystemDto) {
    return 'This action adds a new system';
  }

  async findAll() {
    return await this.systemRepository.find({
      relations: {
        components: {
          device: true,
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} system`;
  }

  update(id: number, updateSystemDto: UpdateSystemDto) {
    return `This action updates a #${id} system`;
  }

  remove(id: number) {
    return `This action removes a #${id} system`;
  }
}
