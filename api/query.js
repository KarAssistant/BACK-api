const use = require("../universalSentenceEncoder/index");
const ipFunctions = require("../utils/antiSpam");
const logger = require("../utils/logger").logger;

/**
 * @swagger
 * tags:
 *   name: Kara
 *   description: My name is car
 */

/**
 * @swagger
 * /api/heyKara/:
 *   get:
 *     summary: Ask something to Kara
 *     description: |
 *        In the element **data** you need to encrypt :
 *        - [Required] The **date** with ISO 8601 example : `2023-09-23T14:30:00`
 *        - [Required] The **query** is the question put to kara. The correct skill will be selected.
 *
 *        In the response you will have an object encrypted:
 *        - **result** : The answer of the question in a phrase
 *        - **bestPhrase** : Best match with a strored phrase
 *        - **similarity** : Similarity with the best phrase. Value near 0, the phrase is very similar. Value near 1, the phrase is very different.
 *        - **skill** : Skill used for the response
 *        - **lang** : Language detected
 *        - **shortAnswerExpected** : Kara ask a question and expect a short answer. Example: were do you live ? Answer: London (The answer is one word)
 *     tags: [Kara]
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
 *         description: "Result of the query (encrypted). More information in description"
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *             example: "ExampleOfEncodedResponse"
 *       403:
 *         description: "User is not authenticated"
 *       500:
 *         description: "Error in back"
 */

module.exports.start = (app) => {
  app.get("/api/heyKara", async function (req, res) {
    try {
      if (!req.headers.karaeatcookies || !req.query.data) return res.sendStatus(400);
      const ipAddress = ipFunctions.getIpAddress(req.socket.remoteAddress);
      logger({ route: "GET /api/heyKara", ipAddress, ipValid: true });
      const result = await use.query({
        clientToken: req.headers.karaeatcookies,
        data: req.query.data,
        aes: req.query.aes,
        ipAddress,
      });
      res.json(result);
    } catch (e) {
      if (typeof e === "number") return res.sendStatus(e);
      if (e) console.log(e);
      console.log();
      res.sendStatus(500);
    }
  });
};
