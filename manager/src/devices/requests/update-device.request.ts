import { PartialType } from '@nestjs/swagger';
import { CreateDeviceRequest } from '/src/devices/requests/create-device.request';

export class UpdateDeviceRequest extends PartialType(CreateDeviceRequest) {}
