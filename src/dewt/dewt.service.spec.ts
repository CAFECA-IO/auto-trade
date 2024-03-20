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
    const address = '0xa0a78676E23c82516De3e4C058a2A9809C42cf8c';
    const privateKey =
      'ed7f7f08cce6e0455d97c4eb2e51d2899cc8ce0bdc92c8701584ff816eb86976';
    const dewt = await service.create(address, privateKey);
    // Info: (20240320 - Jacky) this is aim to get the DEWT for manual testing
    // console.log(dewt);
    expect(dewt.length).toBe(399);
  });
});
