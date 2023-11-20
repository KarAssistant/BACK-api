const cron = require("node-cron");
const fs = require("fs");
const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

function garbageWithType({ type }) {
  const actualDate = new Date();
  const elements = fs.readdirSync(__dirname + "/../data/" + type + "/");
  for (const element of elements) {
    const dataRead = fs.readFileSync(
      __dirname + "/../data/" + type + "/" + element,
      "utf8",
    );
    const content = JSON.parse(dataRead);
    const modificationDate = content.lastRequestDate
      ? new Date(content.lastRequestDate)
      : null;
    const fileDate = new Date(content.creationDate);
    const timeDifference = actualDate - fileDate;
    if (!content.creationDate || timeDifference > oneDayInMilliseconds) {
      if (modificationDate && fileDate - modificationDate !== 0) break;
      fs.unlinkSync(__dirname + "/../data/" + type + "/" + element);
    }
  }
}

module.exports.garbageFilesCollector = garbageFilesCollector;
function garbageFilesCollector() {
  garbageWithType({ type: "sessions" });
  garbageWithType({ type: "users/clients/" });
  garbageWithType({ type: "users/users/" });
}

/* c8 ignore start */
module.exports.start = () => {
  cron
    .schedule("0 */5 * * * *", () => {
      garbageFilesCollector();
    })
    .start();
};
/* c8 ignore stop */
