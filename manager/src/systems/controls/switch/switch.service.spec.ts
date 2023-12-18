import { Test, TestingModule } from '@nestjs/testing';
import { SwitchService } from './switch.service';

describe('SwitchService', () => {
  let service: SwitchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SwitchService],
    }).compile();

    service = module.get<SwitchService>(SwitchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
