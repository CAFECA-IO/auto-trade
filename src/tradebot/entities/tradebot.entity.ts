import { randomUUID } from 'crypto';
import { HDNodeWallet, Wallet, ethers } from 'ethers';
import { myAsset } from '../../user/dto/myAsset.dto';
import * as dotenv from 'dotenv';

dotenv.config();
export class Tradebot {
  constructor() {
    this.id = randomUUID();
    this.created_at = new Date();
    this.updated_at = new Date();
    this.suggestion = process.env.SUGGESTION;
    this.tradeStrategy = process.env.TRADE_STRATEGY;
    this.stopLoss = process.env.STOP_LOSS;
    this.takeProfit = process.env.TAKE_PROFIT;
    this.holdingStatus = 'WAIT';
    this.isRunning = false;
    this.privateKey = process.env.PRIVATE_KEY;
    if (this.privateKey.length === 66 && this.privateKey.startsWith('0x')) {
      this.wallet = this.connectWallet(this.privateKey);
    } else {
      this.wallet = this.createWallet();
    }
  }
  id: string;
  created_at: Date;
  updated_at: Date;
  wallet: HDNodeWallet | Wallet;
  privateKey: string;
  dewt: string;
  suggestion: string;
  tradeStrategy: string;
  stopLoss: string;
  takeProfit: string;
  startAsset: myAsset;
  currentAsset: myAsset;
  holdingStatus: string;
  holdingInstId: string;
  positionId: string;
  openPrice: number;
  absSpreadFee: number;
  endAsset: myAsset;
  isRunning: boolean;
  timer?: NodeJS.Timeout;

  toJSON() {
    const { timer, ...tradebot } = this;
    timer[Symbol()] = 'timer';
    return tradebot;
  }
  createWallet(): HDNodeWallet {
    const randomWallet = ethers.Wallet.createRandom();
    return randomWallet;
  }

  connectWallet(privateKey: string) {
    const realWallet = new ethers.Wallet(privateKey);
    return realWallet;
  }
}
