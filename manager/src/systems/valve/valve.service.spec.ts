import { Test, TestingModule } from '@nestjs/testing';
import { ValveService } from './valve.service';

describe('ValveService', () => {
  let service: ValveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValveService],
    }).compile();

    service = module.get<ValveService>(ValveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
