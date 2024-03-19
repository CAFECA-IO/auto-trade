import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { TradebotService } from './tradebot.service';

@Controller('tradebot')
export class TradebotController {
  constructor(private readonly tradebotService: TradebotService) {}

  @Post()
  async create() {
    const createTradebot = await this.tradebotService.create();
    const { returnDeposit, tradebot } =
      await this.tradebotService.receiveDeposit(createTradebot);
    return (
      'Tradebot ' +
      tradebot.id +
      ' created at ' +
      tradebot.created_at +
      ' public address is ' +
      tradebot.wallet.address +
      ' private key is ' +
      tradebot.wallet.privateKey +
      ' and received deposit is ' +
      returnDeposit.success +
      ' and startAvailable = ' +
      tradebot.startAsset.data.balance.available
    );
  }

  @Get()
  async getTradebot(@Query('id') id?: string) {
    if (id == null) {
      const tradebotArray = await this.tradebotService.getAllTradebots();
      const tradebots = tradebotArray.map((tradebot) => ({
        tradebot: tradebot.toJSON(),
        'private key': tradebot.wallet.privateKey,
      }));
      return tradebots;
    }
    const tradebot = await this.tradebotService.getTradebotById(id);
    return {
      tradebot: tradebot.toJSON(),
      'private key': tradebot.wallet.privateKey,
    };
  }

  @Put()
  async updateTradebot(
    @Query('id') id: string,
    @Body()
    data: {
      deposit?: string;
      suggestion?: string;
      tradeStrategy?: string;
      stopLoss?: string;
      takeProfit?: string;
    },
  ) {
    const getTradebot = await this.tradebotService.getTradebotById(id);
    if (data.deposit) {
      const { returnDeposit, tradebot } =
        await this.tradebotService.receiveDeposit(getTradebot);
      return (
        'Tradebot ' +
        tradebot.id +
        ' received deposit is ' +
        returnDeposit.success +
        ' and startAvailable = ' +
        tradebot.startAsset.data.balance.available
      );
    }
    if (data.suggestion) {
      const suggestionResult = this.tradebotService.setSuggestion(
        getTradebot,
        data.suggestion,
      );
      return suggestionResult;
    }
    if (data.tradeStrategy) {
      const strategyResult = this.tradebotService.setTradeStrategy(
        getTradebot,
        data.tradeStrategy,
      );
      return strategyResult;
    }
    if (data.stopLoss) {
      const stopLossResult = this.tradebotService.setStopLoss(
        getTradebot,
        data.stopLoss,
      );
      return stopLossResult;
    }
    if (data.takeProfit) {
      const takeProfitResult = this.tradebotService.setTakeProfit(
        getTradebot,
        data.takeProfit,
      );
      return takeProfitResult;
    }
  }

  @Post(':tradebotId')
  async command(
    @Param('tradebotId') id: string,
    @Body() data: { strategy: string; command: string },
  ) {
    try {
      const tradebot = await this.tradebotService.getTradebotById(id);
      if (!tradebot) {
        return 'Tradebot not found';
      }
      if (data.command === 'run') {
        const runCommand = this.tradebotService.run(tradebot);
        return runCommand;
      }
      if (data.command === 'stop') {
        const stopCommand = this.tradebotService.stop(tradebot);
        return stopCommand;
      }
      return data.command + 'is invalid command';
    } catch (error) {
      return error.message;
    }
  }
}
