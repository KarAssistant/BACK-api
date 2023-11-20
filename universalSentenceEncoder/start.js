const fs = require("fs");
const start = require("./universalSentenceEncoder").start;
const createVector = require("./universalSentenceEncoder").createVector;
const encodeSentence = require("./universalSentenceEncoder").encodeSentence;
const getAllSkills = require("./loadSkills").getAllSkills;
const loadSkill = require("./loadSkills").loadSkill;
const progressLog = require("../utils/logSameLine").logSameLine;
const dateDiff = require("../utils/dateDiff").dateDiff;

const vectors = require("./loadSkills").vectors;

module.exports.start = async () => {
  await start();
  return;
  const dateStart = new Date();

  console.log(`\n\x1b[34mskills`);
  const limitSkills = !process.argv[2]
    ? false
    : fs.existsSync(__dirname + "/../skills/" + process.argv[2] + "/index.js");
  if (!limitSkills && process.argv[2])
    console.log(`\x1b[31mThe skill '${process.argv[2]}' doesn't exist.\nSkipping limit, loading all skills\x1b[0m`);
  if (limitSkills) {
    loadSkill({ skill: process.argv[2] });
  } else {
    const folders = getAllSkills("");

    for (let index = 0; index < folders.length; index++) {
      const folder = folders[index];

      loadSkill({ skill: folder });
    }
  }

  const vectorToFile = {};
  const vectorSaved = JSON.parse(fs.readFileSync(__dirname + "/../data/vectors.json", "utf8"));
  console.log("\n\x1b[33mStart encode sentences\x1b[34m");
  const length = vectors.length;
  progressLog(`0/${length} 00.00%`);
  for (let index = 0; index < vectors.length; index++) {
    const values =
      vectorSaved[vectors[index].phrase] != null
        ? vectorSaved[vectors[index].phrase]
        : vectorToFile[vectors[index].phrase]
        ? vectorToFile[vectors[index].phrase]
        : await encodeSentence(vectors[index].phrase);
    const vector = createVector(values);
    vectors[index].embedding = vector;
    vectorToFile[vectors[index].phrase] = values;
    progressLog(`${index + 1}/${length} ${(((index + 1) / length) * 100).toFixed(2)}%`);
  }

  if (process.stdout.cursorTo) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
  } else process.stdout.write("\n");

  fs.writeFileSync(__dirname + "/../data/vectors.json", JSON.stringify(vectorToFile));

  process.stdout.write(`\x1b[32m${length}/${length} 100.00%`);
  const dateEnd = new Date();
  const elapsedTimeText = dateDiff(dateStart, dateEnd);
  console.log(`\n\x1b[33mEncode sentences finished in \x1b[35m${elapsedTimeText}\x1b[0m\n`);
};
