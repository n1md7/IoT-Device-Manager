import { Test, TestingModule } from '@nestjs/testing';
import { DevicesHttpController } from './devices-http.controller';
import { DevicesService } from './devices.service';

describe('DevicesController', () => {
  let controller: DevicesHttpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesHttpController],
      providers: [DevicesService],
    }).compile();

    controller = module.get<DevicesHttpController>(DevicesHttpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
