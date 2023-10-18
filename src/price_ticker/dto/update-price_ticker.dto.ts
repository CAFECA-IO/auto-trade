import { PartialType } from '@nestjs/mapped-types';
import { CreatePriceTickerDto } from './create-price_ticker.dto';

export class UpdatePriceTickerDto extends PartialType(CreatePriceTickerDto) {}
