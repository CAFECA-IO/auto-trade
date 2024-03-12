import { Injectable, Logger } from '@nestjs/common';
import { Tradebot } from './entities/tradebot.entity';
import { UserService } from '../user/user.service';
import { DewtService } from '../dewt/dewt.service';
import { PriceTickerService } from '../price_ticker/price_ticker.service';
import { StrategiesService } from '../strategies/strategies.service';
import { TransactionService } from '../transaction/transaction.service';
import { HDNodeWallet, Wallet } from 'ethers';
import { CreateDewtDto } from '../dewt/dto/create-dewt.dto';
import { CreateDepositDto } from '../transaction/dto/createDeposit.dto';
import { myAsset } from '../user/entities/myAsset.entity';
import { ReturnCFDOrderDto } from '../transaction/dto/returnCFDOrder.dto';

@Injectable()
export class TradebotService {
  constructor(
    private readonly userService: UserService,
    private readonly dewtService: DewtService,
    private readonly priceTickerService: PriceTickerService,
    private readonly strategiesService: StrategiesService,
    private readonly trancsactionService: TransactionService,
  ) {}
  private readonly logger = new Logger(TradebotService.name);
  private tradebot: Tradebot; // not sure if this is the right way to do it
  create(privateKey?: string) {
    this.tradebot = new Tradebot();
    if (privateKey == null) {
      this.tradebot.wallet = this.userService.createWallet();
    } else {
      this.tradebot.wallet = this.userService.connectWallet(privateKey);
    }
    this.tradebot.dewt = this.dewtService.create(
      this.tradebot.wallet.address,
      this.tradebot.wallet.privateKey.slice(2),
    );
    this.logger.log(
      'Tradebot ' +
        this.tradebot.id +
        ' created at ' +
        this.tradebot.created_at,
    );
    // TODO: add the tradebot to the database
    return (
      'Tradebot' + this.tradebot.id + 'created at ' + this.tradebot.created_at
    );
  }

  // TODO: add the deposit to the database
  async receiveDeposit() {
    this.logger.log('Tradebot' + this.tradebot.id + ' is receiving deposit');
    this.tradebot.dewt = this.dewtService.create(
      this.tradebot.wallet.address,
      this.tradebot.wallet.privateKey.slice(2),
    );
    const deposit = await this.trancsactionService.deposit(this.tradebot.id);
    this.tradebot.startAsset = await this.userService.getMyAsset(
      this.tradebot.dewt,
    );
    this.logger.log(
      'Tradebot' +
        this.tradebot.id +
        ' received deposit is ' +
        deposit.success +
        'and startAvailable =' +
        this.tradebot.startAsset.data.balance.available,
    );
    return (
      'Tradebot' +
      this.tradebot.id +
      ' received deposit is ' +
      deposit +
      'and startAvailable =' +
      this.tradebot.startAsset.data.balance.available
    );
  }
  async executeStrategy(instId: string, holdingStatus: string) {
    // get price and quotation
    let quotation = await this.priceTickerService.getCFDQuotation(instId);
    const priceArray = await this.priceTickerService.getCandlesticks(instId);
    const suggestion = this.strategiesService.autoARIMASuggestion(
      priceArray,
      quotation.data.spreadFee,
    );
    const tradeStrategy = this.strategiesService.runTradeStrategy(
      suggestion,
      holdingStatus,
    );
    if (tradeStrategy === 'CLOSE') {
      this.tradebot.dewt = this.dewtService.create(
        this.tradebot.wallet.address,
        this.tradebot.wallet.privateKey.slice(2),
      );
      this.tradebot.holdingStatus = 'WAIT';
      this.tradebot.holdingInstId = null;
      return this.trancsactionService.closeCFDOrder(
        this.tradebot.dewt,
        this.tradebot.wallet.privateKey.slice(2),
        quotation,
        this.tradebot.positionId,
      );
    }
    if (tradeStrategy === 'BUY' || tradeStrategy === 'SELL') {
      quotation = await this.priceTickerService.getCFDQuotation(
        instId,
        suggestion,
      );
      const amount = this.trancsactionService.calculateAmount(
        quotation.data.price,
      );
      this.tradebot.holdingStatus = tradeStrategy;
      this.tradebot.holdingInstId = instId;
      const createCFDOrder = await this.trancsactionService.createCFDOrder(
        this.tradebot.dewt,
        this.tradebot.wallet.privateKey.slice(2),
        quotation,
        amount,
      );
      this.tradebot.positionId = createCFDOrder.data.orderSnapshot.id;
      this.tradebot.openPrice = quotation.data.price;
      this.tradebot.absSpreadFee = Math.abs(quotation.data.spreadFee);
      return createCFDOrder;
    }
    return 'Tradebot' + this.tradebot.id + ' is waiting';
  }

  async run() {
    this.logger.log('Tradebot' + this.tradebot.id + ' is running');
    this.tradebot.holdingStatus = 'WAIT';
    this.tradebot.holdingInstId = null;
    while (true) {
      const myAsset = await this.userService.getMyAsset(this.tradebot.dewt);
      if (Number(myAsset.data.balance.available) < 100) {
        break;
      }
      if (this.tradebot.holdingInstId !== 'BTC-USDT') {
        const ETHResult = await this.executeStrategy(
          'ETH-USDT',
          this.tradebot.holdingStatus,
        );
        if (ETHResult instanceof ReturnCFDOrderDto) {
          if (ETHResult.success === false) {
            break;
          }
        }
      }
      if (this.tradebot.holdingInstId !== 'ETH-USDT') {
        const BTCResult = await this.executeStrategy(
          'BTC-USDT',
          this.tradebot.holdingStatus,
        );
        if (BTCResult instanceof ReturnCFDOrderDto) {
          if (BTCResult.success === false) {
            break;
          }
        }
      }
      // stop loss
    }
  }
}
