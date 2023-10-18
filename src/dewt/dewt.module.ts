import { Module } from '@nestjs/common';
import { DewtService } from './dewt.service';
import { DewtController } from './dewt.controller';

@Module({
  controllers: [DewtController],
  providers: [DewtService],
})
export class DewtModule {}
