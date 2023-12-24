import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { UpdateScheduleRequest } from '/src/scheduler/requests/update-schedule.request';
import { Schedule } from '/src/scheduler/entities/scheduler.entity';
import { CreateScheduleRequest } from '/src/scheduler/requests/create-schedule.request';
import { SystemsService } from '/src/systems/systems.service';

@ApiTags('Scheduler')
@Controller('scheduler')
@ApiNotFoundResponse({ description: 'Schedule not found' })
export class SchedulerController {
  constructor(
    @Inject(SchedulerService) private readonly schedulerService: SchedulerService,
    @Inject(SystemsService) private readonly systemsService: SystemsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create schedule', description: 'Create a new schedule' })
  @ApiCreatedResponse({ schema: { $ref: getSchemaPath(Schedule) } })
  async create(@Body() payload: CreateScheduleRequest) {
    const system = await this.systemsService.getById(payload.systemId);

    return await this.schedulerService.createBySystem(system, payload);
  }

  @Get()
  @ApiOkResponse({
    schema: {
      properties: {
        systems: {
          type: 'array',
          description: 'List of schedules',
          items: {
            $ref: getSchemaPath(Schedule),
          },
        },
        count: {
          type: 'integer',
          description: 'Total number of schedules',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Get all schedules', description: 'Get a list of all schedules' })
  async findAll() {
    const [schedules, count] = await this.schedulerService.findAll();

    return {
      count,
      schedules,
    };
  }

  @Get(':id')
  @ApiOkResponse({ schema: { $ref: getSchemaPath(Schedule) } })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.schedulerService.findOne(id);
  }

  @Patch(':id')
  async updateById(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateScheduleRequest) {
    return this.schedulerService.update(+id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete schedule', description: 'Delete a schedule by id' })
  async removeById(@Param('id', ParseIntPipe) id: number) {
    return this.schedulerService.removeById(id);
  }
}
