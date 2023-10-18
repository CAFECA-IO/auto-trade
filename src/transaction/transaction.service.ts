import { Injectable } from '@nestjs/common';
import { CreateTransactionDto, DepositDto } from './dto/deposit.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PriceTicker } from 'src/price_ticker/entities/price_ticker.entity';
import { PriceTickerService } from 'src/price_ticker/price_ticker.service';

@Injectable()
export class TransactionService {
  constructor(private readonly priceTickerService: PriceTickerService) {}

  deposit(deposit: DepositDto) {
    
    return 'This action adds a new transaction';
  }

  createCFDTrade() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
