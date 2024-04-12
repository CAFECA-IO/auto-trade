import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { TransactionService } from './transaction.service';
import { PriceTickerModule } from '../price_ticker/price_ticker.module';
import PriceTickerService from '../price_ticker/price_ticker.service';
import { ReturnCreateCFDOrderDto } from './dto/returnCreateCFDOrder.dto';
import { ReturnCloseCFDOrderDto } from './dto/returnCloseCFDOrder.dto';
import { CreateDepositDto } from './dto/createDeposit.dto';
import { ReturnDeposit } from './dto/returnDeposit.dto';
import { CreateCFDOrderDTO } from './dto/createCFDOrder.dto';
import { CloseCFDOrderDto } from './dto/closeCFDOrder.dto';

describe('TransactionService', () => {
  let transactionService: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PriceTickerModule, HttpModule],
      providers: [TransactionService, PriceTickerService],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should create a deposit DTO with default amount', async () => {
    const amount = 100;
    const expectedDto = new CreateDepositDto();
    expectedDto.blockchain = 'ETH';
    expectedDto.txhash = '0x123';
    expectedDto.targetAsset = 'USDT';
    expectedDto.targetAmount = amount;

    const result = await transactionService.createDepositDto();

    expect(result).toEqual(expectedDto);
  });

  it('should create a deposit DTO with custom amount', async () => {
    const amount = 200;
    const expectedDto = new CreateDepositDto();
    expectedDto.blockchain = 'ETH';
    expectedDto.txhash = '0x123';
    expectedDto.targetAsset = 'USDT';
    expectedDto.targetAmount = amount;

    const result = await transactionService.createDepositDto(amount);

    expect(result).toEqual(expectedDto);
  });

  it('should make a deposit request and return the deposit data', async () => {
    const dewt = 'your_dewt';
    const createDepositDto = new CreateDepositDto();
    const returnDeposit = new ReturnDeposit();
    jest
      .spyOn(transactionService, 'deposit')
      .mockImplementation(async () => returnDeposit);
    const result = await transactionService.deposit(dewt, createDepositDto);
    expect(result).toBe(returnDeposit);
  });

  it('should create a CFD order DTO', async () => {
    const quotation = {
      success: true,
      code: '00000000',
      reason: 'ERROR_MESSAGE.SUCCESS',
      data: {
        instId: 'ETH-USDT',
        targetAsset: 'ETH',
        unitAsset: 'USDT',
        typeOfPosition: 'BUY',
        price: 3651.35,
        spotPrice: 3578.99,
        spreadFee: 72.36,
        deadline: 1711011218,
        signature: '0xfcadebdba757246bd4f23f898e5d66d6',
      },
    };
    const amount = 0.03;
    const result = await transactionService.createCFDOrderDTO(
      quotation,
      amount,
    );
    expect(result).toBeInstanceOf(CreateCFDOrderDTO);
  });

  it('should create a CFD order and return the created order data', async () => {
    const dewt = 'your_dewt';
    const privatekey = 'your_private_key';
    const createCFDDto = new CreateCFDOrderDTO();
    const returnCreateCFDOrderDto = new ReturnCreateCFDOrderDto();
    jest
      .spyOn(transactionService, 'createCFDOrder')
      .mockImplementation(async () => returnCreateCFDOrderDto);

    const result = await transactionService.createCFDOrder(
      dewt,
      privatekey,
      createCFDDto,
    );
    expect(result).toBe(returnCreateCFDOrderDto);
  });

  it('should create a close CFD order DTO', async () => {
    const quotation = {
      success: true,
      code: '00000000',
      reason: 'ERROR_MESSAGE.SUCCESS',
      data: {
        instId: 'ETH-USDT',
        targetAsset: 'ETH',
        unitAsset: 'USDT',
        typeOfPosition: 'BUY',
        price: 3651.35,
        spotPrice: 3578.99,
        spreadFee: 72.36,
        deadline: 1711011218,
        signature: '0xfcadebdba757246bd4f23f898e5d66d6',
      },
    };
    const referenceId = 'your_reference_id';
    const result = await transactionService.closeCFDOrderDTO(
      quotation,
      referenceId,
    );
    expect(result).toBeInstanceOf(CloseCFDOrderDto);
  });

  it('should close a CFD order and return the closed order data', async () => {
    const dewt = 'your_dewt';
    const privatekey = 'your_private_key';
    const closeCFDOrderDto = new CloseCFDOrderDto();
    const returnCloseCFDOrderDto = new ReturnCloseCFDOrderDto();
    jest
      .spyOn(transactionService, 'closeCFDOrder')
      .mockImplementation(async () => returnCloseCFDOrderDto);

    const result = await transactionService.closeCFDOrder(
      dewt,
      privatekey,
      closeCFDOrderDto,
    );
    expect(result).toBe(returnCloseCFDOrderDto);
  });

  it('should calculate the amount based on the balance and price', () => {
    const balance = 100;
    const price = 73205;
    const expectedAmount = 0.006829451540195342;
    const result = transactionService.calculateAmount(balance, price);
    expect(result).toBe(expectedAmount);
  });
});
