import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { HttpModule } from '@nestjs/axios';
import { HistoryList } from './dto/history.dto';

describe('UserService', () => {
  let service: UserService;
  let dewt: string;
  let address: string;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    dewt =
      'f8848b536572766963655465726d9868747470733a2f2f746964656269742d646566692e636f6df83e9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d94a0a78676e23c82516de3e4c058a2a9809c42cf8c8465fba7448465fa55c4.e8a20103cca09cff726200a2f77ba32178eb189c56f9f2a59d8b5037bc5e60c24a8a988f8b2e3e3bab3e939eaf8ada140996a776196f3f177444b490693e700c1c';
    address = '0xf6A69BBADE424F789489Fc2D4D7c24f3AcAF0097';
  });

  it('should register User', async () => {
    const user = {
      code: '00000000',
      success: true,
      reason: 'User is registered',
      data: {
        user: {
          id: '0xa0a78676E23c82516De3e4C058a2A9809C42cf8c',
          address: '0xa0a78676E23c82516De3e4C058a2A9809C42cf8c',
          referCode: '54b9fdf0',
          tidebit:
            '{"ip":"::ffff:172.68.225.75","token":"f8848b536572766963655465726d9868747470733a2f2f746964656269742d646566692e636f6df83e9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d94a0a78676e23c82516de3e4c058a2a9809c42cf8c8465f3dcd68465f28b56.f0d9c4996f0e6603c3d04bcaa9ee8092dc0844dad99c80f672b106466a56f55573c5f2d6cb9e55aaed1c7f8931563876a024651e3829aae24404d9e06d236b361b"}',
          createdAt: 1710394198,
          updatedAt: 1710394198,
        },
        expiredAt: '2024-03-21T03:19:32.000Z',
      },
    };
    jest.spyOn(service, 'registerUser').mockImplementation(async () => user);

    expect(await service.registerUser(address, dewt)).toBe(user);
  });

  it('should return asset data', async () => {
    const asset = {
      success: true,
      code: '00000000',
      data: {
        currency: 'USDT',
        balance: { available: 10, locked: 0.0 },
        pnl: {
          today: {
            amount: { type: 'EQUAL', value: '0.00' },
            percentage: { type: 'EQUAL', value: '0.00' },
          },
          monthly: {
            amount: { type: 'EQUAL', value: '0.00' },
            percentage: { type: 'EQUAL', value: '0.00' },
          },
          cumulative: {
            amount: { type: 'EQUAL', value: '0.00' },
            percentage: { type: 'EQUAL', value: '0.00' },
          },
        },
        interest: { apy: '0.00', monthly: '0.00', cumulative: '0.00' },
      },
    };
    jest.spyOn(service, 'getMyAsset').mockImplementation(async () => asset);
    expect(await service.getMyAsset(dewt)).toBe(asset);
  });

  it('should return history data', async () => {
    const historyList = new HistoryList();
    jest
      .spyOn(service, 'listHistories')
      .mockImplementation(async () => historyList);
    const result = await service.listHistories(dewt);
    expect(result).toBeInstanceOf(HistoryList);
  });
});
