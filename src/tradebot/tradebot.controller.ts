import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TradebotService } from './tradebot.service';
import { CreateTradebotDto } from './dto/create-tradebot.dto';
import { UpdateTradebotDto } from './dto/update-tradebot.dto';

@Controller('tradebot')
export class TradebotController {
  constructor(private readonly tradebotService: TradebotService) {}

  @Post()
  create(@Body() privateKey: string = null) {
    return this.tradebotService.create(privateKey);
  }

  // @Get()
  // findAll() {
  //   return this.tradebotService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tradebotService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTradebotDto: UpdateTradebotDto) {
  //   return this.tradebotService.update(+id, updateTradebotDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tradebotService.remove(+id);
  // }
}
