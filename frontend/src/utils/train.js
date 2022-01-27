import * as tf from '@tensorflow/tfjs';

function getTrainingData(messages, sampleSize) {
  sampleSize = Math.min(messages.length, sampleSize)

  //generates random sample
  var randomIndex = new Set();
  while (randomIndex.size !== sampleSize) {
    randomIndex.add(Math.floor(Math.random() * messages.length));
  }
  randomIndex = Array.from(randomIndex)

  const x_train = [], y_train = [];
  for (const index in randomIndex) {
    x_train.push(messages[randomIndex[index]]['embedding']);
    y_train.push(1 * messages[randomIndex[index]]['spam']);
  }
  const xs = tf.tensor2d(x_train, [
    sampleSize,
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
  sampleSize,
  callback
) => {
  if (messages.length === 0 || !model) return;

  const [xs, ys] = getTrainingData(messages, sampleSize);

  // train model
  await model.fit(xs, ys, {
    epochs,
    batchSize,
    callbacks: {
      onEpochEnd: callback,
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

export const loadModelFromURL = async (url, learningRate) => {
  const model = await tf.loadLayersModel(url);
  model.summary();
  model.compile({
    loss: 'binaryCrossentropy',
    optimizer: tf.train.adam(learningRate),
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
