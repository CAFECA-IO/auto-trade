import { QuotationDto } from '../../price_ticker/dto/quotation.dto';

export class CloseCFDOrderDto {
  operation: string; //CLOSE
  orderType: string; // CFD
  referenceId: string;
  quotation: QuotationDto['data'];
  closePrice: number;
  closedType: string; //'BY_USER'
  closeTimestamp: number; // Deprecate: [after migrationBoltTransactionRecord] (20230915 - tzuhan)
  forcedClose?: boolean;
  liquidationFee?: string;
}
