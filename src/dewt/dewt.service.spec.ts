import { Test, TestingModule } from '@nestjs/testing';
import { DewtService } from './dewt.service';
import { CreateDewtDto } from './dto/create-dewt.dto';
import { randomHex } from '../lib/common';

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
    const createDewtDto = new CreateDewtDto();
    createDewtDto.address = '0x62CA3acE6EE83aa87fCAF11c20E72C7175DAA164';
    createDewtDto.privatekey =
      '54405e07a12ece2ff6abcf56b955343b671ba2913bae5474433ee03aa5b912d9';
    const dewt = service.create(createDewtDto);
    console.log(dewt);
  });
});
