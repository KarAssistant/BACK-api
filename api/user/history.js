const ipFunctions = require("../../utils/antiSpam");
const logger = require("../../utils/logger").logger;
const useSavedData = require("../../utils/user/useSavedData");
const RSA = require("../../utils/RSA");
const testValidTime = require("../../utils/user/testValidTime").test;

/**
 * @swagger
 * /api/user/history:
 *   get:
 *     summary: Get the histroy from the user
 *     description: |
 *        In the element **data** you need to encrypt :
 *        - [Required] The **date** with ISO 8601 example : `2023-09-23T14:30:00`
 *
 *        In the response you will have a list of data encrypted:
 *        - **message** : A string with the message
 *        - **date** : Date of the message
 *        - **isKara** : A boolean to identify author of the message (Kara or the user)
 *     tags: [User]
 *     parameters:
 *     - name: karaeatcookies
 *       in: "header"
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     - name: "data"
 *       in: "query"
 *       description: "Encrypted data"
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: "History of conversation (encrypted). More information in description"
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example: "ExampleOfEncodedResponse"
 *       400:
 *         description: "You need to encrypt the date"
 *       403:
 *         description: "User is not authenticated"
 *       500:
 *         description: "Error in back"
 */

module.exports.start = (app) => {
  app.get("/api/user/history", async function (req, res) {
    try {
      const ipAddress = ipFunctions.getIpAddress(req.socket.remoteAddress);
      const ipValid = ipFunctions.antiSpam({ ipAddress, limit: 5 });
      logger({ route: "GET /api/user/history", ipAddress, ipValid });
      if (!ipValid) return res.sendStatus(403);

      const clientToken = req.headers.karaeatcookies;
      const data = req.query.data;

      const { clientData } = useSavedData.loadClient({ clientToken });
      const backPrivateKey = RSA.loadKey({ key: clientData.backPrivateKey });
      const { decryptError, decryptedData } = await RSA.decrypt({ key: backPrivateKey, data });
      if (decryptError) throw decryptError;

      if (!decryptedData.date) return res.sendStatus(400);
      const resultTimeValid = testValidTime({ clientDate: decryptedData.date });
      if (!resultTimeValid) return res.sendStatus(403);

      const { userData } = useSavedData.loadUser({ userToken: clientData.userToken });

      const clientPublicKey = RSA.loadKey({ key: clientData.clientPublicKey });
      const { encryptError, encryptedData } = await RSA.encrypt({ key: clientPublicKey, data: userData.history });
      if (encryptError) throw encryptError;

      return res.send(encryptedData);
    } catch (e) {
      if (typeof e === "number") return res.sendStatus(e);
      if (e) console.log(e);
      console.log();
      return res.sendStatus(500);
    }
  });
};
