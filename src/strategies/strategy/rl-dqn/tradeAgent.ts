/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as tf from '@tensorflow/tfjs-node';

import { createDeepQNetwork } from './dqn';
import { ReplayMemory } from './replay_memory';
import { Environment } from './environment';

export class TradeAgent {
  environment: any;
  epsilonInit: number;
  epsilonFinal: number;
  epsilonDecayFrames: number;
  epsilonIncrement_: number;
  onlineNetwork: tf.Sequential;
  targetNetwork: tf.Sequential;
  optimizer: tf.AdamOptimizer;
  replayBufferSize: number;
  replayMemory: ReplayMemory;
  cumulativeReward_: number;
  frameCount = 0;
  epsilon: any;
  NUM_ACTIONS: number;
  env: Environment;
  ALL_ACTIONS: number[] = [0, 1, 2, 3];
  /**
   * Constructor of SnakeGameAgent.
   *
   * @param {tradeEnv} environment A game object.
   * @param {object} config The configuration object with the following keys:
   *   - `replayBufferSize` {number} Size of the replay memory. Must be a
   *     positive integer.
   *   - `epsilonInit` {number} Initial value of epsilon (for the epsilon-
   *     greedy algorithm). Must be >= 0 and <= 1.
   *   - `epsilonFinal` {number} The final value of epsilon. Must be >= 0 and
   *     <= 1.
   *   - `epsilonDecayFrames` {number} The # of frames over which the value of
   *     `epsilon` decreases from `episloInit` to `epsilonFinal`, via a linear
   *     schedule.
   *   - `learningRate` {number} The learning rate to use during training.
   */
  constructor(environment) {
    this.NUM_ACTIONS = 4;
    this.env = environment;
    this.epsilonInit = 1;
    this.epsilonFinal = 0.1;
    this.epsilonDecayFrames = 1000;
    this.epsilonIncrement_ =
      (this.epsilonFinal - this.epsilonInit) / this.epsilonDecayFrames;

    this.onlineNetwork = createDeepQNetwork(this.NUM_ACTIONS);
    this.targetNetwork = createDeepQNetwork(this.NUM_ACTIONS);
    // Freeze taget network: it's weights are updated only through copying from
    // the online network.
    this.targetNetwork.trainable = false;

    this.optimizer = tf.train.adam(1e-2);

    this.replayBufferSize = 200;
    this.replayMemory = new ReplayMemory(200);
    this.reset();
  }

  reset() {
    this.cumulativeReward_ = 0;
    this.env.reset();
  }

  /**
   * Play one step of the game.
   *
   * @returns {number | null} If this step leads to the end of the game,
   *   the total reward from the game as a plain number. Else, `null`.
   */
  playStep() {
    this.epsilon =
      this.frameCount >= this.epsilonDecayFrames
        ? this.epsilonFinal
        : this.epsilonInit + this.epsilonIncrement_ * this.frameCount;
    this.frameCount++;

    // The epsilon-greedy algorithm.
    let action;
    const state = this.env.getState().flat();
    if (Math.random() < this.epsilon) {
      // Pick an action at random.
      const actionNum = Math.random();
      if (actionNum < 0.25) {
        action = 0;
      }
      if (actionNum >= 0.25 && actionNum < 0.5) {
        action = 1;
      }
      if (actionNum >= 0.5 && actionNum < 0.75) {
        action = 2;
      }
      if (actionNum >= 0.75) {
        action = 3;
      }
    } else {
      //   Greedily pick an action based on online DQN output.
      tf.tidy(() => {
        // const flatState = state.flat(); // Convert state array to a flat array
        const prediction = this.onlineNetwork.predict(
          tf.tensor1d(state).reshape([1, -1]),
        ) as tf.Tensor<tf.Rank>;
        const actionIndex = prediction.argMax(-1).dataSync()[0];
        action = this.ALL_ACTIONS[actionIndex];
        // console.log(action);
      });
    }
    const nextState = this.env.step(action);
    this.replayMemory.append([
      state,
      action,
      nextState.reward,
      Object.values(nextState).slice(0, 5),
      this.env.done,
    ]);

    this.cumulativeReward_ += nextState.reward;
    const output = {
      action,
      cumulativeReward: this.cumulativeReward_,
      done: this.env.done,
    };
    // if (done) {
    //   this.reset();
    // }
    return output;
  }

  /**
   * Perform training on a randomly sampled batch from the replay buffer.
   *
   * @param {number} batchSize Batch size.
   * @param {number} gamma Reward discount rate. Must be >= 0 and <= 1.
   * @param {tf.train.Optimizer} optimizer The optimizer object used to update
   *   the weights of the online network.
   */
  trainOnReplayBatch(batchSize, gamma, optimizer) {
    // Get a batch of examples from the replay buffer.
    const batch = this.replayMemory.sample(batchSize);
    const lossFunction = () =>
      tf.tidy(() => {
        // console.log(batch.map((example) => example[0]));
        const stateTensor = tf.tensor2d(batch.map((example) => example[0]));
        const actionTensor = tf.tensor1d(
          batch.map((example) => example[1]),
          'int32',
        );
        let qs = this.onlineNetwork.apply(stateTensor, {
          training: true,
        });
        qs = (qs as tf.Tensor<tf.Rank>)
          .mul(tf.oneHot(actionTensor, this.NUM_ACTIONS))
          .sum(-1);
        const rewardTensor = tf.tensor1d(batch.map((example) => example[2]));
        const nextStateTensor = tf.tensor2d(
          batch.map((example) => example[3].flat()),
        );
        // const nextStateTensor = getStateTensor(
        //   batch.map((example) => example[3]),
        //   this.game.height,
        //   this.game.width,
        // );
        const nextMaxQTensor = (
          this.targetNetwork.predict(nextStateTensor) as tf.Tensor<tf.Rank>
        ).max(-1);
        const doneMask = tf
          .scalar(1)
          .sub(tf.tensor1d(batch.map((example) => example[4])));
        const targetQs = rewardTensor.add(
          nextMaxQTensor.mul(doneMask).mul(gamma),
        );
        return tf.losses.meanSquaredError(targetQs, qs);
      });

    // Calculate the gradients of the loss function with repsect to the weights
    // of the online DQN.
    const grads = tf.variableGrads(() => lossFunction() as tf.Scalar);
    // Use the gradients to update the online DQN's weights.
    optimizer.applyGradients(grads.grads);
    tf.dispose(grads);
    // TODO(cais): Return the loss value here?
  }
}
