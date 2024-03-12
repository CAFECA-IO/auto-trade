import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { HttpModule } from '@nestjs/axios';
import { HDNodeWallet } from 'ethers';

describe('UserService', () => {
  let service: UserService;
  let dewt: string;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    dewt =
      'f8858b536572766963655465726d9868747470733a2f2f746964656269742d646566692e636f6df83e9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d94c76d6c61dfa7dbb7700ad3ed390e5eaf98337a748508c7b44de38465efe5e3.0d4b32f0781552cba08e2e8cdd98b3427a8e7e1970cb5d3c07e84ab27c9689a4786429d8902930d06b04472796f53a04e30acb1f27a31e9016a3510c12bcb0571b';
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
});
