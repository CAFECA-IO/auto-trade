import { PartialType } from '@nestjs/mapped-types';
import { CreateDewtDto } from './create-dewt.dto';

export class UpdateDewtDto extends PartialType(CreateDewtDto) {}
