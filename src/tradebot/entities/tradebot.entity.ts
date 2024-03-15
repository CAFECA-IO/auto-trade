import { randomUUID } from 'crypto';
import { HDNodeWallet, Wallet } from 'ethers';
import { DewtService } from '../../dewt/dewt.service';
import { PriceTickerService } from '../../price_ticker/price_ticker.service';
import { StrategiesService } from '../../strategies/strategies.service';
import { TransactionService } from '../../transaction/transaction.service';
import { myAsset } from '../../user/dto/myAsset.dto';
import { UserService } from '../../user/user.service';

export class Tradebot {
  constructor() {
    this.id = randomUUID();
    this.created_at = new Date();
    this.updated_at = new Date();
    this.strategy = 'ARIMA';
    this.holdingStatus = 'WAIT';
    this.stopLoss = 1.6;
    this.takeProfit = 2.1;
    this.isRunning = false;
  }
  id: string;
  created_at: Date;
  updated_at: Date;
  wallet: HDNodeWallet | Wallet;
  dewt: string;
  strategy: string;
  startAsset: myAsset;
  currentAsset: myAsset;
  holdingStatus: string;
  holdingInstId: string;
  positionId: string;
  openPrice: number;
  absSpreadFee: number;
  endAsset: myAsset;
  stopLoss: number; // times of spreadFee
  takeProfit: number; // times of spreadFee
  isRunning: boolean;
  timer?: NodeJS.Timeout;

  toJSON() {
    const { timer, ...tradebot } = this;
    return tradebot;
  }
}
