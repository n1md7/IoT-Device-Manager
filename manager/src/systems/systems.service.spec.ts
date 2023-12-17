import { Test, TestingModule } from '@nestjs/testing';
import { SystemsService } from './systems.service';

describe('SystemsService', () => {
  let service: SystemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemsService],
    }).compile();

    service = module.get<SystemsService>(SystemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
