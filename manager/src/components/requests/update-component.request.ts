import { PartialType } from '@nestjs/swagger';
import { CreateComponentRequest } from '/src/components/requests/create-component.request';

export class UpdateComponentRequest extends PartialType(CreateComponentRequest) {}
