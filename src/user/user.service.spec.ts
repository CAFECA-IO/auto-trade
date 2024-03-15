import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { HttpModule } from '@nestjs/axios';
import { HDNodeWallet } from 'ethers';

describe('UserService', () => {
  let service: UserService;
  let dewt: string;
  let address: string;
  let privateKey: string;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    dewt =
      'f8848b536572766963655465726d9868747470733a2f2f746964656269742d646566692e636f6df83e9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d94af541d702e5b4c5af3f63d765465888ea8e728808465f5405c8465f3eedc.c4d8453f103f8aef8b9df098ba2c16d8005e6887182e973bcd5662689032f85856409a180ea9a69d90caa5b349700c9e9cddf11a2f92f2f3ff1c58ff54f998631b';
    address = '0xf6A69BBADE424F789489Fc2D4D7c24f3AcAF0097';
    privateKey =
      '0xed7f7f08cce6e0455d97c4eb2e51d2899cc8ce0bdc92c8701584ff816eb86976';
  });

  it('should register User', async () => {
    const result = await service.registerUser(address, dewt);
    console.log(result);
    expect(result).not.toBeNull();
  });

  it('should return asset data', async () => {
    const result = await service.getMyAsset(dewt);
    console.log(result);
    expect(result).not.toBeNull();
  });

  it('should return history data', async () => {
    const result = await service.listHistories(dewt);
    console.log(result.data);
    expect(result).not.toBeNull();
  }, 300000); // too much time to get all the data

  it('should return wallet data', async () => {
    const result: HDNodeWallet = await service.createWallet();
    console.log(result.address);
    console.log('🚀 ~ it ~ privateKey:', result.privateKey);
    expect(result).not.toBeNull();
  });

  it('should connect real wallet', async () => {
    const result = await service.connectWallet(privateKey);
    console.log(result);
    expect(result).not.toBeNull();
  });
});
