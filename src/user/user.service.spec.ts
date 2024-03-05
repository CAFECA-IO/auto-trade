import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { HttpModule } from '@nestjs/axios';

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
      'f8848b536572766963655465726d9868747470733a2f2f746964656269742d646566692e636f6df83e9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d9e68747470733a2f2f746964656269742d646566692e636f6d7b686173687d94c76d6c61dfa7dbb7700ad3ed390e5eaf98337a748465e76ced8465e6e04d.5fc9766576fe2ed41ee062aeabdb5246bbbc5e97affedb1351fa409e80386c454fc463f589463554d2e01f7728d24a88fe5ee1b4b8ae456561cf5e5e9ea15dec1c.d7e2ccab6c188e19736b7db16945f311e552b04c8eff2f1e6beea2f70ee640e123447ada8fee22d2c1da2092e80079519d5a58743879b68639609c2ab77b0be71c.b461edda6be5a07a9f653709d08722e27fea0aea1ed89ab00d350e7d97f2fad27f793002e2add341a147b8133da7575056ff698d345337344312ec1d017b566d1c';
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

  it('should return CFD data', async () => {
    const result = await service.listCFDs(dewt);
    console.log(result);
    expect(result).not.toBeNull();
  });

  it('should return PNL data', async () => {
    const result = await service.getPNL(dewt);
    console.log(result);
    expect(result).not.toBeNull();
  });
});
