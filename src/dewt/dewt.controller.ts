import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DewtService } from './dewt.service';
import { CreateDewtDto } from './dto/create-dewt.dto';

@Controller('dewt')
export class DewtController {
  constructor(private readonly dewtService: DewtService) {}

  @Post()
  create(@Body() data: { address: string; privateKey: string }) {
    console.log(data);
    return this.dewtService.create(data.address, data.privateKey);
  }

  // @Get()
  // findAll() {
  //   return this.dewtService.create(
  //     '0xF1cbCfee8e05549B8E6c6192216193D389fe49aE',
  //   );
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.dewtService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDewtDto: UpdateDewtDto) {
  //   return this.dewtService.update(+id, updateDewtDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.dewtService.remove(+id);
  // }
}
