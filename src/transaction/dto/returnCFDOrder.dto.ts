export class ReturnCFDOrderDto {
  success: boolean;
  code: string;
  data: {
    txhash: string;
    balanceSnapshot: object[];
    orderSnapshot: {
      orderType: string;
      id: string;
      txhash: string;
      orderStatus: string;
      state: string;
      instId: string;
      userAddress: string;
      targetAsset: string;
      unitAsset: string;
      margin: object;
      openPrice: string;
      openSpotPrice: string;
      openSpreadFee: string;
      amount: number;
      fee: number;
      outerFee: string;
      typeOfPosition: string;
      leverage: number;
      guaranteedStop: boolean;
      liquidationPrice: number;
      liquidationTime: number;
      share: boolean;
      updatedTimestamp: number;
      createTimestamp: number;
      pnl: object;
    };
  };
}
