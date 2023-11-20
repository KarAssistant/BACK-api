const fs = require("fs");
require("dotenv").config();
const logger_mode = process.env.LOGGER_MODE;

module.exports.getText = getText;
function getText({ route, ipAddress, ipValid }) {
  let textIpAddress = ipAddress;
  for (let index = ipAddress.length; index < 15; index++) {
    textIpAddress += " ";
  }
  return `${!ipValid ? "/!\\" : "   "} ${textIpAddress} ==> ${route}`;
}

/* c8 ignore start */
module.exports.logger = ({ route, ipAddress, ipValid }) => {
  if (!logger_mode) return;
  const line = getText({ route, ipAddress, ipValid });
  const nowDate = new Date();
  const filePath =
    __dirname +
    "/../logs/api/logs_api_" +
    nowDate.getFullYear() +
    "-" +
    ("0" + (nowDate.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + nowDate.getDate()).slice(-2) +
    ".txt";
  if (!fs.existsSync(filePath)) {
    const startOfFile = "This is the api logs of the day\n" + "/!\\ this logo indicates that the user is banned\n";
    fs.appendFileSync(filePath, startOfFile);
  }
  fs.appendFileSync(filePath, line + "\n");
};
/* c8 ignore stop */
