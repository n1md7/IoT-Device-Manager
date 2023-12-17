import { PartialType } from '@nestjs/swagger';
import { CreateSystemRequest } from '/src/systems/requests/create-system.request';

export class UpdateSystemRequest extends PartialType(CreateSystemRequest) {}
