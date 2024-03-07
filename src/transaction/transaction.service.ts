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
    createCFDDto.instId = quotation.data.instId;
    createCFDDto.quotation = quotation.data;
    createCFDDto.typeOfPosition = quotation.data.typeOfPosition;
    createCFDDto.price = quotation.data.price + quotation.data.spreadFee;
    createCFDDto.amount = amount;
    createCFDDto.targetAsset = quotation.data.targetAsset;
    createCFDDto.unitAsset = quotation.data.unitAsset;
    const marginDTO = new MarginDto();
    marginDTO.asset = 'USDT';
    if (quotation.data.typeOfPosition === 'BUY') {
      marginDTO.amount =
        (quotation.data.price + quotation.data.spreadFee) / amount;
    } else {
      marginDTO.amount =
        (quotation.data.price + quotation.data.spreadFee) / amount;
    }
    console.log(marginDTO.amount); // bug
    createCFDDto.margin = marginDTO;
    console.log(createCFDDto.margin);
    console.log(createCFDDto.margin.amount);
    console.log(createCFDDto.margin['amount']);
    createCFDDto.leverage = 5;
    createCFDDto.liquidationPrice = quotation.data.price;
    createCFDDto.liquidationTime = getTimestamp() + 86400;
    createCFDDto.createTimestamp = getTimestamp();
    createCFDDto.fee = 0;
    createCFDDto.guaranteedStop = false;
    typeData.message = createCFDDto;
    typeData.message.quotation.price = SafeMath.toSmallestUnit(
      createCFDDto.price,
      10,
    );
    typeData.message.quotation.spotPrice = SafeMath.toSmallestUnit(
      quotation.data.spotPrice,
      10,
    );
    typeData.message.quotation.spreadFee = Math.abs(
      SafeMath.toSmallestUnit(quotation.data.spreadFee, 10),
    );
    typeData.message.price = SafeMath.toSmallestUnit(createCFDDto.price, 10);
    typeData.message.amount = SafeMath.toSmallestUnit(createCFDDto.amount, 10);
    typeData.message.leverage = SafeMath.toSmallestUnit(
      createCFDDto.leverage,
      10,
    );
    typeData.message.liquidationPrice = SafeMath.toSmallestUnit(
      createCFDDto.liquidationPrice,
      10,
    );
    typeData.message.margin.amount = Math.abs(
      SafeMath.toSmallestUnit(createCFDDto.margin['amount'], 10),
    );
    console.log(typeData.message.margin.amount);
    console.log(typeData.message);
    // const eip712signature = signTypedData({
    //   privateKey: Buffer.from(privatekey, 'hex'),
    //   data: typeData as any,
    //   version: SignTypedDataVersion.V4,
    // });
    // console.log(eip712signature);
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
    // return data;
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
