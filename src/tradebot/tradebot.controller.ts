import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { TradebotService } from './tradebot.service';

@Controller('tradebot')
export class TradebotController {
  constructor(private readonly tradebotService: TradebotService) {}

  @Post()
  async create(@Body() data: { privateKey: string }) {
    const createTradebot = await this.tradebotService.create(data.privateKey);
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
  getTradebot(@Query('id') id?: string) {
    if (id == null) {
      const tradebotArray = this.tradebotService.getAllTradebots();
      const tradebots = tradebotArray.map((tradebot) => ({
        tradebot: tradebot.toJSON(),
        'private key': tradebot.wallet.privateKey,
      }));
      return tradebots;
    }
    const tradebot = this.tradebotService.getTradebotById(id);
    return {
      tradebot: tradebot.toJSON(),
      'private key': tradebot.wallet.privateKey,
    };
  }

  @Put()
  async setTradebot(
    @Query('id') id: string,
    @Query('deposit') deposit?: string,
    @Query('stopLoss') stopLoss?: number,
    @Query('takeProfit') takeProfit?: number,
    @Query('strategy') strategy?: string,
  ) {
    const getTradebot = this.tradebotService.getTradebotById(id);
    if (deposit == 'deposit') {
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
    if (stopLoss) {
      const stopLossResult = this.tradebotService.setStopLoss(
        getTradebot,
        stopLoss,
      );
      return stopLossResult;
    }
    if (takeProfit) {
      const takeProfitResult = this.tradebotService.setTakeProfit(
        getTradebot,
        takeProfit,
      );
      return takeProfitResult;
    }
    if (strategy) {
      const strategyResult = this.tradebotService.setStrategy(
        getTradebot,
        strategy,
      );
      return strategyResult;
    }
  }

  @Post(':tradebotId')
  command(@Param('tradebotId') id: string, @Body() data: { command: string }) {
    try {
      const tradebot = this.tradebotService.getTradebotById(id);
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
