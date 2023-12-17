import { Test, TestingModule } from '@nestjs/testing';
import { SystemsController } from './systems.controller';
import { SystemsService } from './systems.service';

describe('SystemsController', () => {
  let controller: SystemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemsController],
      providers: [SystemsService],
    }).compile();

    controller = module.get<SystemsController>(SystemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
