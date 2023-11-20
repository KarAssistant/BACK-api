const fs = require("fs");

module.exports.prepareFolders = () => {
  //Create files/folders if not exist
  if (!fs.existsSync(__dirname + "/../logs")) fs.mkdirSync(__dirname + "/../logs");
  if (!fs.existsSync(__dirname + "/../logs/api")) fs.mkdirSync(__dirname + "/../logs/api");

  if (!fs.existsSync(__dirname + "/../data")) fs.mkdirSync(__dirname + "/../data");
  if (!fs.existsSync(__dirname + "/../data/users")) fs.mkdirSync(__dirname + "/../data/users");
  if (!fs.existsSync(__dirname + "/../data/users/users")) fs.mkdirSync(__dirname + "/../data/users/users");
  if (!fs.existsSync(__dirname + "/../data/users/clients")) fs.mkdirSync(__dirname + "/../data/users/clients");
  if (!fs.existsSync(__dirname + "/../data/users/links")) fs.mkdirSync(__dirname + "/../data/users/links");

  if (!fs.existsSync(__dirname + "/../data/querriesClose.json"))
    fs.writeFileSync(__dirname + "/../data/querriesClose.json", JSON.stringify([]));
  if (!fs.existsSync(__dirname + "/../data/vectors.json"))
    fs.writeFileSync(__dirname + "/../data/vectors.json", JSON.stringify({}));
};
