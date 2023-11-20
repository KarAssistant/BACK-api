const rsa = require("./encryption").rsa;

module.exports.loadKey = rsa.loadKey;

module.exports.encrypt = rsa.encrypt;

module.exports.decrypt = rsa.decrypt;
