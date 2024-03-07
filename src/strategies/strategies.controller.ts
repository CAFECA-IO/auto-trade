import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StrategiesService } from './strategies.service';
import { CreateStrategyDto } from './dto/create-strategy.dto';
import { UpdateStrategyDto } from './dto/update-strategy.dto';

@Controller('strategies')
export class StrategiesController {
  constructor(private readonly strategiesService: StrategiesService) {}

  @Post()
  create(@Body() createStrategyDto: CreateStrategyDto) {
    return this.strategiesService.create(createStrategyDto);
  }

  @Get()
  findAll() {
    return this.strategiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.strategiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStrategyDto: UpdateStrategyDto) {
    return this.strategiesService.update(+id, updateStrategyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.strategiesService.remove(+id);
  }
}
