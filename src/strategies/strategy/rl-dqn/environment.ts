export class Environment {
  current_step: number;
  initial_balance: number;
  balance: number;
  action_space: any;
  done: boolean;
  spreadFee: number;
  holdingStatus: number;
  priceArray: number[];
  openPrice: number;
  currentPrice: number;
  profitLog: number[];
  actionLog: any[];
  rewardLog: any[];

  constructor(priceArray) {
    this.current_step = 48;
    this.initial_balance = 10000;
    this.spreadFee = 30;
    this.balance = this.initial_balance;
    this.priceArray = priceArray;
    this.action_space = [0, 1, 2, 3]; // WAIT, BUY, SELL, CLOSE
    this.done = false;
    this.holdingStatus = 0;
    this.profitLog = [];
    this.actionLog = [];
    this.rewardLog = [];
  }

  reset() {
    this.current_step = 48;
    this.initial_balance = 10000;
    // this.spreadFee = 30;
    this.balance = this.initial_balance;
    this.done = false;
    this.holdingStatus = 0;
    this.profitLog = [];
    return this;
  }

  // return {
  //   currentPrice: currentPrice,
  //   openPrice: this.openPrice,
  //   spreadFee: spreadFee,
  //   profit: profit,
  //   holdingStatus: 'WAIT',
  // };
  step(action: any) {
    let profit = 0;
    let reward = 0;
    this.currentPrice = this.priceArray[this.current_step];
    this.spreadFee = 0.005 * this.currentPrice;
    if (action === 3) {
      if (this.holdingStatus === 0) {
        reward = -35;
      }
      if (this.holdingStatus === 1) {
        profit = this.currentPrice - this.spreadFee - this.openPrice;
        reward = profit;
        reward += 10;
        this.holdingStatus = 0;
      }
      if (this.holdingStatus === 2) {
        profit = this.openPrice - (this.currentPrice + this.spreadFee);
        reward = profit;
        reward += 10;
        this.holdingStatus = 0;
      }
    }
    if (action === 1) {
      if (this.holdingStatus === 0) {
        const currentPriceStr = JSON.stringify(this.currentPrice);
        this.openPrice = JSON.parse(currentPriceStr);
        this.holdingStatus = 1;
        reward = 25;
        if (this.openPrice < this.priceArray[this.current_step + 10]) {
          reward += 24;
        } else {
          reward += -14;
        }
      } else {
        reward = -35;
      }
    }
    if (action === 2) {
      if (this.holdingStatus === 0) {
        const currentPriceStr = JSON.stringify(this.currentPrice);
        this.openPrice = JSON.parse(currentPriceStr);
        this.holdingStatus = 2;
        reward = 25;
        if (this.openPrice > this.priceArray[this.current_step + 10]) {
          reward += 20;
        } else {
          reward += -20;
        }
      } else {
        reward = -35;
      }
    }
    this.current_step += 1;
    if (this.current_step >= this.priceArray.length) {
      this.done = true;
    }
    if (action === 0) {
      if (this.actionLog.slice(-24).every((a) => a === 0)) {
        reward = -30;
      }
    }
    return {
      previousPrice: this.priceArray.slice(-100),
      currentPrice: this.currentPrice,
      openPrice: this.openPrice,
      spreadFee: this.spreadFee,
      holdingStatus: this.holdingStatus,
      reward: reward,
    };
  }
  getState() {
    return [
      this.priceArray.slice(-100),
      this.currentPrice,
      this.openPrice,
      this.spreadFee,
      this.holdingStatus,
    ];
  }
}
