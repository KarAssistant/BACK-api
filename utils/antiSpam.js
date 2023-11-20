require("dotenv").config();
const allowedIp = process.env.ALLOWED_IP ? JSON.parse(process.env.ALLOWED_IP) : [];
const reIpAddress = new RegExp("(?:[0-9]{1,3}.){3}[0-9]{1,3}");
const dataIp = {};
const banDuration = 60 * 1000;

module.exports.antiSpam = antiSpam;
function antiSpam({ ipAddress, limit = 10 }) {
  if (!ipAddress) return false;
  if (ipAddress === "127.0.0.1") return true; //No ban for localHost
  if (ipAddress.split(".")[0] === "172") return true; //No ban for ip in private newtwork
  if (allowedIp.includes(ipAddress)) return true; //No ban for localHost
  if (!dataIp[ipAddress]) {
    dataIp[ipAddress] = {
      lastRequest: new Date(),
      requestCount: 1,
      force: 0,
    };
    return true;
  } else {
    if (dataIp[ipAddress].banUntil) {
      const nowDate = new Date();
      if (dataIp[ipAddress].banUntil < nowDate) {
        // Refersh ban duration
        dataIp[ipAddress].force++;
        const nowDate = new Date();
        dataIp[ipAddress].banUntil = new Date(nowDate.setTime(nowDate.getTime() + banDuration));
        return false;
      }
    }
    if (dataIp[ipAddress].requestCount >= limit) {
      dataIp[ipAddress].force++;
      if (dataIp[ipAddress].force > 5) {
        //Ban ip
        const nowDate = new Date();
        dataIp[ipAddress].banUntil = new Date(nowDate.setTime(nowDate.getTime() + banDuration));
        return false;
      }
      return false;
    }
    dataIp[ipAddress].lastRequest = new Date();
    dataIp[ipAddress].requestCount++;
    return true;
  }
}

module.exports.cronDeban = cronDeban;
function cronDeban() {
  const nowDate = new Date();
  const previousOneMinuteDate = new Date();
  previousOneMinuteDate.setTime(previousOneMinuteDate.getTime() - 60 * 1000);

  const ipAddressList = Object.keys(dataIp);
  for (const ipAddress of ipAddressList) {
    if (dataIp[ipAddress].banUntil < nowDate) {
      delete dataIp[ipAddress];
    } else if (dataIp[ipAddress].lastRequest < previousOneMinuteDate) {
      delete dataIp[ipAddress];
    }
  }
}

module.exports.getIpAddress = getIpAddress;
function getIpAddress(remoteAddress) {
  const result = remoteAddress.match(reIpAddress);
  if (result) return result[0];
  return "127.0.0.1";
}
