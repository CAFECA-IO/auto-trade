import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { TradebotService } from './tradebot.service';
import { CreateTradebotDto } from './dto/create-tradebot.dto';
import { UpdateTradebotDto } from './dto/update-tradebot.dto';

@Controller('tradebot')
export class TradebotController {
  constructor(private readonly tradebotService: TradebotService) {}

  @Post()
  create(@Body() data: { privateKey: string }) {
    console.log(data);
    return this.tradebotService.create(data.privateKey);
  }

  @Get()
  getTradebot(@Query('id') id?: string) {
    if (id == null) {
      return this.tradebotService.getAllTradebots();
    }
    return this.tradebotService.getTradebotById(id);
  }

  @Put()
  receiveDeposit(@Query('id') id: string) {
    const tradebot = this.tradebotService.getTradebotById(id);
    return this.tradebotService.receiveDeposit(tradebot);
  }

  @Get(':id')
  run(@Param('id') id: string) {
    const tradebot = this.tradebotService.getTradebotById(id);
    return this.tradebotService.run(tradebot);
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTradebotDto: UpdateTradebotDto) {
  //   return this.tradebotService.update(+id, updateTradebotDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tradebotService.remove(+id);
  // }
}
