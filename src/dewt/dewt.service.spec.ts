import { Test, TestingModule } from '@nestjs/testing';
import { DewtService } from './dewt.service';
import { randomHex } from '../common/common';

describe('DewtService', () => {
  let service: DewtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DewtService],
    }).compile();

    service = module.get<DewtService>(DewtService);
  });

  it('should be defined', () => {
    console.log(randomHex(32));
    expect(service).toBeDefined();
  });

  it('should return a dewt', async () => {
    const address = '0xF1cbCfee8e05549B8E6c6192216193D389fe49aE';
    const privateKey =
      '496d0910854c0140df89ed3271084a93ffe9b91bbe8b05c36ee74e646bd02f38';
    const dewt = await service.create(address, privateKey);
    console.log(dewt);
  });
});
