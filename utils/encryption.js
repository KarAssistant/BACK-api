const NodeRSA = require("node-rsa");
const forge = require("node-forge");

const regexSpectialChar = /[^\x00-\x7F]/;
function convertExceptionToHex(text) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    const codeAsciiHex = char.charCodeAt(0).toString(16); // Convertit le code ASCII en hexadécimal
    if (regexSpectialChar.test(char)) result = result + "\\x" + codeAsciiHex;
    else result = result + char;
  }
  return result;
}

function convertExceptionToString(text) {
  const decodedString = eval(`"${text}"`);
  return decodedString;
}

function loadKeyRSA({ key }) {
  try {
    const privateKeyObject = new NodeRSA(key);
    return privateKeyObject;
  } catch {
    return null;
  }
}

async function encryptRSA({ key, data }) {
  return await new Promise((resolve, reject) => {
    try {
      const encryptedData = key.encrypt(JSON.stringify(data), "base64");
      resolve({ encryptedData });
      /* c8 ignore start */
    } catch {
      resolve({ encryptError: 403 });
    }
    /* c8 ignore stop */
  });
}

async function decryptRSA({ key, data }) {
  return await new Promise((resolve, reject) => {
    try {
      const decryptedData = key.decrypt(data, "utf8");
      resolve({ decryptedData: JSON.parse(decryptedData) });
      /* c8 ignore start */
    } catch (e) {
      console.log(e);
      resolve({ decryptError: 406 });
    }
    /* c8 ignore stop */
  });
}

function encryptAES({ message, keyBase64, ivBase64 }) {
  const keyDecoded = keyBase64 ? forge.util.decode64(keyBase64) : forge.random.getBytesSync(16);
  const ivDecoded = ivBase64 ? forge.util.decode64(ivBase64) : forge.random.getBytesSync(16);

  const keyBase64Export = forge.util.encode64(keyDecoded);
  const ivBase64Export = forge.util.encode64(ivDecoded);

  const cipher = forge.cipher.createCipher("AES-CBC", keyDecoded);
  cipher.start({ iv: ivDecoded });
  cipher.update(forge.util.createBuffer(message));
  cipher.finish();
  const messageHex = cipher.output.toHex();

  return { messageHex, keyBase64: keyBase64Export, ivBase64: ivBase64Export };
}

function decryptAES({ keyBase64, ivBase64, messageHex }) {
  try {
    const messageBuff = Buffer.from(messageHex, "hex");
    const key = forge.util.decode64(keyBase64);
    const iv = forge.util.decode64(ivBase64);

    const decipher = forge.cipher.createDecipher("AES-CBC", key);
    decipher.start({ iv });
    decipher.update(forge.util.createBuffer(messageBuff));
    decipher.finish();

    return decipher.output.toString("utf8");
    /* c8 ignore start */
  } catch (error) {
    return JSON.stringify({ result: "ERROR FOR DECRYPT AES" });
  }
  /* c8 ignore stop */
}

async function encryptionForRequest({ query, publicKey }) {
  if (query.bestPhrase) query.bestPhrase = convertExceptionToHex(query.bestPhrase);
  if (query.result) query.result = convertExceptionToHex(query.result);
  const { messageHex, keyBase64, ivBase64 } = encryptAES({
    message: JSON.stringify(query),
  });

  const key = loadKeyRSA({ key: publicKey });
  const { encryptedData } = await encryptRSA({
    data: { key: keyBase64, iv: ivBase64 },
    key,
  });
  const data = { aes: encryptedData, data: messageHex };

  return data;
}

async function decryptionForResult({ data, aes, clientPrivateKey }) {
  const clientPrivateKeyLoaded = loadKeyRSA({ key: clientPrivateKey });
  const { decryptClientAesError, decryptedData: dataAes } = await decryptRSA({
    key: clientPrivateKeyLoaded,
    data: aes,
  });
  /* c8 ignore start */
  if (decryptClientAesError) throw decryptClientAesError;
  /* c8 ignore stop */

  const resultDecryptedString = decryptAES({
    messageHex: data,
    keyBase64: dataAes.key,
    ivBase64: dataAes.iv,
  });

  const resultDecrypted = JSON.parse(resultDecryptedString);
  if (resultDecrypted.query) resultDecrypted.query = convertExceptionToString(resultDecrypted.query);
  return resultDecrypted;
}

module.exports = {
  rsa: {
    loadKey: loadKeyRSA,
    encrypt: encryptRSA,
    decrypt: decryptRSA,
  },
  aes: {
    encrypt: encryptAES,
    decrypt: decryptAES,
  },
  encryptionForRequest,
  decryptionForResult,
};
