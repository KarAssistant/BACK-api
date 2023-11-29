const fs = require("fs");
const encodeSentence = require("./universalSentenceEncoder").encodeSentence;
const encryption = require("../utils/encryption").encryptionForRequest;
const decryption = require("../utils/encryption").decryptionForResult;
const timeIntervalAllowed = 5 * 1000;
const concatDate = require("../utils/dateOperation").concatDate;

module.exports.getAnswer = getAnswer;
async function getAnswer({ userToken, query, ipAddress }){
  // Load user data
  if (!fs.existsSync(__dirname + "/../data/users/users/" + userToken + ".json")) throw 404;

  const formattedDateTime = concatDate();
  const embedding = await encodeSentence(query);
  const fileData = {
    userToken,
    ipAddress,
    phrase: query,
    vector: embedding
  }
  fs.writeFileSync(__dirname + "/../data/users/queries/" + formattedDateTime + ".json", JSON.stringify(fileData));

  const dockerWorking = await require("../utils/runServices").runSkills({ idRequest: formattedDateTime });

  const result = JSON.parse(fs.readFileSync(__dirname + "/../data/users/queries/" + formattedDateTime + ".json", 'utf8'));
  if(!dockerWorking) return;
  fs.unlinkSync(__dirname + "/../data/users/queries/" + formattedDateTime + ".json");

  if (result.result) {
    return result.result;
  } else {
    console.log('\x1b[31mNo result for kara-skills\x1b[0m');
    return;
  }
}

module.exports.query = async ({ clientToken, data, aes, ipAddress }) => {
  if (!fs.existsSync(__dirname + "/../data/users/clients/" + clientToken + ".json")) throw 404;
  const initialClientData = fs.readFileSync(__dirname + "/../data/users/clients/" + clientToken + ".json", "utf8");
  const clientContent = JSON.parse(initialClientData);
  clientContent.lastRequestDate = new Date();

  const userToken = clientContent.userToken;
  const decryptedData = await decryption({ data, aes, clientPrivateKey: clientContent.backPrivateKey });

  if (!decryptedData.query || !decryptedData.date) throw 400;
  const query = decryptedData.query;
  const date = new Date(decryptedData.date);
  const nowDate = new Date();

  // Add date validation
  if (date > nowDate) return false; // Date from the PassPhrase cant be in the future
  if (nowDate - date > timeIntervalAllowed) throw 403; // Request expired

  const result = await getAnswer({ userToken, query, ipAddress });

  const resultData = encryption({ query: result, publicKey: clientContent.clientPublicKey });

  return resultData;
};

