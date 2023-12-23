import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { CreateScheduleRequest } from '/src/scheduler/requests/create-schedule.request';

export class UpdateScheduleRequest extends PartialType(CreateScheduleRequest) {}
