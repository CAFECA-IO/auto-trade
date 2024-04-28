export class CreateDepositDto {
  blockchain: string;
  txhash: string;
  targetAsset: string;
  targetAmount: number;
  fee?: number;
  remark?: string;
}
