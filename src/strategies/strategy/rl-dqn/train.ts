import * as tf from '@tensorflow/tfjs-node';
import { TradeAgent } from './tradeAgent';

class MovingAverager {
  buffer: any[];
  constructor(bufferLength) {
    this.buffer = [];
    for (let i = 0; i < bufferLength; ++i) {
      this.buffer.push(null);
    }
  }

  append(x) {
    this.buffer.shift();
    this.buffer.push(x);
  }

  average() {
    return this.buffer.reduce((x, prev) => x + prev) / this.buffer.length;
  }
}

export async function train(
  agent: TradeAgent,
  batchSize = 32,
  gamma = 0.99,
  learningRate = 1e-3,
  savePath = '/models',
) {
  for (let i = 0; i < agent.replayBufferSize; ++i) {
    agent.playStep();
  }
  console.log(agent.cumulativeReward_);
  // Moving averager: cumulative reward across 100 most recent 100 episodes.
  const rewardAverager100 = new MovingAverager(100);
  // Moving averager: fruits eaten across 100 most recent 100 episodes.

  const optimizer = tf.train.adam(learningRate);
  let averageReward100Best = -Infinity;
  while (true) {
    agent.trainOnReplayBatch(batchSize, gamma, optimizer);
    const { action, cumulativeReward, done } = agent.playStep();
    // console.log("🚀 ~ action:", action)
    if (done) {
      rewardAverager100.append(cumulativeReward);
      const averageReward100 = rewardAverager100.average();

      console.log(cumulativeReward);
      console.log(JSON.stringify(agent.env.profitLog));
      console.log(
        JSON.stringify(
          agent.env.profitLog.reduce((sum, profit) => sum + profit, 0),
        ),
      );
      console.log(
        `cumulativeReward100=${averageReward100.toFixed(1)}; ` +
          `(epsilon=${agent.epsilon.toFixed(3)}) `,
      );
      if (averageReward100 > averageReward100Best) {
        averageReward100Best = averageReward100;
        if (savePath != null) {
          await agent.onlineNetwork.save(
            'file://src/strategies/strategy/rl-dqn/models/dqn',
          );
          console.log(`Saved DQN to ${savePath}`);
        }
      }
      return agent.cumulativeReward_;
    }
  }
}
