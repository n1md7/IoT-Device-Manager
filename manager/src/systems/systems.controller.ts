import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { SystemsService } from './services/systems.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { System } from '/src/systems/entities/system.entity';
import { ControlSystemRequest } from '/src/systems/requests/control-system.request';
import { CreateSystemRequest } from '/src/systems/requests/create-system.request';
import { UpdateSystemRequest } from '/src/systems/requests/update-system.request';
import { HttpErrorSchema } from '/libs/filters/http-exception/http-error.schema';
import { ControlService } from '/src/systems/services/control.service';

@ApiTags('Systems')
@Controller('systems')
@ApiBadRequestResponse({
  schema: {
    $ref: getSchemaPath(HttpErrorSchema),
  },
})
export class SystemsController {
  constructor(
    @Inject(SystemsService) private readonly systemsService: SystemsService,
    @Inject(ControlService) private readonly controlService: ControlService,
  ) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create system', description: 'Create a new system' })
  @ApiCreatedResponse({ schema: { $ref: getSchemaPath(System) } })
  async create(@Body() payload: CreateSystemRequest) {
    return await this.systemsService.create(payload);
  }

  @Post('control')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'System control' })
  @ApiOperation({ summary: 'Control system', description: 'Manually start or stop a system' })
  @ApiConflictResponse({ description: 'System start failure', schema: { $ref: getSchemaPath(HttpErrorSchema) } })
  async controlSystem(@Body() payload: ControlSystemRequest) {
    const system = await this.systemsService.getById(payload.id);

    this.controlService.assertSystemComponents(system);

    if (payload.startRequested()) {
      this.controlService.assertSystemComponentsInUse(system);

      return await this.controlService.componentsStart(system, payload.duration);
    }

    return await this.controlService.componentsStop(system);
  }

  @Get()
  @ApiOkResponse({
    schema: {
      properties: {
        systems: {
          type: 'array',
          description: 'List of systems',
          items: {
            $ref: getSchemaPath(System),
          },
        },
        count: {
          type: 'integer',
          description: 'Total number of systems',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Get all systems', description: 'Get all systems with their components' })
  async findAll() {
    const [systems, count] = await this.systemsService.findAll();

    return {
      systems,
      count,
    };
  }

  @Get(':id')
  @ApiOkResponse({ schema: { $ref: getSchemaPath(System) } })
  @ApiOperation({ summary: 'Get system by id', description: 'Get system by id with no components' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.systemsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update system by id', description: 'Update system by id' })
  updateById(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateSystemRequest) {
    return this.systemsService.updateById(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete system by id', description: 'Delete system by id' })
  removeById(@Param('id', ParseIntPipe) id: number) {
    return this.systemsService.removeById(id);
  }
}
