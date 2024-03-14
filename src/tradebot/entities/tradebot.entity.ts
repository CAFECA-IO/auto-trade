import { Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { HDNodeWallet, Wallet } from 'ethers';
import { DewtService } from '../../dewt/dewt.service';
import { PriceTickerService } from '../../price_ticker/price_ticker.service';
import { StrategiesService } from '../../strategies/strategies.service';
import { TransactionService } from '../../transaction/transaction.service';
import { myAsset } from '../../user/entities/myAsset.entity';
import { UserService } from '../../user/user.service';

export class Tradebot {
  private readonly logger = new Logger(Tradebot.name);
  constructor() {
    this.id = randomUUID();
    this.created_at = new Date();
    this.updated_at = new Date();
    this.strategy = 'ARIMA';
    this.holdingStatus = 'WAIT';
  }
  id: string;
  created_at: Date;
  updated_at: Date;
  wallet: HDNodeWallet | Wallet;
  dewt: string;
  strategy: string;
  startAsset: myAsset;
  holdingStatus: string;
  holdingInstId: string;
  positionId: string;
  openPrice: number;
  absSpreadFee: number;
}
