import { PartialType } from '@nestjs/mapped-types';
import { CreateTradebotDto } from './create-tradebot.dto';

export class UpdateTradebotDto extends PartialType(CreateTradebotDto) {}
