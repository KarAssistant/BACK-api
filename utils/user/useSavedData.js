const fs = require("fs");

module.exports.loadClient = ({ clientToken }) => {
  if (!fs.existsSync(__dirname + "/../../data/users/clients/" + clientToken + ".json")) throw 404;
  const initialClientData = fs.readFileSync(__dirname + "/../../data/users/clients/" + clientToken + ".json", "utf8");
  const clientData = JSON.parse(initialClientData);
  return { initialClientData, clientData };
};

module.exports.loadUser = ({ userToken }) => {
  if (!fs.existsSync(__dirname + "/../../data/users/users/" + userToken + ".json")) throw 404;
  const initialUserData = fs.readFileSync(__dirname + "/../../data/users/users/" + userToken + ".json", "utf8");
  const userData = JSON.parse(initialUserData);
  return { initialUserData, userData };
};
