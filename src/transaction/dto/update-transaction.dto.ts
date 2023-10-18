import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './deposit.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
