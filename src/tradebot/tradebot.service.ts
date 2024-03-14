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
  private tradebotArray: Tradebot[] = []; // not sure if this is the right way to do it
  async create(privateKey?: string): Promise<Tradebot> {
    const tradebot = new Tradebot();
    if (privateKey == null) {
      tradebot.wallet = this.userService.createWallet();
    } else {
      tradebot.wallet = this.userService.connectWallet(privateKey);
    }
    tradebot.dewt = await this.dewtService.create(
      tradebot.wallet.address,
      tradebot.wallet.privateKey.slice(2),
    );
    for (let i = 0; i < 3; i++) {
      const register = await this.userService.registerUser(
        tradebot.wallet.address,
        tradebot.dewt,
      );
      if (register.success == true) {
        this.logger.log(
          'Tradebot ' + tradebot.id + ' regist is ' + register.success,
        );
        // TODO: maybe add the tradebot to the database
        this.tradebotArray.push(tradebot);
        this.logger.log(
          'Tradebot ' +
            tradebot.id +
            ' created at ' +
            tradebot.created_at +
            ' public address is ' +
            tradebot.wallet.address,
        );
        return tradebot;
      }
    }
    throw new Error('Tradebot ' + tradebot.id + ' registration failed');
  }

  getAllTradebots(): Tradebot[] {
    return this.tradebotArray;
  }

  getTradebotById(id: string): Tradebot {
    this.logger.log(
      'Tradebot ' + this.tradebotArray.find((tradebot) => tradebot.id === id),
    );
    return this.tradebotArray.find((tradebot) => tradebot.id === id);
  }

  // TODO: add the deposit to the database
  async receiveDeposit(tradebot: Tradebot) {
    this.logger.log('Tradebot ' + tradebot.id + ' is receiving deposit');
    const deposit = await this.trancsactionService.deposit(tradebot.dewt);
    tradebot.startAsset = await this.userService.getMyAsset(tradebot.dewt);
    this.logger.log(
      'Tradebot ' +
        tradebot.id +
        ' received deposit is ' +
        deposit.success +
        ' and startAvailable = ' +
        tradebot.startAsset.data.balance.available,
    );
    return (
      'Tradebot ' +
      tradebot.id +
      ' received deposit is ' +
      deposit.success +
      ' and startAvailable = ' +
      tradebot.startAsset.data.balance.available
    );
  }
  async executePurchaseStrategy(tradebot: Tradebot, instId: string) {
    this.logger.log(
      'Tradebot ' + tradebot.id + ' is executing purchase strategy',
    );
    // get price and quotation
    let quotation = await this.priceTickerService.getCFDQuotation(instId);
    const priceArray = await this.priceTickerService.getCandlesticks(instId);
    const suggestion = this.strategiesService.autoARIMASuggestion(
      priceArray,
      quotation.data.spreadFee,
    );
    const tradeStrategy = this.strategiesService.purchaseStrategy(
      suggestion,
      tradebot.holdingStatus,
    );
    if (tradeStrategy === 'CLOSE') {
      // this.dewt = await this.dewtService.create(
      // this.wallet.address,
      // this.wallet.privateKey.slice(2),
      // );
      const result = await this.trancsactionService.closeCFDOrder(
        tradebot.dewt,
        tradebot.wallet.privateKey.slice(2),
        quotation,
        tradebot.positionId,
      );
      if (result.success == false) {
        this.logger.log(
          'Tradebot ' + tradebot.id + ' failed to close position',
        );
        return 'Tradebot ' + tradebot.id + ' failed to close position';
      }
      tradebot.holdingStatus = 'WAIT';
      tradebot.holdingInstId = null;
      this.logger.log(
        'Tradebot ' + tradebot.id + 'sucessfully closed position',
      );
      return 'Tradebot ' + tradebot.id + 'sucessfully closed position';
    }
    if (tradeStrategy === 'BUY' || tradeStrategy === 'SELL') {
      quotation = await this.priceTickerService.getCFDQuotation(
        tradeStrategy,
        instId,
      );
      const amount = this.trancsactionService.calculateAmount(
        quotation.data.price,
      );
      tradebot.holdingStatus = tradeStrategy;
      tradebot.holdingInstId = instId;
      const createCFDOrder = await this.trancsactionService.createCFDOrder(
        tradebot.dewt,
        tradebot.wallet.privateKey.slice(2),
        quotation,
        amount,
      );
      tradebot.positionId = createCFDOrder.data.orderSnapshot.id;
      tradebot.openPrice = quotation.data.price;
      tradebot.absSpreadFee = Math.abs(quotation.data.spreadFee);
      this.logger.log(
        'Tradebot ' + tradebot.id + ' created position in ' + instId,
      );
      return 'Tradebot ' + tradebot.id + ' created position in ' + instId;
    }
    if (tradebot.holdingStatus !== 'WAIT') {
      this.logger.log('Tradebot' + tradebot.id + ' is holding position');
      return 'Tradebot' + tradebot.id + ' is holding position';
    }
    this.logger.log('Tradebot' + tradebot.id + ' is waiting for chance');
    return 'Tradebot' + tradebot.id + ' is waiting for chance';
  }

  // stop profit and stop loss
  async executeCloseStrategy(tradebot: Tradebot) {
    this.logger.log('Tradebot ' + tradebot.id + ' is executing close strategy');
    const quotation = await this.priceTickerService.getCFDQuotation(
      tradebot.holdingStatus,
      tradebot.holdingInstId,
    );
    const closeStrategy = this.strategiesService.closeStrategy(
      tradebot.openPrice,
      quotation.data.price,
      quotation.data.spreadFee,
      tradebot.holdingStatus,
    );
    if (closeStrategy === 'CLOSE') {
      const result = await this.trancsactionService.closeCFDOrder(
        tradebot.dewt,
        tradebot.wallet.privateKey.slice(2),
        quotation,
        tradebot.positionId,
      );
      if (result.success == false) {
        this.logger.log(
          'Tradebot ' +
            tradebot.id +
            ' failed to close position in close strategy',
        );
        return (
          'Tradebot ' +
          tradebot.id +
          ' failed to close position in close strategy'
        );
      }
      tradebot.holdingStatus = 'WAIT';
      tradebot.holdingInstId = null;
      this.logger.log(
        'Tradebot ' +
          tradebot.id +
          'sucessfully closed position in close strategy',
      );
      return (
        'Tradebot ' +
        tradebot.id +
        'sucessfully closed position in close strategy'
      );
    }
    this.logger.log(
      'Tradebot' + tradebot.id + ' is holding position in close strategy',
    );
    return 'Tradebot' + tradebot.id + ' is holding position in close strategy';
  }

  async run(tradebot: Tradebot) {
    setInterval(async () => {
      this.logger.log('Tradebot ' + tradebot.id + ' is running');
      if (tradebot.holdingInstId !== 'BTC-USDT') {
        await this.executePurchaseStrategy(tradebot, 'ETH-USDT');
      }
      if (tradebot.holdingInstId !== 'ETH-USDT') {
        await this.executePurchaseStrategy(tradebot, 'BTC-USDT');
      }
      if (tradebot.holdingStatus !== 'WAIT') {
        await this.executeCloseStrategy(tradebot);
      }
    }, 1000 * 5);
  }
}
