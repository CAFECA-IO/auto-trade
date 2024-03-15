import { Controller, Post, Body } from '@nestjs/common';
import { DewtService } from './dewt.service';

@Controller('dewt')
export class DewtController {
  constructor(private readonly dewtService: DewtService) {}

  @Post()
  create(@Body() data: { address: string; privateKey: string }) {
    const dewt = this.dewtService.create(data.address, data.privateKey);
    return dewt;
  }
}
