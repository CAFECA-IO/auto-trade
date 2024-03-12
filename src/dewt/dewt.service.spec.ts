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

  it('should return a dewt', () => {
    const address = '0xC76D6C61dfa7DBb7700Ad3ED390E5eaf98337A74';
    const privateKey =
      '496d0910854c0140df89ed3271084a93ffe9b91bbe8b05c36ee74e646bd02f38';
    const dewt = service.create(address, privateKey);
    console.log(dewt);
  });
});
