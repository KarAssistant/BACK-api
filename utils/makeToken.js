const sha1 = require("crypto-js/sha1");
const fs = require("fs");

function suffleString(string) {
  const array = string.split("");
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  const result = array.join("");
  return result;
}

module.exports.generateToken = generateToken;
function generateToken({ token, type }) {
  const forceToken = token ? token : false;
  const dateTime = `${new Date().getTime()} `;

  const token1 = suffleString(dateTime);
  const token2 = sha1(token1).toString();
  const token3 = suffleString(token2);
  const token4 = sha1(token3).toString();

  const finalToken = forceToken ? forceToken : token4;
  if (forceToken || fs.existsSync(`${__dirname}/../${type}/${finalToken}.json`))
    return generateToken({ type });
  return finalToken;
}
