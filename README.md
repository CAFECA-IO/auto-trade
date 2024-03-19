## auto-trade

auto is an open source project that aims to provide a simple and easy to use trading bot for the TideBit . The bot is written in TypeScript and uses the NestJS framework.

## Description

auto trade is a simple trading bot that uses the TideBit API to trade on the exchange. The bot is written in TypeScript and uses the NestJS framework. The bot is designed to be simple and easy to use, and is intended to be used by people who are new to trading and want to apply different trading strategies.

## Installation

1. Clone this repository:

```bash
git clone https://github.com/CAFECA-IO/auto-trade/tree/develop
```

```bash
cd auto-trade
```

2. Install dependencies:

```bash
npm install
```

3. Copy the example `.env` file in your root directory and fill in the required information:

```json
SUGGESTION = 'autoArima';
TRADE_STRATEGY = 'autoArima';
STOP_LOSS = 'autoArima';
TAKE_PROFIT = 'autoArima';
PRIVATE_KEY = 'YOUR_PRIVATE_KEY';// Your could create tradebot by your own Wallet private key
```

## Change strategy

Create your own strategy in the `src/strategies/strategy` directory and modify `.env` file. You can use the `autoArima` strategy as an example.

```typescript
import * as ARIMA from 'arima';

export function suggestion(data: {
  priceArray: number[];
  spreadFee: number;
}) {
  let suggestion = 'WAIT';
  const arima = new ARIMA('auto');
  arima.train(data.priceArray);
  const AbsspreadFee = Math.abs(data.spreadFee);
  const arimaPredict = arima.predict(15);
  const predict: number[] = arimaPredict[0];
  const predictMax = Math.max(...predict);
  const predictMin = Math.min(...predict);
  const predictProfit = AbsspreadFee * 2.5;
  const currentPrice = data.priceArray[data.priceArray.length - 1];
  if (predictMax - currentPrice > predictProfit) {
    suggestion = 'BUY';
    return suggestion;
  }
  if (currentPrice - predictMin > predictProfit) {
    suggestion = 'SELL';
    return suggestion;
  }
  return suggestion;
}

export function tradeStrategy(data: {
  suggestion: string;
  holdingStatus: string;
}) {
  if (data.holdingStatus === 'WAIT') {
    return data.suggestion;
  }
  if (data.holdingStatus === 'BUY') {
    if (data.suggestion === 'SELL') {
      return 'CLOSE';
    }
  }
  if (data.holdingStatus === 'SELL') {
    if (data.suggestion === 'BUY') {
      return 'CLOSE';
    }
  }
  return 'WAIT';
}
export function takeProfit(data: {
  openPrice: number;
  currentPrice: number;
  spreadFee: number;
  holdingStatus: string;
}) {
  const AbsOpenSpreadFee = Math.abs(data.spreadFee);
  const openPrice = data.openPrice;
  const currentPrice = data.currentPrice;
  const takeProfit = AbsOpenSpreadFee * 2.2;
  const holdingStatus = data.holdingStatus;
  if (holdingStatus === 'BUY') {
    if (currentPrice - openPrice > takeProfit) {
      return 'CLOSE';
    }
  }
  if (holdingStatus === 'SELL') {
    if (openPrice - currentPrice < takeProfit) {
      return 'CLOSE';
    }
  }
  return 'WAIT';
}
export function stopLoss(data: {
  openPrice: number;
  currentPrice: number;
  spreadFee: number;
  holdingStatus: string;
}) {
  const AbsOpenSpreadFee = Math.abs(data.spreadFee);
  const openPrice = data.openPrice;
  const currentPrice = data.currentPrice;
  const stopLoss = AbsOpenSpreadFee * 1.5;
  const holdingStatus = data.holdingStatus;
  if (holdingStatus === 'BUY') {
    if (openPrice - currentPrice > stopLoss) {
      return 'CLOSE';
    }
  }
  if (holdingStatus === 'SELL') {
    if (currentPrice - openPrice > stopLoss) {
      return 'CLOSE';
    }
  }
  return 'WAIT';
}
```

[!WARNING]
The strategy must have the same functions and parameters as the example above. and it' free to combine the strategy as long as it's in the same format.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API usage

### Create Tradebot

#### Request URL

```typescript
POST /tradebot
```

### Get All Tradebot

#### Request URL

```typescript
GET /tradebot
```

### Get Tradebot by ID

#### Request URL

```typescript
GET /tradebot
```

Parameters
| name      | type    | required | default |
| --------  | ------- | -------- | ------- |
| id  | string(UUID) | true | null |

#### Request Example

```typescript

PUT /tradebot?id=tradebotId

```

### Update Tradebot

Request URL

```typescript
PUT /tradebot
```

Parameters
| name      | type    | required | default |
| --------  | ------- | -------- | ------- |
| id  | string(UUID) | true | null |

### body

| name      | type    | required | default |
| --------  | ------- | -------- | ------- |
| deposit   | string  | false    | null    |
| suggestion   | string  | false    | null    |
| tradeStrategy   | string  | false    | null    |
| stopLoss   | string  | false    | null    |
| takeProfit   | string  | false    | null    |

### Request Example

```typescript

PUT /tradebot?id=tradebotId


```

```json
"body": {
  "deposit": "deposit",
  "suggestion": "string",
  "tradeStrategy": "string",
  "stopLoss": "string",
  "takeProfit": "string",
}
```

### Command Tradebot

Request URL

```typescript
POST /tradebot/tradebotId
```

### body

| name      | type    | required | default |description |
| --------  | ------- | -------- | ------- | ----- |
| command   | string  | true    | null    | "run" or "stop"


### Request Example

```typescript

POST /tradebot/tradebotId


```

```json
"body": {
  "command": "run",
}
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
