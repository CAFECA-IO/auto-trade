import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { myAsset } from './entities/myAsset.entity';
import { HistoryList } from './entities/history.entity';
import { HDNodeWallet, ethers } from 'ethers';
import CFDOrderCreate from '../common/constants/contracts/cfd_create';

@Injectable()
export class UserService {
  private readonly TBDBackendUrl: string;
  constructor(private readonly httpService: HttpService) {
    this.TBDBackendUrl = 'https://api.tidebit-defi.com/api/v1/';
  }
  async getMyAsset(dewt: string): Promise<myAsset> {
    const { data } = await firstValueFrom(
      this.httpService.get<myAsset>(this.TBDBackendUrl + 'users/assets', {
        headers: {
          'Content-Type': 'application/json',
          Dewt: dewt,
        },
      }),
    );
    return data;
  }
  async listHistories(dewt: string, limit: string = '3'): Promise<HistoryList> {
    const { data } = await firstValueFrom(
      this.httpService.get<HistoryList>(
        this.TBDBackendUrl + 'bolt-transactions/history?limit=' + limit,
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
  createWallet(): HDNodeWallet {
    const randomWallet = ethers.Wallet.createRandom();
    return randomWallet;
  }

  connectWallet(privateKey: string) {
    const realWallet = new ethers.Wallet(privateKey);
    return realWallet;
  }
  sendToken(){}
  receiveToken(){}
}
