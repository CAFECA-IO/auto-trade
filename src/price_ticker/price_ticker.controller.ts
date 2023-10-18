import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PriceTickerService } from './price_ticker.service';
import { CreatePriceTickerDto } from './dto/create-price_ticker.dto';
import { UpdatePriceTickerDto } from './dto/update-price_ticker.dto';

@Controller('price-ticker')
export class PriceTickerController {
  constructor(private readonly priceTickerService: PriceTickerService) {}

  // @Post()
  // create(@Body() createPriceTickerDto: CreatePriceTickerDto) {
  //   return this.priceTickerService.create(createPriceTickerDto);
  // }

  // @Get()
  // findAll() {
  //   return this.priceTickerService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.priceTickerService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePriceTickerDto: UpdatePriceTickerDto) {
  //   return this.priceTickerService.update(+id, updatePriceTickerDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.priceTickerService.remove(+id);
  // }
}
