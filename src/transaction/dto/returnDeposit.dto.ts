export class ReturnDeposit {
  success: boolean;
  code: string;
  reason: string;
  data: {
    id: string;
    userAddress: string;
    txhash: string;
    targetAsset: string;
    targetAmount: string;
    ethereumTxHash: string;
    orderType: string;
    orderStatus: string;
    createTimestamp: number;
    updatedTimestamp: number;
  };
}
