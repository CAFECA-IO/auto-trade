export class myAsset {
  success: boolean;
  code: string;
  data: {
    currency: string;
    balance: { available: string; locked: string };
    pnl: {
      today: {
        amount: { type: string; value: string };
        percentage: { type: string; value: string };
      };
      monthly: {
        amount: { type: string; value: string };
        percentage: { type: string; value: string };
      };
      cumulative: {
        amount: { type: string; value: string };
        percentage: { type: string; value: string };
      };
    };
    interest: { apy: string; monthly: string; cumulative: string };
  };
}
