import { Test, TestingModule } from '@nestjs/testing';
import { TradebotController } from './tradebot.controller';
import { TradebotService } from './tradebot.service';
import { HttpModule } from '@nestjs/axios';
import { PriceTickerModule } from '../price_ticker/price_ticker.module';
import { StrategiesModule } from '../strategies/strategies.module';
import { DewtModule } from '../dewt/dewt.module';
import { TransactionModule } from '../transaction/transaction.module';
import { UserModule } from '../user/user.module';
import { DewtService } from '../dewt/dewt.service';
import { PriceTickerService } from '../price_ticker/price_ticker.service';
import { StrategiesService } from '../strategies/strategies.service';
import { TransactionService } from '../transaction/transaction.service';
import { UserService } from '../user/user.service';

describe('TradebotController', () => {
  let controller: TradebotController;
  // let tradebotService: TradebotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradebotController],
      providers: [
        TradebotService,
        PriceTickerService,
        StrategiesService,
        DewtService,
        TransactionService,
        UserService,
      ],
      imports: [
        PriceTickerModule,
        StrategiesModule,
        DewtModule,
        TransactionModule,
        UserModule,
        HttpModule,
      ],
    }).compile();

    controller = module.get<TradebotController>(TradebotController);
    // tradebotService = module.get<TradebotService>(TradebotService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
// TODO: (20240325 - Jacky) Should be finish in the future for higher quality
//   describe('create', () => {
//     it('should create a tradebot and return the tradebot details', async () => {
//       const createTradebotResult = {
//         returnDeposit: true,
//         tradebot: {
//           id: '1',
//           created_at: '2022-01-01',
//           wallet: {
//             address: 'address',
//             privateKey: 'privateKey',
//           },
//           currentAsset: {
//             data: {
//               balance: {
//                 available: 100,
//               },
//             },
//           },
//         },
//       };
//       jest
//         .spyOn(tradebotService, 'create')
//         .mockImplementation(async);

//       const result = await controller.create();

//       expect(result).toEqual(
//         'Tradebot 1 created at 2022-01-01 public address is address private key is privateKey and received deposit is true and currentAvailable = 100',
//       );
//     });

//     it('should return an error message if tradebot creation fails', async () => {
//       jest.spyOn(tradebotService, 'create').mockResolvedValue(null);

//       const result = await controller.create();

//       expect(result).toEqual('Tradebot not created');
//     });

//     it('should return an error message if deposit is not successful', async () => {
//       const createTradebotResult = {
//         returnDeposit: false,
//         tradebot: {
//           id: '1',
//           created_at: '2022-01-01',
//           wallet: {
//             address: 'address',
//             privateKey: 'privateKey',
//           },
//           currentAsset: {
//             data: {
//               balance: {
//                 available: 100,
//               },
//             },
//           },
//         },
//       };
//       jest
//         .spyOn(tradebotService, 'create')
//         .mockResolvedValue(createTradebotResult);

//       const result = await controller.create();

//       expect(result).toEqual('Tradebot is created, but deposit is not successful');
//     });
//   });

//   describe('getTradebot', () => {
//     it('should return all tradebots if id is not provided', async () => {
//       const tradebotArray = [
//         {
//           id: '1',
//           toJSON: () => ({
//             id: '1',
//             wallet: {
//               privateKey: 'privateKey',
//             },
//           }),
//         },
//         {
//           id: '2',
//           toJSON: () => ({
//             id: '2',
//             wallet: {
//               privateKey: 'privateKey',
//             },
//           }),
//         },
//       ];
//       jest.spyOn(tradebotService, 'getAllTradebots').mockResolvedValue(tradebotArray);

//       const result = await controller.getTradebot();

//       expect(result).toEqual([
//         {
//           tradebot: {
//             id: '1',
//             wallet: {
//               privateKey: 'privateKey',
//             },
//           },
//           'private key': 'privateKey',
//         },
//         {
//           tradebot: {
//             id: '2',
//             wallet: {
//               privateKey: 'privateKey',
//             },
//           },
//           'private key': 'privateKey',
//         },
//       ]);
//     });

//     it('should return a tradebot by id', async () => {
//       const tradebot = {
//         id: '1',
//         toJSON: () => ({
//           id: '1',
//           wallet: {
//             privateKey: 'privateKey',
//           },
//         }),
//       };
//       jest.spyOn(tradebotService, 'getTradebotById').mockResolvedValue(tradebot);

//       const result = await controller.getTradebot('1');

//       expect(result).toEqual({
//         tradebot: {
//           id: '1',
//           wallet: {
//             privateKey: 'privateKey',
//           },
//         },
//         'private key': 'privateKey',
//       });
//     });
//   });

//   describe('updateTradebot', () => {
//     it('should update a tradebot and return the updated tradebot details', async () => {
//       const tradebot = {
//         id: '1',
//         toJSON: () => ({
//           id: '1',
//         }),
//       };
//       const updatedTradebot = {
//         id: '1',
//         toJSON: () => ({
//           id: '1',
//         }),
//       };
//       const data = {
//         suggestion: 'suggestion',
//         tradeStrategy: 'tradeStrategy',
//         stopLoss: 'stopLoss',
//         takeProfit: 'takeProfit',
//       };
//       jest.spyOn(tradebotService, 'getTradebotById').mockResolvedValue(tradebot);
//       jest.spyOn(tradebotService, 'updateTradebot').mockResolvedValue(updatedTradebot);

//       const result = await controller.updateTradebot('1', data);

//       expect(result).toEqual('1 is updated and tradebot = {"id":"1"}');
//     });

//     it('should return an error message if tradebot is not found', async () => {
//       jest.spyOn(tradebotService, 'getTradebotById').mockResolvedValue(null);

//       const result = await controller.updateTradebot('1', {});

//       expect(result).toEqual('Tradebot not found');
//     });
//   });

//   describe('command', () => {
//     it('should run a command to start the tradebot', async () => {
//       const tradebot = {
//         id: '1',
//       };
//       jest.spyOn(tradebotService, 'getTradebotById').mockResolvedValue(tradebot);
//       jest.spyOn(tradebotService, 'run').mockReturnValue('Run command executed');

//       const result = await controller.command('1', { strategy: 'strategy', command: 'run' });

//       expect(result).toEqual('Run command executed');
//     });

//     it('should run a command to stop the tradebot', async () => {
//       const tradebot = {
//         id: '1',
//       };
//       jest.spyOn(tradebotService, 'getTradebotById').mockResolvedValue(tradebot);
//       jest.spyOn(tradebotService, 'stop').mockReturnValue('Stop command executed');

//       const result = await controller.command('1', { strategy: 'strategy', command: 'stop' });

//       expect(result).toEqual('Stop command executed');
//     });

//     it('should run a command to receive deposit for the tradebot', async () => {
//       const tradebot = {
//         id: '1',
//       };
//       jest.spyOn(tradebotService, 'getTradebotById').mockResolvedValue(tradebot);
//       jest.spyOn(tradebotService, 'receiveDeposit').mockReturnValue('Deposit command executed');

//       const result = await controller.command('1', { strategy: 'strategy', command: 'deposit' });

//       expect(result).toEqual('Deposit command executed');
//     });

//     it('should return an error message for an invalid command', async () => {
//       const tradebot = {
//         id: '1',
//       };
//       jest.spyOn(tradebotService, 'getTradebotById').mockResolvedValue(tradebot);

//       const result = await controller.command('1', { strategy: 'strategy', command: 'invalid' });

//       expect(result).toEqual('invalid is invalid command');
//     });

//     it('should return an error message if tradebot is not found', async () => {
//       jest.spyOn(tradebotService, 'getTradebotById').mockResolvedValue(null);

//       const result = await controller.command('1', { strategy: 'strategy', command: 'run' });

//       expect(result).toEqual('Tradebot not found');
//     });

//     it('should return an error message if an exception occurs', async () => {
//       const tradebot = {
//         id: '1',
//       };
//       jest.spyOn(tradebotService, 'getTradebotById').mockResolvedValue(tradebot);
//       jest.spyOn(tradebotService, 'run').mockImplementation(() => {
//         throw new Error('An error occurred');
//       });

//       const result = await controller.command('1', { strategy: 'strategy', command: 'run' });

//       expect(result).toEqual('An error occurred');
//     });
//   });
// });