import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ComponentsService } from './components.service';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateComponentRequest } from '/src/components/requests/create-component.request';
import { UpdateComponentRequest } from '/src/components/requests/update-component.request';
import { Component } from '/src/components/entities/component.entity';

@ApiTags('Components')
@Controller('components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create component', description: 'Create a new component' })
  @ApiCreatedResponse({ schema: { $ref: getSchemaPath(Component) } })
  async create(@Body() payload: CreateComponentRequest) {
    return await this.componentsService.create(payload);
  }

  @Get()
  @ApiOkResponse({
    schema: {
      properties: {
        components: {
          type: 'array',
          description: 'List of components',
          items: {
            $ref: getSchemaPath(Component),
          },
        },
        count: {
          type: 'integer',
          description: 'Total number of components',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Get components', description: 'Get a list of components' })
  async findAll() {
    const [components, count] = await this.componentsService.findAll();

    return {
      components,
      count,
    };
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Component not found' })
  @ApiOkResponse({ schema: { $ref: getSchemaPath(Component) } })
  @ApiOperation({ summary: 'Get component', description: 'Get a component by id' })
  async findOne(@Param('id') id: number) {
    return await this.componentsService.getById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Component updated' })
  @ApiOperation({ summary: 'Update component', description: 'Update a component by id' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateComponentRequest) {
    return await this.componentsService.updateById(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Component deleted' })
  @ApiOperation({ summary: 'Delete component', description: 'Delete a component by id' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.componentsService.removeById(id);
  }
}
