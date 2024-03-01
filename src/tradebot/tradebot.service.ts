import { Injectable } from '@nestjs/common';
import { CreateTradebotDto } from './dto/create-tradebot.dto';
import { UpdateTradebotDto } from './dto/update-tradebot.dto';

@Injectable()
export class TradebotService {
  create(createTradebotDto: CreateTradebotDto) {
    return 'This action adds a new tradebot';
  }

  findAll() {
    return `This action returns all tradebot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tradebot`;
  }

  update(id: number, updateTradebotDto: UpdateTradebotDto) {
    return `This action updates a #${id} tradebot`;
  }

  remove(id: number) {
    return `This action removes a #${id} tradebot`;
  }
}
