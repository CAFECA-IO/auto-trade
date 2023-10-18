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
    createDewtDto.address = '0xE0Afd681eE959Ddd198eAb61A1Ced30774c24501';
    createDewtDto.privatekey =
      '8cf1ee97f9fd106503017e215825dd6966aa81784f42c308b216be6167109562';
    const dewt = service.create(createDewtDto);
    console.log(dewt);
  });
});
