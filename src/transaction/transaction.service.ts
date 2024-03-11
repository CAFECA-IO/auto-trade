import { Injectable } from '@nestjs/common';
import { CreateDepositDto } from './dto/createDeposit.dto';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Deposit } from './entities/deposit.entity';
import { CFDOrder } from './entities/CFDOrder.entity';
import CFDOrderCreate from '../common/constants/contracts/cfd_create';
import { SignTypedDataVersion, signTypedData } from '@metamask/eth-sig-util';
import { CreateCFDOrderDTO } from './dto/createCFDOrder.dto';
import { QuotationDto } from '../price_ticker/dto/quotation.dto';
import { SafeMath } from '../common/safe_math';
import { getTimestamp } from '../common/common';
import { CloseCFDOrderDto } from './dto/closeCFDOrder.dto';
import CFDOrderClose from '../common/constants/contracts/cfd_close';
import { MarginDto } from './dto/margin.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly httpService: HttpService) {}

  async deposit(
    dewt: string,
    createDepositDto: CreateDepositDto,
  ): Promise<Deposit> {
    const { data } = await firstValueFrom(
      this.httpService.post<Deposit>(
        'https://api.tidebit-defi.com/api/v1/users/deposit',
        createDepositDto,
        {
          headers: {
            'Content-Type': 'application/json',
            Dewt: dewt,
          },
        },
      ),
    );
    console.log(data);
    return data;
  }
  async getCFDTrade(dewt: string, id: string): Promise<any> {}
  async createCFDOrder(
    dewt: string,
    privatekey: string,
    quotation: QuotationDto,
    amount: number,
  ): Promise<any> {
    const createCFDDto = new CreateCFDOrderDTO();
    const typeData = CFDOrderCreate;
    createCFDDto.operation = 'CREATE';
    createCFDDto.orderType = 'CFD';
    createCFDDto.instId = quotation.data.instId;
    createCFDDto.quotation = quotation.data;
    createCFDDto.typeOfPosition = quotation.data.typeOfPosition;
    createCFDDto.price = quotation.data.price;
    createCFDDto.amount = amount;
    createCFDDto.targetAsset = quotation.data.targetAsset;
    createCFDDto.unitAsset = quotation.data.unitAsset;
    const marginDTO = new MarginDto();
    marginDTO.asset = 'USDT';
    createCFDDto.leverage = 5;
    if (quotation.data.typeOfPosition === 'BUY') {
      marginDTO.amount = (createCFDDto.price * amount) / createCFDDto.leverage;
      createCFDDto.liquidationPrice =
        quotation.data.price * (1 - 1 / createCFDDto.leverage);
    } else {
      marginDTO.amount = (createCFDDto.price * amount) / createCFDDto.leverage;
      createCFDDto.liquidationPrice =
        quotation.data.price * (1 + 1 / createCFDDto.leverage);
    }
    createCFDDto.margin = marginDTO;
    createCFDDto.liquidationTime = getTimestamp() + 86400;
    createCFDDto.createTimestamp = getTimestamp();
    createCFDDto.fee = 0;
    createCFDDto.guaranteedStop = false;
    const typeDataTemp = JSON.stringify(createCFDDto);
    typeData.message = JSON.parse(typeDataTemp);
    typeData.message.quotation.price = SafeMath.toSmallestUnit(
      typeData.message.quotation.price,
      10,
    );
    typeData.message.quotation.spotPrice = SafeMath.toSmallestUnit(
      typeData.message.quotation.spotPrice,
      10,
    );
    typeData.message.quotation.spreadFee = Math.abs(
      SafeMath.toSmallestUnit(typeData.message.quotation.spreadFee, 10),
    );
    typeData.message.price = SafeMath.toSmallestUnit(
      typeData.message.price,
      10,
    );
    typeData.message.amount = SafeMath.toSmallestUnit(
      typeData.message.amount,
      10,
    );
    typeData.message.leverage = SafeMath.toSmallestUnit(
      typeData.message.leverage,
      10,
    );
    typeData.message.liquidationPrice = SafeMath.toSmallestUnit(
      typeData.message.liquidationPrice,
      10,
    );
    typeData.message.margin.amount = Math.abs(
      SafeMath.toSmallestUnit(typeData.message.margin.amount, 10),
    );
    const eip712signature = signTypedData({
      privateKey: Buffer.from(privatekey, 'hex'),
      data: typeData as any,
      version: SignTypedDataVersion.V4,
    });
    const applyData = createCFDDto;
    const { data } = await lastValueFrom(
      this.httpService.post<any>(
        'https://api.tidebit-defi.com/api/v1/users/cfds/create',
        { applyData: applyData, userSignature: eip712signature },
        {
          headers: {
            'Content-Type': 'application/json',
            Dewt: dewt,
          },
        },
      ),
    );
    return data;
  }
  async closeCFDOrder(
    dewt: string,
    privatekey: string,
    quotation: QuotationDto,
    referenceId: string,
  ): Promise<any> {
    const closeCFDOrderDto = new CloseCFDOrderDto();
    const typeData = CFDOrderClose;
    closeCFDOrderDto.operation = 'CLOSE';
    closeCFDOrderDto.orderType = 'CFD';
    closeCFDOrderDto.referenceId = referenceId;
    closeCFDOrderDto.quotation = quotation.data;
    closeCFDOrderDto.closePrice = quotation.data.price;
    closeCFDOrderDto.closedType = 'BY_USER';
    closeCFDOrderDto.closeTimestamp = getTimestamp();
    const typeDataTemp = JSON.stringify(closeCFDOrderDto);
    typeData.message = JSON.parse(typeDataTemp);
    typeData.message.quotation.price = SafeMath.toSmallestUnit(
      quotation.data.price,
      10,
    );
    typeData.message.quotation.spotPrice = SafeMath.toSmallestUnit(
      quotation.data.spotPrice,
      10,
    );
    typeData.message.quotation.spreadFee = Math.abs(
      SafeMath.toSmallestUnit(quotation.data.spreadFee, 10),
    );
    typeData.message.closePrice = SafeMath.toSmallestUnit(
      closeCFDOrderDto.closePrice,
      10,
    );
    const eip712signature = signTypedData({
      privateKey: Buffer.from(privatekey, 'hex'),
      data: typeData as any,
      version: SignTypedDataVersion.V4,
    });
    const { data } = await lastValueFrom(
      //should be put
      this.httpService.put<any>(
        'https://api.tidebit-defi.com/api/v1/users/cfds/close',
        { applyData: closeCFDOrderDto, userSignature: eip712signature },
        {
          headers: {
            'Content-Type': 'application/json',
            Dewt: dewt,
          },
        },
      ),
    );
    return data;
  }
}
