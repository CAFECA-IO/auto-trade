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
  actionLog: any[] = [];

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
    // console.log("🚀 ~ Environment ~ step ~ currentPrice:", this.currentPrice)
    this.spreadFee = 0.005 * this.currentPrice;
    if (action === 3) {
      if (this.holdingStatus === 0) {
        reward = -40;
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
        this.openPrice = JSON.parse(JSON.stringify(this.currentPrice));
        this.holdingStatus = 1;
        reward = 20;
        if (this.openPrice < this.priceArray[this.current_step + 10]) {
          reward += 15;
        } else {
          reward += -15;
        }
      } else {
        reward = -20;
      }
    }
    if (action === 2) {
      if (this.holdingStatus === 0) {
        this.openPrice = JSON.parse(JSON.stringify(this.currentPrice));
        this.holdingStatus = 2;
        reward = 20;
        if (this.openPrice > this.priceArray[this.current_step + 10]) {
          reward += 15;
        } else {
          reward += -15;
        }
      } else {
        reward = -20;
      }
    }
    if (profit > 50) {
      console.log(
        'wcnb',
        this.current_step,
        profit,
        this.currentPrice,
        this.openPrice,
      );
    }
    if (profit < -50) {
      console.log(
        'wcnm',
        this.current_step,
        profit,
        this.currentPrice,
        this.openPrice,
      );
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
    this.actionLog.push(action);
    this.profitLog.push(profit);
    return {
      previousPrice: this.priceArray.slice(
        this.current_step - 48,
        this.current_step,
      ),
      currentPrice: this.currentPrice,
      openPrice: this.openPrice,
      spreadFee: this.spreadFee,
      holdingStatus: this.holdingStatus,
      reward: reward,
    };
  }
  getState() {
    return [
      this.priceArray.slice(this.current_step - 48, this.current_step),
      this.currentPrice,
      this.openPrice,
      this.spreadFee,
      this.holdingStatus,
    ];
  }
}
