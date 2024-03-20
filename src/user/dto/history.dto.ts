export class HistoryList {
  success: boolean;
  code: string;
  data: History[];
}
class History {
  id: string;
  userAddress: string;
  orderType: string;
  sequence: number;
  txhash: string;
  applyData: {
    orderType: string;
    blockchain: string;
    txhash: string;
    targetAsset: string;
    targetAmount: string;
    createdAt: number;
    fee: number;
  };
  receipt: {
    txhash: string;
    sequence: number;
    balanceSnapshot: [
      {
        id: string;
        userAddress: string;
        currency: string;
        available: string;
        locked: string;
        blockNumber: number;
        createdAt: number;
        updatedAt: number;
      },
    ];
    orderSnapshot: {
      id: string;
      userAddress: string;
      orderType: string;
      orderStatus: string;
      fee: string;
      createTimestamp: number;
      updatedTimestamp: number;
      txhash: string;
      targetAsset: string;
      targetAmount: string;
      ethereumTxHash: string;
    };
  };
  userSignature: string;
  droneSignature: string;
  locutusSignature: string;
  createTimestamp: number;
  updateTimestamp: number;
}
