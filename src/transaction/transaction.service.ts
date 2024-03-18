import { Injectable } from '@nestjs/common';
import { CreateDepositDto } from './dto/createDeposit.dto';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ReturnDeposit } from './dto/returnDeposit.dto';
import CFDOrderCreate from '../common/constants/contracts/cfd_create';
import { SignTypedDataVersion, signTypedData } from '@metamask/eth-sig-util';
import { CreateCFDOrderDTO } from './dto/createCFDOrder.dto';
import { QuotationDto } from '../price_ticker/dto/quotation.dto';
import { SafeMath } from '../common/safe_math';
import { getTimestamp } from '../common/common';
import { CloseCFDOrderDto } from './dto/closeCFDOrder.dto';
import CFDOrderClose from '../common/constants/contracts/cfd_close';
import { MarginDto } from './dto/margin.dto';
import { ReturnCloseCFDOrderDto } from './dto/returnCloseCFDOrder.dto';
import { ReturnCreateCFDOrderDto } from './dto/returnCreateCFDOrder.dto';
import { DOMAIN_BACKEND } from '../common/constants/config';

@Injectable()
export class TransactionService {
  constructor(private readonly httpService: HttpService) {}

  async deposit(dewt: string, amount: number = 100): Promise<ReturnDeposit> {
    const createDepositDto = new CreateDepositDto();
    createDepositDto.blockchain = 'ETH';
    createDepositDto.txhash = '0x123';
    createDepositDto.targetAsset = 'USDT';
    createDepositDto.targetAmount = amount;
    const { data } = await firstValueFrom(
      this.httpService.post<ReturnDeposit>(
        DOMAIN_BACKEND + '/users/deposit',
        createDepositDto,
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

  async createCFDOrder(
    dewt: string,
    privatekey: string,
    quotation: QuotationDto,
    amount: number,
  ): Promise<ReturnCreateCFDOrderDto> {
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
    // Info: (20240315 - Jacky) this is aim to copy the object without any references
    typeData.message = JSON.parse(JSON.stringify(createCFDDto));
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
      this.httpService.post<ReturnCreateCFDOrderDto>(
        DOMAIN_BACKEND + '/users/cfds/create',
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
  ): Promise<ReturnCloseCFDOrderDto> {
    const closeCFDOrderDto = new CloseCFDOrderDto();
    const typeData = CFDOrderClose;
    closeCFDOrderDto.operation = 'CLOSE';
    closeCFDOrderDto.orderType = 'CFD';
    closeCFDOrderDto.referenceId = referenceId;
    closeCFDOrderDto.quotation = quotation.data;
    closeCFDOrderDto.closePrice = quotation.data.price;
    closeCFDOrderDto.closedType = 'BY_USER';
    closeCFDOrderDto.closeTimestamp = getTimestamp();
    // Info: (20240315 - Jacky) this is aim to copy the object without any references
    typeData.message = JSON.parse(JSON.stringify(closeCFDOrderDto));
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
      this.httpService.put<ReturnCloseCFDOrderDto>(
        DOMAIN_BACKEND + '/users/cfds/close',
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
  calculateAmount(balance: number, price: number): number {
    const nearest = (balance / (price / 5)).toFixed(4);
    return Number(nearest);
  }
}
