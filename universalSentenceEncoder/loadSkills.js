const fs = require("fs");

const vectors = [];
module.exports.vectors = vectors;

module.exports.loadSkill = ({ skill }) => {
  console.log("-- " + skill);
  const file = require(__dirname + "/../skills/" + skill);
  const phrases = file.data.phrases;
  const langs = Object.keys(phrases);
  for (const lang of langs) {
    for (const phrase of phrases[lang]) {
      vectors.push({ skill: skill, lang, phrase });
    }
  }
};

module.exports.getAllSkills = getAllSkills;
function getAllSkills(path) {
  let result = [];
  if (fs.lstatSync(__dirname + "/../skills/" + path).isDirectory()) {
    const elementExist = fs.existsSync(__dirname + "/../skills/" + path + "/index.js");
    const elementIsFile = elementExist ? fs.lstatSync(__dirname + "/../skills/" + path + "/index.js").isFile() : false;

    if (elementExist && elementIsFile) {
      result.push(path);
    } else {
      const elements = fs.readdirSync(__dirname + "/../skills/" + path);
      for (const element of elements) {
        const resultFolder = getAllSkills(`${path}${path != "" ? "/" : ""}${element}`);
        result = result.concat(resultFolder);
      }
    }
  }
  return result;
}
