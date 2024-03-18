import { Injectable, Logger } from '@nestjs/common';
import { Tradebot } from './entities/tradebot.entity';
import { UserService } from '../user/user.service';
import { DewtService } from '../dewt/dewt.service';
import { PriceTickerService } from '../price_ticker/price_ticker.service';
import { StrategiesService } from '../strategies/strategies.service';
import { TransactionService } from '../transaction/transaction.service';
import { QuotationDto } from '../price_ticker/dto/quotation.dto';

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
  // TODO: (20240315 Jacky) : Should store the tradebot in the database in the future
  private tradebotArray: Tradebot[] = [];
  async create(privateKey?: string): Promise<Tradebot> {
    try {
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
      // TODO: (20240315 Jacky) : Should store the tradebot in the database in the future
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
    } catch (error) {
      this.logger.error('Error creating tradebot: ' + error.message);
    }
  }

  getAllTradebots(): Tradebot[] {
    if (this.tradebotArray.length === 0) {
      this.logger.error('No tradebots found');
    }
    return this.tradebotArray;
  }

  getTradebotById(id: string): Tradebot {
    const tradebot = this.tradebotArray.find((tradebot) => tradebot.id === id);
    if (!tradebot) {
      this.logger.error('Tradebot not found');
    }
    this.logger.log('Tradebot ' + tradebot.id + ' is found');
    return tradebot;
  }

  // TODO: add the deposit to the database
  async receiveDeposit(tradebot: Tradebot) {
    try {
      this.logger.log('Tradebot ' + tradebot.id + ' is receiving deposit');
      tradebot.dewt = await this.dewtService.create(
        tradebot.wallet.address,
        tradebot.wallet.privateKey.slice(2),
      );
      const deposit = await this.trancsactionService.deposit(tradebot.dewt);
      tradebot.startAsset = await this.userService.getMyAsset(tradebot.dewt);
      tradebot.currentAsset = tradebot.startAsset;
      this.logger.log(
        'Tradebot ' +
          tradebot.id +
          ' received deposit is ' +
          deposit.success +
          ' and startAvailable = ' +
          tradebot.startAsset.data.balance.available,
      );
      tradebot.updated_at = new Date();
      return {
        returnDeposit: deposit,
        tradebot: tradebot,
      };
    } catch (error) {
      this.logger.error(
        tradebot.id + ' Error receiving deposit: ' + error.message,
      );
    }
  }
  async executeStrategy(tradebot: Tradebot, instId: string) {
    this.logger.log(
      'Tradebot ' +
        tradebot.id +
        ' is executing ' +
        instId +
        ' purchase strategy',
    );
    try {
      let quotation: QuotationDto;
      if (tradebot.holdingStatus === 'WAIT') {
        this.logger.log('Tradebot ' + tradebot.id + ' hasn`t holding position');
        quotation = await this.priceTickerService.getCFDQuotation(instId);
      } else {
        quotation = await this.priceTickerService.getCFDQuotation(
          tradebot.holdingStatus,
          tradebot.holdingInstId,
        );
      }
      const priceArray = await this.priceTickerService.getCandlesticks(instId);
      const suggestion = this.strategiesService.autoARIMASuggestion(
        priceArray,
        quotation.data.spreadFee,
      );
      const currentPrice = priceArray[priceArray.length - 1];
      const tradeStrategy = this.strategiesService.executeStrategy(
        suggestion,
        tradebot.holdingStatus,
        tradebot.openPrice,
        currentPrice,
        tradebot.absSpreadFee,
        tradebot.stopLoss,
        tradebot.takeProfit,
      );
      if (tradeStrategy === 'CLOSE') {
        tradebot.dewt = await this.dewtService.create(
          tradebot.wallet.address,
          tradebot.wallet.privateKey.slice(2),
        );
        const closeCFDOrder = await this.trancsactionService.closeCFDOrder(
          tradebot.dewt,
          tradebot.wallet.privateKey.slice(2),
          quotation,
          tradebot.positionId,
        );
        if (closeCFDOrder.success == false) {
          this.logger.log(
            'Tradebot ' + tradebot.id + ' failed to close position',
          );
          return 'Tradebot ' + tradebot.id + ' failed to close position';
        }
        tradebot.holdingStatus = 'WAIT';
        tradebot.holdingInstId = null;
        tradebot.updated_at = new Date();
        tradebot.positionId = null;
        tradebot.openPrice = null;
        tradebot.absSpreadFee = null;
        tradebot.currentAsset = await this.userService.getMyAsset(
          tradebot.dewt,
        );
        this.logger.log(
          'Tradebot ' + tradebot.id + ' successfully closed position',
        );
        return 'Tradebot ' + tradebot.id + ' successfully closed position';
      }
      if (tradeStrategy === 'BUY' || tradeStrategy === 'SELL') {
        tradebot.dewt = await this.dewtService.create(
          tradebot.wallet.address,
          tradebot.wallet.privateKey.slice(2),
        );
        quotation = await this.priceTickerService.getCFDQuotation(
          tradeStrategy,
          instId,
        );
        const amount = this.trancsactionService.calculateAmount(
          tradebot.currentAsset.data.balance.available,
          quotation.data.price,
        );
        const createCFDOrder = await this.trancsactionService.createCFDOrder(
          tradebot.dewt,
          tradebot.wallet.privateKey.slice(2),
          quotation,
          amount,
        );
        if (createCFDOrder.success == false) {
          this.logger.error(
            'Tradebot ' +
              tradebot.id +
              ' failed to create position' +
              createCFDOrder.code,
          );
          return 'Tradebot ' + tradebot.id + ' failed to create position';
        }
        tradebot.holdingStatus = tradeStrategy;
        tradebot.holdingInstId = instId;
        tradebot.positionId = createCFDOrder.data.orderSnapshot.id;
        tradebot.openPrice = quotation.data.price;
        tradebot.absSpreadFee = Math.abs(quotation.data.spreadFee);
        tradebot.updated_at = new Date();
        tradebot.currentAsset = await this.userService.getMyAsset(
          tradebot.dewt,
        );
        this.logger.log(
          'Tradebot ' +
            tradebot.id +
            ' created a ' +
            tradebot.holdingStatus +
            ' position in ' +
            instId,
        );
        return (
          'Tradebot ' +
          tradebot.id +
          ' created a ' +
          tradebot.holdingStatus +
          ' position in ' +
          instId
        );
      }
      if (tradebot.holdingStatus !== 'WAIT') {
        this.logger.log('Tradebot ' + tradebot.id + ' is holding position');
        return 'Tradebot ' + tradebot.id + ' is holding position';
      }
      this.logger.log('Tradebot ' + tradebot.id + ' is waiting for chance');
      return 'Tradebot ' + tradebot.id + ' is waiting for chance';
    } catch (error) {
      this.logger.error(
        tradebot.id + ' Error executing strategy: ' + error.message,
      );
    }
  }

  async run(tradebot: Tradebot) {
    if (tradebot.isRunning) {
      this.logger.log('Tradebot ' + tradebot.id + ' is already running');
      return 'Tradebot ' + tradebot.id + ' is already running';
    }
    tradebot.isRunning = true;
    tradebot.timer = setInterval(async () => {
      this.logger.log('Tradebot ' + tradebot.id + ' is running');
      if (tradebot.holdingInstId !== 'BTC-USDT') {
        await this.executeStrategy(tradebot, 'ETH-USDT');
      }
      if (
        tradebot.holdingInstId !== 'ETH-USDT' &&
        tradebot.currentAsset.data.balance.available > 250
      ) {
        await this.executeStrategy(tradebot, 'BTC-USDT');
      }
    }, 1000 * 15);
    this.logger.log('Tradebot ' + tradebot.id + ' start running');
    return 'Tradebot ' + tradebot.id + ' start running';
  }
  async stop(tradebot: Tradebot) {
    if (!tradebot.isRunning) {
      this.logger.log('Tradebot ' + tradebot.id + ' is already stopped');
      return 'Tradebot ' + tradebot.id + ' is already stopped';
    }
    tradebot.isRunning = false;
    clearInterval(tradebot.timer);
    this.logger.log('Tradebot ' + tradebot.id + ' is stopped');
    return 'Tradebot ' + tradebot.id + ' is stopped';
  }

  setStopLoss(tradebot: Tradebot, stopLoss: number) {
    tradebot.stopLoss = stopLoss;
    this.logger.log(
      'Tradebot ' + tradebot.id + ' set stop loss to ' + stopLoss,
    );
    return 'Tradebot ' + tradebot.id + ' set stop loss to ' + stopLoss;
  }

  setTakeProfit(tradebot: Tradebot, takeProfit: number) {
    tradebot.takeProfit = takeProfit;
    this.logger.log(
      'Tradebot ' + tradebot.id + ' set take profit to ' + takeProfit,
    );
    return 'Tradebot ' + tradebot.id + ' set take profit to ' + takeProfit;
  }

  setStrategy(tradebot: Tradebot, strategy: string) {
    tradebot.strategy = strategy;
    this.logger.log('Tradebot ' + tradebot.id + ' set strategy to ' + strategy);
    return 'Tradebot ' + tradebot.id + ' set strategy to ' + strategy;
  }
}
