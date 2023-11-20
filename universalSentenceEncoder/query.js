const fs = require("fs");
const forge = require("node-forge");
const text = require("./text.json");
const encodeSentence = require("./universalSentenceEncoder").encodeSentence;
const compareSentences = require("./universalSentenceEncoder").compareSentences;
const encryption = require("../utils/encryption").encryptionForRequest;
const decryption = require("../utils/encryption").decryptionForResult;
const timeIntervalAllowed = 5 * 1000;

const vectors = require("./loadSkills").vectors;

module.exports.query = async ({ clientToken, data, aes, ipAddress }) => {
  if (!fs.existsSync(__dirname + "/../data/users/clients/" + clientToken + ".json")) throw 404;
  const initialClientData = fs.readFileSync(__dirname + "/../data/users/clients/" + clientToken + ".json", "utf8");
  const clientContent = JSON.parse(initialClientData);
  clientContent.lastRequestDate = new Date();

  const userToken = clientContent.userToken;
  const decryptedData = await decryption({ data, aes, clientPrivateKey: clientContent.backPrivateKey });
  // const backPrivateKey = loadKey({ key: clientContent.backPrivateKey });

  // const { decryptClientAesError, decryptedData: dataAes } = await decrypt({ key: backPrivateKey, data: aes });
  // if (decryptClientAesError) throw decryptClientAesError;

  // const decryptedDataString = require("../utils/encryption").aes.decrypt({
  //   messageHex: data,
  //   keyBase64: dataAes.key,
  //   ivBase64: dataAes.iv,
  // });
  // const decryptedData = JSON.parse(decryptedDataString);

  if (!decryptedData.query || !decryptedData.date) throw 400;
  const query = decryptedData.query;
  const date = new Date(decryptedData.date);
  const nowDate = new Date();

  // Add date validation
  if (date > nowDate) return false; // Date from the PassPhrase cant be in the future
  if (nowDate - date > timeIntervalAllowed) throw 403; // Request expired

  // Load user data
  if (!fs.existsSync(__dirname + "/../data/users/users/" + userToken + ".json")) throw 404;
  const initialUserData = fs.readFileSync(__dirname + "/../data/users/users/" + userToken + ".json", "utf8");
  const userContent = JSON.parse(initialUserData);

  const embedding = await encodeSentence(query);
  const result = { similarity: 1, bestPhrase: "", shortAnswerExpected: false };
  const resData = {};

  if (clientContent.session && clientContent.session.skill) {
    try {
      const skillResult = await require(__dirname + "/../skills/" + clientContent.session.skill + "/session").execute({
        query,
        userData: userContent ? userContent.data : null,
        lang: clientContent.session.lang,
        data: clientContent.session.data,
      });
      if (skillResult != null) {
        result.result = skillResult.text;
        result.shortAnswerExpected = !!skillResult.shortAnswerExpected;
        resData.data = skillResult.data;
        if (skillResult.userData) userContent.data = skillResult.userData;
        if (skillResult.session) {
          if (!clientContent.session) clientContent.session = {};
          clientContent.session.skill = skillResult.skill ? skillResult.skill : clientContent.session.skill;
          clientContent.session.lang = skillResult.lang ? skillResult.lang : clientContent.session.lang;
          clientContent.session.data = skillResult.session;
        } else {
          delete clientContent.session;
        }
      }
    } catch (error) {
      console.log("\x1b[31mERROR: skill " + result.skill + "\x1b[0m");
      console.log(error);
      throw null;
    }
  }

  if (result.result == null) {
    //Loop on all skills
    for (const vector of vectors) {
      if (result.result) break;
      const similarity = await compareSentences(vector.embedding, embedding);

      if (similarity < result.similarity) {
        result.similarity = similarity;
        result.lang = vector.lang;
        result.bestPhrase = vector.phrase;
        result.skill = vector.skill;
        //Execute skill if very close
        if (result.similarity < 0.1) {
          try {
            const skillResult = await require(__dirname + "/../skills/" + result.skill).execute({
              query,
              lang: result.lang,
              userData: userContent ? userContent.data : null,
            });
            result.result = skillResult.text;
            result.shortAnswerExpected = !!skillResult.shortAnswerExpected;
            resData.data = skillResult.data;
            if (skillResult.userData) userContent.data = skillResult.userData;
            if (skillResult.session) {
              if (!clientContent.session) clientContent.session = {};
              clientContent.session.skill = result.skill;
              clientContent.session.lang = result.lang;
              clientContent.session.data = skillResult.session;
            }
            break;
          } catch (error) {
            console.log("\x1b[31mERROR: skill " + result.skill + "\x1b[0m");
            console.log(error);
            throw null;
          }
        }
      }
    }
  }

  //Exeption of the closest competence
  if (!result.result && result.similarity < 0.2) {
    try {
      const skillResult = await require(__dirname + "/../skills/" + result.skill).execute({
        query,
        lang: result.lang,
        userData: userContent ? userContent.data : null,
      });
      result.result = skillResult.text;
      result.shortAnswerExpected = !!skillResult.shortAnswerExpected;
      resData.data = skillResult.data;
      if (skillResult.userData) userContent.data = skillResult.userData;
      if (skillResult.session) {
        if (!clientContent.session) clientContent.session = {};
        clientContent.session.skill = result.skill;
        clientContent.session.lang = result.lang;
        clientContent.session.data = skillResult.session;
      }
    } catch (error) {
      console.log("\x1b[31mERROR: skill " + result.skill + "\x1b[0m");
      console.log(error);
      throw null;
    }
  }

  if (!result.result) {
    //Save if it's close, but not too close
    //This is used for logs
    if (result.similarity < 0.3) {
      saveQueryClose(result, query);
    }
    if (!result.lang) result.lang = "en";
    result.result = text[result.lang].dontUnderstand;
  }

  // Save history
  if (userContent.history == null) userContent.history = [];
  userContent.history.push({ message: query, date: new Date(), isKara: false });
  userContent.history.push({ message: result.result, date: new Date(), isKara: true });
  for (let index = 20; index < userContent.history.length; index++) {
    userContent.history.shift();
  }

  // Save client data
  const newClientContent = JSON.stringify(clientContent);
  if (initialClientData !== newClientContent)
    fs.writeFileSync(__dirname + "/../data/users/clients/" + clientToken + ".json", newClientContent);

  // Save user data
  const newUserData = JSON.stringify(userContent);
  if (initialUserData !== newUserData)
    fs.writeFileSync(__dirname + "/../data/users/users/" + userToken + ".json", newUserData);

  const resultData = encryption({ query: result, publicKey: clientContent.clientPublicKey });

  return resultData;
};

async function saveQueryClose(result, query) {
  const dataRead = fs.readFileSync(__dirname + "/../data/querriesClose.json", "utf8");
  const content = JSON.parse(dataRead);
  content.push({
    query,
    similarity: result.similarity,
    lang: result.lang,
    skill: result.skill,
    bestPhrase: result.bestPhrase,
  });
  const dataWrite = JSON.stringify(content);
  fs.writeFileSync(__dirname + "/../data/querriesClose.json", dataWrite, "utf8");
}
