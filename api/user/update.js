const fs = require("fs");
const ipFunctions = require("../../utils/antiSpam");
const logger = require("../../utils/logger").logger;
const loadKey = require("../../utils/RSA").loadKey;
const decrypt = require("../../utils/RSA").decrypt;
const timeIntervalAllowed = 5 * 1000;
const checkValues = ["discordAvatarUrl", "timeZone"];

/**
 * @swagger
 * /api/user:
 *   put:
 *     summary: Update a client
 *     description: |
 *        In the element **data** you need to encrypt :
 *        - [Required] The **date** with ISO 8601 example : `2023-09-23T14:30:00`
 *        - [Optional] The **timeZone** used later for skill with date
 *        - [Optional] The **discordAvatarUrl** the personnal picture of discord user
 *     tags: [User]
 *     parameters:
 *     - name: karaeatcookies
 *       in: "header"
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     - name: "data"
 *       in: "query"
 *       description: "The question encrypted"
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: "User is updated"
 *       403:
 *         description: "User is not authenticated"
 *       500:
 *         description: "Error in back"
 */

module.exports.start = (app) => {
  app.put("/api/user", async function (req, res) {
    try {
      const clientToken = req.headers.karaeatcookies;
      const data = req.query.data;
      const nowDate = new Date(new Date().toUTCString());
      if (!clientToken || !data) return res.sendStatus(400);

      const ipAddress = ipFunctions.getIpAddress(req.socket.remoteAddress);
      const ipValid = ipFunctions.antiSpam({ ipAddress, limit: 5 });
      logger({ route: "PUT /api/user", ipAddress, ipValid });
      if (!ipValid) return res.sendStatus(403);

      let clientExist = clientToken && fs.existsSync(__dirname + "/../../data/users/clients/" + clientToken + ".json");
      if (!clientExist) return res.sendStatus(403);
      const clientDataRead = fs.readFileSync(__dirname + "/../../data/users/clients/" + clientToken + ".json", "utf8");
      const clientContent = JSON.parse(clientDataRead);
      clientContent.lastRequestDate = nowDate;
      fs.writeFileSync(__dirname + "/../../data/users/clients/" + clientToken + ".json", JSON.stringify(clientContent));

      userToken = clientContent.userToken;

      const backPrivateKey = loadKey({ key: clientContent.backPrivateKey });
      const { decryptError, decryptedData } = await decrypt({ key: backPrivateKey, data });
      if (decryptError) throw decryptError;

      const date = new Date(new Date(decryptedData.date).toUTCString());

      // Add date validation
      if (date > nowDate) return false; // Date from the PassPhrase cant be in the future
      if (nowDate - date > timeIntervalAllowed) throw 403; // Request expired

      const userDataRead = fs.readFileSync(__dirname + "/../../data/users/users/" + userToken + ".json", "utf8");
      userContent = JSON.parse(userDataRead);

      // Add data to user
      // All authorized variables are at the top of the file
      userContent.lastRequestDate = nowDate;
      for (const element of checkValues) {
        if (decryptedData[element]) {
          userContent.data[element] = decryptedData[element];
        }
      }

      fs.writeFileSync(__dirname + "/../../data/users/users/" + userToken + ".json", JSON.stringify(userContent));

      return res.sendStatus(200);
    } catch (e) {
      if (typeof e === "number") return res.sendStatus(e);
      if (e) console.log(e);
      console.log();
      return res.sendStatus(500);
    }
  });
};
