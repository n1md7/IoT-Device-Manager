import { PartialType } from '@nestjs/swagger';
import { CreateScheduleRequest } from '/src/scheduler/requests/create-schedule.request';

export class UpdateScheduleRequest extends PartialType(CreateScheduleRequest) {}
