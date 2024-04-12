import * as tf from '@tensorflow/tfjs-node';
import { Environment } from './environment';
import * as fs from 'fs';
import { TradeAgent } from './tradeAgent';
import { train } from './train';

describe('RL test', () => {
  it('should be run', () => {
    // Create a sequential model
    const model = tf.sequential();

    // Add layers to the model
    model.add(
      tf.layers.dense({ units: 2, inputShape: [2], activation: 'relu' }),
    );
    const denseLayer = tf.layers.dense({ units: 2, activation: 'relu' });
    model.add(denseLayer);

    // Compile the model
    model.compile({
      optimizer: 'sgd',
      loss: 'binaryCrossentropy',
      metrics: ['accuracy'],
    });

    // Generate some dummy data
    const xs = tf.tensor2d([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
    const ys = tf.tensor2d([[0], [1], [1], [0]]);

    // Train the model
    model.fit(xs, ys, { epochs: 100 }).then(() => {
      // Make predictions
      const tensor = tf.tensor2d([[0, 1]]);
      const prediction = model.predict(tensor);
      console.log('Prediction:', prediction);
    });
  });
  it('DQN', async () => {
    // Read the file
    const ethArrfile = fs.readFileSync('src/strategies/etharr.txt', 'utf8');
    const ethArr = JSON.parse(ethArrfile);
    const env = new Environment(ethArr);
    const tradeAgent = new TradeAgent(env);
    await train(tradeAgent);
  });
});
