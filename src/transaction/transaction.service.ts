import { Injectable } from '@nestjs/common';
import { CreateDepositDto } from './dto/createDeposit.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PriceTicker } from '../price_ticker/entities/price_ticker.entity';
import { PriceTickerService } from '../price_ticker/price_ticker.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Deposit } from './entities/deposit.entity';
import { CFDOrder } from './entities/CFDOrder.entity';
import CFDOrderCreate from '../common/constants/contracts/cfd_create';
import { SignTypedDataVersion, signTypedData } from '@metamask/eth-sig-util';
import { CreateCFDOrderDTO } from './dto/createCFDOrder.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly priceTickerService: PriceTickerService,
    private readonly httpService: HttpService,
  ) {}

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
    createCFDDto: CreateCFDOrderDTO,
  ): Promise<any> {
    const typeData = CFDOrderCreate;
    typeData.message = createCFDDto;
    const eip712signature = signTypedData({
      privateKey: Buffer.from(privatekey, 'hex'),
      data: typeData,
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
  async closeCFDOrder(): Promise<any> {
    // should have return type
  }
}
