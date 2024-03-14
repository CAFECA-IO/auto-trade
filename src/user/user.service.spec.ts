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
      'f8848b536572766963655465726d9868747470733a2f2f746964656269742d646566692e636f6df83e9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d94a2d6fa8bf05f82b82e7a2dd0583a3366b19ea1808465f29b038465f14983.a8c725c44ae2262e523b96905987f5afadcab195551370f01169684197ccf16d0125f683a40fbe93bc34ee4b1bd960e292e82cdc639f89f00bd8dddfd529cd591c';
    address = '0xa2D6fa8bf05F82B82e7A2Dd0583A3366B19Ea180';
    privateKey =
      '496d0910854c0140df89ed3271084a93ffe9b91bbe8b05c36ee74e646bd02f38';
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
    console.log(result.signingKey);
    expect(result).not.toBeNull();
  });
});
