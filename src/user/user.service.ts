import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { myAsset } from './entities/myAsset.entity';
import { HistoryList } from './entities/history.entity';

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
  async listCFDs(dewt: string): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get<any>(this.TBDBackendUrl + 'cfds', {
        headers: {
          'Content-Type': 'application/json',
          Dewt: dewt,
        },
      }),
    );
    return data;
  }
  async listBalances(dewt: string): Promise<any> {}
  async getPNL(dewt: string): Promise<any> {}
}
