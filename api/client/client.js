const fs = require("fs");
const NodeRSA = require("node-rsa");
const ipFunctions = require("../../utils/antiSpam");
const logger = require("../../utils/logger").logger;

/**
 * @swagger
 * tags:
 *   name: User
 *   description: All about users
 */

/**
 * @swagger
 * /api/client/newToken:
 *   get:
 *     summary: Get new client token
 *     description: |
 *        If you want to use Kara you will need to create an user and use the **backPublicKey**, **clientPrivateKey** to encrypt data with **backPublicKey** to make request and decrypt response with **clientPrivateKey**
 *     tags: [User]
 *     parameters:
 *     - name: "appType"
 *       in: "query"
 *       description: "The type of the client (mobile app, discord)"
 *       required: true
 *       type: string
 *     - name: "authautifierTag"
 *       in: "query"
 *       description: "String to authentify"
 *       type: string
 *     responses:
 *       200:
 *         description: "Token for new client"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientToken:
 *                   type: string
 *                   description: Token for the client
 *                 backPublicKey:
 *                   type: string
 *                   description: Back public key used to encrypt data
 *                 clientPrivateKey:
 *                   type: string
 *                   description: Client private key used to decrypt data
 *               example:
 *                 clientToken: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
 *                 backPublicKey: exampleBackpublicKey"
 *                 clientPrivateKey: exampleClientPrivateKey
 *       400:
 *         description: "Some parameters are wrong"
 *       403:
 *         description: "User is not authenticated"
 *       500:
 *         description: "Error in back"
 */

module.exports.newUserToken = newUserToken;
function newUserToken() {
  const creationDate = new Date();
  const data = {
    creationDate,
    lastRequestDate: creationDate,
    clients: [],
    data: {},
  };
  const userToken = require("../../utils/makeToken").generateToken({
    type: "data/users/users",
  });

  return { userToken, data };
}

module.exports.newClientToken = newClientToken;
function newClientToken({ userFile, appType, authautifierTag }) {
  const clientToken = require("../../utils/makeToken").generateToken({
    type: "data/users/clients",
  });
  userFile.data.clients.push(clientToken);

  const backKeys = new NodeRSA({ b: 1024 });
  const backPublicKey = backKeys.exportKey("public");
  const backPrivateKey = backKeys.exportKey("private");
  const clientKeys = new NodeRSA({ b: 1024 });
  const clientPublicKey = clientKeys.exportKey("public");
  const clientPrivateKey = clientKeys.exportKey("private");

  const creationDate = new Date();
  const data = {
    creationDate,
    lastRequestDate: creationDate,
    userToken: userFile.userToken,
    appType,
    authautifierTag,
    backPrivateKey: backPrivateKey,
    clientPublicKey: clientPublicKey,
  };

  return { userFile, clientFile: { clientToken, data }, backPublicKey, clientPrivateKey };
}

module.exports.saveData = saveData;
function saveData({ userFile, clientFile }) {
  fs.writeFileSync(
    __dirname + "/../../data/users/users/" + userFile.userToken + ".json",
    JSON.stringify(userFile.data)
  );

  fs.writeFileSync(
    __dirname + "/../../data/users/clients/" + clientFile.clientToken + ".json",
    JSON.stringify(clientFile.data)
  );
  return true;
}

module.exports.start = (app) => {
  app.get("/api/client/newToken", async function (req, res) {
    try {
      if (!req.query.appType) return res.sendStatus(400);
      const ipAddress = ipFunctions.getIpAddress(req.socket.remoteAddress);
      const ipValid = ipFunctions.antiSpam({ ipAddress, limit: 2 });
      logger({ route: "GET /api/client/newToken", ipAddress, ipValid });
      if (!ipValid) return res.sendStatus(403);
      const defaultUserFile = newUserToken();
      const { userFile, clientFile, backPublicKey, clientPrivateKey } = newClientToken({
        userFile: defaultUserFile,
        appType: req.query.appType,
        authautifierTag: req.query.authautifierTag,
      });
      saveData({ userFile, clientFile });

      return res.json({ clientToken: clientFile.clientToken, backPublicKey, clientPrivateKey });
    } catch (e) {
      if (e) console.log(e);
      console.log();
      res.sendStatus(500);
    }
  });
};
