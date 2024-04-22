import * as tf from '@tensorflow/tfjs-node';
import { TradeAgent } from './tradeAgent';
import { copyWeights } from './dqn';

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
  batchSize = 48,
  gamma = 0.99,
  learningRate = 1e-3,
  savePath = '/models',
) {
  for (let i = 0; i < agent.replayBufferSize; ++i) {
    agent.playStep();
  }
  // Moving averager: cumulative reward across 100 most recent 100 episodes.
  const rewardAverager100 = new MovingAverager(100);
  // Moving averager: fruits eaten across 100 most recent 100 episodes.

  const optimizer = tf.train.adam(learningRate);
  let averageReward100Best = -Infinity;
  let syncCount = 0;
  while (true) {
    agent.trainOnReplayBatch(batchSize, gamma, optimizer);
    const { cumulativeReward, done } = agent.playStep();
    if (done) {
      rewardAverager100.append(cumulativeReward);
      const averageReward100 = rewardAverager100.average();
      if (averageReward100 > averageReward100Best) {
        averageReward100Best = averageReward100;
        // if (savePath != null) {
        //   await agent.onlineNetwork.save(
        //     'file://src/strategies/strategy/rl-dqn/models/dqn',
        //   );
        // }
      }
      syncCount++;
      return agent.cumulativeReward_;
    }
    if (syncCount === 300) {
      syncCount = 0;
      copyWeights(agent.targetNetwork, agent.onlineNetwork);
    }
  }
}
