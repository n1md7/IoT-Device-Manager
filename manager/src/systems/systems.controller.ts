import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SystemsService } from './systems.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { System } from '/src/systems/entities/system.entity';
import { ControlSystemRequest } from '/src/systems/requests/control-system.request';
import { Action } from '/src/systems/enum/action.enum';
import { CreateSystemRequest } from '/src/systems/requests/create-system.request';
import { UpdateSystemRequest } from '/src/systems/requests/update-system.request';
import { HttpErrorSchema } from '/libs/filters/http-exception/http-error.schema';

@ApiTags('Systems')
@Controller('systems')
export class SystemsController {
  constructor(@Inject(SystemsService) private readonly systemsService: SystemsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBadRequestResponse({ schema: { $ref: getSchemaPath(HttpErrorSchema) } })
  @ApiCreatedResponse({ schema: { $ref: getSchemaPath(System) } })
  async create(@Body() payload: CreateSystemRequest) {
    return await this.systemsService.create(payload);
  }

  @Post('control')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'System control' })
  @ApiConflictResponse({ description: 'System start failure', schema: { $ref: getSchemaPath(HttpErrorSchema) } })
  async controlSystem(@Body() payload: ControlSystemRequest) {
    const system = await this.systemsService.getById(payload.id);

    if (payload.action === Action.START) {
      for (const component of system.components) {
        if (component.inUse && !component.shared) {
          throw new ConflictException(`System ${system.name} is already in use`);
        }
      }

      return await this.systemsService.componentsStart(system);
    }

    return await this.systemsService.componentsStop(system);
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
  async findAll() {
    const [systems, count] = await this.systemsService.findAll();

    return {
      systems,
      count,
    };
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.systemsService.findById(id);
  }

  @Patch(':id')
  updateById(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateSystemRequest) {
    return this.systemsService.updateById(id, payload);
  }

  @Delete(':id')
  removeById(@Param('id', ParseIntPipe) id: number) {
    return this.systemsService.removeById(id);
  }
}
