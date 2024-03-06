import { Injectable } from '@nestjs/common';
import { CreateDepositDto } from './dto/createDeposit.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Deposit } from './entities/deposit.entity';
import { CFDOrder } from './entities/CFDOrder.entity';
import CFDOrderCreate from '../common/constants/contracts/cfd_create';
import { SignTypedDataVersion, signTypedData } from '@metamask/eth-sig-util';
import { CreateCFDOrderDTO } from './dto/createCFDOrder.dto';
import { QuotationDto } from '../price_ticker/dto/quotation.dto';
import { SafeMath } from '../common/safe_math';
import { getTimestamp } from '../common/common';
import { CloseCFDOrderDto } from './dto/closeCFD.dto';
import CFDOrderClose from '../common/constants/contracts/cfd_close';

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
    createCFDDto.instId = quotation.data.instId;
    createCFDDto.quotation = quotation.data;
    createCFDDto.typeOfPosition = quotation.data.typeOfPosition;
    createCFDDto.price = quotation.data.price;
    createCFDDto.targetAsset = quotation.data.targetAsset;
    createCFDDto.unitAsset = quotation.data.unitAsset;
    createCFDDto.margin.asset = 'USDT'; // fixed
    if (quotation.data.typeOfPosition === 'BUY') {
      createCFDDto.margin.amount =
        (quotation.data.price + quotation.data.spreadFee) / amount;
    } else {
      createCFDDto.margin.amount =
        (quotation.data.price + quotation.data.spreadFee) / amount;
    }
    createCFDDto.leverage = 5;
    createCFDDto.liquidationPrice = quotation.data.price;
    createCFDDto.liquidationTime = getTimestamp() + 86400;
    createCFDDto.createTimestamp = getTimestamp();
    createCFDDto.fee = 0;
    createCFDDto.guaranteedStop = false;
    typeData.message = createCFDDto;
    for (const prop in createCFDDto) {
      if (typeof createCFDDto[prop] === 'number') {
        typeData.message[prop] = SafeMath.toSmallestUnit(
          createCFDDto[prop],
          10,
        );
      }
    }
    const eip712signature = signTypedData({
      privateKey: Buffer.from(privatekey, 'hex'),
      data: typeData as any,
      version: SignTypedDataVersion.V4,
    });
    console.log(eip712signature);
    // const { data } = await firstValueFrom(
    //   this.httpService.post<any>(
    //     'https://api.tidebit-defi.com/api/v1/users/cfds/create',
    //     { applyData: createCFDDto, userSignature: eip712signature },
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Dewt: dewt,
    //       },
    //     },
    //   ),
    // );
    // console.log(data);
    // return data;
    return eip712signature;
  }
  async closeCFDOrder(
    dewt: string,
    privatekey: string,
    // quotation: QuotationDto,
    // referenceId: string,
  ): Promise<any> {
    const closeCFDOrderDto = new CloseCFDOrderDto();
    const typeData = CFDOrderClose;
    // closeCFDOrderDto.referenceId = referenceId;
    // closeCFDOrderDto.quotation = quotation.data;
    // closeCFDOrderDto.closePrice = quotation.data.price;
    // closeCFDOrderDto.closedType = 'BY_USER';
    // closeCFDOrderDto.closeTimestamp = getTimestamp();
    // typeData.message = closeCFDOrderDto;
    for (const prop in closeCFDOrderDto) {
      if (typeof closeCFDOrderDto[prop] === 'number') {
        typeData.message[prop] = SafeMath.toSmallestUnit(
          closeCFDOrderDto[prop],
          10,
        );
      }
    }
    const eip712signature = signTypedData({
      privateKey: Buffer.from(privatekey, 'hex'),
      data: typeData as any,
      version: SignTypedDataVersion.V4,
    });
    console.log(eip712signature);
    return eip712signature;
  }
}
