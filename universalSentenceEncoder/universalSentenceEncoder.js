const tf = require("@tensorflow/tfjs");
try {
  require("@tensorflow/tfjs-node");
} catch {}
const use = require("@tensorflow-models/universal-sentence-encoder");
let model = use.load();

//tf.tensor([1,1], [1, 512], 'float32')

module.exports.encodeSentence = async (sentence) => {
  // Encodage de la phrase en array
  const embeddings = await model.embed(sentence);
  return embeddings.arraySync();
};

module.exports.createVector = (values) => {
  return tf.tensor(values, [1, 512], "float32");
};

module.exports.compareSentences = async (embedding1, embedding2) => {
  return (await tf.losses.cosineDistance(embedding1, embedding2).data())[0];
};

module.exports.start = async () => {
  if (model.then) model = await model;
  return true;
};
