import * as tf from '@tensorflow/tfjs';

function getTrainingData(messages) {
  const x_train = [],
    y_train = [];

  for (const row of messages) {
    x_train.push(row['embedding']);
    y_train.push(1 * row['spam']);
  }

  const xs = tf.tensor2d(x_train, [
    messages.length,
    messages[0]['embedding'].length,
  ]);
  const ys = tf.tensor1d(y_train);

  return [xs, ys];
}

export const trainModel = async (
  messages,
  model,
  epochs,
  batchSize,
  callback
) => {
  if (messages.length === 0 || !model) return;

  const [xs, ys] = getTrainingData(messages);

  // train model
  await model.fit(xs, ys, {
    epochs,
    batchSize,
    callbacks: {
      onEpochEnd: callback,
      // async (epoch, logs) => {
      //   console.log('Epoch: ' + epoch + ' Loss: ' + logs.loss);
      // },
    },
  });

  // statistics for backend
  const stats = model.evaluate(xs, ys);
  console.log(
    `Loss: ${stats[0].dataSync()[0]} Accuracy: ${stats[1].dataSync()[0]}`
  );

  return {
    numMessages: messages.length,
    trainLoss: Math.round(stats[0].dataSync()[0] * 1000) / 1000,
    trainAcc: Math.round(stats[1].dataSync()[0] * 100 * 100) / 100,
  };
};

export const loadModelFromURL = async (url) => {
  const model = await tf.loadLayersModel(url);
  model.summary();
  model.compile({
    loss: 'binaryCrossentropy',
    optimizer: tf.train.adam(0.01),
    metrics: ['accuracy'],
  });
  return model;
};

export const saveModel = async (model, url, trainStats) => {
  await model.save(
    tf.io.http(url, {
      requestInit: {
        method: 'POST',
        headers: trainStats,
      },
    })
  );
};
